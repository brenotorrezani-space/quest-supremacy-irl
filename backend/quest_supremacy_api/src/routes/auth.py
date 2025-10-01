from flask import Blueprint, jsonify, request, session
from src.models.user import User, GameData, db
from datetime import datetime, date
import json

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Registrar novo usuário"""
    try:
        data = request.json
        
        # Validar dados obrigatórios
        if not data.get('username') or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Username, email e password são obrigatórios'}), 400
        
        # Verificar se usuário já existe
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username já existe'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email já está em uso'}), 400
        
        # Criar novo usuário
        user = User(
            username=data['username'],
            email=data['email']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Criar dados iniciais do jogo
        initial_stats = {
            'força': {'level': 'F', 'xp': 0, 'crisis': False},
            'saude_mental': {'level': 'F', 'xp': 0, 'crisis': False},
            'inteligencia': {'level': 'F', 'xp': 0, 'crisis': False},
            'controle_vicios': {'level': 'F', 'xp': 0, 'crisis': False},
            'saude_alimentar': {'level': 'F', 'xp': 0, 'crisis': False},
            'resistencia': {'level': 'F', 'xp': 0, 'crisis': False},
            'velocidade': {'level': 'F', 'xp': 0, 'crisis': False},
            'carisma': {'level': 'F', 'xp': 0, 'crisis': False},
            'habilidades': {'level': 'F', 'xp': 0, 'crisis': False},
            'sexualidade': {'level': 'F', 'xp': 0, 'crisis': False}
        }
        
        game_data = GameData(user_id=user.id)
        game_data.set_player_stats(initial_stats)
        game_data.set_daily_quests([])
        game_data.set_achievements([])
        game_data.set_settings({'darkMode': True, 'notifications': True})
        
        db.session.add(game_data)
        db.session.commit()
        
        # Fazer login automático
        session['user_id'] = user.id
        session['username'] = user.username
        
        return jsonify({
            'message': 'Usuário criado com sucesso',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Fazer login do usuário"""
    try:
        data = request.json
        
        if not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Username e password são obrigatórios'}), 400
        
        # Buscar usuário
        user = User.query.filter_by(username=data['username']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Credenciais inválidas'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Conta desativada'}), 401
        
        # Atualizar último login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Criar sessão
        session['user_id'] = user.id
        session['username'] = user.username
        
        return jsonify({
            'message': 'Login realizado com sucesso',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Fazer logout do usuário"""
    session.clear()
    return jsonify({'message': 'Logout realizado com sucesso'}), 200

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """Obter dados do usuário atual"""
    if 'user_id' not in session:
        return jsonify({'error': 'Não autenticado'}), 401
    
    user = User.query.get(session['user_id'])
    if not user:
        session.clear()
        return jsonify({'error': 'Usuário não encontrado'}), 404
    
    return jsonify(user.to_dict()), 200

@auth_bp.route('/check-auth', methods=['GET'])
def check_auth():
    """Verificar se usuário está autenticado"""
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        if user and user.is_active:
            return jsonify({
                'authenticated': True,
                'user': user.to_dict()
            }), 200
    
    return jsonify({'authenticated': False}), 200
