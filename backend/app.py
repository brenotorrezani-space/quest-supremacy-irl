#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Quest Supremacy IRL - Backend API
Versão corrigida com paths dinâmicos para Render
"""

import os
import json
import hashlib
import uuid
from datetime import datetime
from flask import Flask, request, jsonify, session
from flask_cors import CORS

# Configuração da aplicação
app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'quest-supremacy-secret-2024')

# Configuração CORS
cors_origins = os.environ.get('CORS_ORIGINS', 'https://quest-supremacy-irl.vercel.app,http://localhost:5173').split(',')
CORS(app, 
     origins=cors_origins,
     supports_credentials=True,
     allow_headers=['Content-Type', 'Authorization'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

# Configuração do banco de dados JSON com paths dinâmicos
def get_data_file_path():
    """Determina o caminho correto do arquivo de dados baseado no ambiente"""
    if os.environ.get('RENDER'):
        # No Render, usar caminho na raiz do projeto
        return '/opt/render/project/src/quest_data.json'
    else:
        # Local, usar caminho relativo ao arquivo atual
        return os.path.join(os.path.dirname(os.path.abspath(__file__)), 'quest_data.json')

DATA_FILE = get_data_file_path()

def ensure_data_dir():
    """Garante que o diretório do arquivo de dados existe"""
    try:
        data_dir = os.path.dirname(DATA_FILE)
        if not os.path.exists(data_dir):
            os.makedirs(data_dir, exist_ok=True)
            print(f"✅ Diretório criado: {data_dir}")
        return True
    except Exception as e:
        print(f"❌ Erro ao criar diretório: {e}")
        return False

def init_data_file():
    """Inicializa o arquivo de dados se não existir"""
    try:
        ensure_data_dir()
        
        if not os.path.exists(DATA_FILE):
            initial_data = {
                "users": {},
                "created_at": datetime.now().isoformat(),
                "version": "2.0-corrigida"
            }
            with open(DATA_FILE, 'w', encoding='utf-8') as f:
                json.dump(initial_data, f, indent=2, ensure_ascii=False)
            print(f"✅ Arquivo de dados criado: {DATA_FILE}")
        else:
            print(f"✅ Arquivo de dados existe: {DATA_FILE}")
        return True
    except Exception as e:
        print(f"❌ Erro ao inicializar arquivo de dados: {e}")
        return False

def load_data():
    """Carrega dados do arquivo JSON"""
    try:
        if not os.path.exists(DATA_FILE):
            if not init_data_file():
                raise Exception("Falha ao inicializar arquivo de dados")
        
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data
    except Exception as e:
        print(f"❌ Erro ao carregar dados: {e}")
        # Retornar dados padrão em caso de erro
        return {
            "users": {}, 
            "created_at": datetime.now().isoformat(), 
            "version": "2.0-corrigida"
        }

def save_data(data):
    """Salva dados no arquivo JSON"""
    try:
        ensure_data_dir()
        
        # Criar backup se arquivo existe
        if os.path.exists(DATA_FILE):
            backup_file = DATA_FILE + '.backup'
            try:
                with open(DATA_FILE, 'r', encoding='utf-8') as f:
                    backup_data = f.read()
                with open(backup_file, 'w', encoding='utf-8') as f:
                    f.write(backup_data)
            except Exception as e:
                print(f"⚠️ Aviso: Não foi possível criar backup: {e}")
        
        # Salvar dados
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"✅ Dados salvos em: {DATA_FILE}")
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
    return [
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

# Rotas da API

@app.route('/')
def home():
    """Página inicial da API"""
    return jsonify({
        "message": "Quest Supremacy IRL API - Versão Corrigida",
        "version": "2.0-corrigida",
        "status": "running",
        "data_file": DATA_FILE,
        "render_mode": bool(os.environ.get('RENDER')),
        "data_file_exists": os.path.exists(DATA_FILE),
        "endpoints": [
            "/health",
            "/api/auth/register",
            "/api/auth/login", 
            "/api/auth/logout",
            "/api/auth/check-auth",
            "/api/game/player-stats",
            "/api/game/daily-quests"
        ]
    })

@app.route('/health')
def health():
    """Health check detalhado"""
    try:
        data = load_data()
        return jsonify({
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "users_count": len(data.get("users", {})),
            "data_file": DATA_FILE,
            "data_file_exists": os.path.exists(DATA_FILE),
            "version": "2.0-corrigida",
            "render_mode": bool(os.environ.get('RENDER')),
            "data_dir_exists": os.path.exists(os.path.dirname(DATA_FILE)),
            "working_directory": os.getcwd(),
            "python_version": f"{os.sys.version_info.major}.{os.sys.version_info.minor}.{os.sys.version_info.micro}"
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat(),
            "data_file": DATA_FILE,
            "render_mode": bool(os.environ.get('RENDER'))
        }), 500

@app.route('/api/test')
def test():
    """Endpoint de teste"""
    return jsonify({
        "message": "API funcionando perfeitamente!",
        "timestamp": datetime.now().isoformat(),
        "cors_origins": cors_origins,
        "data_file": DATA_FILE,
        "render_mode": bool(os.environ.get('RENDER')),
        "test_status": "OK"
    })

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Registro de usuário com logs detalhados"""
    try:
        print("🔄 [REGISTRO] Iniciando processo de registro...")
        print(f"📁 [REGISTRO] Arquivo de dados: {DATA_FILE}")
        print(f"🌐 [REGISTRO] Modo Render: {bool(os.environ.get('RENDER'))}")
        
        # Validar dados de entrada
        data = request.get_json()
        if not data:
            print("❌ [REGISTRO] Dados não fornecidos")
            return jsonify({"error": "Dados não fornecidos"}), 400
            
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        print(f"📝 [REGISTRO] Dados recebidos: username={username}, email={email}")
        
        # Validações básicas
        if not username or len(username) < 3:
            print("❌ [REGISTRO] Username inválido")
            return jsonify({"error": "Nome de usuário deve ter pelo menos 3 caracteres"}), 400
            
        if not email or '@' not in email:
            print("❌ [REGISTRO] Email inválido")
            return jsonify({"error": "Email inválido"}), 400
            
        if not password or len(password) < 6:
            print("❌ [REGISTRO] Senha inválida")
            return jsonify({"error": "Senha deve ter pelo menos 6 caracteres"}), 400
        
        print("✅ [REGISTRO] Validações básicas OK")
        
        # Carregar dados existentes
        print("🔄 [REGISTRO] Carregando dados existentes...")
        db_data = load_data()
        users = db_data.get("users", {})
        
        print(f"📊 [REGISTRO] Usuários existentes: {len(users)}")
        
        # Verificar se usuário já existe
        for user_id, user_data in users.items():
            if user_data.get("username") == username:
                print(f"❌ [REGISTRO] Username já existe: {username}")
                return jsonify({"error": "Nome de usuário já existe"}), 400
            if user_data.get("email") == email:
                print(f"❌ [REGISTRO] Email já existe: {email}")
                return jsonify({"error": "Email já cadastrado"}), 400
        
        print("✅ [REGISTRO] Usuário único confirmado")
        
        # Hash da senha
        print("🔄 [REGISTRO] Fazendo hash da senha...")
        password_hash = hash_password(password)
        if not password_hash:
            print("❌ [REGISTRO] Erro ao fazer hash da senha")
            return jsonify({"error": "Erro ao processar senha"}), 500
        
        print("✅ [REGISTRO] Hash da senha OK")
        
        # Criar novo usuário
        user_id = str(uuid.uuid4())
        print(f"🆔 [REGISTRO] ID do usuário: {user_id}")
        
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
        
        print("✅ [REGISTRO] Dados do usuário criados")
        
        # Salvar usuário
        print("🔄 [REGISTRO] Salvando usuário...")
        users[user_id] = new_user
        db_data["users"] = users
        
        if not save_data(db_data):
            print("❌ [REGISTRO] Erro ao salvar usuário")
            return jsonify({"error": "Erro ao salvar usuário"}), 500
        
        print("✅ [REGISTRO] Usuário salvo com sucesso")
        
        # Criar sessão
        session['user_id'] = user_id
        session['username'] = username
        
        print("✅ [REGISTRO] Sessão criada")
        
        # Resposta de sucesso (sem senha)
        user_response = {
            "id": user_id,
            "username": username,
            "email": email,
            "created_at": new_user["created_at"]
        }
        
        print("🎉 [REGISTRO] Registro concluído com sucesso!")
        
        return jsonify({
            "message": "Usuário registrado com sucesso!",
            "success": True,
            "user": user_response
        }), 201
        
    except Exception as e:
        print(f"❌ [REGISTRO] Erro crítico: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": "Erro interno do servidor", 
            "details": str(e),
            "data_file": DATA_FILE,
            "render_mode": bool(os.environ.get('RENDER'))
        }), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login de usuário"""
    try:
        print("🔄 [LOGIN] Iniciando processo de login...")
        
        data = request.get_json()
        if not data:
            return jsonify({"error": "Dados não fornecidos"}), 400
            
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        if not username or not password:
            return jsonify({"error": "Username e senha são obrigatórios"}), 400
        
        print(f"📝 [LOGIN] Tentativa de login: {username}")
        
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
            print(f"❌ [LOGIN] Usuário não encontrado: {username}")
            return jsonify({"error": "Usuário não encontrado"}), 401
        
        user_id, user_data = user_found
        
        # Verificar senha
        password_hash = hash_password(password)
        if password_hash != user_data.get("password_hash"):
            print(f"❌ [LOGIN] Senha incorreta para: {username}")
            return jsonify({"error": "Senha incorreta"}), 401
        
        # Criar sessão
        session['user_id'] = user_id
        session['username'] = username
        
        print(f"✅ [LOGIN] Login realizado com sucesso: {username}")
        
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
        print(f"❌ [LOGIN] Erro: {e}")
        return jsonify({"error": "Erro interno do servidor"}), 500

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Logout de usuário"""
    try:
        username = session.get('username', 'Desconhecido')
        session.clear()
        print(f"✅ [LOGOUT] Logout realizado: {username}")
        return jsonify({
            "message": "Logout realizado com sucesso!",
            "success": True
        })
    except Exception as e:
        print(f"❌ [LOGOUT] Erro: {e}")
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
        print(f"❌ [AUTH_CHECK] Erro: {e}")
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
        print(f"❌ [PLAYER_STATS] Erro: {e}")
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
        print(f"❌ [DAILY_QUESTS] Erro: {e}")
        return jsonify({"error": "Erro interno do servidor"}), 500

# Inicialização
if __name__ == '__main__':
    print("🚀 QUEST SUPREMACY IRL - VERSÃO CORRIGIDA")
    print("=" * 70)
    print("✅ Paths dinâmicos - Render/Local")
    print("✅ Logs super detalhados")
    print("✅ Tratamento robusto de erros")
    print("✅ Inicialização automática")
    print("=" * 70)
    print(f"📁 Arquivo de dados: {DATA_FILE}")
    print(f"🌐 Modo Render: {bool(os.environ.get('RENDER'))}")
    print(f"📂 Diretório atual: {os.getcwd()}")
    print("🚀 Iniciando servidor...")
    print("💡 Use Ctrl+C para parar")
    print("=" * 70)
    
    # Inicializar arquivo de dados
    init_success = init_data_file()
    if init_success:
        print("✅ Inicialização do banco de dados OK")
    else:
        print("⚠️ Problema na inicialização do banco, mas continuando...")
    
    # Configuração para desenvolvimento/produção
    debug_mode = os.environ.get('FLASK_ENV') != 'production'
    port = int(os.environ.get('PORT', 5000))
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug_mode
    )
