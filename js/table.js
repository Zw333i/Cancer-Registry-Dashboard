/* ========================================
   CANCER REGISTRY DASHBOARD
   Table Updates
   ======================================== */

// ==========================================
// TABLE UPDATE
// ==========================================
function updateTable() {
    const tbody = document.getElementById('tableBody');
    const displayPatients = filteredPatients.slice(0, 100); // Limit to 100 for performance
    
    tbody.innerHTML = displayPatients.map(patient => `
        <tr>
            <td>${patient.ID}</td>
            <td>
                <span class="cancer-badge" style="--cancer-color: ${cancerColors[patient.Cancer_Type] || '#64748b'}">
                    ${patient.Cancer_Type}
                </span>
            </td>
            <td>${patient.Lung_Subtype || '-'}</td>
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
}
