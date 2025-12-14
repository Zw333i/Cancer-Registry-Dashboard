/* ========================================
   CANCER REGISTRY DASHBOARD
   Event Listeners
   ======================================== */

// ==========================================
// EVENT LISTENERS
// ==========================================
function initEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Load saved theme on init
    loadSavedTheme();
    
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    const footer = document.querySelector('.dashboard-footer');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
            sidebarToggle.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
            if (footer) footer.classList.toggle('expanded');
        });
    }
    
    // Body diagram organ regions
    document.querySelectorAll('.organ-region').forEach(region => {
        region.addEventListener('click', handleOrganClick);
        region.addEventListener('mouseenter', handleOrganHover);
        region.addEventListener('mousemove', handleOrganMove);
        region.addEventListener('mouseleave', handleOrganLeave);
    });
    
    // All types button
    document.querySelectorAll('.organ-btn').forEach(btn => {
        btn.addEventListener('click', handleOrganBtnClick);
    });
    
    // Lung subfilter
    document.querySelectorAll('.subfilter-btn').forEach(btn => {
        btn.addEventListener('click', handleLungSubfilter);
    });
    
    // Survival slider
    const slider = document.getElementById('survivalSlider');
    if (slider) {
        slider.addEventListener('input', handleSliderChange);
    }
    
    // Stage checkboxes
    document.querySelectorAll('.stage-checkbox').forEach(cb => {
        cb.addEventListener('change', handleStageFilter);
    });
    
    // Reset button
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
    
    // Patient spotlight controls
    const prevBtn = document.getElementById('prevPatient');
    const nextBtn = document.getElementById('nextPatient');
    const shuffleBtn = document.getElementById('shufflePatient');
    if (prevBtn) prevBtn.addEventListener('click', () => navigatePatient(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigatePatient(1));
    if (shuffleBtn) shuffleBtn.addEventListener('click', shufflePatient);
    
    // Clickable patient stats
    document.querySelectorAll('.clickable-stat').forEach(stat => {
        stat.addEventListener('click', handleStatClick);
    });
    
    // Clickable patient tags
    document.querySelectorAll('.patient-tags .tag').forEach(tag => {
        tag.style.cursor = 'pointer';
        tag.addEventListener('click', handleTagClick);
    });
    
    // Hero card hover effects
    document.querySelectorAll('.hero-card').forEach(card => {
        card.addEventListener('mousemove', handleCardTilt);
        card.addEventListener('mouseleave', resetCardTilt);
        card.addEventListener('click', handleHeroCardClick);
    });
    
    // Modal close button
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Curve stats are clickable
    document.querySelectorAll('.curve-stat').forEach(stat => {
        stat.style.cursor = 'pointer';
        stat.addEventListener('click', handleCurveStatClick);
    });
    
    // Export CSV button
    const exportBtn = document.getElementById('exportCSV');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportToCSV);
    }
    
    // Comparison mode toggle
    const comparisonToggle = document.getElementById('comparisonModeToggle');
    if (comparisonToggle) {
        comparisonToggle.addEventListener('change', toggleComparisonMode);
    }
    
    // Comparison select dropdowns - auto-compare when both selected
    const compareType1 = document.getElementById('compareType1');
    const compareType2 = document.getElementById('compareType2');
    if (compareType1) {
        compareType1.addEventListener('change', checkAndRunComparison);
    }
    if (compareType2) {
        compareType2.addEventListener('change', checkAndRunComparison);
    }
    
    // Close comparison button
    const closeComparisonBtn = document.getElementById('closeComparison');
    if (closeComparisonBtn) {
        closeComparisonBtn.addEventListener('click', closeComparison);
    }
    
    // Chart card click handlers for interpretations (on header or info icon, not the canvas)
    document.querySelector('.chart-doughnut .chart-header')?.addEventListener('click', showDistributionInterpretation);
    document.querySelector('.chart-stage .chart-header')?.addEventListener('click', showStageInterpretation);
    document.querySelector('.survival-section .chart-header')?.addEventListener('click', showSurvivalInterpretation);
    document.querySelector('.bubble-card .chart-header')?.addEventListener('click', showBubbleInterpretation);
    
    // Status pills (Alive/Deceased) click handlers
    const alivePill = document.getElementById('alivePill');
    const deceasedPill = document.getElementById('deceasedPill');
    if (alivePill) {
        alivePill.addEventListener('click', () => toggleStatusFilter('Alive'));
    }
    if (deceasedPill) {
        deceasedPill.addEventListener('click', () => toggleStatusFilter('Deceased'));
    }
}

// ==========================================
// ORGAN TOOLTIP HANDLERS
// ==========================================
function handleOrganHover(e) {
    const region = e.currentTarget;
    const cancer = region.dataset.cancer;
    const tooltip = document.getElementById('organTooltip');
    
    // Get patient count for this cancer type
    const count = patients.filter(p => p.Cancer_Type === cancer).length;
    tooltip.textContent = `${cancer} (${count} patients)`;
    tooltip.classList.add('visible');
}

