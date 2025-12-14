/* ========================================
   CANCER REGISTRY DASHBOARD
   Dashboard Updates
   ======================================== */

// ==========================================
// BREADCRUMB & DISPLAY UPDATES
// ==========================================
function updateBreadcrumb(filterName) {
    const display = document.getElementById('currentFilter');
    if (display) {
        display.textContent = filterName;
    }
}

// ==========================================
// DASHBOARD UPDATES
// ==========================================
function updateDashboard() {
    const total = filteredPatients.length;
    const alive = filteredPatients.filter(p => p.Status === 'Alive').length;
    const deceased = filteredPatients.filter(p => p.Status === 'Deceased').length;
    const avgSurvival = filteredPatients.length > 0 
        ? (filteredPatients.reduce((sum, p) => sum + (parseInt(p.Survival_Months) || 0), 0) / total).toFixed(1)
        : 0;
    
    // Calculate survival rates per stage
    const stageData = {};
    ['Stage I', 'Stage II', 'Stage III', 'Stage IV'].forEach(stage => {
        const stagePatients = filteredPatients.filter(p => p.Stage === stage);
        const stageAlive = stagePatients.filter(p => p.Status === 'Alive').length;
        stageData[stage] = stagePatients.length > 0 
            ? ((stageAlive / stagePatients.length) * 100).toFixed(0)
            : 0;
    });
    
    // Find most critical (lowest survival rate with patients)
    let criticalStage = 'Stage IV';
    let lowestRate = 100;
    for (const [stage, rate] of Object.entries(stageData)) {
        const stageCount = filteredPatients.filter(p => p.Stage === stage).length;
        if (stageCount > 0 && parseInt(rate) < lowestRate) {
            lowestRate = parseInt(rate);
            criticalStage = stage;
        }
    }
    
    // Animate counters
    animateCounter('totalPatients', total);
    const survivalRatePct = Math.round((alive / total) * 100) || 0;
    animateCounter('survivalRate', survivalRatePct, '%');
    animateCounter('avgSurvival', parseFloat(avgSurvival));
    
    // Update survival ring indicator
    const survivalRing = document.getElementById('survivalRing');
    const ringLabel = document.getElementById('ringLabel');
    if (survivalRing) {
        const circumference = 2 * Math.PI * 40; // r=40
        const offset = circumference - (survivalRatePct / 100) * circumference;
        survivalRing.style.strokeDasharray = circumference;
        survivalRing.style.strokeDashoffset = offset;
    }
    if (ringLabel) {
        ringLabel.textContent = survivalRatePct + '%';
    }
    
    // Update critical watch card - show the stage name
    const criticalCancer = document.getElementById('criticalCancer');
    const criticalRate = document.getElementById('criticalRate');
    if (criticalCancer) {
        criticalCancer.textContent = criticalStage;
    }
    if (criticalRate) {
        criticalRate.textContent = `${lowestRate}% survival rate`;
    }
    
    // Update alive/deceased pills
    const headerAlive = document.getElementById('headerAlive');
    const headerDeceased = document.getElementById('headerDeceased');
    if (headerAlive) headerAlive.textContent = alive;
    if (headerDeceased) headerDeceased.textContent = deceased;
}

function animateCounter(elementId, targetValue, suffix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = parseInt(element.textContent) || 0;
    const duration = 800;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        const currentValue = startValue + (targetValue - startValue) * easeOutQuart;
        element.textContent = Math.round(currentValue) + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ==========================================
// STAGE COUNTS UPDATE
// ==========================================
function updateStageCounts() {
    const stages = ['Stage I', 'Stage II', 'Stage III', 'Stage IV', 'Unknown'];
    const stageLabels = {
        'Stage I': 'stageICount',
        'Stage II': 'stageIICount',
        'Stage III': 'stageIIICount',
        'Stage IV': 'stageIVCount',
        'Unknown': 'stageUnknownCount'
    };
    
    stages.forEach(stage => {
        const count = filteredPatients.filter(p => p.Stage === stage).length;
        const element = document.getElementById(stageLabels[stage]);
        if (element) {
            element.textContent = count;
        }
    });
}

// ==========================================
// SURVIVAL STATS UPDATE
// ==========================================
function updateSurvivalStats() {
    // Calculate survival rates at different time points
    // Use all patients (ignoring survival duration filter) to show actual survival rates
    // Filter based on current cancer type, status, and stage filters only
    const basePatients = patients.filter(p => {
        // Cancer type filter
        if (currentCancerFilter !== 'all' && p.Cancer_Type !== currentCancerFilter) {
            return false;
        }
        // Lung subtype filter
        if (currentCancerFilter === 'Lung' && currentLungSubtype !== 'all') {
            if (p.Lung_Subtype !== currentLungSubtype) {
                return false;
            }
        }
        // Stage filter
        if (!selectedStages.includes(p.Stage)) {
            return false;
        }
        return true;
    });
    
    const total = basePatients.length;
    
    // Patients who survived at least X months
    const alive12 = basePatients.filter(p => (parseFloat(p.Survival_Months) || 0) >= 12).length;
    const alive36 = basePatients.filter(p => (parseFloat(p.Survival_Months) || 0) >= 36).length;
    const alive60 = basePatients.filter(p => (parseFloat(p.Survival_Months) || 0) >= 60).length;
    
    const rate12 = total > 0 ? Math.round((alive12 / total) * 100) : 0;
    const rate36 = total > 0 ? Math.round((alive36 / total) * 100) : 0;
    const rate60 = total > 0 ? Math.round((alive60 / total) * 100) : 0;
    
    // Update the curve stat values using IDs for reliability
    const survival1yr = document.getElementById('survival1yr');
    const survival3yr = document.getElementById('survival3yr');
    const survival5yr = document.getElementById('survival5yr');
    
    if (survival1yr) survival1yr.textContent = `${rate12}%`;
    if (survival3yr) survival3yr.textContent = `${rate36}%`;
    if (survival5yr) survival5yr.textContent = `${rate60}%`;
}

// ==========================================
// STAGE SURVIVAL RATES
// ==========================================
function updateStageSurvivalRates() {
    const stageOrder = ['Stage I', 'Stage II', 'Stage III', 'Stage IV'];
    const stageIds = ['1', '2', '3', '4'];
    
    stageOrder.forEach((stage, index) => {
        const stagePatients = filteredPatients.filter(p => p.Stage === stage);
        const survived = stagePatients.filter(p => p.Status === 'Alive').length;
        const total = stagePatients.length;
        const rate = total > 0 ? Math.round((survived / total) * 100) : 0;
        
        // Update counts (e.g., "45/120")
        const countsEl = document.getElementById(`stageCounts${stageIds[index]}`);
        if (countsEl) {
            countsEl.textContent = `${survived}/${total}`;
        }
        
        // Update survival percentage
        const survivalEl = document.getElementById(`stageSurvival${stageIds[index]}`);
        if (survivalEl) {
            survivalEl.textContent = `${rate}%`;
        }
    });
}
