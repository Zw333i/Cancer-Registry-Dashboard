/* ========================================
   CANCER REGISTRY DASHBOARD
   Charts Initialization & Updates
   ======================================== */

// ==========================================
// CHARTS INITIALIZATION
// ==========================================
function initCharts() {
    Chart.defaults.font.family = "'Poppins', sans-serif";
    Chart.defaults.color = '#6b7280';
    
    try {
        initDoughnutChart();
        initStageChart();
        initAgeDiagnosisChart();
        initSurvivalAnalysisChart();
        initSurvivalCurve();
        initBubbleChart();
        populateComparisonSelectors();
        console.log('Charts initialized successfully');
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

function initDoughnutChart() {
    const canvas = document.getElementById('doughnutChart');
    if (!canvas) {
        console.error('Doughnut chart canvas not found');
        return;
    }
    const ctx = canvas.getContext('2d');
    
    charts.doughnut = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [],
                borderWidth: 0,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 15,
                        font: { size: 11 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8',
                    borderColor: 'rgba(6, 182, 212, 0.3)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    callbacks: {
                        label: (context) => {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            },
            onClick: (e, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const cancer = charts.doughnut.data.labels[index];
                    if (cancer) {
                        selectCancerType(cancer);
                    }
                }
            }
        }
    });
}

function initStageChart() {
    const canvas = document.getElementById('stageChart');
    if (!canvas) {
        console.error('Stage chart canvas not found');
        return;
    }
    const ctx = canvas.getContext('2d');
    
    charts.stage = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Stage I', 'Stage II', 'Stage III', 'Stage IV'],
            datasets: [
                {
                    label: 'Alive',
                    data: [0, 0, 0, 0],
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderRadius: 6,
                    barPercentage: 0.7
                },
                {
                    label: 'Deceased',
                    data: [0, 0, 0, 0],
                    backgroundColor: 'rgba(248, 113, 113, 0.8)',
                    borderRadius: 6,
                    barPercentage: 0.7
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    grid: { 
                        color: 'rgba(148, 163, 184, 0.1)',
                        drawBorder: false
                    },
                    ticks: { font: { size: 11 } }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 15,
                        font: { size: 11 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8',
                    borderColor: 'rgba(6, 182, 212, 0.3)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12
                }
            }
        }
    });
}

// ==========================================
// AGE AT DIAGNOSIS DISTRIBUTION CHART (Stacked Area)
// ==========================================
function initAgeDiagnosisChart() {
    const canvas = document.getElementById('ageDiagnosisChart');
    if (!canvas) {
        console.error('Age diagnosis chart canvas not found');
        return;
    }
    const ctx = canvas.getContext('2d');
    
    // Age group colors matching the legend - with more opacity for stacked effect
    const ageColors = {
        '10-30': 'rgba(139, 92, 246, 0.9)',   // Purple
        '31-50': 'rgba(6, 182, 212, 0.9)',    // Cyan
        '51-70': 'rgba(251, 191, 36, 0.9)',   // Amber
        '71-90': 'rgba(239, 68, 68, 0.9)'     // Red
    };
    
    charts.ageDiagnosis = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Cancer types
            datasets: [
                {
                    label: '71-90',
                    data: [],
                    backgroundColor: ageColors['71-90'],
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 2,
                    fill: 'origin',
                    tension: 0.4,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    pointBackgroundColor: 'rgba(239, 68, 68, 1)',
                    order: AGE_LAYER_ORDER['71-90']
                },
                {
                    label: '51-70',
                    data: [],
                    backgroundColor: ageColors['51-70'],
                    borderColor: 'rgba(251, 191, 36, 1)',
                    borderWidth: 2,
                    fill: 'origin',
                    tension: 0.4,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    pointBackgroundColor: 'rgba(251, 191, 36, 1)',
                    order: AGE_LAYER_ORDER['51-70']
                },
                {
                    label: '31-50',
                    data: [],
                    backgroundColor: ageColors['31-50'],
                    borderColor: 'rgba(6, 182, 212, 1)',
                    borderWidth: 2,
                    fill: 'origin',
                    tension: 0.4,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    pointBackgroundColor: 'rgba(6, 182, 212, 1)',
                    order: AGE_LAYER_ORDER['31-50']
                },
                {
                    label: '10-30',
                    data: [],
                    backgroundColor: ageColors['10-30'],
                    borderColor: 'rgba(139, 92, 246, 1)',
                    borderWidth: 2,
                    fill: 'origin',
                    tension: 0.4,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    pointBackgroundColor: 'rgba(139, 92, 246, 1)',
                    order: AGE_LAYER_ORDER['10-30']
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: false,
                    grid: { display: false },
                    ticks: { 
                        font: { size: 11, weight: '500' },
                        maxRotation: 45,
                        minRotation: 0
                    }
                },
                y: {
                    stacked: false,
                    beginAtZero: true,
                    grid: { 
                        color: 'rgba(148, 163, 184, 0.1)',
                        drawBorder: false
                    },
                    ticks: { 
                        font: { size: 11 },
                        stepSize: 10
                    },
                    title: {
                        display: true,
                        text: 'Number of Patients',
                        font: { size: 12, weight: '500' },
                        color: '#94a3b8'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Using custom legend in HTML
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8',
                    borderColor: 'rgba(6, 182, 212, 0.3)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: (context) => {
                            return `Age ${context.dataset.label}: ${context.raw} patients`;
                        }
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            }
        }
    });
}

