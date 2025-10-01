from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)

# CORS muito permissivo para debug
CORS(app, 
     origins=['*'],  # Permite qualquer origem
     supports_credentials=True,
     allow_headers=['*'],
     methods=['*'])

# Simulação de "banco de dados" em memória
users_db = {}
sessions = {}

@app.route('/')
def index():
    return {
        'message': 'Quest Supremacy IRL API - DEBUG MODE',
        'version': '1.0.0-debug',
        'status': 'running',
        'cors': 'enabled',
        'users_count': len(users_db)
    }

@app.route('/health')
def health():
    return {
        'status': 'healthy',
        'mode': 'debug',
        'database': 'memory',
        'cors': 'permissive'
    }

@app.route('/api/test')
def test():
    return {
        'message': 'API is working!',
        'method': request.method,
        'headers': dict(request.headers),
        'origin': request.headers.get('Origin', 'No origin'),
        'user_agent': request.headers.get('User-Agent', 'No user agent')
    }

@app.route('/api/auth/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        print(f"Register request: {data}")
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not username or not email or not password:
            return jsonify({'error': 'Username, email and password are required'}), 400
        
        if username in users_db:
            return jsonify({'error': 'Username already exists'}), 400
        
        # "Salvar" usuário
        users_db[username] = {
            'username': username,
            'email': email,
            'password': password,  # Em produção, seria hasheado!
            'id': len(users_db) + 1
        }
        
        # Criar "sessão"
        session_id = f"session_{len(sessions) + 1}"
        sessions[session_id] = username
        
        user_data = {
            'id': users_db[username]['id'],
            'username': username,
            'email': email
        }
        
        response = jsonify({
            'message': 'User registered successfully',
            'user': user_data
        })
        response.set_cookie('session_id', session_id, httponly=True)
        
        print(f"User registered: {username}")
        return response, 201
        
    except Exception as e:
        print(f"Register error: {e}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        print(f"Login request: {data}")
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400
        
        if username not in users_db:
            return jsonify({'error': 'User not found'}), 404
        
        if users_db[username]['password'] != password:
            return jsonify({'error': 'Invalid password'}), 401
        
        # Criar "sessão"
        session_id = f"session_{len(sessions) + 1}"
        sessions[session_id] = username
        
        user_data = {
            'id': users_db[username]['id'],
            'username': username,
            'email': users_db[username]['email']
        }
        
        response = jsonify({
            'message': 'Login successful',
            'user': user_data
        })
        response.set_cookie('session_id', session_id, httponly=True)
        
        print(f"User logged in: {username}")
        return response, 200
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/api/auth/check-auth', methods=['GET'])
def check_auth():
    try:
        session_id = request.cookies.get('session_id')
        
        if not session_id or session_id not in sessions:
            return jsonify({'authenticated': False}), 200
        
        username = sessions[session_id]
        if username not in users_db:
            return jsonify({'authenticated': False}), 200
        
        user_data = {
            'id': users_db[username]['id'],
            'username': username,
            'email': users_db[username]['email']
        }
        
        return jsonify({
            'authenticated': True,
            'user': user_data
        }), 200
        
    except Exception as e:
        print(f"Check auth error: {e}")
        return jsonify({'authenticated': False}), 200

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    try:
        session_id = request.cookies.get('session_id')
        
        if session_id and session_id in sessions:
            del sessions[session_id]
        
        response = jsonify({'message': 'Logout successful'})
        response.set_cookie('session_id', '', expires=0)
        
        return response, 200
        
    except Exception as e:
        print(f"Logout error: {e}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/debug/users')
def debug_users():
    return {
        'users': list(users_db.keys()),
        'sessions': list(sessions.keys()),
        'total_users': len(users_db)
    }

if __name__ == '__main__':
    print("🔧 Quest Supremacy IRL - DEBUG MODE")
    print("🌐 CORS: Permissive (allows all origins)")
    print("💾 Database: In-memory (data will be lost on restart)")
    print("🚀 Starting server on http://localhost:5000")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
