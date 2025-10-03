#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
QUEST SUPREMACY IRL - BACKEND PARA PRODUÇÃO
==========================================
Versão otimizada para deploy no Render
"""

from flask import Flask, request, jsonify, session
from flask_cors import CORS
import json
import os
import hashlib
import uuid
from datetime import datetime

# Configuração da aplicação
app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'quest-supremacy-ultra-secret-key-2024')

# CORS totalmente permissivo para desenvolvimento e produção
CORS(app, 
     origins=['*'],
     allow_headers=['*'],
     methods=['*'],
     supports_credentials=True)

# Arquivo de dados
DATA_FILE = 'users_data.json'

def log(message):
    """Log com timestamp"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print(f"[{timestamp}] {message}")

def load_data():
    """Carrega dados do arquivo JSON"""
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                log(f"✅ Dados carregados: {len(data.get('users', []))} usuários")
                return data
        else:
            log("📁 Arquivo de dados não existe, criando novo")
            return {'users': []}
    except Exception as e:
        log(f"❌ Erro ao carregar dados: {e}")
        return {'users': []}

def save_data(data):
    """Salva dados no arquivo JSON"""
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        log(f"✅ Dados salvos: {len(data.get('users', []))} usuários")
        return True
    except Exception as e:
        log(f"❌ Erro ao salvar dados: {e}")
        return False

def hash_password(password):
    """Hash simples da senha"""
    return hashlib.sha256(password.encode()).hexdigest()

# Rotas principais
@app.route('/')
def home():
    log("🏠 Acesso à página inicial")
    return jsonify({
        'message': 'Quest Supremacy IRL - Backend em Produção',
        'status': 'online',
        'version': 'production-v1.0',
        'environment': 'render'
    })

@app.route('/health')
def health():
    log("❤️ Health check")
    data = load_data()
    return jsonify({
        'status': 'healthy',
        'users_count': len(data.get('users', [])),
        'version': 'production',
        'timestamp': datetime.now().isoformat(),
        'environment': 'render'
    })

@app.route('/api/auth/register', methods=['POST', 'OPTIONS'])
def register():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return '', 200
        
    log("🔄 [REGISTRO] Iniciando processo de registro...")
    
    try:
        # Obter dados da requisição
        data = request.get_json()
        log(f"📝 [REGISTRO] Dados recebidos: {data}")
        
        if not data:
            log("❌ [REGISTRO] Nenhum dado recebido")
            return jsonify({'error': 'Nenhum dado recebido'}), 400
        
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        
        log(f"📝 [REGISTRO] Username: {username}, Email: {email}")
        
        # Validações básicas
        if not username or not email or not password:
            log("❌ [REGISTRO] Campos obrigatórios faltando")
            return jsonify({'error': 'Todos os campos são obrigatórios'}), 400
        
        if len(username) < 3:
            log("❌ [REGISTRO] Username muito curto")
            return jsonify({'error': 'Username deve ter pelo menos 3 caracteres'}), 400
        
        if len(password) < 6:
            log("❌ [REGISTRO] Senha muito curta")
            return jsonify({'error': 'Senha deve ter pelo menos 6 caracteres'}), 400
        
        # Carregar dados existentes
        log("🔄 [REGISTRO] Carregando dados existentes...")
        users_data = load_data()
        users = users_data.get('users', [])
        
        # Verificar se usuário já existe
        for user in users:
            if user.get('username') == username:
                log(f"❌ [REGISTRO] Username já existe: {username}")
                return jsonify({'error': 'Username já existe'}), 400
            if user.get('email') == email:
                log(f"❌ [REGISTRO] Email já existe: {email}")
                return jsonify({'error': 'Email já existe'}), 400
        
        log("✅ [REGISTRO] Usuário único confirmado")
        
        # Criar novo usuário
        user_id = str(uuid.uuid4())
        password_hash = hash_password(password)
        
        log("🔄 [REGISTRO] Criando novo usuário...")
        
        new_user = {
            'id': user_id,
            'username': username,
            'email': email,
            'password_hash': password_hash,
            'created_at': datetime.now().isoformat(),
            'stats': {
                'força': {'level': 'F', 'xp': 0, 'max_xp': 100},
                'saude_mental': {'level': 'F', 'xp': 0, 'max_xp': 100},
                'inteligencia': {'level': 'F', 'xp': 0, 'max_xp': 100},
                'controle_vicios': {'level': 'F', 'xp': 0, 'max_xp': 100},
                'saude_alimentar': {'level': 'F', 'xp': 0, 'max_xp': 100},
                'resistencia': {'level': 'F', 'xp': 0, 'max_xp': 100},
                'velocidade': {'level': 'F', 'xp': 0, 'max_xp': 100},
                'carisma': {'level': 'F', 'xp': 0, 'max_xp': 100},
                'habilidades': {'level': 'F', 'xp': 0, 'max_xp': 100},
                'sexualidade': {'level': 'F', 'xp': 0, 'max_xp': 100}
            },
            'quests_completed': [],
            'achievements': [],
            'last_quest_date': None
        }
        
        # Adicionar usuário à lista
        users.append(new_user)
        users_data['users'] = users
        
        # Salvar dados
        log("🔄 [REGISTRO] Salvando usuário...")
        if save_data(users_data):
            log("✅ [REGISTRO] Usuário salvo com sucesso")
            
            # Criar sessão
            session['user_id'] = user_id
            session['username'] = username
            log(f"✅ [REGISTRO] Sessão criada para: {username}")
            
            # Resposta de sucesso
            response_data = {
                'message': 'Usuário registrado com sucesso!',
                'success': True,
                'user': {
                    'id': user_id,
                    'username': username,
                    'email': email
                }
            }
            
            log(f"🎉 [REGISTRO] Registro concluído com sucesso para: {username}")
            return jsonify(response_data), 201
        else:
            log("❌ [REGISTRO] Erro ao salvar usuário")
            return jsonify({'error': 'Erro ao salvar usuário'}), 500
            
    except Exception as e:
        log(f"❌ [REGISTRO] Erro inesperado: {str(e)}")
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200
        
    log("🔄 [LOGIN] Iniciando processo de login...")
    
    try:
        data = request.get_json()
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()
        
        log(f"📝 [LOGIN] Tentativa de login: {username}")
        
        if not username or not password:
            return jsonify({'error': 'Username e senha são obrigatórios'}), 400
        
        # Carregar dados
        users_data = load_data()
        users = users_data.get('users', [])
        
        # Buscar usuário
        password_hash = hash_password(password)
        for user in users:
            if (user.get('username') == username and 
                user.get('password_hash') == password_hash):
                
                # Criar sessão
                session['user_id'] = user['id']
                session['username'] = user['username']
                
                log(f"✅ [LOGIN] Login bem-sucedido: {username}")
                return jsonify({
                    'message': 'Login realizado com sucesso!',
                    'success': True,
                    'user': {
                        'id': user['id'],
                        'username': user['username'],
                        'email': user['email']
                    }
                }), 200
        
        log(f"❌ [LOGIN] Credenciais inválidas: {username}")
        return jsonify({'error': 'Credenciais inválidas'}), 401
        
    except Exception as e:
        log(f"❌ [LOGIN] Erro inesperado: {str(e)}")
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@app.route('/api/game/player-stats', methods=['GET'])
def get_player_stats():
    if 'user_id' not in session:
        return jsonify({'error': 'Não autenticado'}), 401
    
    users_data = load_data()
    users = users_data.get('users', [])
    
    for user in users:
        if user['id'] == session['user_id']:
            return jsonify(user['stats']), 200
    
    return jsonify({'error': 'Usuário não encontrado'}), 404

