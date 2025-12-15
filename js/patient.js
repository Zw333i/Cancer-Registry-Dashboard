/* ========================================
   CANCER REGISTRY DASHBOARD
   Patient Spotlight
   ======================================== */

// ==========================================
// PATIENT SPOTLIGHT
// ==========================================
function displayPatientSpotlight() {
    const currentCounter = document.getElementById('currentPatientNum');
    const totalCounter = document.getElementById('totalPatientNum');

    if (filteredPatients.length === 0) {
        document.getElementById('patientId').textContent = 'No patients';
        document.getElementById('patientCancerTag').textContent = '--';
        document.getElementById('patientStageTag').textContent = '--';
        document.getElementById('patientStatusTag').textContent = '--';
        document.getElementById('patientDuration').textContent = '--';
        document.getElementById('patientPrognosis').textContent = '--';
        document.getElementById('patientNarrative').textContent = 'No matching patients found. Try adjusting your filters.';
        if (currentCounter) currentCounter.textContent = '0';
        if (totalCounter) totalCounter.textContent = '0';
        highlightPatientRow(null);
        return;
    }
    
    if (currentPatientIndex >= filteredPatients.length) {
        currentPatientIndex = filteredPatients.length - 1;
    }
    if (currentPatientIndex < 0) {
        currentPatientIndex = 0;
    }

    const patient = filteredPatients[currentPatientIndex];
    if (totalCounter) totalCounter.textContent = filteredPatients.length;
    if (currentCounter) currentCounter.textContent = currentPatientIndex + 1;
    
    // Update ID
    document.getElementById('patientId').textContent = patient.ID;
    
    // Update tags
    const cancerTag = document.getElementById('patientCancerTag');
    const stageTag = document.getElementById('patientStageTag');
    const statusTag = document.getElementById('patientStatusTag');
    
    // Show subtype for Lung cancer
    if (patient.Cancer_Type === 'Lung' && patient.Lung_Subtype) {
        cancerTag.textContent = `${patient.Cancer_Type} (${patient.Lung_Subtype})`;
    } else {
        cancerTag.textContent = patient.Cancer_Type;
    }
    cancerTag.style.setProperty('--cancer-color', cancerColors[patient.Cancer_Type] || '#64748b');
    
    stageTag.textContent = patient.Stage;
    stageTag.style.setProperty('--stage-color', stageColors[patient.Stage] || '#64748b');
    
    statusTag.textContent = patient.Status;
    statusTag.style.setProperty('--status-color', patient.Status === 'Alive' ? '#34d399' : '#f87171');
    const avatarStatus = document.getElementById('avatarStatus');
    if (avatarStatus) {
        avatarStatus.classList.remove('alive', 'deceased');
        avatarStatus.classList.add(patient.Status === 'Alive' ? 'alive' : 'deceased');
    }
    
    // Update stats
    const months = parseInt(patient.Survival_Months) || 0;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let durationText;
    if (years > 0 && remainingMonths > 0) {
        durationText = `${years}y ${remainingMonths}m`;
    } else if (years > 0) {
        durationText = `${years} years`;
    } else {
        durationText = `${months} months`;
    }
    document.getElementById('patientDuration').textContent = durationText;
    
    // Calculate prognosis comparison
    const typePatients = patients.filter(p => p.Cancer_Type === patient.Cancer_Type);
    const avgSurvival = typePatients.reduce((sum, p) => sum + (parseInt(p.Survival_Months) || 0), 0) / typePatients.length;
    const diff = months - avgSurvival;
    const diffText = diff >= 0 ? `+${diff.toFixed(0)}m` : `${diff.toFixed(0)}m`;
    document.getElementById('patientPrognosis').textContent = diffText;
    
    // Update narrative
    document.getElementById('patientNarrative').textContent = generatePatientNarrative(patient);
    
    // Update avatar color based on cancer type
    const avatar = document.querySelector('.patient-avatar');
    if (avatar) {
        avatar.style.setProperty('--avatar-glow', cancerColors[patient.Cancer_Type] || '#64748b');
    }
    
    // Make tags clickable - update their title attributes
    cancerTag.title = `Click to filter by ${patient.Cancer_Type}`;
    stageTag.title = `Click to filter by ${patient.Stage}`;

    highlightPatientRow(patient.ID);
}

function generatePatientNarrative(patient) {
    const months = parseInt(patient.Survival_Months) || 0;
    const isAlive = patient.Status === 'Alive';
    const stage = patient.Stage;
    
    // Calculate stats for context
    const typePatients = patients.filter(p => p.Cancer_Type === patient.Cancer_Type);
    const avgSurvival = typePatients.reduce((sum, p) => sum + (parseInt(p.Survival_Months) || 0), 0) / typePatients.length;
    const survivalRate = (typePatients.filter(p => p.Status === 'Alive').length / typePatients.length * 100).toFixed(0);
    
    const survivalComparison = months > avgSurvival ? 'above' : months < avgSurvival ? 'below' : 'at';
    const years = (months / 12).toFixed(1);
    
    let narrative = '';
    
    // Lung cancer subtype info
    if (patient.Cancer_Type === 'Lung' && patient.Lung_Subtype) {
        narrative = `This patient was diagnosed with ${patient.Lung_Subtype} lung cancer at ${stage}. `;
    } else {
        narrative = `This patient was diagnosed with ${patient.Cancer_Type.toLowerCase()} cancer at ${stage}. `;
    }
    
    // Survival context
    if (isAlive) {
        narrative += `Currently surviving at ${years} years, which is ${survivalComparison} the average of ${(avgSurvival/12).toFixed(1)} years for this cancer type.`;
    } else {
        narrative += `Survived for ${years} years before passing, which was ${survivalComparison} the average of ${(avgSurvival/12).toFixed(1)} years.`;
    }
    
    // Add prognosis insight
    if (stage === 'Stage IV' && months > 24) {
        narrative += ' Notably exceeded typical Stage IV expectations.';
    } else if (stage === 'Stage I' && !isAlive) {
        narrative += ' An unfortunate outcome despite early detection.';
    }
    
    return narrative;
}

function navigatePatient(direction) {
    if (filteredPatients.length === 0) return;
    
    currentPatientIndex = (currentPatientIndex + direction + filteredPatients.length) % filteredPatients.length;
    displayPatientSpotlight();
}

function shufflePatient() {
    if (filteredPatients.length <= 1) return;
    
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * filteredPatients.length);
    } while (newIndex === currentPatientIndex);
    
    currentPatientIndex = newIndex;
    displayPatientSpotlight();
}

function highlightPatientRow(patientId) {
    const rows = document.querySelectorAll('#tableBody tr');
    rows.forEach(row => {
        const isActive = patientId && row.dataset.patientId === patientId;
        row.classList.toggle('active', Boolean(isActive));
    });
}
