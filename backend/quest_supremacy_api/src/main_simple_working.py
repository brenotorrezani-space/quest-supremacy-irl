#!/usr/bin/env python3
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

# Criar app Flask
app = Flask(__name__)

# CORS super permissivo para garantir que funcione
CORS(app, 
     origins=['*'],
     methods=['*'],
     allow_headers=['*'],
     supports_credentials=True)

# "Banco de dados" em arquivo JSON
USERS_FILE = 'users.json'

def load_users():
    """Carregar usuários do arquivo"""
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE, 'r') as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_users(users):
    """Salvar usuários no arquivo"""
    try:
        with open(USERS_FILE, 'w') as f:
            json.dump(users, f, indent=2)
        return True
    except:
        return False

@app.before_request
def handle_preflight():
    """Lidar com requests OPTIONS (CORS preflight)"""
    if request.method == "OPTIONS":
        response = jsonify()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        response.headers.add('Access-Control-Allow-Credentials', "true")
        return response

@app.after_request
def after_request(response):
    """Adicionar headers CORS em todas as respostas"""
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

@app.route('/')
def index():
    """Página inicial da API"""
    users = load_users()
    return jsonify({
        'message': 'Quest Supremacy IRL API - WORKING VERSION',
        'version': '1.0.0-working',
        'status': 'running',
        'cors': 'enabled',
        'users_count': len(users),
        'endpoints': [
            'GET /',
            'GET /health',
            'POST /api/auth/register',
            'GET /debug/users'
        ]
    })

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'mode': 'working',
        'database': 'json_file',
        'cors': 'enabled',
        'file_exists': os.path.exists(USERS_FILE)
    })

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Registrar novo usuário"""
    try:
        # Log da request
        print(f"\n🔥 REGISTER REQUEST:")
        print(f"Method: {request.method}")
        print(f"Headers: {dict(request.headers)}")
        print(f"Content-Type: {request.content_type}")
        
        # Obter dados JSON
        if not request.is_json:
            print("❌ Request não é JSON")
            return jsonify({'error': 'Content-Type deve ser application/json'}), 400
        
        data = request.get_json()
        print(f"Data received: {data}")
        
        if not data:
            print("❌ Dados vazios")
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        # Validar campos obrigatórios
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        
        print(f"Username: '{username}', Email: '{email}', Password: {'*' * len(password)}")
        
        if not username:
            return jsonify({'error': 'Username é obrigatório'}), 400
        if not email:
            return jsonify({'error': 'Email é obrigatório'}), 400
        if not password:
            return jsonify({'error': 'Password é obrigatório'}), 400
        
        # Carregar usuários existentes
        users = load_users()
        
        # Verificar se usuário já existe
        if username in users:
            print(f"❌ Usuário {username} já existe")
            return jsonify({'error': 'Username já existe'}), 400
        
        # Verificar se email já existe
        for existing_user in users.values():
            if existing_user.get('email') == email:
                print(f"❌ Email {email} já existe")
                return jsonify({'error': 'Email já existe'}), 400
        
        # Criar novo usuário
        new_user = {
            'id': len(users) + 1,
            'username': username,
            'email': email,
            'password': password,  # Em produção seria hasheado!
            'created_at': str(os.times())
        }
        
        # Salvar usuário
        users[username] = new_user
        if not save_users(users):
            print("❌ Erro ao salvar usuário")
            return jsonify({'error': 'Erro interno ao salvar usuário'}), 500
        
        # Resposta de sucesso
        user_response = {
            'id': new_user['id'],
            'username': username,
            'email': email
        }
        
        print(f"✅ Usuário {username} criado com sucesso!")
        
        response = jsonify({
            'message': 'Usuário registrado com sucesso!',
            'user': user_response,
            'success': True
        })
        
        return response, 201
        
    except Exception as e:
        print(f"❌ ERRO INTERNO: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': f'Erro interno do servidor: {str(e)}',
            'type': type(e).__name__
        }), 500

@app.route('/debug/users')
def debug_users():
    """Endpoint para debug - listar usuários"""
    users = load_users()
    return jsonify({
        'total_users': len(users),
        'users': [
            {
                'id': user['id'],
                'username': user['username'],
                'email': user['email']
            }
            for user in users.values()
        ],
        'file_path': os.path.abspath(USERS_FILE),
        'file_exists': os.path.exists(USERS_FILE)
    })

@app.route('/debug/clear')
def debug_clear():
    """Limpar todos os usuários (apenas para debug)"""
    try:
        if os.path.exists(USERS_FILE):
            os.remove(USERS_FILE)
        return jsonify({'message': 'Usuários limpos com sucesso'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Quest Supremacy IRL - WORKING VERSION")
    print("=" * 50)
    print("🌐 CORS: Totalmente permissivo")
    print("💾 Database: Arquivo JSON local")
    print("🔧 Debug: Logs detalhados habilitados")
    print("📍 Endpoints disponíveis:")
    print("   GET  /")
    print("   GET  /health")
    print("   POST /api/auth/register")
    print("   GET  /debug/users")
    print("   GET  /debug/clear")
    print("=" * 50)
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
