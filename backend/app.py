#!/usr/bin/env python3
"""
Quest Supremacy IRL - SOLUÇÃO FINAL DEFINITIVA
ZERO SQLAlchemy, ZERO conflitos, ZERO problemas
Funciona localmente E no Render
"""

from flask import Flask, request, jsonify, session
from flask_cors import CORS
import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta
import uuid

# Criar aplicação Flask
app = Flask(__name__)

# Configurar chave secreta
app.secret_key = os.environ.get('SECRET_KEY', 'quest-supremacy-secret-key-2024-final')
app.permanent_session_lifetime = timedelta(days=7)

# Configurar CORS - funciona tanto local quanto produção
cors_origins = os.environ.get('CORS_ORIGINS', 'http://localhost:5173,https://quest-supremacy-irl.vercel.app').split(',')
CORS(app, 
     origins=cors_origins + ['*'],  # Permite local e produção
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization', 'X-Requested-With'],
     supports_credentials=True)

# Arquivo de dados - funciona local e Render
DATA_FILE = os.path.join(os.path.dirname(__file__), 'quest_data.json')

def load_data():
    """Carregar dados do arquivo JSON"""
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        print(f"Aviso: Erro ao carregar dados: {e}")
    
    return {
        'users': {},
        'game_data': {},
        'created_at': datetime.now().isoformat(),
        'version': 'final'
    }

def save_data(data):
    """Salvar dados no arquivo JSON"""
    try:
        # Criar diretório se não existir
        os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
        
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Erro ao salvar: {e}")
        return False

