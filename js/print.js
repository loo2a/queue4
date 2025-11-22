// تحميل العيادات
function loadClinicsForPrint() {
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

// إنشاء التذاكر
function generateTickets() {
    const clinicId = document.getElementById('clinicSelect').value;
    const startNumber = parseInt(document.getElementById('startNumber').value);
    const endNumber = parseInt(document.getElementById('endNumber').value);
    
    if (!clinicId || !startNumber || !endNumber) {
        alert('املأ جميع الحقول');
        return;
    }
    
    database.ref(`clinics/${clinicId}`).once('value', (snapshot) => {
        const clinic = snapshot.val();
        const container = document.getElementById('ticketsContainer');
        container.innerHTML = '';
        
        for (let i = startNumber; i <= endNumber; i++) {
            const ticket = document.createElement('div');
            ticket.className = 'ticket';
            ticket.innerHTML = `
                <div class="font-bold">${clinic.name}</div>
                <div class="text-3xl font-bold my-2">${i}</div>
                <div class="text-sm">العملاء المتقدمين: ${i - 1}</div>
                <div class="text-xs mt-2">وقت الانتظار: ${(i - clinic.currentNumber) * 10} دقيقة</div>
            `;
            container.appendChild(ticket);
        }
    });
}

// تحميل العيادات عند التحميل
loadClinicsForPrint();
