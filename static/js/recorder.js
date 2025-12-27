let mediaRecorder;
let audioChunks = [];
const recordBtn = document.getElementById('recordBtn');
const statusText = document.getElementById('status');

recordBtn.addEventListener('click', async () => {
    if (!mediaRecorder || mediaRecorder.state === "inactive") {
        // Mulai Merekam
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            audioChunks = []; // Reset chunk
            sendAudioToServer(audioBlob);
        };

        mediaRecorder.start();
        recordBtn.innerText = "Selesai Membaca";
        recordBtn.classList.replace('bg-blue-600', 'bg-red-600');
        statusText.innerText = "Merekam suara... Silakan baca teks di atas.";
    } else {
        // Berhenti Merekam
        mediaRecorder.stop();
        recordBtn.innerText = "Mulai Membaca";
        recordBtn.classList.replace('bg-red-600', 'bg-blue-600');
        statusText.innerText = "Mengirim rekaman untuk dianalisis...";
    }
});

async function sendAudioToServer(blob) {
    const formData = new FormData();
    formData.append('audio_data', blob);

    try {
        const response = await fetch('/upload-audio', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result.status === "success") {
            statusText.innerText = "Analisis selesai! (Cek folder uploads)";
        }
    } catch (error) {
        console.error("Error:", error);
        statusText.innerText = "Gagal mengirim audio.";
    }
}