@app.route('/api/game/daily-quests', methods=['GET'])
def get_daily_quests():
    if 'user_id' not in session:
        return jsonify({'error': 'Não autenticado'}), 401
    
    # Quests padrão do dia
    daily_quests = [
        {
            'id': 'exercise',
            'title': 'Exercitar-se',
            'description': 'Faça pelo menos 30 minutos de exercício',
            'xp_reward': 50,
            'completed': False
        },
        {
            'id': 'read',
            'title': 'Leitura',
            'description': 'Leia por pelo menos 20 minutos',
            'xp_reward': 30,
            'completed': False
        },
        {
            'id': 'meditate',
            'title': 'Meditação',
            'description': 'Medite por 10 minutos',
            'xp_reward': 40,
            'completed': False
        }
    ]
    
    return jsonify(daily_quests), 200

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    log("🔄 [LOGOUT] Fazendo logout...")
    session.clear()
    log("✅ [LOGOUT] Logout realizado")
    return jsonify({'message': 'Logout realizado com sucesso!'}), 200

@app.route('/api/auth/check-auth')
def check_auth():
    log("🔄 [AUTH] Verificando autenticação...")
    
    if 'user_id' in session:
        log(f"✅ [AUTH] Usuário autenticado: {session.get('username')}")
        return jsonify({
            'authenticated': True,
            'user': {
                'id': session['user_id'],
                'username': session['username']
            }
        }), 200
    else:
        log("❌ [AUTH] Usuário não autenticado")
        return jsonify({'authenticated': False}), 401

# Rota de teste
@app.route('/api/test')
def test():
    log("🧪 Teste da API")
    return jsonify({
        'message': 'API funcionando perfeitamente em produção!',
        'status': 'success',
        'timestamp': datetime.now().isoformat(),
        'environment': 'render'
    })

if __name__ == '__main__':
    log("🚀 QUEST SUPREMACY IRL - BACKEND PRODUÇÃO")
    log("=" * 60)
    log("✅ CORS configurado para Vercel")
    log("✅ Logs detalhados")
    log("✅ Tratamento robusto de erros")
    log("✅ Pronto para produção")
    log("=" * 60)
    
    # Testar carregamento de dados na inicialização
    data = load_data()
    log(f"📊 Usuários existentes: {len(data.get('users', []))}")
    
    # Iniciar servidor
    port = int(os.environ.get('PORT', 5000))
    log(f"🚀 Iniciando servidor na porta {port}")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=False
    )
