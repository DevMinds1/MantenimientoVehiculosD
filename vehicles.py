from flask import Flask, request, jsonify
from flask_cors import CORS
from firebaseconfig import db

app = Flask(__name__)
cors = CORS(app, origins='*')

@app.route('/api/register_vehicle', methods=['POST'])
def register_vehicle():
    data = request.json
    plate = data.get('plate')
    brand = data.get('brand')
    year = data.get('year')
    mileage = data.get('mileage')
    model = data.get('model')
    fuel_type = data.get('fuel_type')
    oil = data.get('oil')
    type = data.get('type')

    vehicles_ref = db.collection('vehicles')
    new_vehicle = {
        'plate': plate,
        'brand': brand,
        'year': year,
        'mileage': mileage,
        'model': model,
        'fuel_type': fuel_type,
        'oil': oil,
        'type': type
    }

    vehicles_ref.add(new_vehicle)

    return jsonify({'message': 'Vehículo registrado correctamente'}), 201

@app.route('/api/get_vehicles', methods=['GET'])
def get_vehicles():
    try:
        vehicles_ref = db.collection('vehicles')
        vehicles = [doc.to_dict() for doc in vehicles_ref.stream()]
        return jsonify(vehicles), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/get_light_vehicles', methods=['GET'])
def get_light_vehicles():
    try:
        vehicles_ref = db.collection('vehicles').where('type', '==', 'Liviano')
        vehicles = [doc.to_dict() for doc in vehicles_ref.stream()]
        return jsonify(vehicles), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/get_heavy_vehicles', methods=['GET'])
def get_heavy_vehicles():
    try:
        vehicles_ref = db.collection('vehicles').where('type', '==', 'Pesado')
        vehicles = [doc.to_dict() for doc in vehicles_ref.stream()]
        return jsonify(vehicles), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)

