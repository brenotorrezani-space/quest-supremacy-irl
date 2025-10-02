#!/usr/bin/env python3
"""
Quest Supremacy IRL - Backend Ultra-Limpo
Sem SQLAlchemy, sem dependências complexas, apenas Flask + JSON
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

# Configurar chave secreta para sessões
app.secret_key = secrets.token_hex(32)
app.permanent_session_lifetime = timedelta(days=7)

# Configurar CORS
CORS(app, 
     origins=['http://localhost:5173', 'https://quest-supremacy-irl.vercel.app'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization', 'X-Requested-With'],
     supports_credentials=True,
     expose_headers=['Content-Type'])

# Arquivo de dados
DATA_FILE = os.path.join(os.path.dirname(__file__), '..', 'game_data.json')

def init_data_file():
    """Inicializar arquivo de dados se não existir"""
    if not os.path.exists(DATA_FILE):
        initial_data = {
            'users': {},
            'game_data': {},
            'metadata': {
                'created_at': datetime.now().isoformat(),
                'version': '1.0.0'
            }
        }
        save_data(initial_data)

def load_data():
    """Carregar dados do arquivo JSON"""
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        print(f"Erro ao carregar dados: {e}")
    
    # Retornar estrutura padrão se falhar
    return {
        'users': {},
        'game_data': {},
        'metadata': {
            'created_at': datetime.now().isoformat(),
            'version': '1.0.0'
        }
    }

def save_data(data):
    """Salvar dados no arquivo JSON"""
    try:
        # Criar diretório se não existir
        os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
        
        # Salvar com backup
        backup_file = DATA_FILE + '.backup'
        if os.path.exists(DATA_FILE):
            os.rename(DATA_FILE, backup_file)
        
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        # Remover backup se salvou com sucesso
        if os.path.exists(backup_file):
            os.remove(backup_file)
            
        return True
    except Exception as e:
        print(f"Erro ao salvar dados: {e}")
        # Restaurar backup se falhou
        backup_file = DATA_FILE + '.backup'
        if os.path.exists(backup_file):
            os.rename(backup_file, DATA_FILE)
        return False

def hash_password(password):
    """Criar hash da senha"""
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def generate_user_id():
    """Gerar ID único para usuário"""
    return str(uuid.uuid4())

def create_initial_stats():
    """Criar status iniciais do jogador"""
    stats = {}
    categories = [
        'strength', 'mental_health', 'intelligence', 'addiction_control',
        'nutrition', 'endurance', 'speed', 'charisma', 'skills', 'sexuality'
    ]
    
    for category in categories:
        stats[category] = {
            'level': 'F',
            'xp': 0,
            'max_xp': 100,
            'total_xp': 0
        }
    
    return stats

def create_daily_quests():
    """Criar quests diárias"""
    quests = [
        {
            'id': 'quest_1',
            'title': 'Ritual da Força',
            'description': 'Complete 30 minutos de exercício físico',
            'category': 'strength',
            'xp_reward': 15,
            'completed': False,
            'type': 'daily'
        },
        {
            'id': 'quest_2',
            'title': 'Meditação Mental',
            'description': 'Pratique 10 minutos de meditação ou mindfulness',
            'category': 'mental_health',
            'xp_reward': 12,
            'completed': False,
            'type': 'daily'
        },
        {
            'id': 'quest_3',
            'title': 'Aprendizado Épico',
            'description': 'Estude algo novo por 45 minutos',
            'category': 'intelligence',
            'xp_reward': 18,
            'completed': False,
            'type': 'daily'
        },
        {
            'id': 'quest_4',
            'title': 'Resistência às Trevas',
            'description': 'Evite vícios por todo o dia',
            'category': 'addiction_control',
            'xp_reward': 20,
            'completed': False,
            'type': 'daily'
        },
        {
            'id': 'quest_5',
            'title': 'Nutrição Sagrada',
            'description': 'Coma apenas alimentos saudáveis hoje',
            'category': 'nutrition',
            'xp_reward': 16,
            'completed': False,
            'type': 'daily'
        }
    ]
    return quests

# Inicializar arquivo de dados
init_data_file()

@app.before_request
def before_request():
    """Processar request antes de chegar às rotas"""
    # Fazer sessão permanente
    session.permanent = True

@app.route('/')
def index():
    """Página inicial da API"""
    return jsonify({
        'message': 'Quest Supremacy IRL API - Ultra Clean Version',
        'version': '1.0.0-clean',
        'status': 'running',
        'database': 'json_file',
        'features': ['authentication', 'rpg_system', 'daily_quests']
    })

@app.route('/health')
def health():
    """Health check endpoint"""
    data = load_data()
    return jsonify({
        'status': 'healthy',
        'users_count': len(data.get('users', {})),
        'data_file_exists': os.path.exists(DATA_FILE),
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Registrar novo usuário"""
    try:
        # Obter dados da request
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        
        # Validar dados
        if not username or not email or not password:
            return jsonify({'error': 'Username, email e senha são obrigatórios'}), 400
        
        if len(username) < 3:
            return jsonify({'error': 'Username deve ter pelo menos 3 caracteres'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'Senha deve ter pelo menos 6 caracteres'}), 400
        
        # Carregar dados existentes
        app_data = load_data()
        
        # Verificar se usuário já existe
        if username in app_data['users']:
            return jsonify({'error': 'Username já existe'}), 400
        
        # Verificar se email já existe
        for user_data in app_data['users'].values():
            if user_data.get('email') == email:
                return jsonify({'error': 'Email já está em uso'}), 400
        
        # Criar novo usuário
        user_id = generate_user_id()
        app_data['users'][username] = {
            'id': user_id,
            'username': username,
            'email': email,
            'password': hash_password(password),
            'created_at': datetime.now().isoformat(),
            'last_login': None
        }
        
        # Criar dados do jogo para o usuário
        app_data['game_data'][username] = {
            'stats': create_initial_stats(),
            'daily_quests': create_daily_quests(),
            'achievements': [],
            'level': 1,
            'total_xp': 0,
            'last_quest_reset': datetime.now().isoformat()
        }
        
        # Salvar dados
        if not save_data(app_data):
            return jsonify({'error': 'Erro ao salvar dados do usuário'}), 500
        
        # Criar sessão
        session['user_id'] = user_id
        session['username'] = username
        session['logged_in'] = True
        
        # Resposta de sucesso
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
    """Login do usuário"""
    try:
        # Obter dados da request
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()
        
        # Validar dados
        if not username or not password:
            return jsonify({'error': 'Username e senha são obrigatórios'}), 400
        
        # Carregar dados
        app_data = load_data()
        
        # Verificar se usuário existe
        if username not in app_data['users']:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        user_data = app_data['users'][username]
        
        # Verificar senha
        if user_data['password'] != hash_password(password):
            return jsonify({'error': 'Senha incorreta'}), 401
        
        # Atualizar último login
        app_data['users'][username]['last_login'] = datetime.now().isoformat()
        save_data(app_data)
        
        # Criar sessão
        session['user_id'] = user_data['id']
        session['username'] = username
        session['logged_in'] = True
        
        # Resposta de sucesso
        return jsonify({
            'message': 'Login realizado com sucesso!',
            'user': {
                'id': user_data['id'],
                'username': username,
                'email': user_data['email']
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
        
        user_data = app_data['users'][username]
        return jsonify({
            'authenticated': True,
            'user': {
                'id': user_data['id'],
                'username': username,
                'email': user_data['email']
            }
        })
        
    except Exception as e:
        print(f"Erro na verificação de auth: {e}")
        return jsonify({'authenticated': False})

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Logout do usuário"""
    session.clear()
    return jsonify({'message': 'Logout realizado com sucesso!'})

@app.route('/api/game/player-stats', methods=['GET'])
def get_player_stats():
    """Obter status do jogador"""
    if not session.get('logged_in'):
        return jsonify({'error': 'Não autenticado'}), 401
    
    try:
        username = session['username']
        app_data = load_data()
        
        if username not in app_data['game_data']:
            # Criar dados iniciais se não existirem
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
        return jsonify({'error': 'Erro interno do servidor'}), 500

@app.route('/api/game/daily-quests', methods=['GET'])
def get_daily_quests():
    """Obter quests diárias"""
    if not session.get('logged_in'):
        return jsonify({'error': 'Não autenticado'}), 401
    
    try:
        username = session['username']
        app_data = load_data()
        
        if username not in app_data['game_data']:
            # Criar dados iniciais se não existirem
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
        return jsonify({'error': 'Erro interno do servidor'}), 500

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
        quest_found = None
        for quest in game_data['daily_quests']:
            if quest['id'] == quest_id:
                quest_found = quest
                break
        
        if not quest_found:
            return jsonify({'error': 'Quest não encontrada'}), 404
        
        if quest_found['completed']:
            return jsonify({'error': 'Quest já foi completada'}), 400
        
        # Marcar quest como completada
        quest_found['completed'] = True
        
        # Adicionar XP ao status correspondente
        category = quest_found['category']
        xp_reward = quest_found['xp_reward']
        
        if category in game_data['stats']:
            game_data['stats'][category]['xp'] += xp_reward
            game_data['stats'][category]['total_xp'] += xp_reward
            game_data['total_xp'] += xp_reward
            
            # Verificar level up
            current_stat = game_data['stats'][category]
            if current_stat['xp'] >= current_stat['max_xp']:
                # Level up logic aqui se necessário
                pass
        
        # Salvar dados
        if not save_data(app_data):
            return jsonify({'error': 'Erro ao salvar progresso'}), 500
        
        return jsonify({
            'message': 'Quest completada com sucesso!',
            'xp_gained': xp_reward,
            'category': category
        })
        
    except Exception as e:
        print(f"Erro ao completar quest: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500

# Endpoint de debug (remover em produção)
@app.route('/debug/data')
def debug_data():
    """Ver dados para debug"""
    data = load_data()
    return jsonify({
        'users_count': len(data.get('users', {})),
        'users': list(data.get('users', {}).keys()),
        'game_data_count': len(data.get('game_data', {})),
        'file_path': DATA_FILE,
        'file_exists': os.path.exists(DATA_FILE)
    })

if __name__ == '__main__':
    print("🚀 Quest Supremacy IRL - ULTRA CLEAN VERSION")
    print("=" * 60)
    print("✅ Sem SQLAlchemy - apenas Flask + JSON")
    print("✅ Sem dependências complexas")
    print("✅ Sistema de sessões Flask nativo")
    print("✅ Persistência em arquivo JSON")
    print("✅ CORS configurado")
    print("=" * 60)
    print(f"📁 Arquivo de dados: {DATA_FILE}")
    print("🚀 Iniciando servidor em http://localhost:5000")
    print("💡 Use Ctrl+C para parar")
    print()
    
    # Iniciar servidor
    app.run(
        debug=True,
        host='0.0.0.0',
        port=5000,
        use_reloader=True
    )
