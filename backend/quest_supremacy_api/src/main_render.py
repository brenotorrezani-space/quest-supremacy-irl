import os
from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    
    # Configuração baseada no ambiente
    if os.getenv('FLASK_ENV') == 'production':
        app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'fallback-secret-key-for-render')
        database_url = os.getenv('DATABASE_URL')
        
        # Verificar se DATABASE_URL existe e não está vazia
        if database_url and database_url.strip():
            app.config['SQLALCHEMY_DATABASE_URI'] = database_url
        else:
            # Fallback para SQLite se não houver PostgreSQL configurado
            app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
            
        cors_origins = os.getenv('CORS_ORIGINS', '').split(',') if os.getenv('CORS_ORIGINS') else ['*']
    else:
        app.config['SECRET_KEY'] = 'dev-secret-key-change-in-production'
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
        cors_origins = ['http://localhost:5173']
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Configurar CORS
    CORS(app, 
         origins=cors_origins,
         supports_credentials=True,
         allow_headers=['Content-Type', 'Authorization'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    
    # Importar e inicializar banco apenas se necessário
    try:
        from src.models.user import db
        db.init_app(app)
        
        # Criar tabelas se não existirem
        with app.app_context():
            db.create_all()
    except Exception as e:
        print(f"Warning: Database initialization failed: {e}")
        # Continuar sem banco para permitir que o app inicie
    
    # Importar e registrar blueprints apenas se disponíveis
    try:
        from src.routes.auth import auth_bp
        from src.routes.game import game_bp
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        app.register_blueprint(game_bp, url_prefix='/api/game')
    except ImportError as e:
        print(f"Warning: Could not import routes: {e}")
    
    @app.route('/')
    def index():
        return {
            'message': 'Quest Supremacy IRL API',
            'version': '1.0.0',
            'status': 'running',
            'environment': os.getenv('FLASK_ENV', 'development')
        }
    
    @app.route('/health')
    def health():
        return {
            'status': 'healthy',
            'database': 'connected' if app.config.get('SQLALCHEMY_DATABASE_URI') else 'not configured'
        }
    
    @app.route('/api/test')
    def test():
        return {
            'message': 'API is working!',
            'cors_origins': cors_origins,
            'database_configured': bool(app.config.get('SQLALCHEMY_DATABASE_URI'))
        }
    
    return app

# Para desenvolvimento local
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)

# Para produção (Gunicorn)
app = create_app()
