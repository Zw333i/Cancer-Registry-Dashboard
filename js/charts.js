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
                    // Toggle: if already filtered to this cancer, reset to all
                    if (currentCancerFilter === cancer) {
                        selectCancerType('all');
                    } else {
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
    
    charts.survival = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['0', '12', '24', '36', '48', '60', '72', '84', '96', '108', '120'],
            datasets: [{
                label: 'Survival Rate',
                data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
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
    
    // Update survival curve - Kaplan-Meier style
    const timePoints = [0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120];
    const survivalData = timePoints.map(months => {
        if (filteredPatients.length === 0) return 100;
        
        // Count patients who either:
        // 1. Are alive and have survival >= months, OR
        // 2. Are deceased but survived at least this many months
        const atRisk = filteredPatients.filter(p => {
            const survivalMonths = parseFloat(p.Survival_Months) || 0;
            return survivalMonths >= months || (p.Status === 'Alive' && survivalMonths >= months);
        }).length;
        
        // For month 0, everyone is at 100%
        if (months === 0) return 100;
        
        // Calculate what percentage made it to this time point
        const survived = filteredPatients.filter(p => {
            const survivalMonths = parseFloat(p.Survival_Months) || 0;
            // Patient is still being followed at this time point
            return survivalMonths >= months;
        }).length;
        
        return (survived / filteredPatients.length) * 100;
    });
    
    charts.survival.data.datasets[0].data = survivalData;
    charts.survival.update();
    
    // Update bubble chart
    updateBubbleChart();
}

function updateBubbleChart() {
    if (!charts.bubble) return;
    
    const cancerTypes = ['Breast', 'Lung', 'Colon', 'Prostate', 'Liver', 'Stomach', 'Pancreas', 'Ovarian'];
    const stages = ['Stage I', 'Stage II', 'Stage III', 'Stage IV'];
    const stageMap = { 'Stage I': 1, 'Stage II': 2, 'Stage III': 3, 'Stage IV': 4 };
    
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
                    
                    dataPoints.push({
                        x: Math.min(avgSurvival, 120), // Cap at 120 months
                        y: stageMap[stage],
                        count: stagePatients.length
                    });
                }
            });
        }
        
        charts.bubble.data.datasets[datasetIndex].data = dataPoints;
        charts.bubble.data.datasets[datasetIndex].hidden = !isSelected;
    });
    
    charts.bubble.update();
}