// ==========================================
// SURVIVAL RATE BY CANCER TYPE & STAGE CHART
// ==========================================
function initSurvivalAnalysisChart() {
    const canvas = document.getElementById('survivalAnalysisChart');
    if (!canvas) {
        console.error('Survival analysis chart canvas not found');
        return;
    }
    const ctx = canvas.getContext('2d');
    
    // Stage colors matching the legend
    const stageChartColors = {
        'Stage I': 'rgba(16, 185, 129, 0.85)',    // Green
        'Stage II': 'rgba(251, 191, 36, 0.85)',   // Yellow/Amber
        'Stage III': 'rgba(251, 146, 60, 0.85)',  // Orange
        'Stage IV': 'rgba(239, 68, 68, 0.85)'     // Red
    };
    
    charts.survivalAnalysis = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [], // Cancer types
            datasets: [
                {
                    label: 'Stage I',
                    data: [],
                    backgroundColor: stageChartColors['Stage I'],
                    borderRadius: 4,
                    barPercentage: 0.85,
                    categoryPercentage: 0.8
                },
                {
                    label: 'Stage II',
                    data: [],
                    backgroundColor: stageChartColors['Stage II'],
                    borderRadius: 4,
                    barPercentage: 0.85,
                    categoryPercentage: 0.8
                },
                {
                    label: 'Stage III',
                    data: [],
                    backgroundColor: stageChartColors['Stage III'],
                    borderRadius: 4,
                    barPercentage: 0.85,
                    categoryPercentage: 0.8
                },
                {
                    label: 'Stage IV',
                    data: [],
                    backgroundColor: stageChartColors['Stage IV'],
                    borderRadius: 4,
                    barPercentage: 0.85,
                    categoryPercentage: 0.8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { 
                        font: { size: 11, weight: '500' },
                        maxRotation: 45,
                        minRotation: 0
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { 
                        color: 'rgba(148, 163, 184, 0.1)',
                        drawBorder: false
                    },
                    ticks: { 
                        font: { size: 11 },
                        callback: (value) => value + '%'
                    },
                    title: {
                        display: true,
                        text: 'Survival Rate (%)',
                        font: { size: 12, weight: '500' },
                        color: '#94a3b8'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Using custom legend in HTML
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8',
                    borderColor: 'rgba(6, 182, 212, 0.3)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    callbacks: {
                        title: (context) => {
                            return context[0].label + ' Cancer';
                        },
                        label: (context) => {
                            const stage = context.dataset.label;
                            const displayValue = context.raw;
                            // Check if this was a 0% shown as 2
                            const actualRate = displayValue === 2 ? 0 : displayValue;
                            if (actualRate === null || actualRate === undefined) {
                                return `${stage}: No data`;
                            }
                            return `${stage}: ${actualRate.toFixed(1)}% survival`;
                        }
                    }
                }
            }
        }
    });
}

