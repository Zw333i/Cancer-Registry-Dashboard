/* ========================================
   CANCER REGISTRY DASHBOARD
   Table Updates
   ======================================== */

// ==========================================
// TABLE UPDATE
// ==========================================
function updateTable() {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;

    const displayPatients = filteredPatients
        .map((patient, index) => ({ patient, index }))
        .slice(0, 100); // Limit to 100 for performance
    
    tbody.innerHTML = displayPatients.map(({ patient, index }) => `
        <tr class="patient-row" data-patient-id="${patient.ID}" data-patient-index="${index}">
            <td>${patient.ID}</td>
            <td>
                <span class="cancer-badge" style="--cancer-color: ${cancerColors[patient.Cancer_Type] || '#64748b'}">
                    ${patient.Cancer_Type}
                </span>
            </td>
            <td>
                <span class="stage-badge" style="--stage-color: ${stageColors[patient.Stage] || '#64748b'}">
                    ${patient.Stage}
                </span>
            </td>
            <td>
                <span class="status-${patient.Status.toLowerCase()}">${patient.Status}</span>
            </td>
            <td>${patient.Survival_Months}</td>
        </tr>
    `).join('');
    
    // Update table count
    const tableCount = document.getElementById('tableCount');
    if (tableCount) {
        tableCount.textContent = filteredPatients.length;
    }

    tbody.querySelectorAll('.patient-row').forEach(row => {
        row.addEventListener('click', () => {
            const index = parseInt(row.dataset.patientIndex, 10);
            if (Number.isNaN(index)) return;
            currentPatientIndex = index;
            displayPatientSpotlight();
            document.querySelector('.spotlight-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });

    const activePatient = filteredPatients[currentPatientIndex];
    highlightPatientRow(activePatient ? activePatient.ID : null);
}