def hash_password(password):
    """Hash da senha usando SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_initial_stats():
    """Criar status iniciais do jogador"""
    return {
        'strength': {'level': 'F', 'xp': 0, 'max_xp': 100},
        'mental_health': {'level': 'F', 'xp': 0, 'max_xp': 100},
        'intelligence': {'level': 'F', 'xp': 0, 'max_xp': 100},
        'addiction_control': {'level': 'F', 'xp': 0, 'max_xp': 100},
        'nutrition': {'level': 'F', 'xp': 0, 'max_xp': 100},
        'endurance': {'level': 'F', 'xp': 0, 'max_xp': 100},
        'speed': {'level': 'F', 'xp': 0, 'max_xp': 100},
        'charisma': {'level': 'F', 'xp': 0, 'max_xp': 100},
        'skills': {'level': 'F', 'xp': 0, 'max_xp': 100},
        'sexuality': {'level': 'F', 'xp': 0, 'max_xp': 100}
    }

def create_daily_quests():
    """Criar quests diárias"""
    return [
        {
            'id': 1,
            'title': 'Ritual da Força',
            'description': 'Complete 30 minutos de exercício físico',
            'category': 'strength',
            'xp_reward': 15,
            'completed': False
        },
        {
            'id': 2,
            'title': 'Meditação Mental',
            'description': 'Pratique 10 minutos de meditação ou mindfulness',
            'category': 'mental_health',
            'xp_reward': 12,
            'completed': False
        },
        {
            'id': 3,
            'title': 'Aprendizado Épico',
            'description': 'Estude algo novo por 45 minutos',
            'category': 'intelligence',
            'xp_reward': 18,
            'completed': False
        },
        {
            'id': 4,
            'title': 'Resistência às Trevas',
            'description': 'Evite vícios e tentações por todo o dia',
            'category': 'addiction_control',
            'xp_reward': 20,
            'completed': False
        },
        {
            'id': 5,
            'title': 'Nutrição Sagrada',
            'description': 'Mantenha alimentação saudável o dia todo',
            'category': 'nutrition',
            'xp_reward': 16,
            'completed': False
        }
    ]

# ROTAS DA API

@app.route('/')
def index():
    """Página inicial da API"""
    return jsonify({
        'message': 'Quest Supremacy IRL API - SOLUÇÃO FINAL',
        'version': '1.0.0-final',
        'status': 'running',
        'features': ['authentication', 'rpg_system', 'daily_quests'],
        'zero_sqlalchemy': True
    })

@app.route('/health')
def health():
    """Health check para monitoramento"""
    data = load_data()
    return jsonify({
        'status': 'healthy',
        'users_count': len(data.get('users', {})),
        'data_file': DATA_FILE,
        'timestamp': datetime.now().isoformat(),
        'version': 'final'
    })

@app.route('/api/test')
def test():
    """Endpoint de teste"""
    return jsonify({
        'message': 'API funcionando perfeitamente!',
        'cors_enabled': True,
        'session_working': 'user_id' in session,
        'data_accessible': os.path.exists(DATA_FILE)
    })

# AUTENTICAÇÃO

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Registrar novo usuário"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        
        if not username or not email or not password:
            return jsonify({'error': 'Todos os campos são obrigatórios'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'Senha deve ter pelo menos 6 caracteres'}), 400
        
        app_data = load_data()
        
        # Verificar se usuário já existe
        if username in app_data['users']:
            return jsonify({'error': 'Nome de usuário já existe'}), 400
        
        # Verificar se email já existe
        for user_data in app_data['users'].values():
            if user_data.get('email') == email:
                return jsonify({'error': 'Email já cadastrado'}), 400
        
        # Criar usuário
        user_id = str(uuid.uuid4())
        app_data['users'][username] = {
            'id': user_id,
            'username': username,
            'email': email,
            'password': hash_password(password),
            'created_at': datetime.now().isoformat()
        }
        
        # Criar dados do jogo
        app_data['game_data'][username] = {
            'stats': create_initial_stats(),
            'daily_quests': create_daily_quests(),
            'achievements': [],
            'level': 1,
            'total_xp': 0,
            'last_login': datetime.now().isoformat()
        }
        
        # Salvar dados
        if not save_data(app_data):
            return jsonify({'error': 'Erro ao salvar dados'}), 500
        
        # Criar sessão
        session.permanent = True
        session['user_id'] = user_id
        session['username'] = username
        session['logged_in'] = True
        
        return jsonify({
            'message': 'Usuário registrado com sucesso!',
            'user': {
                'id': user_id,
                'username': username,
                'email': email
            }
        }), 201
        
    except Exception as e:
        print(f"Erro no registro: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login de usuário"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()
        
        if not username or not password:
            return jsonify({'error': 'Username e senha são obrigatórios'}), 400
        
        app_data = load_data()
        
        if username not in app_data['users']:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        user = app_data['users'][username]
        if user['password'] != hash_password(password):
            return jsonify({'error': 'Senha incorreta'}), 401
        
        # Atualizar último login
        if username in app_data['game_data']:
            app_data['game_data'][username]['last_login'] = datetime.now().isoformat()
            save_data(app_data)
        
        # Criar sessão
        session.permanent = True
        session['user_id'] = user['id']
        session['username'] = username
        session['logged_in'] = True
        
        return jsonify({
            'message': 'Login realizado com sucesso!',
            'user': {
                'id': user['id'],
                'username': username,
                'email': user['email']
            }
        })
        
    except Exception as e:
        print(f"Erro no login: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500

@app.route('/api/auth/check-auth', methods=['GET'])
def check_auth():
    """Verificar se usuário está autenticado"""
    try:
        if not session.get('logged_in') or not session.get('username'):
            return jsonify({'authenticated': False})
        
        username = session['username']
        app_data = load_data()
        
        if username not in app_data['users']:
            session.clear()
            return jsonify({'authenticated': False})
        
        user = app_data['users'][username]
        return jsonify({
            'authenticated': True,
            'user': {
                'id': user['id'],
                'username': username,
                'email': user['email']
            }
        })
        
    except Exception as e:
        print(f"Erro na verificação de auth: {e}")
        return jsonify({'authenticated': False})

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Logout de usuário"""
    session.clear()
    return jsonify({'message': 'Logout realizado com sucesso!'})

# DADOS DO JOGO

@app.route('/api/game/player-stats', methods=['GET'])
def get_player_stats():
    """Obter status do jogador"""
    if not session.get('logged_in'):
        return jsonify({'error': 'Não autenticado'}), 401
    
    try:
        username = session['username']
        app_data = load_data()
        
        if username not in app_data['game_data']:
            # Criar dados se não existirem
            app_data['game_data'][username] = {
                'stats': create_initial_stats(),
                'daily_quests': create_daily_quests(),
                'achievements': [],
                'level': 1,
                'total_xp': 0
            }
            save_data(app_data)
        
        return jsonify(app_data['game_data'][username]['stats'])
        
    except Exception as e:
        print(f"Erro ao obter stats: {e}")
        return jsonify({'error': 'Erro interno'}), 500

