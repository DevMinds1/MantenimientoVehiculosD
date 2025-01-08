from flask import Flask, request, jsonify
from flask_cors import CORS
from firebaseconfig import db

app = Flask(__name__)
cors = CORS(app, origins='*')

@app.route('/api/register_repairshop', methods=['POST'])
def register_repairshop():
    data = request.json
    name = data.get('name')
    address = data.get('address')
    phone = data.get('phone')
    city = data.get('city')
    type = data.get('type')

    repairshops_ref = db.collection('repairshops')
    new_repairshops = {
        'name': name,
        'address': address,
        'phone': phone,
        'city': city,
        'type': type
    }

    repairshops_ref.add(new_repairshops)

    return jsonify({'message': 'Taller registrado exitosamente'}), 201

@app.route('/api/get_repairshops', methods=['GET'])
def get_repairshops():
    try:
        repairshops_ref = db.collection('repairshops')
        repairshops = [doc.to_dict() for doc in repairshops_ref.stream()]
        return jsonify(repairshops), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/api/get_mechanic_repairshops', methods=['GET'])
def get_mechanic_repairshops():
    try:
        repairshops_ref = db.collection('repairshops').where('type', '==', 'Mecánica')
        repairshops = [doc.to_dict() for doc in repairshops_ref.stream()]
        return jsonify(repairshops), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/get_dealership_repairshops', methods=['GET'])
def get_dealership_repairshops():
    try:
        repairshops_ref = db.collection('repairshops').where('type', '==', 'Concesionario')
        repairshops = [doc.to_dict() for doc in repairshops_ref.stream()]
        return jsonify(repairshops), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5002)

