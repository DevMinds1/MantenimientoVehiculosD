from flask import Flask, request, jsonify
from flask_cors import CORS
from firebaseconfig import db
from google.protobuf.timestamp_pb2 import Timestamp

app = Flask(__name__)
cors = CORS(app, origins='*')

@app.route('/api/register_corrective_order/', methods=['POST'])
def register_corrective_order():
    data = request.get_json()
    vehicle = data.get('vehicle')
    repairshop = data.get('repairshop')
    mandated = data.get('mandated')
    faults = data.get('faults')
    state = data.get('state')
    type = data.get('type')
    comments = data.get('comments')

    order_ref = db.collection('orders')
    new_order = {
        'vehicle': vehicle,
        'repairshop': repairshop,
        'mandated': mandated,
        'faults': faults,
        'state': state,
        'type': type,
        'comments': comments,
    }

    doc_ref = order_ref.add(new_order)[1]

    doc_id = doc_ref.id

    order_ref.document(doc_id).update({'id': doc_id})

    return jsonify({'message': 'Orden registrada exitosamente'}), 201

@app.route('/api/register_preventive_order', methods=['POST'])
def register_preventive_order():
    data = request.get_json()
    vehicle = data.get('vehicle')
    repairshop = data.get('repairshop')
    mandated = data.get('mandated')
    faults = data.get('faults')
    state = data.get('state')
    type = data.get('type')
    date = data.get('type')
    entry_date = data.get('entry_date')
    delivery_date = data.get('delivery_date')
    entry_date_ms = data.get('entry_date')
    delivery_date_ms = data.get('delivery_date')
    date_ms = data.get('date')

    entry_date = None
    if entry_date_ms:
        entry_date = Timestamp()
        entry_date.FromMilliseconds(entry_date_ms)

    delivery_date = None
    if delivery_date_ms:
        delivery_date = Timestamp()
        delivery_date.FromMilliseconds(delivery_date_ms)

    date = None
    if date_ms:
        date = Timestamp()
        date.FromMilliseconds(date_ms)

    order_ref = db.collection('orders')
    new_order = {
        'vehicle': vehicle,
        'repairshop': repairshop,
        'mandated': mandated,
        'faults': faults,
        'state': state,
        'type': type,
        'entry_date': entry_date.ToDatetime() if entry_date else None,
        'delivery_date': delivery_date.ToDatetime() if delivery_date else None,
        'date': date.ToDatetime() if date else None,
    }

    doc_ref = order_ref.add(new_order)[1]

    doc_id = doc_ref.id

    order_ref.document(doc_id).update({'id': doc_id})

    return jsonify({'message': 'Orden registrada exitosamente'}), 201

@app.route('/api/get_pending_orders', methods=['GET'])
def get_pending_orders():
    try:
        order_ref = db.collection('orders').where('state', '==', 'Pendiente')
        orders = [doc.to_dict() for doc in order_ref.stream()]
        return jsonify(orders), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/get_completed_orders', methods=['GET'])
def get_completed_orders():
    try:
        order_ref = db.collection('orders').where('state', '==', 'Completada')
        orders = [doc.to_dict() for doc in order_ref.stream()]
        return jsonify(orders), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5004)