#!/usr/bin/env python3
"""
Quest Supremacy IRL - Versão Completamente Isolada
Zero dependências SQLAlchemy, zero conflitos
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
app.secret_key = 'quest-supremacy-secret-key-2024'
app.permanent_session_lifetime = timedelta(days=7)

# Configurar CORS
CORS(app, 
     origins=['http://localhost:5173', 'https://quest-supremacy-irl.vercel.app', '*'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization', 'X-Requested-With'],
     supports_credentials=True)

# Arquivo de dados
DATA_FILE = 'quest_data.json'

def load_data():
    """Carregar dados do arquivo JSON"""
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
    except:
        pass
    
    return {
        'users': {},
        'game_data': {},
        'created_at': datetime.now().isoformat()
    }

def save_data(data):
    """Salvar dados no arquivo JSON"""
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Erro ao salvar: {e}")
        return False

def hash_password(password):
    """Hash da senha"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_stats():
    """Criar status iniciais"""
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

def create_quests():
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
            'description': 'Pratique 10 minutos de meditação',
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
            'description': 'Coma apenas alimentos saudáveis',
            'category': 'nutrition',
            'xp_reward': 16,
            'completed': False
        }
    ]

@app.route('/')
def index():
    return jsonify({
        'message': 'Quest Supremacy IRL API - Versão Isolada',
        'version': '1.0.0-isolated',
        'status': 'running'
    })

@app.route('/health')
def health():
    data = load_data()
    return jsonify({
        'status': 'healthy',
        'users': len(data.get('users', {})),
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        
        if not username or not email or not password:
            return jsonify({'error': 'Todos os campos são obrigatórios'}), 400
        
        app_data = load_data()
        
        if username in app_data['users']:
            return jsonify({'error': 'Username já existe'}), 400
        
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
            'stats': create_stats(),
            'daily_quests': create_quests(),
            'achievements': [],
            'level': 1,
            'total_xp': 0
        }
        
        save_data(app_data)
        
        # Criar sessão
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
        return jsonify({'error': 'Erro interno'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()
        
        if not username or not password:
            return jsonify({'error': 'Username e senha obrigatórios'}), 400
        
        app_data = load_data()
        
        if username not in app_data['users']:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        user = app_data['users'][username]
        if user['password'] != hash_password(password):
            return jsonify({'error': 'Senha incorreta'}), 401
        
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
        return jsonify({'error': 'Erro interno'}), 500

@app.route('/api/auth/check-auth', methods=['GET'])
def check_auth():
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

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logout realizado com sucesso!'})

@app.route('/api/game/player-stats', methods=['GET'])
def get_player_stats():
    if not session.get('logged_in'):
        return jsonify({'error': 'Não autenticado'}), 401
    
    username = session['username']
    app_data = load_data()
    
    if username not in app_data['game_data']:
        app_data['game_data'][username] = {
            'stats': create_stats(),
            'daily_quests': create_quests(),
            'achievements': [],
            'level': 1,
            'total_xp': 0
        }
        save_data(app_data)
    
    return jsonify(app_data['game_data'][username]['stats'])

@app.route('/api/game/daily-quests', methods=['GET'])
def get_daily_quests():
    if not session.get('logged_in'):
        return jsonify({'error': 'Não autenticado'}), 401
    
    username = session['username']
    app_data = load_data()
    
    if username not in app_data['game_data']:
        app_data['game_data'][username] = {
            'stats': create_stats(),
            'daily_quests': create_quests(),
            'achievements': [],
            'level': 1,
            'total_xp': 0
        }
        save_data(app_data)
    
    return jsonify(app_data['game_data'][username]['daily_quests'])

@app.route('/api/game/complete-quest', methods=['POST'])
def complete_quest():
    if not session.get('logged_in'):
        return jsonify({'error': 'Não autenticado'}), 401
    
    try:
        data = request.get_json()
        quest_id = data.get('quest_id')
        
        username = session['username']
        app_data = load_data()
        
        if username not in app_data['game_data']:
            return jsonify({'error': 'Dados não encontrados'}), 404
        
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
            return jsonify({'error': 'Quest já completada'}), 400
        
        # Completar quest
        quest['completed'] = True
        
        # Adicionar XP
        category = quest['category']
        xp_reward = quest['xp_reward']
        
        if category in game_data['stats']:
            game_data['stats'][category]['xp'] += xp_reward
            game_data['total_xp'] += xp_reward
        
        save_data(app_data)
        
        return jsonify({
            'message': 'Quest completada com sucesso!',
            'xp_gained': xp_reward,
            'category': category
        })
        
    except Exception as e:
        print(f"Erro ao completar quest: {e}")
        return jsonify({'error': 'Erro interno'}), 500

if __name__ == '__main__':
    print("🚀 Quest Supremacy IRL - VERSÃO ISOLADA")
    print("=" * 50)
    print("✅ ZERO SQLAlchemy")
    print("✅ ZERO conflitos")
    print("✅ Apenas Flask + JSON")
    print("=" * 50)
    print("🚀 Iniciando em http://localhost:5000")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
