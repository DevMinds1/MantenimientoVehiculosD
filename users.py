import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin import auth
from firebase_admin.exceptions import FirebaseError
from firebaseconfig import db

app = Flask(__name__)
cors = CORS(app, origins='*')

FIREBASE_WEB_API_KEY = "AIzaSyDBYylNRuPkJLGZGNqewF9w93UzIUJpvLg"

@app.route('/api/authentication', methods=['POST'])
def authentication():
    try:
        data = request.get_json()

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email y contraseña son requeridos'}), 400

        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_WEB_API_KEY}"
        payload = {
            "email": email,
            "password": password,
            "returnSecureToken": True
        }

        response = requests.post(url, json=payload)
        if response.status_code != 200:
            return jsonify({'error': 'Credenciales inválidas'}), 401

        response_data = response.json()
        user_id = response_data.get('localId')

        print(user_id)
        user_doc = db.collection('users').document(user_id).get()

        if user_doc.exists:
            user_data = user_doc.to_dict()
            return jsonify({'user': user_data}), 200
        else:
            return jsonify({'error': 'Usuario no encontrado en Firestore'}), 404

    except FirebaseError as e:
        return jsonify({'error': 'Error con Firebase: ' + str(e)}), 500
    except Exception as e:
        return jsonify({'error': 'Error interno: ' + str(e)}), 500

@app.route('/api/get_mandated_users', methods=['GET'])
def get_mandated_users():
    try:
        users_ref = db.collection('users').where('role', '==', 'mandated')
        users = [doc.to_dict() for doc in users_ref.stream()]
        return jsonify(users), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/get_admin_users', methods=['GET'])
def get_admin_users():
    try:
        users_ref = db.collection('users').where('role', '==', 'admin')
        users = [doc.to_dict() for doc in users_ref.stream()]
        return jsonify(users), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
