let currentClinic = null;
let currentClinicData = null;

// تحميل العيادات
function loadClinics() {
    listenToFirebase('clinics', (clinics) => {
        const select = document.getElementById('clinicSelect');
        select.innerHTML = '<option value="">اختر العيادة</option>';
        
        if (clinics) {
            for (const [clinicId, clinic] of Object.entries(clinics)) {
                const option = document.createElement('option');
                option.value = clinicId;
                option.textContent = `${clinic.name} - ${clinic.number}`;
                select.appendChild(option);
            }
        }
    });
}

// تسجيل الدخول
function login() {
    const clinicId = document.getElementById('clinicSelect').value;
    const password = document.getElementById('passwordInput').value;
    
    if (!clinicId) {
        alert('اختر العيادة');
        return;
    }
    
    database.ref(`clinics/${clinicId}`).once('value', (snapshot) => {
        const clinic = snapshot.val();
        if (clinic && clinic.password === password) {
            currentClinic = clinicId;
            currentClinicData = clinic;
            document.getElementById('currentClinic').textContent = clinic.name;
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('controlPanel').classList.remove('hidden');
        } else {
            alert('كلمة المرور غير صحيحة');
        }
    });
}

// العميل التالي
function nextPatient() {
    if (!currentClinic) return;
    
    currentClinicData.currentNumber++;
    const callData = {
        patientNumber: currentClinicData.currentNumber,
        clinicId: currentClinic.split('clinic')[1],
        clinicName: currentClinicData.name,
        timestamp: Date.now()
    };
    
    Promise.all([
        updateFirebase(`clinics/${currentClinic}/currentNumber`, currentClinicData.currentNumber),
        updateFirebase(`clinics/${currentClinic}/isCalling`, true),
        updateFirebase(`calls/${currentClinic}`, callData)
    ]).then(() => {
        setTimeout(() => {
            updateFirebase(`clinics/${currentClinic}/isCalling`, false);
        }, 5000);
    });
}

// تكرار النداء
function repeatCall() {
    if (!currentClinic || !currentClinicData.currentNumber) return;
    
    const callData = {
        patientNumber: currentClinicData.currentNumber,
        clinicId: currentClinic.split('clinic')[1],
        clinicName: currentClinicData.name,
        timestamp: Date.now()
    };
    
    updateFirebase(`calls/${currentClinic}`, callData);
}

// تصفير العيادة
function resetClinic() {
    if (!currentClinic) return;
    
    currentClinicData.currentNumber = 0;
    updateFirebase(`clinics/${currentClinic}/currentNumber`, 0)
        .then(() => alert('تم تصفير العيادة'));
}

// الخروج
function logout() {
    currentClinic = null;
    currentClinicData = null;
    document.getElementById('loginForm').style.display = 'flex';
    document.getElementById('controlPanel').classList.add('hidden');
    document.getElementById('passwordInput').value = '';
}

// تحميل العيادات عند التحميل
loadClinics();
