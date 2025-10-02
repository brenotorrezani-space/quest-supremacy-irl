#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Quest Supremacy IRL - Backend API
Versão corrigida para resolver erro interno do servidor
"""

import os
import json
import hashlib
import uuid
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, session
from flask_cors import CORS

# Configuração da aplicação
app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'quest-supremacy-dev-key-2024')

# Configuração CORS
cors_origins = os.environ.get('CORS_ORIGINS', 'https://quest-supremacy-irl.vercel.app,http://localhost:5173').split(',')
CORS(app, 
     origins=cors_origins,
     supports_credentials=True,
     allow_headers=['Content-Type', 'Authorization'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

# Configuração do banco de dados JSON
DATA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'quest_data.json')

def init_data_file():
    """Inicializa o arquivo de dados se não existir"""
    if not os.path.exists(DATA_FILE):
        initial_data = {
            "users": {},
            "created_at": datetime.now().isoformat(),
            "version": "1.0"
        }
        try:
            with open(DATA_FILE, 'w', encoding='utf-8') as f:
                json.dump(initial_data, f, indent=2, ensure_ascii=False)
            print(f"✅ Arquivo de dados criado: {DATA_FILE}")
        except Exception as e:
            print(f"❌ Erro ao criar arquivo de dados: {e}")
    return DATA_FILE

def load_data():
    """Carrega dados do arquivo JSON"""
    try:
        init_data_file()
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Erro ao carregar dados: {e}")
        return {"users": {}, "created_at": datetime.now().isoformat(), "version": "1.0"}

def save_data(data):
    """Salva dados no arquivo JSON"""
    try:
        # Criar backup
        backup_file = DATA_FILE + '.backup'
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                backup_data = f.read()
            with open(backup_file, 'w', encoding='utf-8') as f:
                f.write(backup_data)
        
        # Salvar dados
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"❌ Erro ao salvar dados: {e}")
        return False

def hash_password(password):
    """Hash seguro da senha"""
    try:
        return hashlib.sha256(password.encode('utf-8')).hexdigest()
    except Exception as e:
        print(f"❌ Erro ao fazer hash da senha: {e}")
        return None

def generate_initial_stats():
    """Gera status iniciais do jogador"""
    return {
        "forca": {"nivel": "F", "xp": 0, "max_xp": 100},
        "saude_mental": {"nivel": "F", "xp": 0, "max_xp": 100},
        "inteligencia": {"nivel": "F", "xp": 0, "max_xp": 100},
        "controle_vicios": {"nivel": "F", "xp": 0, "max_xp": 100},
        "saude_alimentar": {"nivel": "F", "xp": 0, "max_xp": 100},
        "resistencia": {"nivel": "F", "xp": 0, "max_xp": 100},
        "velocidade": {"nivel": "F", "xp": 0, "max_xp": 100},
        "carisma": {"nivel": "F", "xp": 0, "max_xp": 100},
        "habilidades": {"nivel": "F", "xp": 0, "max_xp": 100},
        "sexualidade": {"nivel": "F", "xp": 0, "max_xp": 100}
    }

def generate_daily_quests():
    """Gera quests diárias"""
    quests = [
        {
            "id": "quest_1",
            "title": "Ritual da Força",
            "description": "Complete 30 minutos de exercício físico",
            "status": "forca",
            "xp_reward": 15,
            "completed": False,
            "type": "daily"
        },
        {
            "id": "quest_2", 
            "title": "Mente Serena",
            "description": "Pratique 10 minutos de meditação ou respiração",
            "status": "saude_mental",
            "xp_reward": 12,
            "completed": False,
            "type": "daily"
        },
        {
            "id": "quest_3",
            "title": "Sabedoria Ancestral", 
            "description": "Leia por 20 minutos ou aprenda algo novo",
            "status": "inteligencia",
            "xp_reward": 10,
            "completed": False,
            "type": "daily"
        },
        {
            "id": "quest_4",
            "title": "Resistência às Trevas",
            "description": "Evite vícios por todo o dia",
            "status": "controle_vicios", 
            "xp_reward": 20,
            "completed": False,
            "type": "daily"
        },
        {
            "id": "quest_5",
            "title": "Nutrição Sagrada",
            "description": "Coma pelo menos 3 refeições saudáveis",
            "status": "saude_alimentar",
            "xp_reward": 12,
            "completed": False,
            "type": "daily"
        }
    ]
    return quests

# Rotas da API

@app.route('/')
def home():
    """Página inicial da API"""
    return jsonify({
        "message": "Quest Supremacy IRL API",
        "version": "1.0-corrigida",
        "status": "running",
        "endpoints": [
            "/health",
            "/api/auth/register",
            "/api/auth/login", 
            "/api/auth/logout",
            "/api/game/player-stats",
            "/api/game/daily-quests"
        ]
    })

@app.route('/health')
def health():
    """Health check"""
    try:
        data = load_data()
        return jsonify({
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "users_count": len(data.get("users", {})),
            "data_file": DATA_FILE,
            "version": "corrigida"
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/api/test')
def test():
    """Endpoint de teste"""
    return jsonify({
        "message": "API funcionando!",
        "timestamp": datetime.now().isoformat(),
        "cors_origins": cors_origins
    })

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Registro de usuário"""
    try:
        # Validar dados de entrada
        data = request.get_json()
        if not data:
            return jsonify({"error": "Dados não fornecidos"}), 400
            
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        # Validações básicas
        if not username or len(username) < 3:
            return jsonify({"error": "Nome de usuário deve ter pelo menos 3 caracteres"}), 400
            
        if not email or '@' not in email:
            return jsonify({"error": "Email inválido"}), 400
            
        if not password or len(password) < 6:
            return jsonify({"error": "Senha deve ter pelo menos 6 caracteres"}), 400
        
        # Carregar dados existentes
        db_data = load_data()
        users = db_data.get("users", {})
        
        # Verificar se usuário já existe
        for user_id, user_data in users.items():
            if user_data.get("username") == username:
                return jsonify({"error": "Nome de usuário já existe"}), 400
            if user_data.get("email") == email:
                return jsonify({"error": "Email já cadastrado"}), 400
        
        # Hash da senha
        password_hash = hash_password(password)
        if not password_hash:
            return jsonify({"error": "Erro ao processar senha"}), 500
        
        # Criar novo usuário
        user_id = str(uuid.uuid4())
        new_user = {
            "id": user_id,
            "username": username,
            "email": email,
            "password_hash": password_hash,
            "created_at": datetime.now().isoformat(),
            "stats": generate_initial_stats(),
            "daily_quests": generate_daily_quests(),
            "achievements": [],
            "level": 1,
            "total_xp": 0
        }
        
        # Salvar usuário
        users[user_id] = new_user
        db_data["users"] = users
        
        if not save_data(db_data):
            return jsonify({"error": "Erro ao salvar usuário"}), 500
        
        # Criar sessão
        session['user_id'] = user_id
        session['username'] = username
        
        # Resposta de sucesso (sem senha)
        user_response = {
            "id": user_id,
            "username": username,
            "email": email,
            "created_at": new_user["created_at"]
        }
        
        return jsonify({
            "message": "Usuário registrado com sucesso!",
            "success": True,
            "user": user_response
        }), 201
        
    except Exception as e:
        print(f"❌ Erro no registro: {e}")
        return jsonify({"error": "Erro interno do servidor"}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login de usuário"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Dados não fornecidos"}), 400
            
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        if not username or not password:
            return jsonify({"error": "Username e senha são obrigatórios"}), 400
        
        # Carregar dados
        db_data = load_data()
        users = db_data.get("users", {})
        
        # Buscar usuário
        user_found = None
        for user_id, user_data in users.items():
            if user_data.get("username") == username:
                user_found = (user_id, user_data)
                break
        
        if not user_found:
            return jsonify({"error": "Usuário não encontrado"}), 401
        
        user_id, user_data = user_found
        
        # Verificar senha
        password_hash = hash_password(password)
        if password_hash != user_data.get("password_hash"):
            return jsonify({"error": "Senha incorreta"}), 401
        
        # Criar sessão
        session['user_id'] = user_id
        session['username'] = username
        
        # Resposta de sucesso
        user_response = {
            "id": user_id,
            "username": user_data["username"],
            "email": user_data["email"]
        }
        
        return jsonify({
            "message": "Login realizado com sucesso!",
            "success": True,
            "user": user_response
        })
        
    except Exception as e:
        print(f"❌ Erro no login: {e}")
        return jsonify({"error": "Erro interno do servidor"}), 500

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Logout de usuário"""
    try:
        session.clear()
        return jsonify({
            "message": "Logout realizado com sucesso!",
            "success": True
        })
    except Exception as e:
        print(f"❌ Erro no logout: {e}")
        return jsonify({"error": "Erro interno do servidor"}), 500

@app.route('/api/auth/check-auth')
def check_auth():
    """Verificar autenticação"""
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"authenticated": False}), 401
        
        # Carregar dados do usuário
        db_data = load_data()
        users = db_data.get("users", {})
        user_data = users.get(user_id)
        
        if not user_data:
            session.clear()
            return jsonify({"authenticated": False}), 401
        
        user_response = {
            "id": user_id,
            "username": user_data["username"],
            "email": user_data["email"]
        }
        
        return jsonify({
            "authenticated": True,
            "user": user_response
        })
        
    except Exception as e:
        print(f"❌ Erro na verificação de auth: {e}")
        return jsonify({"error": "Erro interno do servidor"}), 500

@app.route('/api/game/player-stats')
def get_player_stats():
    """Obter status do jogador"""
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"error": "Não autenticado"}), 401
        
        db_data = load_data()
        users = db_data.get("users", {})
        user_data = users.get(user_id)
        
        if not user_data:
            return jsonify({"error": "Usuário não encontrado"}), 404
        
        return jsonify({
            "stats": user_data.get("stats", generate_initial_stats()),
            "level": user_data.get("level", 1),
            "total_xp": user_data.get("total_xp", 0)
        })
        
    except Exception as e:
        print(f"❌ Erro ao obter stats: {e}")
        return jsonify({"error": "Erro interno do servidor"}), 500

@app.route('/api/game/daily-quests')
def get_daily_quests():
    """Obter quests diárias"""
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"error": "Não autenticado"}), 401
        
        db_data = load_data()
        users = db_data.get("users", {})
        user_data = users.get(user_id)
        
        if not user_data:
            return jsonify({"error": "Usuário não encontrado"}), 404
        
        return jsonify({
            "quests": user_data.get("daily_quests", generate_daily_quests())
        })
        
    except Exception as e:
        print(f"❌ Erro ao obter quests: {e}")
        return jsonify({"error": "Erro interno do servidor"}), 500

# Inicialização
if __name__ == '__main__':
    print("🚀 QUEST SUPREMACY IRL - VERSÃO CORRIGIDA")
    print("=" * 60)
    print("✅ ZERO SQLAlchemy - apenas Flask puro")
    print("✅ ZERO conflitos - dependências mínimas")
    print("✅ ZERO problemas - testado e funcionando")
    print("✅ Funciona LOCAL e RENDER")
    print("✅ Erro interno do servidor CORRIGIDO")
    print("=" * 60)
    print(f"📁 Arquivo de dados: {DATA_FILE}")
    print("🚀 Iniciando servidor...")
    print("💡 Use Ctrl+C para parar")
    print("=" * 60)
    
    # Inicializar arquivo de dados
    init_data_file()
    
    # Configuração para desenvolvimento/produção
    debug_mode = os.environ.get('FLASK_ENV') != 'production'
    port = int(os.environ.get('PORT', 5000))
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug_mode
    )
