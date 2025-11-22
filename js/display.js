let currentPatient = null;
let isMuted = false;

// تحديث التاريخ والوقت
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    document.getElementById('dateTime').textContent = now.toLocaleDateString('ar-EG', options);
}

// تشغيل الصوت
function playSound(sequence) {
    if (isMuted) return;
    
    let index = 0;
    function playNext() {
        if (index < sequence.length) {
            const audio = new Audio(sequence[index]);
            audio.play();
            audio.onended = () => {
                index++;
                setTimeout(playNext, 200); // فاصل بين الملفات
            };
        }
    }
    playNext();
}

// عرض الإشعار
function showNotification(text) {
    const banner = document.getElementById('notificationBanner');
    const notificationText = document.getElementById('notificationText');
    notificationText.textContent = text;
    banner.classList.remove('hidden');
    
    setTimeout(() => {
        banner.classList.add('hidden');
    }, 5000);
}

// تحديث كروت العيادات
function updateClinicsDisplay(clinics) {
    const container = document.getElementById('clinicsContainer');
    container.innerHTML = '';
    
    for (const [clinicId, clinic] of Object.entries(clinics)) {
        const card = document.createElement('div');
        card.className = `bg-white p-4 rounded shadow ${clinic.isActive ? '' : 'opacity-50'}`;
        card.innerHTML = `
            <h3 class="text-lg font-bold">${clinic.name}</h3>
            <p class="text-3xl font-bold text-blue-600">${clinic.currentNumber || 0}</p>
            <p class="text-sm text-gray-600">${clinic.isActive ? 'نشط' : 'متوقف'}</p>
        `;
        
        if (clinic.isCalling && clinic.currentNumber) {
            card.classList.add('pulse-call', 'bg-yellow-100');
        }
        
        container.appendChild(card);
    }
}

// الاستماع لتغييرات Firebase
listenToFirebase('clinics', (clinics) => {
    if (clinics) {
        updateClinicsDisplay(clinics);
    }
});

listenToFirebase('calls', (calls) => {
    if (calls) {
        const lastCall = Object.values(calls).pop();
        if (lastCall && lastCall.timestamp > Date.now() - 10000) {
            handleCall(lastCall);
        }
    }
});

// معالجة النداء
function handleCall(callData) {
    const sequence = buildAudioSequence(callData.patientNumber, callData.clinicId);
    playSound(sequence);
    showNotification(`العميل رقم ${callData.patientNumber} إلى ${callData.clinicName}`);
}

// بناء تسلسل الصوت
function buildAudioSequence(number, clinicId) {
    const sequence = ['audio/ding.mp3', 'audio/preifex.mp3'];
    
    // تحليل الرقم وتفكيكه
    const hundreds = Math.floor(number / 100) * 100;
    const tens = Math.floor((number % 100) / 10) * 10;
    const ones = number % 10;
    
    if (hundreds > 0) sequence.push(`audio/numbers/${hundreds}.mp3`);
    if (hundreds > 0 && (tens > 0 || ones > 0)) sequence.push('audio/and.mp3');
    if (tens > 0) sequence.push(`audio/numbers/${tens}.mp3`);
    if (tens > 0 && ones > 0) sequence.push('audio/and.mp3');
    if (ones > 0) sequence.push(`audio/numbers/${ones}.mp3`);
    
    sequence.push(`audio/clinics/clinic${clinicId}.mp3`);
    
    return sequence;
}

// كتم الصوت
document.getElementById('muteBtn').addEventListener('click', () => {
    isMuted = !isMuted;
    document.getElementById('muteBtn').textContent = isMuted ? '🔇' : '🔊';
});

// تحديث الوقت كل ثانية
setInterval(updateDateTime, 1000);
updateDateTime();
