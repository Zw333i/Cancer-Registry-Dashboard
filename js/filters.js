/* ========================================
   CANCER REGISTRY DASHBOARD
   Filter Handlers
   ======================================== */

function getCancerSelectionSummary() {
    if (selectedCancerTypes.length === 0) {
        return 'All Patients';
    }
    if (selectedCancerTypes.length === 1) {
        return `${selectedCancerTypes[0]} Patients`;
    }
    return `${selectedCancerTypes.length} Cancer Types`;
}

function getActiveOrganSummary() {
    if (selectedCancerTypes.length === 0) {
        return 'All Types';
    }
    if (selectedCancerTypes.length === 1) {
        return selectedCancerTypes[0];
    }
    if (selectedCancerTypes.length === 2) {
        return selectedCancerTypes.join(', ');
    }
    return `${selectedCancerTypes[0]}, ${selectedCancerTypes[1]} +${selectedCancerTypes.length - 2} more`;
}

function selectionsMatch(a, b) {
    if (a.length !== b.length) return false;
    return a.every((value, index) => value === b[index]);
}

function refreshCancerBreadcrumb() {
    let label;
    if (currentStatusFilter === 'all') {
        label = getCancerSelectionSummary();
    } else if (selectedCancerTypes.length === 0) {
        label = `${currentStatusFilter} Patients`;
    } else if (selectedCancerTypes.length === 1) {
        label = `${currentStatusFilter} ${selectedCancerTypes[0]} Patients`;
    } else {
        label = `${currentStatusFilter} • ${selectedCancerTypes.length} Cancer Types`;
    }
    updateBreadcrumb(label);
}

function syncOrganSelectionUI() {
    const active = new Set(selectedCancerTypes);
    document.querySelectorAll('.organ-region').forEach(region => {
        region.classList.toggle('active', active.has(region.dataset.cancer));
    });
    const allBtn = document.querySelector('.organ-btn[data-cancer="all"]');
    if (allBtn) {
        allBtn.classList.toggle('active', selectedCancerTypes.length === 0);
    }
    const indicator = document.getElementById('activeOrgan');
    if (indicator) {
        indicator.textContent = getActiveOrganSummary();
    }
}

function syncBubbleSelectionFromCancerFilters() {
    if (selectedCancerTypes.length === 0) {
        selectedBubbleTypes = [...CANCER_TYPES];
    } else {
        selectedBubbleTypes = [...selectedCancerTypes];
    }
    updateBubbleCheckboxes();
}

function updateLungSubfilterVisibility() {
    const lungSubfilter = document.getElementById('lungSubfilter');
    if (!lungSubfilter) return;
    const singleLungSelected = selectedCancerTypes.length === 1 && selectedCancerTypes[0] === 'Lung';
    if (singleLungSelected) {
        lungSubfilter.classList.add('visible');
    } else {
        lungSubfilter.classList.remove('visible');
        if (currentLungSubtype !== 'all') {
            currentLungSubtype = 'all';
            document.querySelectorAll('.subfilter-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.subfilter-btn[data-subtype="all"]')?.classList.add('active');
        }
    }
}

function isLungSubtypeFilterActive() {
    return selectedCancerTypes.length === 1 && selectedCancerTypes[0] === 'Lung' && currentLungSubtype !== 'all';
}

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
    } else {
        currentStatusFilter = status;
        
        // Update visual states
        if (status === 'Alive') {
            alivePill.classList.add('active');
            alivePill.classList.remove('dimmed');
            deceasedPill.classList.add('dimmed');
            deceasedPill.classList.remove('active');
        } else {
            deceasedPill.classList.add('active');
            deceasedPill.classList.remove('dimmed');
            alivePill.classList.add('dimmed');
            alivePill.classList.remove('active');
        }
    }
    
    console.log('Current filter after:', currentStatusFilter);
    
    refreshCancerBreadcrumb();
    
    applyFilters();
    
    if (currentStatusFilter !== 'all') {
        setTimeout(() => {
            document.querySelector('.table-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }
}

// ==========================================
// FILTER HANDLERS
// ==========================================
function handleOrganClick(e) {
    const region = e.currentTarget;
    const cancer = region.dataset.cancer;
    selectCancerType(cancer);
}

function handleOrganBtnClick(e) {
    const btn = e.currentTarget;
    const cancer = btn.dataset.cancer;
    if (cancer === 'all') {
        selectCancerType('all');
    } else {
        selectCancerType(cancer, { replace: true });
    }
}

function selectCancerType(cancer, options = {}) {
    const previousSelection = [...selectedCancerTypes];
    const previousLungSubtype = currentLungSubtype;
    
    if (cancer === 'all') {
        selectedCancerTypes = [];
    } else if (options.replace) {
        selectedCancerTypes = [cancer];
    } else if (selectedCancerTypes.includes(cancer)) {
        selectedCancerTypes = selectedCancerTypes.filter(type => type !== cancer);
    } else {
        selectedCancerTypes = [...selectedCancerTypes, cancer];
    }

    syncOrganSelectionUI();
    updateLungSubfilterVisibility();
    syncBubbleSelectionFromCancerFilters();
    refreshCancerBreadcrumb();
    const selectionChanged = !selectionsMatch(previousSelection, selectedCancerTypes);
    const lungChanged = previousLungSubtype !== currentLungSubtype;
    if (!options.silent && (selectionChanged || lungChanged || options.force)) {
        applyFilters();
    }
}

function resetCancerSelection() {
    const alreadyAll = selectedCancerTypes.length === 0 && currentLungSubtype === 'all';
    if (alreadyAll) {
        showToast('info', 'Cancer Filters', 'Already showing all cancer types');
        return;
    }
    selectCancerType('all', { force: true });
    showToast('success', 'Cancer Filters Reset', 'All cancer types restored');
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
    
    selectCancerType(cancer, { replace: true });
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
    const percentage = (value / SURVIVAL_SLIDER_MAX) * 100;
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
    currentLungSubtype = 'all';
    selectedCancerTypes = [];
    syncOrganSelectionUI();
    updateLungSubfilterVisibility();
    syncBubbleSelectionFromCancerFilters();
    
    // Reset status filter
    currentStatusFilter = 'all';
    document.getElementById('alivePill')?.classList.remove('active', 'dimmed');
    document.getElementById('deceasedPill')?.classList.remove('active', 'dimmed');
    
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
    
    refreshCancerBreadcrumb();
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
    tablePage = 1;
    
    // Use setTimeout to allow UI to update before heavy processing
    setTimeout(() => {
        const hasCancerSelection = selectedCancerTypes.length > 0;
        const lungSubtypeActive = isLungSubtypeFilterActive();
        filteredPatients = patients.filter(p => {
            if (hasCancerSelection && !selectedCancerTypes.includes(p.Cancer_Type)) {
                return false;
            }

            if (lungSubtypeActive && p.Lung_Subtype !== currentLungSubtype) {
                return false;
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
