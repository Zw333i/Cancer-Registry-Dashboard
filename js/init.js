/* ========================================
   CANCER REGISTRY DASHBOARD
   Initialization
   ======================================== */

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, starting initialization...');
    await loadData();
    console.log(`Data loaded: ${patients.length} patients, ${filteredPatients.length} filtered`);
    initIntroAnimation();
    initParticles();
    initEventListeners();
    initCharts();
    updateDashboard();
    updateSurvivalStats();
    updateCharts();
    updateTable();
    updateStageCounts();
    updateStageSurvivalRates();
    currentPatientIndex = 0;
    displayPatientSpotlight();
    showWelcomeToast();
    console.log('Initialization complete');
});

// ==========================================
// INTRO ANIMATION
// ==========================================
function initIntroAnimation() {
    const overlay = document.getElementById('introOverlay');
    
    // After the loading animation completes, fade out intro
    setTimeout(() => {
        overlay.classList.add('hidden');
        
        // Add stagger animation to main elements
        animateMainContent();
    }, 2600);
}

function animateMainContent() {
    const elements = [
        '.main-header',
        '.hero-card',
        '.chart-card',
        '.spotlight-card',
        '.table-card'
    ];
    
    elements.forEach((selector, index) => {
        const els = document.querySelectorAll(selector);
        els.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, (index * 100) + (i * 50));
        });
    });
}

// ==========================================
// FLOATING PARTICLES
// ==========================================
function initParticles() {
    const container = document.getElementById('particles');
    const colors = ['#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#3b82f6'];
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 8 + 4;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * 15;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${left}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;
        
        container.appendChild(particle);
    }
}

// ==========================================
// DATA LOADING
// ==========================================
async function loadData() {
    try {
        const [csvResponse, ageResponse] = await Promise.all([
            fetch('data/data.csv'),
            fetch('data/age-data.json').catch(() => null)
        ]);
        if (!csvResponse.ok) {
            throw new Error('Unable to load data.csv');
        }

        const text = await csvResponse.text();
        const parsedPatients = parseCSV(text);
        if (!parsedPatients.length) {
            throw new Error('data.csv is empty or invalid.');
        }

        let ageMap = {};
        hasAgeData = false;
        if (ageResponse && ageResponse.ok) {
            try {
                const parsedAgeMap = await ageResponse.json();
                if (parsedAgeMap && typeof parsedAgeMap === 'object') {
                    ageMap = parsedAgeMap;
                }
            } catch (ageError) {
                console.warn('Failed to parse age-data.json:', ageError);
            }
        } else {
            console.warn('Age data file not found. Age charts will be limited.');
        }

        let ageAssignments = 0;
        patients = parsedPatients.map(patient => {
            const ageValue = ageMap[patient.ID];
            if (typeof ageValue === 'number' && Number.isFinite(ageValue)) {
                patient.Age = ageValue;
                patient.Age_Group = getAgeGroupFromValue(ageValue);
                ageAssignments++;
            } else {
                patient.Age = null;
                patient.Age_Group = null;
            }
            return patient;
        });

        hasAgeData = ageAssignments > 0;
        filteredPatients = [...patients];

        const missingAges = patients.filter(p => p.Age === null).length;
        console.log(`Loaded ${patients.length} patients (${patients.length - missingAges} with age data)`);
        if (!hasAgeData) {
            console.warn('Age data missing for all patients. Age visualizations will show a placeholder message.');
        }
    } catch (error) {
        console.error('Error loading data:', error);
        showToast('error', 'Data Error', 'Failed to load patient data');
    }
}

function parseCSV(text) {
    const rows = [];
    let field = '';
    let row = [];
    let inQuotes = false;

    const pushField = () => {
        row.push(field);
        field = '';
    };

    const pushRow = () => {
        if (row.length === 0) return;
        rows.push(row);
        row = [];
    };

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char === '"') {
            if (inQuotes && text[i + 1] === '"') {
                field += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            pushField();
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            if (char === '\r' && text[i + 1] === '\n') {
                i++;
            }
            pushField();
            pushRow();
        } else {
            field += char;
        }
    }

    if (field.length || row.length) {
        pushField();
        pushRow();
    }

    if (!rows.length) {
        return [];
    }

    const headers = rows.shift().map(header => header.replace(/^\ufeff/, '').trim());
    return rows
        .filter(columns => columns.some(value => value && value.trim() !== ''))
        .map(columns => {
            const record = {};
            headers.forEach((header, index) => {
                const key = header;
                let value = (columns[index] ?? '').trim();
                if (key === 'Survival_Months') {
                    const numeric = parseFloat(value);
                    record[key] = Number.isFinite(numeric) ? numeric : 0;
                } else {
                    record[key] = value;
                }
            });
            return record;
        });
}
