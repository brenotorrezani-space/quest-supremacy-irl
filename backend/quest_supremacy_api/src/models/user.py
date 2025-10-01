from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relacionamentos com dados do jogo
    game_data = db.relationship('GameData', backref='user', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<User {self.username}>'

    def set_password(self, password):
        """Define a senha do usuário com hash"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verifica se a senha está correta"""
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'is_active': self.is_active
        }

class GameData(db.Model):
    """Modelo para armazenar dados do jogo do usuário"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Status do jogador (JSON)
    player_stats = db.Column(db.Text, default='{}')  # Força, Saúde Mental, etc.
    
    # Quests e progresso
    daily_quests = db.Column(db.Text, default='[]')
    completed_quests = db.Column(db.Text, default='[]')
    quest_history = db.Column(db.Text, default='[]')
    
    # Conquistas e títulos
    achievements = db.Column(db.Text, default='[]')
    titles = db.Column(db.Text, default='[]')
    artifacts = db.Column(db.Text, default='[]')
    
    # Estatísticas gerais
    total_days = db.Column(db.Integer, default=0)
    total_quests_completed = db.Column(db.Integer, default=0)
    current_streak = db.Column(db.Integer, default=0)
    best_streak = db.Column(db.Integer, default=0)
    
    # Configurações do usuário
    settings = db.Column(db.Text, default='{}')
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_quest_date = db.Column(db.Date)

    def __repr__(self):
        return f'<GameData User:{self.user_id}>'

    def get_player_stats(self):
        """Retorna os stats do jogador como dict"""
        try:
            return json.loads(self.player_stats) if self.player_stats else {}
        except:
            return {}

    def set_player_stats(self, stats):
        """Define os stats do jogador"""
        self.player_stats = json.dumps(stats)

    def get_daily_quests(self):
        """Retorna as quests diárias como lista"""
        try:
            return json.loads(self.daily_quests) if self.daily_quests else []
        except:
            return []

    def set_daily_quests(self, quests):
        """Define as quests diárias"""
        self.daily_quests = json.dumps(quests)

    def get_achievements(self):
        """Retorna as conquistas como lista"""
        try:
            return json.loads(self.achievements) if self.achievements else []
        except:
            return []

    def set_achievements(self, achievements):
        """Define as conquistas"""
        self.achievements = json.dumps(achievements)

    def get_settings(self):
        """Retorna as configurações como dict"""
        try:
            return json.loads(self.settings) if self.settings else {}
        except:
            return {}

    def set_settings(self, settings):
        """Define as configurações"""
        self.settings = json.dumps(settings)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'player_stats': self.get_player_stats(),
            'daily_quests': self.get_daily_quests(),
            'achievements': self.get_achievements(),
            'total_days': self.total_days,
            'total_quests_completed': self.total_quests_completed,
            'current_streak': self.current_streak,
            'best_streak': self.best_streak,
            'settings': self.get_settings(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'last_quest_date': self.last_quest_date.isoformat() if self.last_quest_date else None
        }
