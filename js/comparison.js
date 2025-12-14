/* ========================================
   CANCER REGISTRY DASHBOARD
   Comparison Mode
   ======================================== */

// ==========================================
// COMPARISON MODE
// ==========================================
function populateComparisonSelectors() {
    const select1 = document.getElementById('compareType1');
    const select2 = document.getElementById('compareType2');
    
    if (!select1 || !select2) return;
    
    const cancerTypes = ['Breast', 'Lung', 'Colon', 'Prostate', 'Liver', 'Stomach', 'Pancreas', 'Ovarian'];
    
    cancerTypes.forEach(type => {
        select1.innerHTML += `<option value="${type}">${type}</option>`;
        select2.innerHTML += `<option value="${type}">${type}</option>`;
    });
}

function toggleComparisonMode() {
    const toggle = document.getElementById('comparisonModeToggle');
    const selectors = document.getElementById('comparisonSelectors');
    
    isComparisonMode = toggle.checked;
    selectors.style.display = isComparisonMode ? 'flex' : 'none';
    
    if (!isComparisonMode) {
        closeComparison();
    } else {
        // Check if both selects already have valid values
        checkAndRunComparison();
    }
}

function checkAndRunComparison() {
    const type1 = document.getElementById('compareType1').value;
    const type2 = document.getElementById('compareType2').value;
    
    // Only run if both are selected and different
    if (type1 && type2 && type1 !== type2) {
        runComparison();
    } else if (type1 && type2 && type1 === type2) {
        // Hide comparison if same type selected
        const section = document.getElementById('comparisonSection');
        if (section) section.style.display = 'none';
    }
}

function runComparison() {
    const type1 = document.getElementById('compareType1').value;
    const type2 = document.getElementById('compareType2').value;
    
    // Silently return if conditions not met (auto-triggered)
    if (!type1 || !type2 || type1 === type2) {
        return;
    }
    
    // Get data for both types
    const data1 = patients.filter(p => p.Cancer_Type === type1);
    const data2 = patients.filter(p => p.Cancer_Type === type2);
    
    // Calculate stats
    const alive1 = data1.filter(p => p.Status === 'Alive').length;
    const alive2 = data2.filter(p => p.Status === 'Alive').length;
    const survival1 = data1.length > 0 ? ((alive1 / data1.length) * 100).toFixed(1) : 0;
    const survival2 = data2.length > 0 ? ((alive2 / data2.length) * 100).toFixed(1) : 0;
    
    const avgMonths1 = data1.length > 0 ? Math.round(data1.reduce((sum, p) => sum + (parseInt(p.Survival_Months) || 0), 0) / data1.length) : 0;
    const avgMonths2 = data2.length > 0 ? Math.round(data2.reduce((sum, p) => sum + (parseInt(p.Survival_Months) || 0), 0) / data2.length) : 0;
    
    // Update UI
    document.getElementById('comparisonTitle').textContent = `${type1} vs ${type2}`;
    document.getElementById('compareHeader1').innerHTML = `<span class="type-badge" style="background: linear-gradient(135deg, ${cancerColors[type1]}, ${cancerColors[type1]}dd)">${type1}</span>`;
    document.getElementById('compareHeader2').innerHTML = `<span class="type-badge" style="background: linear-gradient(135deg, ${cancerColors[type2]}, ${cancerColors[type2]}dd)">${type2}</span>`;
    
    document.getElementById('comp1Patients').textContent = data1.length;
    document.getElementById('comp1Survival').textContent = survival1 + '%';
    document.getElementById('comp1AvgMonths').textContent = avgMonths1;
    
    document.getElementById('comp2Patients').textContent = data2.length;
    document.getElementById('comp2Survival').textContent = survival2 + '%';
    document.getElementById('comp2AvgMonths').textContent = avgMonths2;
    
    // Generate insight
    const winner = parseFloat(survival1) > parseFloat(survival2) ? type1 : type2;
    const difference = Math.abs(parseFloat(survival1) - parseFloat(survival2)).toFixed(1);
    document.getElementById('insightText').textContent = `${winner} shows ${difference}% higher survival rate. Average survival differs by ${Math.abs(avgMonths1 - avgMonths2)} months.`;
    
    // Create comparison chart
    createComparisonChart(type1, type2, data1, data2);
    
    // Show section
    document.getElementById('comparisonSection').style.display = 'block';
    document.getElementById('comparisonSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function createComparisonChart(type1, type2, data1, data2) {
    const canvas = document.getElementById('comparisonChart');
    if (!canvas) return;
    
    // Destroy existing chart
    if (charts.comparison) {
        charts.comparison.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    
    // Generate survival curve data for each type
    const maxMonths = 120;
    const curve1 = generateSurvivalCurveData(data1, maxMonths);
    const curve2 = generateSurvivalCurveData(data2, maxMonths);
    
    charts.comparison = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 13 }, (_, i) => i * 10),
            datasets: [
                {
                    label: type1,
                    data: curve1,
                    borderColor: cancerColors[type1],
                    backgroundColor: `${cancerColors[type1]}20`,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: type2,
                    data: curve2,
                    borderColor: cancerColors[type2],
                    backgroundColor: `${cancerColors[type2]}20`,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Months',
                        color: '#64748b'
                    },
                    grid: { display: false },
                    ticks: { color: '#64748b' }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Survival %',
                        color: '#64748b'
                    },
                    min: 0,
                    max: 100,
                    grid: {
                        color: 'rgba(100, 116, 139, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#64748b',
                        callback: val => val + '%'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 20,
                        font: { size: 12, weight: 600 }
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
                        label: (context) => `${context.dataset.label}: ${context.raw.toFixed(1)}%`
                    }
                }
            }
        }
    });
}

function generateSurvivalCurveData(data, maxMonths) {
    const points = [];
    const intervals = 13; // 0, 10, 20, ..., 120
    
    for (let i = 0; i < intervals; i++) {
        const month = i * 10;
        const surviving = data.filter(p => {
            const survival = parseInt(p.Survival_Months) || 0;
            return survival >= month || p.Status === 'Alive';
        }).length;
        const percentage = data.length > 0 ? (surviving / data.length) * 100 : 0;
        points.push(percentage);
    }
    
    return points;
}

function closeComparison() {
    const section = document.getElementById('comparisonSection');
    if (section) {
        section.style.display = 'none';
    }
    
    // Destroy chart
    if (charts.comparison) {
        charts.comparison.destroy();
        charts.comparison = null;
    }
    
    // Turn off the comparison mode toggle
    const toggle = document.getElementById('comparisonModeToggle');
    if (toggle) {
        toggle.checked = false;
        isComparisonMode = false;
        const selectors = document.getElementById('comparisonSelectors');
        if (selectors) selectors.style.display = 'none';
    }
    
    // Reset the select dropdowns
    const select1 = document.getElementById('compareType1');
    const select2 = document.getElementById('compareType2');
    if (select1) select1.value = '';
    if (select2) select2.value = '';
}