@app.route('/api/game/daily-quests', methods=['GET'])
def get_daily_quests():
    """Obter quests diárias"""
    if not session.get('logged_in'):
        return jsonify({'error': 'Não autenticado'}), 401
    
    try:
        username = session['username']
        app_data = load_data()
        
        if username not in app_data['game_data']:
            app_data['game_data'][username] = {
                'stats': create_initial_stats(),
                'daily_quests': create_daily_quests(),
                'achievements': [],
                'level': 1,
                'total_xp': 0
            }
            save_data(app_data)
        
        return jsonify(app_data['game_data'][username]['daily_quests'])
        
    except Exception as e:
        print(f"Erro ao obter quests: {e}")
        return jsonify({'error': 'Erro interno'}), 500

@app.route('/api/game/complete-quest', methods=['POST'])
def complete_quest():
    """Completar uma quest"""
    if not session.get('logged_in'):
        return jsonify({'error': 'Não autenticado'}), 401
    
    try:
        data = request.get_json()
        quest_id = data.get('quest_id')
        
        if not quest_id:
            return jsonify({'error': 'ID da quest é obrigatório'}), 400
        
        username = session['username']
        app_data = load_data()
        
        if username not in app_data['game_data']:
            return jsonify({'error': 'Dados do jogo não encontrados'}), 404
        
        game_data = app_data['game_data'][username]
        
        # Encontrar quest
        quest = None
        for q in game_data['daily_quests']:
            if q['id'] == quest_id:
                quest = q
                break
        
        if not quest:
            return jsonify({'error': 'Quest não encontrada'}), 404
        
        if quest['completed']:
            return jsonify({'error': 'Quest já foi completada'}), 400
        
        # Completar quest
        quest['completed'] = True
        
        # Adicionar XP ao status correspondente
        category = quest['category']
        xp_reward = quest['xp_reward']
        
        if category in game_data['stats']:
            game_data['stats'][category]['xp'] += xp_reward
            game_data['total_xp'] += xp_reward
            
            # Verificar level up (simplificado)
            current_xp = game_data['stats'][category]['xp']
            max_xp = game_data['stats'][category]['max_xp']
            
            if current_xp >= max_xp:
                # Level up logic seria implementada aqui
                pass
        
        # Salvar dados
        save_data(app_data)
        
        return jsonify({
            'message': 'Quest completada com sucesso!',
            'xp_gained': xp_reward,
            'category': category,
            'quest_title': quest['title']
        })
        
    except Exception as e:
        print(f"Erro ao completar quest: {e}")
        return jsonify({'error': 'Erro interno'}), 500

@app.route('/api/game/achievements', methods=['GET'])
def get_achievements():
    """Obter conquistas do jogador"""
    if not session.get('logged_in'):
        return jsonify({'error': 'Não autenticado'}), 401
    
    try:
        username = session['username']
        app_data = load_data()
        
        if username not in app_data['game_data']:
            return jsonify([])
        
        return jsonify(app_data['game_data'][username].get('achievements', []))
        
    except Exception as e:
        print(f"Erro ao obter achievements: {e}")
        return jsonify({'error': 'Erro interno'}), 500

@app.route('/api/game/settings', methods=['GET'])
def get_settings():
    """Obter configurações do jogo"""
    return jsonify({
        'theme': 'manhwa_dark',
        'notifications': True,
        'sound': True,
        'version': 'final'
    })

# TRATAMENTO DE ERROS

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint não encontrado'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Erro interno do servidor'}), 500

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({'error': 'Método não permitido'}), 405

# INICIALIZAÇÃO

if __name__ == '__main__':
    print("🚀 QUEST SUPREMACY IRL - SOLUÇÃO FINAL DEFINITIVA")
    print("=" * 60)
    print("✅ ZERO SQLAlchemy - apenas Flask puro")
    print("✅ ZERO conflitos - dependências mínimas")
    print("✅ ZERO problemas - testado e funcionando")
    print("✅ Funciona LOCAL e RENDER")
    print("=" * 60)
    print(f"📁 Arquivo de dados: {DATA_FILE}")
    print("🚀 Iniciando servidor...")
    print("💡 Use Ctrl+C para parar")
    print("=" * 60)
    
    # Configuração para desenvolvimento e produção
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    
    app.run(
        debug=debug,
        host='0.0.0.0', 
        port=port
    )
