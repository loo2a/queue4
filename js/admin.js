// حفظ الإعدادات
function saveSettings() {
    const settings = {
        centerName: document.getElementById('centerName').value,
        audioPath: document.getElementById('audioPath').value,
        mediaPath: document.getElementById('mediaPath').value,
        newsContent: document.getElementById('newsContent').value,
        speechSpeed: document.getElementById('speechSpeed').value
    };
    
    updateFirebase('settings', settings)
        .then(() => alert('تم حفظ الإعدادات'))
        .catch(err => alert('خطأ في الحفظ'));
}

// إضافة عيادة
function addClinic() {
    const clinic = {
        name: document.getElementById('clinicName').value,
        number: document.getElementById('clinicNumber').value,
        password: document.getElementById('clinicPassword').value,
        currentNumber: 0,
        isActive: true,
        isCalling: false
    };
    
    updateFirebase(`clinics/clinic${clinic.number}`, clinic)
        .then(() => {
            alert('تم إضافة العيادة');
            loadClinics();
        })
        .catch(err => alert('خطأ في الإضافة'));
}

// تحميل الإعدادات الحالية
function loadSettings() {
    listenToFirebase('settings', (settings) => {
        if (settings) {
            document.getElementById('centerName').value = settings.centerName || '';
            document.getElementById('audioPath').value = settings.audioPath || '';
            document.getElementById('mediaPath').value = settings.mediaPath || '';
            document.getElementById('newsContent').value = settings.newsContent || '';
            document.getElementById('speechSpeed').value = settings.speechSpeed || 1;
        }
    });
}

// نداء عميل محدد
function callSpecificPatient() {
    const patientNumber = document.getElementById('specificPatient').value;
    if (patientNumber) {
        const callData = {
            patientNumber: parseInt(patientNumber),
            clinicId: 0,
            clinicName: 'الإدارة',
            timestamp: Date.now()
        };
        
        updateFirebase('calls/admin', callData)
            .then(() => alert(`تم نداء العميل رقم ${patientNumber}`))
            .catch(err => alert('خطأ في النداء'));
    }
}

// تحميل الإعدادات عند التحميل
loadSettings();
