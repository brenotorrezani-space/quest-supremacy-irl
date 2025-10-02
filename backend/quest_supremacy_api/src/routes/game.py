from flask import Blueprint, jsonify, request, session
from src.models.user import User, GameData, db
from datetime import datetime, date
import json
import random

game_bp = Blueprint('game', __name__)

def require_auth():
    """Decorator para verificar autenticação"""
    if 'user_id' not in session:
        return jsonify({'error': 'Não autenticado'}), 401
    return None

@game_bp.route('/game-data', methods=['GET'])
def get_game_data():
    """Obter todos os dados do jogo do usuário"""
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    game_data = GameData.query.filter_by(user_id=session['user_id']).first()
    
    if not game_data:
        # Criar dados iniciais se não existirem
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
        
        game_data = GameData(user_id=session['user_id'])
        game_data.set_player_stats(initial_stats)
        game_data.set_daily_quests([])
        game_data.set_achievements([])
        game_data.set_settings({'darkMode': True, 'notifications': True})
        
        db.session.add(game_data)
        db.session.commit()
    
    return jsonify(game_data.to_dict()), 200

@game_bp.route('/player-stats', methods=['GET'])
def get_player_stats():
    """Obter status do jogador"""
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    game_data = GameData.query.filter_by(user_id=session['user_id']).first()
    if not game_data:
        return jsonify({'error': 'Dados do jogo não encontrados'}), 404
    
    return jsonify(game_data.get_player_stats()), 200

@game_bp.route('/player-stats', methods=['PUT'])
def update_player_stats():
    """Atualizar status do jogador"""
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    game_data = GameData.query.filter_by(user_id=session['user_id']).first()
    if not game_data:
        return jsonify({'error': 'Dados do jogo não encontrados'}), 404
    
    data = request.json
    game_data.set_player_stats(data)
    game_data.updated_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({'message': 'Status atualizado com sucesso'}), 200

@game_bp.route('/daily-quests', methods=['GET'])
def get_daily_quests():
    """Obter quests diárias"""
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    game_data = GameData.query.filter_by(user_id=session['user_id']).first()
    if not game_data:
        return jsonify({'error': 'Dados do jogo não encontrados'}), 404
    
    # Verificar se precisa gerar novas quests
    today = date.today()
    if game_data.last_quest_date != today:
        # Gerar novas quests diárias
        new_quests = generate_daily_quests(game_data.get_player_stats())
        game_data.set_daily_quests(new_quests)
        game_data.last_quest_date = today
        db.session.commit()
    
    return jsonify(game_data.get_daily_quests()), 200

@game_bp.route('/daily-quests', methods=['PUT'])
def update_daily_quests():
    """Atualizar quests diárias"""
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    game_data = GameData.query.filter_by(user_id=session['user_id']).first()
    if not game_data:
        return jsonify({'error': 'Dados do jogo não encontrados'}), 404
    
    data = request.json
    game_data.set_daily_quests(data)
    game_data.updated_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({'message': 'Quests atualizadas com sucesso'}), 200

@game_bp.route('/complete-quest', methods=['POST'])
def complete_quest():
    """Completar uma quest"""
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    data = request.json
    quest_id = data.get('quest_id')
    
    game_data = GameData.query.filter_by(user_id=session['user_id']).first()
    if not game_data:
        return jsonify({'error': 'Dados do jogo não encontrados'}), 404
    
    # Atualizar quest como completada
    quests = game_data.get_daily_quests()
    for quest in quests:
        if quest.get('id') == quest_id:
            quest['status'] = 'completed'
            quest['completed_at'] = datetime.utcnow().isoformat()
            break
    
    game_data.set_daily_quests(quests)
    game_data.total_quests_completed += 1
    game_data.updated_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({'message': 'Quest completada com sucesso'}), 200

@game_bp.route('/achievements', methods=['GET'])
def get_achievements():
    """Obter conquistas"""
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    game_data = GameData.query.filter_by(user_id=session['user_id']).first()
    if not game_data:
        return jsonify({'error': 'Dados do jogo não encontrados'}), 404
    
    return jsonify(game_data.get_achievements()), 200

@game_bp.route('/achievements', methods=['PUT'])
def update_achievements():
    """Atualizar conquistas"""
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    game_data = GameData.query.filter_by(user_id=session['user_id']).first()
    if not game_data:
        return jsonify({'error': 'Dados do jogo não encontrados'}), 404
    
    data = request.json
    game_data.set_achievements(data)
    game_data.updated_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({'message': 'Conquistas atualizadas com sucesso'}), 200

@game_bp.route('/settings', methods=['GET'])
def get_settings():
    """Obter configurações"""
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    game_data = GameData.query.filter_by(user_id=session['user_id']).first()
    if not game_data:
        return jsonify({'error': 'Dados do jogo não encontrados'}), 404
    
    return jsonify(game_data.get_settings()), 200

@game_bp.route('/settings', methods=['PUT'])
def update_settings():
    """Atualizar configurações"""
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    game_data = GameData.query.filter_by(user_id=session['user_id']).first()
    if not game_data:
        return jsonify({'error': 'Dados do jogo não encontrados'}), 404
    
    data = request.json
    game_data.set_settings(data)
    game_data.updated_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({'message': 'Configurações atualizadas com sucesso'}), 200

def generate_daily_quests(player_stats):
    """Gerar quests diárias baseadas nos stats do jogador"""
    quest_templates = {
        'força': [
            {'title': 'Ritual da Força', 'description': 'Faça 50 flexões ou agachamentos', 'xp': 2, 'difficulty': 'epic'},
            {'title': 'Caminho do Guerreiro', 'description': 'Treine por 30 minutos', 'xp': 3, 'difficulty': 'epic'},
            {'title': 'Forja do Corpo', 'description': 'Levante pesos ou faça exercícios de resistência', 'xp': 4, 'difficulty': 'epic'}
        ],
        'saude_mental': [
            {'title': 'Meditação do Sábio', 'description': 'Medite por 15 minutos', 'xp': 2, 'difficulty': 'routine'},
            {'title': 'Reflexão Interior', 'description': 'Escreva 3 coisas pelas quais é grato', 'xp': 2, 'difficulty': 'routine'},
            {'title': 'Paz Mental', 'description': 'Pratique respiração profunda por 10 minutos', 'xp': 1, 'difficulty': 'routine'}
        ],
        'inteligencia': [
            {'title': 'Sede de Conhecimento', 'description': 'Leia por 30 minutos', 'xp': 3, 'difficulty': 'challenge'},
            {'title': 'Mente Afiada', 'description': 'Resolva um problema complexo ou puzzle', 'xp': 4, 'difficulty': 'challenge'},
            {'title': 'Aprendizado Contínuo', 'description': 'Estude algo novo por 20 minutos', 'xp': 2, 'difficulty': 'routine'}
        ]
    }
    
    quests = []
    quest_id = 1
    
    # Gerar 15 quests aleatórias
    for i in range(15):
        stat = random.choice(list(quest_templates.keys()))
        template = random.choice(quest_templates[stat])
        
        quest = {
            'id': quest_id,
            'title': template['title'],
            'description': template['description'],
            'stat': stat,
            'xp': template['xp'],
            'difficulty': template['difficulty'],
            'status': 'pending',
            'created_at': datetime.utcnow().isoformat()
        }
        
        quests.append(quest)
        quest_id += 1
    
    return quests
