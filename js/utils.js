/* ========================================
   CANCER REGISTRY DASHBOARD
   Utility Functions
   ======================================== */

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(type, title, message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function showWelcomeToast() {
    setTimeout(() => {
        showToast('success', 'Dashboard Ready', `Loaded ${patients.length} patient records`);
    }, 3500);
}

// ==========================================
// EXPORT CSV
// ==========================================
function exportToCSV() {
    if (filteredPatients.length === 0) {
        showToast('warning', 'No Data', 'No patients to export');
        return;
    }
    
    // Headers
    const headers = ['ID', 'Cancer_Type', 'Lung_Subtype', 'Stage', 'Status', 'Survival_Months'];
    
    // Build CSV content
    let csvContent = headers.join(',') + '\n';
    
    filteredPatients.forEach(patient => {
        const row = headers.map(header => {
            let value = patient[header] || '';
            // Escape quotes and wrap in quotes if contains comma
            if (value.includes(',') || value.includes('"')) {
                value = `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csvContent += row.join(',') + '\n';
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Generate filename with current filter info
    let filename = 'cancer_registry';
    if (currentCancerFilter !== 'all') {
        filename += `_${currentCancerFilter.toLowerCase()}`;
    }
    if (currentStatusFilter !== 'all') {
        filename += `_${currentStatusFilter.toLowerCase()}`;
    }
    filename += `_${filteredPatients.length}_patients.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('success', 'Export Complete', `Downloaded ${filteredPatients.length} patient records`);
}

// ==========================================
// BUBBLE CHART CHECKBOXES
// ==========================================
function updateBubbleCheckboxes() {
    document.querySelectorAll('.bubble-checkbox').forEach(cb => {
        cb.checked = selectedBubbleTypes.includes(cb.value);
    });
}

// ==========================================
// BUBBLE FILTER HANDLERS
// ==========================================
function handleBubbleFilterChange(e) {
    const type = e.target.value;
    const checked = e.target.checked;
    
    if (checked) {
        if (!selectedBubbleTypes.includes(type)) {
            selectedBubbleTypes.push(type);
        }
    } else {
        selectedBubbleTypes = selectedBubbleTypes.filter(t => t !== type);
    }
    
    updateBubbleChart();
}

function bubbleSelectAll() {
    selectedBubbleTypes = ['Breast', 'Lung', 'Colon', 'Prostate', 'Liver', 'Stomach', 'Pancreas', 'Ovarian'];
    updateBubbleCheckboxes();
    updateBubbleChart();
}

function bubbleClearAll() {
    selectedBubbleTypes = [];
    updateBubbleCheckboxes();
    updateBubbleChart();
}

// Make functions globally available for onclick handlers
window.handleBubbleFilterChange = handleBubbleFilterChange;
window.bubbleSelectAll = bubbleSelectAll;
window.bubbleClearAll = bubbleClearAll;
