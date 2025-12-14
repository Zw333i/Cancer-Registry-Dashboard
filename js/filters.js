/* ========================================
   CANCER REGISTRY DASHBOARD
   Filter Handlers
   ======================================== */

// ==========================================
// STATUS FILTER TOGGLE
// ==========================================
function toggleStatusFilter(status) {
    console.log('toggleStatusFilter called with:', status);
    console.log('Current filter before:', currentStatusFilter);
    
    const alivePill = document.getElementById('alivePill');
    const deceasedPill = document.getElementById('deceasedPill');
    
    // Toggle: if already filtering by this status, reset to all
    if (currentStatusFilter === status) {
        currentStatusFilter = 'all';
        alivePill.classList.remove('active', 'dimmed');
        deceasedPill.classList.remove('active', 'dimmed');
        showToast('info', 'Filter Cleared', 'Showing all patients');
    } else {
        currentStatusFilter = status;
        
        // Update visual states
        if (status === 'Alive') {
            alivePill.classList.add('active');
            alivePill.classList.remove('dimmed');
            deceasedPill.classList.add('dimmed');
            deceasedPill.classList.remove('active');
            showToast('success', 'Filtered', 'Showing only Alive patients');
        } else {
            deceasedPill.classList.add('active');
            deceasedPill.classList.remove('dimmed');
            alivePill.classList.add('dimmed');
            alivePill.classList.remove('active');
            showToast('warning', 'Filtered', 'Showing only Deceased patients');
        }
    }
    
    console.log('Current filter after:', currentStatusFilter);
    
    // Update breadcrumb display
    if (currentStatusFilter === 'all') {
        if (currentCancerFilter === 'all') {
            updateBreadcrumb('All Patients');
        } else {
            updateBreadcrumb(currentCancerFilter + ' Cancer');
        }
    } else {
        if (currentCancerFilter === 'all') {
            updateBreadcrumb(currentStatusFilter + ' Patients');
        } else {
            updateBreadcrumb(currentStatusFilter + ' ' + currentCancerFilter + ' Patients');
        }
    }
    
    applyFilters();
    
    // Scroll to patient records table after filter is applied
    setTimeout(() => {
        document.querySelector('.table-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
}

// ==========================================
// FILTER HANDLERS
// ==========================================
function handleOrganClick(e) {
    const region = e.currentTarget;
    const cancer = region.dataset.cancer;
    
    // Toggle: if clicking same cancer, reset to all
    if (currentCancerFilter === cancer) {
        selectCancerType('all');
    } else {
        selectCancerType(cancer);
    }
}

function handleOrganBtnClick(e) {
    const btn = e.currentTarget;
    const cancer = btn.dataset.cancer;
    selectCancerType(cancer);
}

function selectCancerType(cancer) {
    // Update organ region active states
    document.querySelectorAll('.organ-region').forEach(r => r.classList.remove('active'));
    if (cancer !== 'all') {
        document.querySelectorAll(`.organ-region[data-cancer="${cancer}"]`).forEach(r => {
            r.classList.add('active');
        });
    }
    
    // Update organ button active state
    document.querySelectorAll('.organ-btn').forEach(b => b.classList.remove('active'));
    if (cancer === 'all') {
        document.querySelector('.organ-btn[data-cancer="all"]')?.classList.add('active');
    }
    
    // Update active organ display
    const displayText = cancer === 'all' ? 'All Types' : cancer;
    document.getElementById('activeOrgan').textContent = displayText;
    
    // Handle lung subfilter visibility
    const lungSubfilter = document.getElementById('lungSubfilter');
    if (cancer === 'Lung') {
        lungSubfilter.classList.add('visible');
    } else {
        lungSubfilter.classList.remove('visible');
        currentLungSubtype = 'all';
    }
    
    // Sync bubble chart checkboxes
    if (cancer === 'all') {
        selectedBubbleTypes = ['Breast', 'Lung', 'Colon', 'Prostate', 'Liver', 'Stomach', 'Pancreas', 'Ovarian'];
    } else {
        selectedBubbleTypes = [cancer];
    }
    updateBubbleCheckboxes();
    
    currentCancerFilter = cancer;
    updateBreadcrumb(cancer === 'all' ? 'All Patients' : cancer);
    applyFilters();
    
    showToast('info', 'Filter Applied', `Showing ${cancer === 'all' ? 'all cancer types' : cancer + ' cancer'}`);
}

function handleCancerFilter(e) {
    const btn = e.currentTarget;
    const cancer = btn.dataset.cancer;
    
    // Update active state
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Handle lung subfilter visibility
    const lungSubfilter = document.getElementById('lungSubfilter');
    if (cancer === 'Lung') {
        lungSubfilter.classList.add('visible');
        btn.classList.add('active');
    } else {
        lungSubfilter.classList.remove('visible');
        currentLungSubtype = 'all';
    }
    
    currentCancerFilter = cancer;
    updateBreadcrumb(cancer === 'all' ? 'All Patients' : cancer);
    applyFilters();
    
    showToast('info', 'Filter Applied', `Showing ${cancer === 'all' ? 'all cancer types' : cancer + ' cancer'}`);
}

function handleLungSubfilter(e) {
    const btn = e.currentTarget;
    const subtype = btn.dataset.subtype;
    
    document.querySelectorAll('.subfilter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    currentLungSubtype = subtype;
    applyFilters();
}

function handleSliderChange(e) {
    const value = parseInt(e.target.value);
    currentSurvivalMin = value;
    
    // Update fill
    const fill = document.getElementById('sliderFill');
    const percentage = (value / 120) * 100;
    fill.style.width = `${percentage}%`;
    
    // Update label
    const label = document.getElementById('sliderValue');
    if (value === 0) {
        label.textContent = 'All patients';
    } else {
        const years = (value / 12).toFixed(1);
        label.textContent = `≥ ${value}mo (${years}yr)`;
    }
    
    applyFilters();
}

function handleStageFilter() {
    selectedStages = Array.from(document.querySelectorAll('.stage-checkbox:checked'))
        .map(cb => cb.value);
    applyFilters();
}

function resetFilters() {
    // Reset cancer filter
    currentCancerFilter = 'all';
    currentLungSubtype = 'all';
    
    // Reset status filter
    currentStatusFilter = 'all';
    document.getElementById('alivePill')?.classList.remove('active', 'dimmed');
    document.getElementById('deceasedPill')?.classList.remove('active', 'dimmed');
    
    // Reset body diagram
    document.querySelectorAll('.organ-region').forEach(r => r.classList.remove('active'));
    document.querySelectorAll('.organ-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.organ-btn[data-cancer="all"]')?.classList.add('active');
    document.getElementById('activeOrgan').textContent = 'All Types';
    
    document.getElementById('lungSubfilter').classList.remove('visible');
    document.querySelectorAll('.subfilter-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.subfilter-btn[data-subtype="all"]').classList.add('active');
    
    // Reset slider
    currentSurvivalMin = 0;
    currentSurvivalYearFilter = null;
    document.getElementById('survivalSlider').value = 0;
    document.getElementById('sliderFill').style.width = '0%';
    document.getElementById('sliderValue').textContent = 'All patients';
    
    // Reset curve stat active states
    document.querySelectorAll('.curve-stat').forEach(s => s.classList.remove('active'));
    
    // Reset stages
    selectedStages = ['Stage I', 'Stage II', 'Stage III', 'Stage IV', 'Unknown'];
    document.querySelectorAll('.stage-checkbox').forEach(cb => cb.checked = true);
    
    updateBreadcrumb('All Patients');
    applyFilters();
    
    showToast('success', 'Filters Reset', 'All filters have been cleared');
}

function showSkeletonLoading() {
    document.querySelector('.dashboard-container').classList.add('dashboard-loading');
}

function hideSkeletonLoading() {
    document.querySelector('.dashboard-container').classList.remove('dashboard-loading');
}

function applyFilters() {
    // Show skeleton loading
    showSkeletonLoading();
    
    // Use setTimeout to allow UI to update before heavy processing
    setTimeout(() => {
        filteredPatients = patients.filter(p => {
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
            
            // Status filter (Alive/Deceased)
            if (currentStatusFilter !== 'all' && p.Status !== currentStatusFilter) {
                return false;
            }
            
            // Survival duration filter
            const survival = parseInt(p.Survival_Months) || 0;
            if (survival < currentSurvivalMin) {
                return false;
            }
            
            // Stage filter
            if (!selectedStages.includes(p.Stage)) {
                return false;
            }
            
            return true;
        });
        
        updateDashboard();
        updateSurvivalStats();
        updateCharts();
        updateTable();
        updateStageCounts();
        updateStageSurvivalRates();
        
        // Reset patient spotlight to first of filtered
        currentPatientIndex = 0;
        displayPatientSpotlight();
        
        // Hide skeleton after a short delay for visual feedback
        setTimeout(hideSkeletonLoading, 150);
    }, 50);
}
