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
async function exportToCSV() {
    try {
        const response = await fetch('data/data.csv', { cache: 'no-cache' });
        if (!response.ok) {
            throw new Error('Unable to fetch data.csv');
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().split('T')[0];
        link.href = url;
        link.download = `cancer_registry_data_${timestamp}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('success', 'Export Complete', 'Downloaded data.csv from the data folder');
    } catch (error) {
        console.error('CSV export failed:', error);
        showToast('error', 'Export Failed', 'Unable to download data.csv');
    }
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
