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
        name = request.form.get('name')
        address = request.form.get('address')
        phone = request.form.get('phone')
        city = request.form.get('city')
        type = request.form.get('type')
        image = request.files.get('image')

        if not image:
            return jsonify({'error': 'No se envió ninguna imagen'}), 400

        filename = secure_filename(image.filename)
        blob = bucket.blob(f"repairshops/{filename}")
        blob.upload_from_file(image.stream, content_type=image.content_type)

        blob.make_public()
        image_url = blob.public_url

        repairshops_ref = db.collection('repairshops')
        new_repairshop = {
            'name': name,
            'address': address,
            'phone': phone,
            'city': city,
            'type': type,
            'image_url': image_url
        }

        doc_ref = repairshops_ref.add(new_repairshop)[1]

        doc_id = doc_ref.id

        repairshops_ref.document(doc_id).update({'id': doc_id})

        return jsonify({'message': 'Taller registrado exitosamente', 'image_url': image_url}), 201

    except Exception as e:
        print(f"Error: {str(e)}")
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

