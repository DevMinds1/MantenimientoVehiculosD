import firebase_admin
from firebase_admin import credentials, firestore, storage

cred2 = credentials.Certificate('firebase_credentials.json')
cred = credentials.Certificate('firebase_credentials_vehicles.json')

firebase_admin.initialize_app(cred, name='compartida')

firebase_admin.initialize_app(cred2, {
    'storageBucket': 'global-tine-447000-u6.firebasestorage.app'
}, name='nocompartida')

db = firestore.client(app=firebase_admin.get_app('compartida'))
bucket = storage.bucket(app=firebase_admin.get_app('nocompartida'))