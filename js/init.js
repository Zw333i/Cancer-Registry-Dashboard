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
    }, 3200);
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
        let ageMap = {};
        if (ageResponse && ageResponse.ok) {
            try {
                ageMap = await ageResponse.json();
            } catch (ageError) {
                console.warn('Failed to parse age-data.json:', ageError);
            }
        } else {
            console.warn('Age data file not found. Age charts will be limited.');
        }
        patients = parseCSV(text).map(patient => {
            const ageValue = ageMap[patient.ID];
            if (typeof ageValue === 'number') {
                patient.Age = ageValue;
                patient.Age_Group = getAgeGroupFromValue(ageValue);
            } else {
                patient.Age = null;
                patient.Age_Group = null;
            }
            return patient;
        });
        filteredPatients = [...patients];
        const missingAges = patients.filter(p => p.Age === null).length;
        console.log(`Loaded ${patients.length} patients (${patients.length - missingAges} with age data)`);
        if (missingAges > 0) {
            console.warn(`Age data missing for ${missingAges} patients.`);
        }
    } catch (error) {
        console.error('Error loading data:', error);
        showToast('error', 'Data Error', 'Failed to load patient data');
    }
}

function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((header, index) => {
            let value = values[index]?.trim() || '';
            // Convert Survival_Months to number
            if (header.trim() === 'Survival_Months') {
                value = parseFloat(value) || 0;
            }
            obj[header.trim()] = value;
        });
        return obj;
    });
}