function initSurvivalCurve() {
    const canvas = document.getElementById('survivalCurve');
    if (!canvas) {
        console.error('Survival curve canvas not found');
        return;
    }
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(6, 182, 212, 0.3)');
    gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
    const survivalLabels = Array.from({ length: Math.floor(SURVIVAL_SLIDER_MAX / 12) + 1 }, (_, index) => String(index * 12));
    
    charts.survival = new Chart(ctx, {
        type: 'line',
        data: {
            labels: survivalLabels,
            datasets: [{
                label: 'Survival Rate',
                data: Array(survivalLabels.length).fill(100),
                borderColor: '#06b6d4',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#06b6d4',
                pointBorderColor: '#0a0f1a',
                pointBorderWidth: 2,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Months',
                        font: { size: 11, weight: '500' }
                    },
                    grid: { display: false },
                    ticks: { font: { size: 10 } }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Survival %',
                        font: { size: 11, weight: '500' }
                    },
                    min: 0,
                    max: 100,
                    grid: { 
                        color: 'rgba(148, 163, 184, 0.1)',
                        drawBorder: false
                    },
                    ticks: { 
                        font: { size: 10 },
                        callback: v => v + '%'
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8',
                    borderColor: 'rgba(6, 182, 212, 0.3)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    callbacks: {
                        title: (items) => `Month ${items[0].label}`,
                        label: (item) => `Survival: ${item.raw.toFixed(1)}%`
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            onClick: (event, elements, chart) => {
                if (!elements || elements.length === 0) return;
                const point = elements[0];
                const label = chart?.data?.labels?.[point.index];
                const months = parseInt(label, 10);
                if (!Number.isFinite(months)) return;
                const slider = document.getElementById('survivalSlider');
                if (!slider) return;
                slider.value = months;
                currentSurvivalYearFilter = null;
                document.querySelectorAll('.curve-stat').forEach(stat => stat.classList.remove('active'));
                handleSliderChange({ target: slider });
                setTimeout(() => {
                    document.querySelector('.table-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 400);
            }
        }
    });
}

function createOrganIcon(type, size = 28) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const color = bubbleCancerIcons[type].color;
    
    // Draw background circle
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw simplified organ shape
    ctx.save();
    ctx.translate(size/2 - 12, size/2 - 12);
    ctx.scale(1, 1);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Draw organ based on type
    const path = new Path2D(organSVGPaths[type]);
    ctx.stroke(path);
    ctx.restore();
    
    return canvas;
}

function initBubbleChart() {
    const canvas = document.getElementById('bubbleChart');
    if (!canvas) {
        console.error('Bubble chart canvas not found');
        return;
    }
    const ctx = canvas.getContext('2d');
    
    // Create custom point images for each cancer type
    const cancerImages = {};
    const cancerTypes = ['Breast', 'Lung', 'Colon', 'Prostate', 'Liver', 'Stomach', 'Pancreas', 'Ovarian'];
    
    cancerTypes.forEach(type => {
        cancerImages[type] = createOrganIcon(type, 28);
    });
    
    charts.bubble = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: cancerTypes.map(type => ({
                label: type,
                data: [],
                backgroundColor: bubbleCancerIcons[type].color,
                borderColor: 'rgba(255,255,255,0.6)',
                borderWidth: 2,
                pointRadius: 14,
                pointHoverRadius: 18,
                pointStyle: cancerImages[type],
                hidden: false
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Average Survival (Months)',
                        font: { size: 11, weight: '500' },
                        color: '#94a3b8'
                    },
                    min: 0,
                    max: 120,
                    ticks: {
                        stepSize: 12,
                        callback: function(value) {
                            return value;
                        },
                        font: { size: 9 },
                        color: '#64748b'
                    },
                    grid: { 
                        color: 'rgba(148, 163, 184, 0.1)',
                        drawBorder: false
                    }
                },
                y: {
                    title: {
                        display: false
                    },
                    min: 0.5,
                    max: 4.5,
                    afterFit: function(scaleInstance) {
                        scaleInstance.width = 0;
                    },
                    ticks: {
                        display: false
                    },
                    grid: { 
                        color: 'rgba(148, 163, 184, 0.1)',
                        drawBorder: false
                    },
                    reverse: false
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8',
                    borderColor: 'rgba(6, 182, 212, 0.3)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    callbacks: {
                        title: function(items) {
                            return items[0].dataset.label;
                        },
                        label: function(context) {
                            const stage = ['', 'Stage I', 'Stage II', 'Stage III', 'Stage IV'][context.raw.y];
                            const survival = context.raw.x.toFixed(1);
                            const count = context.raw.count || 0;
                            return [`${stage}`, `Avg Survival: ${survival} months`, `Patients: ${count}`];
                        }
                    }
                }
            },
            onClick: (e, elements) => {
                if (elements.length > 0) {
                    const cancer = charts.bubble.data.datasets[elements[0].datasetIndex].label;
                    if (cancer) {
                        // Toggle behavior: if already filtered to this type, reset to all
                        if (selectedBubbleTypes.length === 1 && selectedBubbleTypes[0] === cancer) {
                            // Reset to all types
                            selectedBubbleTypes = ['Breast', 'Lung', 'Colon', 'Prostate', 'Liver', 'Stomach', 'Pancreas', 'Ovarian'];
                            updateBubbleCheckboxes();
                            selectCancerType('all');
                        } else {
                            // Filter to this type only
                            selectedBubbleTypes = [cancer];
                            updateBubbleCheckboxes();
                            selectCancerType(cancer);
                        }
                    }
                }
            }
        }
    });
    
    // Initialize dropdown handlers
    initBubbleFilterDropdown();
}

