import os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Buat folder uploads jika belum ada
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/')
def index():
    # Contoh teks yang akan dibaca oleh siswa
    text_to_read = "Teknologi informasi berkembang sangat pesat di era digital saat ini."
    return render_template('index.html', text=text_to_read)

@app.route('/upload-audio', methods=['POST'])
def upload_audio():
    if 'audio_data' not in request.files:
        return jsonify({"status": "error", "message": "Tidak ada data audio"}), 400
    
    audio_file = request.files['audio_data']
    filename = "rekaman_siswa.wav"
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    audio_file.save(file_path)

    # Nanti di sini kita akan panggil Azure/Whisper API untuk analisis
    # Untuk sekarang, kita beri respon sukses dulu
    return jsonify({
        "status": "success", 
        "message": "Audio berhasil diterima",
        "path": file_path
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)