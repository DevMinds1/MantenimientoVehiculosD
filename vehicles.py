from flask import Flask, request, jsonify
from flask_cors import CORS
from firebaseconfigvehicles import db, bucket
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
cors = CORS(app, origins='*')

@app.route('/api/register_vehicle', methods=['POST'])
def register_vehicle():
    try:
        data = request.get_json()
        actividadUbicacion = data.get('actividadUbicacion')
        anio = data.get('anio')
        chasis = data.get('chasis')
        color = data.get('color')
        combustible = data.get('combustible')
        detalle = data.get('detalle')
        marca = data.get('marca')
        modeloAnio = data.get('modeloAnio')
        motor = data.get('motor')
        num = data.get('num')
        placa = data.get('placa')
        propiedad = data.get('propiedad')
        responsable = data.get('responsable')
        tipo = data.get('tipo')
        tipoVehiculo = data.get('tipoVehiculo')
        image = data.get('imagen')

        vehicles_ref = db.collection('vehiculos')
        new_vehicle = {
            'ACTIVIDAD_UBICACION': actividadUbicacion,
            'ANIO': anio,
            'CHASIS': chasis,
            'COLOR': color,
            'COMBUSTIBLE': combustible,
            'DETALLE': detalle,
            'MARCA': marca,
            'MODELO_ANIO': modeloAnio,
            'MOTOR': motor,
            'NUM': num,
            'PLACA': placa,
            'PROPIEDAD': propiedad,
            'RESPONSABLE': responsable,
            'TIPO': tipo,
            'TIPO_VEHICULO': tipoVehiculo,
            'IMAGE_URL': image 
        }

        doc_ref = vehicles_ref.add(new_vehicle)[1]

        doc_id = doc_ref.id

        vehicles_ref.document(doc_id).update({'id': doc_id})

        return jsonify({'message': 'Vehículo registrado correctamente', 'image_url': image}), 201

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/get_vehicles', methods=['GET'])
def get_vehicles():
    try:
        vehicles_ref = db.collection('vehiculos')
        vehicles = [doc.to_dict() for doc in vehicles_ref.stream()]
        return jsonify(vehicles), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/get_vehicle_by_plate', methods=['GET'])
def get_vehicle_by_plate():
    try:
        vehicle_plate = request.args.get('PLACA')
        if not vehicle_plate:
            return jsonify({'error': 'El parámetro "PLACA" es requerido'}), 400

        vehicles_ref = db.collection('vehiculos').where('PLACA', '==', vehicle_plate)
        vehicle_docs = vehicles_ref.stream()

        vehicles = [doc.to_dict() for doc in vehicle_docs]
        if not vehicles:
            return jsonify({'error': 'Vehículo no encontrado'}), 404

        return jsonify(vehicles[0]), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/get_light_vehicles', methods=['GET'])
def get_light_vehicles():
    try:
        vehicles_ref = db.collection('vehiculos').where('TIPO_VEHICULO', '==', 'LIVIANO')
        vehicles = [doc.to_dict() for doc in vehicles_ref.stream()]
        return jsonify(vehicles), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/get_heavy_vehicles', methods=['GET'])
def get_heavy_vehicles():
    try:
        vehicles_ref = db.collection('vehiculos').where('TIPO_VEHICULO', '==', 'PESADO')
        vehicles = [doc.to_dict() for doc in vehicles_ref.stream()]
        return jsonify(vehicles), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)