function initBubbleFilterDropdown() {
    const toggle = document.getElementById('bubbleFilterToggle');
    const menu = document.getElementById('bubbleFilterMenu');
    const checkboxes = document.querySelectorAll('.bubble-type-checkbox');
    
    if (!toggle || !menu) return;
    
    // Toggle dropdown
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
    });
    
    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            toggle.classList.remove('active');
            menu.classList.remove('active');
        }
    });
    
    // Handle checkbox changes
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            selectedBubbleTypes = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            
            // Update toggle text
            if (selectedBubbleTypes.length === 8) {
                toggle.querySelector('span').textContent = 'All Types';
            } else if (selectedBubbleTypes.length === 0) {
                toggle.querySelector('span').textContent = 'None';
            } else if (selectedBubbleTypes.length <= 2) {
                toggle.querySelector('span').textContent = selectedBubbleTypes.join(', ');
            } else {
                toggle.querySelector('span').textContent = `${selectedBubbleTypes.length} Types`;
            }
            
            updateBubbleChart();
        });
    });
}

// ==========================================
// CHARTS UPDATE
// ==========================================
function updateCharts() {
    if (!charts.doughnut || !charts.stage || !charts.survival || !charts.bubble) {
        console.warn('Charts not yet initialized');
        return;
    }
    
    // Update doughnut chart
    const cancerCounts = {};
    filteredPatients.forEach(p => {
        cancerCounts[p.Cancer_Type] = (cancerCounts[p.Cancer_Type] || 0) + 1;
    });
    
    const labels = Object.keys(cancerCounts);
    const data = Object.values(cancerCounts);
    const colors = labels.map(c => cancerColors[c] || '#888');
    
    charts.doughnut.data.labels = labels;
    charts.doughnut.data.datasets[0].data = data;
    charts.doughnut.data.datasets[0].backgroundColor = colors;
    charts.doughnut.update('none');
    
    // Update stage chart
    const stageData = {
        'Stage I': { alive: 0, deceased: 0 },
        'Stage II': { alive: 0, deceased: 0 },
        'Stage III': { alive: 0, deceased: 0 },
        'Stage IV': { alive: 0, deceased: 0 }
    };
    
    filteredPatients.forEach(p => {
        if (stageData[p.Stage]) {
            if (p.Status === 'Alive') {
                stageData[p.Stage].alive++;
            } else {
                stageData[p.Stage].deceased++;
            }
        }
    });
    
    charts.stage.data.datasets[0].data = Object.values(stageData).map(s => s.alive);
    charts.stage.data.datasets[1].data = Object.values(stageData).map(s => s.deceased);
    charts.stage.update();
    
    // Update survival curve - adjust axis to filter range and observed max
    const survivalMonths = filteredPatients.map(p => parseFloat(p.Survival_Months) || 0);
    const observedMax = survivalMonths.length > 0 ? Math.max(...survivalMonths) : 0;
    const paddedMax = Math.max(SURVIVAL_SLIDER_MAX, Math.ceil(observedMax / 12) * 12);
    const basePoints = [];
    for (let month = 0; month <= paddedMax; month += 12) {
        basePoints.push(month);
    }
    if (!basePoints.includes(currentSurvivalMin)) {
        basePoints.push(currentSurvivalMin);
    }
    basePoints.sort((a, b) => a - b);

    const survivalSeries = basePoints.map(months => {
        if (filteredPatients.length === 0) return 0;
        const survivors = filteredPatients.filter(p => {
            const monthsSurvived = parseFloat(p.Survival_Months) || 0;
            return monthsSurvived >= months;
        }).length;
        return (survivors / filteredPatients.length) * 100;
    });

    const visiblePoints = basePoints.filter(month => month >= currentSurvivalMin);
    const visibleSeries = survivalSeries.filter((_, index) => basePoints[index] >= currentSurvivalMin);

    charts.survival.data.labels = (visiblePoints.length ? visiblePoints : [0]).map(value => `${value}`);
    charts.survival.data.datasets[0].data = visibleSeries.length ? visibleSeries : [0];
    charts.survival.update();
    
    // Update survival analysis chart (cancer type x stage)
    updateSurvivalAnalysisChart();
    
    // Update age at diagnosis chart
    updateAgeDiagnosisChart();
    
    // Update bubble chart
    updateBubbleChart();
}

