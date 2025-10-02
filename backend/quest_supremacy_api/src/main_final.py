#!/usr/bin/env python3
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import json
import os
import hashlib
import secrets
from datetime import datetime

# Criar app Flask
app = Flask(__name__)
app.secret_key = secrets.token_hex(32)

# CORS configurado
CORS(app, 
     origins=['http://localhost:5173', 'https://quest-supremacy-irl.vercel.app'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization'],
     supports_credentials=True)

# Arquivo de dados
DATA_FILE = 'quest_data.json'

def load_data():
    """Carregar dados do arquivo JSON"""
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            pass
    return {
        'users': {},
        'game_data': {},
        'sessions': {}
    }

def save_data(data):
    """Salvar dados no arquivo JSON"""
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Erro ao salvar dados: {e}")
        return False

def hash_password(password):
    """Hash da senha"""
    return hashlib.sha256(password.encode()).hexdigest()

def generate_initial_stats():
    """Gerar status iniciais do jogador"""
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

def generate_daily_quests():
    """Gerar quests diárias"""
    quests = [
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
            'description': 'Evite vícios por todo o dia',
            'category': 'addiction_control',
            'xp_reward': 20,
            'completed': False
        },
        {
            'id': 5,
            'title': 'Nutrição Sagrada',
            'description': 'Coma apenas alimentos saudáveis hoje',
            'category': 'nutrition',
            'xp_reward': 16,
            'completed': False
        }
    ]
    return quests

@app.route('/')
def index():
    """Página inicial da API"""
    return jsonify({
        'message': 'Quest Supremacy IRL API',
        'version': '1.0.0',
        'status': 'running'
    })

@app.route('/health')
def health():
    """Health check"""
    return jsonify({'status': 'healthy'})

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
            return jsonify({'error': 'Username, email e senha são obrigatórios'}), 400
        
        # Carregar dados
        app_data = load_data()
        
        # Verificar se usuário já existe
        if username in app_data['users']:
            return jsonify({'error': 'Username já existe'}), 400
        
        # Verificar se email já existe
        for user in app_data['users'].values():
            if user.get('email') == email:
                return jsonify({'error': 'Email já existe'}), 400
        
        # Criar usuário
        user_id = len(app_data['users']) + 1
        app_data['users'][username] = {
            'id': user_id,
            'username': username,
            'email': email,
            'password': hash_password(password),
            'created_at': datetime.now().isoformat()
        }
        
        # Criar dados do jogo
        app_data['game_data'][username] = {
            'stats': generate_initial_stats(),
            'daily_quests': generate_daily_quests(),
            'achievements': [],
            'level': 1,
            'total_xp': 0
        }
        
        # Salvar dados
        if not save_data(app_data):
            return jsonify({'error': 'Erro ao salvar usuário'}), 500
        
        # Criar sessão
        session['user_id'] = user_id
        session['username'] = username
        
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
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()
        
        if not username or not password:
            return jsonify({'error': 'Username e senha são obrigatórios'}), 400
        
        # Carregar dados
        app_data = load_data()
        
        # Verificar usuário
        if username not in app_data['users']:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        user = app_data['users'][username]
        if user['password'] != hash_password(password):
            return jsonify({'error': 'Senha incorreta'}), 401
        
        # Criar sessão
        session['user_id'] = user['id']
        session['username'] = username
        
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
    """Verificar autenticação"""
    if 'username' in session:
        app_data = load_data()
        username = session['username']
        if username in app_data['users']:
            user = app_data['users'][username]
            return jsonify({
                'authenticated': True,
                'user': {
                    'id': user['id'],
                    'username': username,
                    'email': user['email']
                }
            })
    
    return jsonify({'authenticated': False})

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Logout do usuário"""
    session.clear()
    return jsonify({'message': 'Logout realizado com sucesso!'})

@app.route('/api/game/player-stats', methods=['GET'])
def get_player_stats():
    """Obter status do jogador"""
    if 'username' not in session:
        return jsonify({'error': 'Não autenticado'}), 401
    
    app_data = load_data()
    username = session['username']
    
    if username in app_data['game_data']:
        return jsonify(app_data['game_data'][username]['stats'])
    
    return jsonify(generate_initial_stats())

@app.route('/api/game/daily-quests', methods=['GET'])
def get_daily_quests():
    """Obter quests diárias"""
    if 'username' not in session:
        return jsonify({'error': 'Não autenticado'}), 401
    
    app_data = load_data()
    username = session['username']
    
    if username in app_data['game_data']:
        return jsonify(app_data['game_data'][username]['daily_quests'])
    
    return jsonify(generate_daily_quests())

@app.route('/api/game/complete-quest', methods=['POST'])
def complete_quest():
    """Completar uma quest"""
    if 'username' not in session:
        return jsonify({'error': 'Não autenticado'}), 401
    
    try:
        data = request.get_json()
        quest_id = data.get('quest_id')
        
        if not quest_id:
            return jsonify({'error': 'ID da quest é obrigatório'}), 400
        
        app_data = load_data()
        username = session['username']
        
        if username not in app_data['game_data']:
            return jsonify({'error': 'Dados do jogo não encontrados'}), 404
        
        # Encontrar e completar quest
        quests = app_data['game_data'][username]['daily_quests']
        for quest in quests:
            if quest['id'] == quest_id:
                quest['completed'] = True
                
                # Adicionar XP ao status correspondente
                category = quest['category']
                if category in app_data['game_data'][username]['stats']:
                    app_data['game_data'][username]['stats'][category]['xp'] += quest['xp_reward']
                
                break
        
        # Salvar dados
        save_data(app_data)
        
        return jsonify({'message': 'Quest completada com sucesso!'})
        
    except Exception as e:
        print(f"Erro ao completar quest: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500

if __name__ == '__main__':
    print("🚀 Quest Supremacy IRL - VERSÃO FINAL")
    print("=" * 50)
    print("🌐 CORS: Configurado para localhost e Vercel")
    print("💾 Database: Arquivo JSON local")
    print("🎮 Funcionalidades: Completas")
    print("=" * 50)
    print("🚀 Iniciando servidor em http://localhost:5000")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
