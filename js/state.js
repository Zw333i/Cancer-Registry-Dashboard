/* ========================================
   CANCER REGISTRY DASHBOARD
   State & Configuration
   ======================================== */

// ==========================================
// DATA & STATE
// ==========================================
let patients = [];
let filteredPatients = [];
let currentCancerFilter = 'all';
let currentLungSubtype = 'all';
let currentSurvivalMin = 0;
let currentSurvivalYearFilter = null; // Track which year filter is active (12, 36, 60 or null)
let currentStatusFilter = 'all'; // 'all', 'Alive', or 'Deceased'
let selectedStages = ['Stage I', 'Stage II', 'Stage III', 'Stage IV', 'Unknown'];
let isComparisonMode = false;
let currentPatientIndex = 0;
let charts = {};

// Cancer type colors
const cancerColors = {
    'Breast': '#ec4899',
    'Lung': '#3b82f6',
    'Colon': '#8b5cf6',
    'Prostate': '#06b6d4',
    'Liver': '#f59e0b',
    'Stomach': '#ef4444',
    'Pancreas': '#84cc16',
    'Ovarian': '#d946ef'
};

const stageColors = {
    'Stage I': '#34d399',
    'Stage II': '#60a5fa',
    'Stage III': '#fbbf24',
    'Stage IV': '#f472b6',
    'Unknown': '#64748b'
};

const AGE_GROUPS = ['10-30', '31-50', '51-70', '71-90'];
const ageGroupDescriptions = {
    '10-30': 'Young adults',
    '31-50': 'Working age',
    '51-70': 'Prime diagnosis',
    '71-90': 'Senior patients'
};

function getAgeGroupFromValue(ageValue) {
    const numericAge = typeof ageValue === 'number' ? ageValue : parseFloat(ageValue);
    if (Number.isNaN(numericAge)) return null;
    if (numericAge <= 30) return '10-30';
    if (numericAge <= 50) return '31-50';
    if (numericAge <= 70) return '51-70';
    return '71-90';
}

// Cancer type colors and icons for bubble chart
const bubbleCancerIcons = {
    'Breast': { color: '#ec4899' },
    'Lung': { color: '#3b82f6' },
    'Colon': { color: '#22c55e' },
    'Prostate': { color: '#a855f7' },
    'Liver': { color: '#f97316' },
    'Stomach': { color: '#eab308' },
    'Pancreas': { color: '#14b8a6' },
    'Ovarian': { color: '#f43f5e' }
};

// SVG paths for organ icons
const organSVGPaths = {
    'Breast': 'M12 4c-2 0-4 2-4 4s2 6 4 8c2-2 4-6 4-8s-2-4-4-4z M8 10c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4z M16 10c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4z',
    'Lung': 'M7 8c-2 0-3 2-3 5s1 6 3 7c1 0 2-1 2-2V9c0-1-1-1-2-1z M17 8c2 0 3 2 3 5s-1 6-3 7c-1 0-2-1-2-2V9c0-1 1-1 2-1z M12 6v12',
    'Colon': 'M6 6c0 2 1 3 3 3h6c2 0 3 1 3 3s-1 3-3 3H9c-2 0-3 1-3 3s1 3 3 3h6',
    'Prostate': 'M12 8c-3 0-5 2-5 4s2 4 5 4 5-2 5-4-2-4-5-4z M12 4v4 M12 16v4',
    'Liver': 'M6 8c0 6 2 10 6 10s8-4 8-8c0-3-2-5-5-5H9c-2 0-3 1-3 3z',
    'Stomach': 'M8 6c-2 0-3 2-3 4v4c0 3 2 5 5 5h4c3 0 5-2 5-5v-2c0-2-1-4-3-4h-2c-1 0-2-1-2-2z',
    'Pancreas': 'M4 12h4c1 0 2 1 3 1h6c2 0 3-1 3-2s-1-2-3-2h-2c-1 0-2-1-2-2s1-2 2-2h5',
    'Ovarian': 'M8 12a3 3 0 1 0 0-1 3 3 0 0 0 0 1z M16 12a3 3 0 1 0 0-1 3 3 0 0 0 0 1z M11 12h2'
};

let selectedBubbleTypes = ['Breast', 'Lung', 'Colon', 'Prostate', 'Liver', 'Stomach', 'Pancreas', 'Ovarian'];
