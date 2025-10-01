import os
from flask import Flask
from flask_cors import CORS
from src.models.user import db
from src.routes.auth import auth_bp
from src.routes.game import game_bp

def create_app():
    app = Flask(__name__)
    
    # Configuração baseada no ambiente
    if os.getenv('FLASK_ENV') == 'production':
        app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
        app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
        cors_origins = os.getenv('CORS_ORIGINS', '').split(',')
    else:
        app.config['SECRET_KEY'] = 'dev-secret-key-change-in-production'
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database/app.db'
        cors_origins = ['http://localhost:5173']
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Configurar CORS
    CORS(app, 
         origins=cors_origins,
         supports_credentials=True,
         allow_headers=['Content-Type', 'Authorization'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    
    # Inicializar banco de dados
    db.init_app(app)
    
    # Registrar blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(game_bp, url_prefix='/api/game')
    
    # Criar tabelas se não existirem
    with app.app_context():
        db.create_all()
    
    @app.route('/')
    def index():
        return {
            'message': 'Quest Supremacy IRL API',
            'version': '1.0.0',
            'status': 'running'
        }
    
    @app.route('/health')
    def health():
        return {'status': 'healthy'}
    
    return app

# Para desenvolvimento local
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)

# Para produção (Gunicorn)
app = create_app()
