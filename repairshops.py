from flask import Flask, request, jsonify
from flask_cors import CORS
from firebaseconfig import db, bucket
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
cors = CORS(app, origins='*')

@app.route('/api/register_repairshop', methods=['POST'])
def register_repairshop():
    try:
        data = request.get_json()
        name = data.get('name')
        address = data.get('address')
        phone = data.get('phone')
        city = data.get('city')
        type = data.get('type')
        image = data.get('image')

        repairshops_ref = db.collection('repairshops')
        new_repairshop = {
            'name': name,
            'address': address,
            'phone': phone,
            'city': city,
            'type': type,
            'image_url': image
        }

        doc_ref = repairshops_ref.add(new_repairshop)[1]

        doc_id = doc_ref.id

        repairshops_ref.document(doc_id).update({'id': doc_id})

        return jsonify({'message': 'Taller registrado exitosamente', 'image_url': image}), 201

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/get_repairshop_by_id', methods=['GET'])
def get_repairshop_by_id():
    try:
        repairshop_id = request.args.get('id')
        if not repairshop_id:
            return jsonify({'error': 'El parámetro "id" es requerido'}), 400

        repairshop_ref = db.collection('repairshops').document(repairshop_id)
        repairshop = repairshop_ref.get()

        if not repairshop.exists:
            return jsonify({'error': 'Taller no encontrado'}), 404

        return jsonify(repairshop.to_dict()), 200

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

