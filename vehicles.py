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
        actividadUbicacion = request.form.get('actividadUbicacion')
        anio = request.form.get('anio')
        chasis = request.form.get('chasis')
        color = request.form.get('color')
        combustible = request.form.get('combustible')
        detalle = request.form.get('detalle')
        marca = request.form.get('marca')
        modeloAnio = request.form.get('modeloAnio')
        motor = request.form.get('motor')
        num = request.form.get('num')
        placa = request.form.get('placa')
        propiedad = request.form.get('propiedad')
        responsable = request.form.get('responsable')
        tipo = request.form.get('tipo')
        tipoVehiculo = request.form.get('tipoVehiculo')
        image = request.files.get('image')

        if not image:
            return jsonify({'error': 'No se envió ninguna imagen'}), 400

        filename = secure_filename(image.filename)
        blob = bucket.blob(f"vehicles/{filename}")
        blob.upload_from_file(image.stream, content_type=image.content_type)

        blob.make_public()
        image_url = blob.public_url

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
            'IMAGE_URL': image_url 
        }

        doc_ref = vehicles_ref.add(new_vehicle)[1]

        doc_id = doc_ref.id

        vehicles_ref.document(doc_id).update({'id': doc_id})

        return jsonify({'message': 'Vehículo registrado correctamente', 'image_url': image_url}), 201

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

