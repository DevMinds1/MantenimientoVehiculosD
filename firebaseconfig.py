import firebase_admin
from firebase_admin import credentials, firestore, storage

cred = credentials.Certificate('firebase_credentials.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'global-tine-447000-u6.firebasestorage.app'
})

db = firestore.client()
bucket = storage.bucket()