// ==========================================
// SURVIVAL ANALYSIS CHART UPDATE
// ==========================================
function updateSurvivalAnalysisChart() {
    if (!charts.survivalAnalysis) return;
    
    // Get unique cancer types from filtered data
    const cancerTypes = [...new Set(filteredPatients.map(p => p.Cancer_Type))].sort();
    const stages = ['Stage I', 'Stage II', 'Stage III', 'Stage IV'];
    
    // Calculate survival rate for each cancer type and stage combination
    const survivalRates = {};
    
    cancerTypes.forEach(cancer => {
        survivalRates[cancer] = {};
        stages.forEach(stage => {
            const patients = filteredPatients.filter(p => 
                p.Cancer_Type === cancer && p.Stage === stage
            );
            
            if (patients.length > 0) {
                const alive = patients.filter(p => p.Status === 'Alive').length;
                survivalRates[cancer][stage] = (alive / patients.length) * 100;
            } else {
                survivalRates[cancer][stage] = null; // No data
            }
        });
    });
    
    // Update chart data - show 0% as small visible bar (2) for visibility
    charts.survivalAnalysis.data.labels = cancerTypes;
    
    // Store original rates for tooltip
    charts.survivalAnalysis.originalRates = survivalRates;
    
    stages.forEach((stage, index) => {
        charts.survivalAnalysis.data.datasets[index].data = cancerTypes.map(cancer => {
            const rate = survivalRates[cancer][stage];
            if (rate === null) return null;
            // Show 0% as small bar (2) for visibility, but store actual value
            return rate === 0 ? 2 : rate;
        });
    });
    
    charts.survivalAnalysis.update();
}