function handleOrganMove(e) {
    const tooltip = document.getElementById('organTooltip');
    const container = document.querySelector('.body-diagram-container');
    const containerRect = container.getBoundingClientRect();
    
    // Position tooltip relative to the container
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;
    
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y + 20}px`;
}

function handleOrganLeave() {
    const tooltip = document.getElementById('organTooltip');
    tooltip.classList.remove('visible');
}

// ==========================================
// INTERACTIVE ELEMENT HANDLERS
// ==========================================
function handleStatClick(e) {
    const stat = e.currentTarget.dataset.stat;
    if (stat === 'duration') {
        showToast('info', 'Survival Duration', `This patient has survived ${document.getElementById('patientDuration').textContent}`);
    } else if (stat === 'prognosis') {
        const prognosis = document.getElementById('patientPrognosis').textContent;
        const message = prognosis.startsWith('+') 
            ? 'This patient is doing better than average!' 
            : 'This patient\'s survival is below average for their cancer type.';
        showToast('info', 'Prognosis Comparison', message);
    }
}

function handleTagClick(e) {
    const tag = e.currentTarget;
    const tagId = tag.id;
    
    if (tagId === 'patientCancerTag') {
        const cancer = tag.textContent.split(' (')[0]; // Handle "Lung (Adenocarcinoma)"
        if (cancer && cancer !== '--') {
            selectCancerType(cancer);
        }
    } else if (tagId === 'patientStageTag') {
        const stage = tag.textContent;
        if (stage && stage !== '--') {
            // Toggle this stage filter
            const checkbox = document.querySelector(`.stage-checkbox[value="${stage}"]`);
            if (checkbox) {
                // Uncheck all, check only this one
                document.querySelectorAll('.stage-checkbox').forEach(cb => cb.checked = false);
                checkbox.checked = true;
                handleStageFilter();
                showToast('info', 'Stage Filter', `Showing only ${stage} patients`);
            }
        }
    } else if (tagId === 'patientStatusTag') {
        const status = tag.textContent;
        showToast('info', 'Patient Status', `This patient is currently ${status}`);
    }
}

function handleHeroCardClick(e) {
    const card = e.currentTarget;
    if (card.classList.contains('card-patients')) {
        // Scroll to patient records table
        document.querySelector('.table-card').scrollIntoView({ behavior: 'smooth' });
        showToast('info', 'Patient Records', 'Scrolling to patient data table');
    } else if (card.classList.contains('card-survival')) {
        // Open survival rate modal
        openSurvivalRateModal();
    } else if (card.classList.contains('card-time')) {
        // Open average survival per type modal
        openAvgSurvivalModal();
    } else if (card.classList.contains('card-critical')) {
        // Open critical watch modal (ranked by survival rate)
        openCriticalWatchModal();
    }
}

function handleCurveStatClick(e) {
    const stat = e.currentTarget;
    const label = stat.querySelector('.stat-label').textContent;
    const value = stat.querySelector('.stat-value').textContent;
    
    let months = 12;
    if (label === '3-Year') months = 36;
    if (label === '5-Year') months = 60;
    
    // Toggle: if clicking same filter, reset to 0
    if (currentSurvivalYearFilter === months) {
        // Reset filter
        currentSurvivalYearFilter = null;
        document.getElementById('survivalSlider').value = 0;
        handleSliderChange({ target: { value: 0 } });
        
        // Remove active state from all curve stats
        document.querySelectorAll('.curve-stat').forEach(s => s.classList.remove('active'));
        
        showToast('info', 'Filter Reset', 'Showing all patients');
    } else {
        // Apply filter
        currentSurvivalYearFilter = months;
        document.getElementById('survivalSlider').value = months;
        handleSliderChange({ target: { value: months } });
        
        // Update active state
        document.querySelectorAll('.curve-stat').forEach(s => s.classList.remove('active'));
        stat.classList.add('active');
        
        showToast('info', `${label} Survival`, `${value} of patients survived ${months} months or more`);
    }
}

// ==========================================
// CARD TILT EFFECT
// ==========================================
function handleCardTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
}

function resetCardTilt(e) {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
}

// ==========================================
// THEME TOGGLE
// ==========================================
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Show toast notification
    const themeName = newTheme === 'light' ? 'Light Mode' : 'Dark Mode';
    const icon = newTheme === 'light' ? '☀️' : '🌙';
    showToast('info', `${icon} ${themeName}`, 'Theme switched successfully');
    
    // Update charts to match new theme
    updateChartsTheme();
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
}

function updateChartsTheme() {
    // Get the current theme colors
    const style = getComputedStyle(document.documentElement);
    const textColor = style.getPropertyValue('--text-primary').trim();
    const textSecondary = style.getPropertyValue('--text-secondary').trim();
    const gridColor = style.getPropertyValue('--border-color').trim();
    
    // Update all Chart.js charts
    Object.values(charts).forEach(chart => {
        if (chart && chart.options) {
            // Update scale colors
            if (chart.options.scales) {
                Object.values(chart.options.scales).forEach(scale => {
                    if (scale.ticks) scale.ticks.color = textSecondary;
                    if (scale.grid) scale.grid.color = gridColor;
                    if (scale.title) scale.title.color = textSecondary;
                });
            }
            // Update legend colors
            if (chart.options.plugins && chart.options.plugins.legend) {
                chart.options.plugins.legend.labels.color = textSecondary;
            }
            chart.update('none');
        }
    });
}
