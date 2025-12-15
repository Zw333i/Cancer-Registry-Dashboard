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

    const total = filteredPatients.length;
    const totalPages = Math.max(1, Math.ceil(total / ROWS_PER_PAGE));
    tablePage = Math.min(Math.max(tablePage, 1), totalPages);
    const startIndex = total === 0 ? 0 : (tablePage - 1) * ROWS_PER_PAGE;
    const endIndex = total === 0 ? 0 : Math.min(startIndex + ROWS_PER_PAGE, total);
    const displayPatients = filteredPatients
        .slice(startIndex, endIndex)
        .map((patient, offset) => ({ patient, index: startIndex + offset }));
    
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
        tableCount.textContent = total;
    }
    const rangeLabel = document.getElementById('tableRange');
    if (rangeLabel) {
        if (total === 0) {
            rangeLabel.textContent = '0-0';
        } else {
            rangeLabel.textContent = `${startIndex + 1}-${endIndex}`;
        }
    }

    renderTablePagination(totalPages);

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

function renderTablePagination(totalPages) {
    const container = document.getElementById('tablePagination');
    if (!container) return;

    if (filteredPatients.length === 0 || totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    const prevDisabled = tablePage <= 1;
    const nextDisabled = tablePage >= totalPages;
    container.innerHTML = `
        <button ${prevDisabled ? 'disabled' : ''} data-page="${tablePage - 1}">Previous</button>
        <span class="page-label">Page ${tablePage} of ${totalPages}</span>
        <button ${nextDisabled ? 'disabled' : ''} data-page="${tablePage + 1}">Next</button>
    `;
}

function handleTablePaginationClick(event) {
    const button = event.target.closest('button[data-page]');
    if (!button || button.disabled) return;

    const requestedPage = parseInt(button.dataset.page, 10);
    if (Number.isNaN(requestedPage)) return;

    const maxPages = Math.max(1, Math.ceil(filteredPatients.length / ROWS_PER_PAGE));
    tablePage = Math.min(Math.max(requestedPage, 1), maxPages);
    updateTable();
    document.querySelector('.table-wrapper')?.scrollTo({ top: 0, behavior: 'smooth' });
}