// ==========================================
// AGE AT DIAGNOSIS CHART UPDATE
// ==========================================
function updateAgeDiagnosisChart() {
    if (!charts.ageDiagnosis) return;
    
    // Get unique cancer types from filtered data
    const cancerTypes = [...new Set(filteredPatients.map(p => p.Cancer_Type))].sort();
    
    const ageGroups = AGE_GROUPS || ['10-30', '31-50', '51-70', '71-90'];
    const groupTotals = ageGroups.reduce((acc, group) => ({ ...acc, [group]: 0 }), {});
    let grandTotal = 0;
    
    // Calculate count for each cancer type and age group
    const ageData = {};
    cancerTypes.forEach(cancer => {
        ageData[cancer] = {
            '10-30': 0,
            '31-50': 0,
            '51-70': 0,
            '71-90': 0
        };
    });
    
    filteredPatients.forEach(patient => {
        const cancer = patient.Cancer_Type;
        const ageGroup = getAgeGroupFromValue(patient.Age);
        if (!ageGroup || !ageData[cancer]) return;
        ageData[cancer][ageGroup]++;
        groupTotals[ageGroup]++;
        grandTotal++;
    });

    const shareElements = {
        '10-30': document.getElementById('ageShare10_30'),
        '31-50': document.getElementById('ageShare31_50'),
        '51-70': document.getElementById('ageShare51_70'),
        '71-90': document.getElementById('ageShare71_90')
    };
    const emptyState = document.getElementById('ageDiagnosisEmpty');
    const ageCanvas = document.getElementById('ageDiagnosisChart');
    const shouldShowEmpty = !hasAgeData || grandTotal === 0;

    if (emptyState && ageCanvas) {
        if (shouldShowEmpty) {
            emptyState.textContent = hasAgeData 
                ? 'No age data is available for the current filters.'
                : 'Age data is unavailable for this dataset.';
            emptyState.removeAttribute('hidden');
            ageCanvas.style.display = 'none';
        } else {
            emptyState.setAttribute('hidden', '');
            ageCanvas.style.display = '';
        }
    }

    if (shouldShowEmpty) {
        charts.ageDiagnosis.data.labels = [];
        charts.ageDiagnosis.data.datasets.forEach(dataset => dataset.data = []);
        Object.values(shareElements).forEach(element => {
            if (element) {
                element.textContent = '0%';
                element.setAttribute('title', '0 patients');
            }
        });
        charts.ageDiagnosis.update('none');
        return;
    }
    
    // Update chart data
    charts.ageDiagnosis.data.labels = cancerTypes;
    
    const reversedAgeGroups = [...ageGroups].reverse();
    reversedAgeGroups.forEach((group, index) => {
        const dataset = charts.ageDiagnosis.data.datasets[index];
        dataset.data = cancerTypes.map(cancer => (ageData[cancer] ? ageData[cancer][group] : 0));
        dataset.order = AGE_LAYER_ORDER[group] ?? index + 1;
    });
    
    // Update legend share badges
    ageGroups.forEach(group => {
        if (!shareElements[group]) return;
        if (grandTotal === 0) {
            shareElements[group].textContent = '0%';
            shareElements[group].setAttribute('title', '0 patients');
            return;
        }
        const share = Math.round((groupTotals[group] / grandTotal) * 100);
        shareElements[group].textContent = `${share}%`;
        shareElements[group].setAttribute('title', `${groupTotals[group]} patients`);
    });

    charts.ageDiagnosis.update();
}

function updateBubbleChart() {
    if (!charts.bubble) return;
    
    const cancerTypes = ['Breast', 'Lung', 'Colon', 'Prostate', 'Liver', 'Stomach', 'Pancreas', 'Ovarian'];
    const stages = ['Stage I', 'Stage II', 'Stage III', 'Stage IV'];
    const stageMap = { 'Stage I': 1, 'Stage II': 2, 'Stage III': 3, 'Stage IV': 4 };
    let maxAvgSurvival = 0;
    let chartHasData = false;
    
    // Update each dataset (one per cancer type)
    cancerTypes.forEach((cancer, datasetIndex) => {
        const dataPoints = [];
        const isSelected = selectedBubbleTypes.includes(cancer);
        
        if (isSelected) {
            stages.forEach(stage => {
                const stagePatients = filteredPatients.filter(p => 
                    p.Cancer_Type === cancer && p.Stage === stage
                );
                
                if (stagePatients.length > 0) {
                    const avgSurvival = stagePatients.reduce((sum, p) => 
                        sum + (parseFloat(p.Survival_Months) || 0), 0
                    ) / stagePatients.length;
                    chartHasData = true;
                    if (avgSurvival > maxAvgSurvival) {
                        maxAvgSurvival = avgSurvival;
                    }
                    dataPoints.push({
                        x: avgSurvival,
                        y: stageMap[stage],
                        count: stagePatients.length
                    });
                }
            });
        }
        
        charts.bubble.data.datasets[datasetIndex].data = dataPoints;
        charts.bubble.data.datasets[datasetIndex].hidden = !isSelected;
    });
    
    const xScale = charts.bubble.options?.scales?.x;
    if (xScale) {
        const paddedMax = chartHasData
            ? Math.max(120, Math.ceil((maxAvgSurvival + 6) / 6) * 6)
            : 120;
        const minRange = currentSurvivalMin > 0 ? currentSurvivalMin : 0;
        xScale.max = Math.max(paddedMax, minRange + 6);
        xScale.min = minRange;
    }
    
    charts.bubble.update();
}
