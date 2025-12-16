/* ========================================
   CANCER REGISTRY DASHBOARD
   Modal Functions & Chart Interpretations
   ======================================== */

const MODAL_ICONS = {
    chart: '<span class="modal-inline-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="10" width="4" height="9" rx="1"/><rect x="10" y="6" width="4" height="13" rx="1"/><rect x="17" y="3" width="4" height="16" rx="1"/></svg></span>',
    list: '<span class="modal-inline-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg></span>',
    bulb: '<span class="modal-inline-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12c.5.6 1 1.6 1 2.5V17h6v-.5c0-.9.5-1.9 1-2.5A7 7 0 0 0 12 2Z"/></svg></span>',
    alert: '<span class="modal-inline-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>',
    pointer: '<span class="modal-inline-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12s4-8 9-8 9 8 9 8-4 8-9 8-9-8-9-8Z"/><circle cx="12" cy="12" r="2.5"/></svg></span>',
    target: '<span class="modal-inline-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg></span>',
    trendUp: '<span class="modal-inline-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/></svg></span>',
    trendDown: '<span class="modal-inline-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 7 9 13 13 9 21 17"/><polyline points="14 17 21 17 21 10"/></svg></span>',
    document: '<span class="modal-inline-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M14 3v6h6"/></svg></span>',
    info: '<span class="modal-inline-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></span>'
};

const rankBadge = (index) => {
    if (index === 0) return '<span class="rank-badge gold" aria-hidden="true">1</span>';
    if (index === 1) return '<span class="rank-badge silver" aria-hidden="true">2</span>';
    if (index === 2) return '<span class="rank-badge bronze" aria-hidden="true">3</span>';
    return '';
};

// ==========================================
// MODAL FUNCTIONS
// ==========================================
function openModal(title, content) {
    const overlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    overlay.classList.add('active');
    
    // Close on click outside
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active');
}

// ==========================================
// HERO CARD MODALS
// ==========================================
function openSurvivalRateModal() {
    const total = filteredPatients.length;
    const alive = filteredPatients.filter(p => p.Status === 'Alive').length;
    const rate = total > 0 ? ((alive / total) * 100).toFixed(1) : 0;
    
    // Calculate survival rates per cancer type
    const cancerTypes = [...new Set(filteredPatients.map(p => p.Cancer_Type))];
    const cancerData = cancerTypes.map(type => {
        const typePatients = filteredPatients.filter(p => p.Cancer_Type === type);
        const typeAlive = typePatients.filter(p => p.Status === 'Alive').length;
        const typeRate = typePatients.length > 0 ? ((typeAlive / typePatients.length) * 100).toFixed(1) : 0;
        return { type, alive: typeAlive, total: typePatients.length, rate: parseFloat(typeRate) };
    }).sort((a, b) => b.rate - a.rate);
    
    let cancerRows = '';
    cancerData.forEach(data => {
        const rateColor = data.rate >= parseFloat(rate) ? '#34d399' : '#f87171';
        const indicator = data.rate < parseFloat(rate) ? MODAL_ICONS.trendDown : MODAL_ICONS.trendUp;
        cancerRows += `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 8px;"><strong>${data.type}</strong></td>
                <td style="text-align: center; padding: 8px;">${data.alive}/${data.total}</td>
                <td style="text-align: center; padding: 8px; color: ${rateColor}; display: flex; align-items: center; justify-content: center; gap: 6px;"><strong>${data.rate}%</strong> ${indicator}</td>
            </tr>`;
    });
    
    const content = `
        <div class="interpretation-content">
            <div class="interpretation-highlight">
                <h4>${MODAL_ICONS.chart}Overall Survival Rate</h4>
                <p style="font-size: 2rem; color: var(--color-alive); font-weight: 700;">${rate}%</p>
                <p>${alive} alive out of ${total} patients</p>
            </div>
            
            <div class="interpretation-highlight">
                <h4>${MODAL_ICONS.list}Survival Rate by Cancer Type</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">Sorted by highest survival rate</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <th style="text-align: left; padding: 8px; color: var(--text-muted);">Cancer Type</th>
                        <th style="text-align: center; padding: 8px; color: var(--text-muted);">Alive/Total</th>
                        <th style="text-align: center; padding: 8px; color: var(--text-muted);">Rate</th>
                    </tr>
                    ${cancerRows}
                </table>
            </div>
            
            <div class="tip-box">
                <span class="tip-icon">${MODAL_ICONS.bulb}</span>
                <p>Up icon = above average | Down icon = below average survival rate. Click cancer types in the sidebar to filter.</p>
            </div>
        </div>
    `;
    
    openModal('Survival Rate by Cancer Type', content);
}

function openAvgSurvivalModal() {
    const total = filteredPatients.length;
    const avgMonths = total > 0 
        ? (filteredPatients.reduce((sum, p) => sum + (parseFloat(p.Survival_Months) || 0), 0) / total).toFixed(1)
        : 0;
    const avgYears = (avgMonths / 12).toFixed(1);
    
    // Calculate average survival per cancer type
    const cancerTypes = [...new Set(filteredPatients.map(p => p.Cancer_Type))];
    const cancerData = cancerTypes.map(type => {
        const typePatients = filteredPatients.filter(p => p.Cancer_Type === type);
        const typeAvg = typePatients.length > 0 
            ? typePatients.reduce((sum, p) => sum + (parseFloat(p.Survival_Months) || 0), 0) / typePatients.length
            : 0;
        return { type, avgMonths: typeAvg, avgYears: (typeAvg / 12).toFixed(1), count: typePatients.length };
    }).sort((a, b) => b.avgMonths - a.avgMonths);
    
    // Determine hope level based on average survival
    let hopeIcon = MODAL_ICONS.trendUp;
    let hopeText = 'Strong Hope';
    let hopeColor = '#34d399';
    if (avgMonths < 24) {
        hopeIcon = MODAL_ICONS.info;
        hopeText = 'Fighting Spirit';
        hopeColor = '#fbbf24';
    } else if (avgMonths < 12) {
        hopeIcon = MODAL_ICONS.alert;
        hopeText = 'Courage Required';
        hopeColor = '#f87171';
    }
    
    let cancerRows = '';
    cancerData.forEach((data, index) => {
        const barWidth = Math.min((data.avgMonths / Math.max(...cancerData.map(d => d.avgMonths))) * 100, 100);
        cancerRows += `
            <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span>${rankBadge(index)} <strong>${data.type}</strong></span>
                    <span style="color: var(--text-accent);">${data.avgMonths.toFixed(1)}mo (${data.avgYears}yr)</span>
                </div>
                <div style="background: rgba(255,255,255,0.1); border-radius: 4px; height: 8px; overflow: hidden;">
                    <div style="background: var(--gradient-main); width: ${barWidth}%; height: 100%; border-radius: 4px;"></div>
                </div>
            </div>`;
    });
    
    const content = `
        <div class="interpretation-content">
            <div class="interpretation-highlight">
                <h4>${hopeIcon}${hopeText} Indicator</h4>
                <p style="font-size: 2rem; color: ${hopeColor}; font-weight: 700;">${avgMonths} months</p>
                <p>Average survival time across ${total} patients (~${avgYears} years)</p>
            </div>
            
            <div class="interpretation-highlight">
                <h4>${MODAL_ICONS.list}Average Survival by Cancer Type</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">Ranked from longest to shortest survival</p>
                ${cancerRows}
            </div>
            
            <div class="tip-box">
                <span class="tip-icon">${MODAL_ICONS.bulb}</span>
                <p>Use the survival slider to filter patients by minimum survival duration.</p>
            </div>
        </div>
    `;
    
    openModal('Hope Indicator - Average Survival', content);
}

function openCriticalWatchModal() {
    // Calculate overall average survival rate
    const totalAlive = filteredPatients.filter(p => p.Status === 'Alive').length;
    const overallRate = filteredPatients.length > 0 ? (totalAlive / filteredPatients.length) * 100 : 0;
    
    // Calculate survival rates per cancer type + stage combination
    const combinations = [];
    const cancerTypes = [...new Set(filteredPatients.map(p => p.Cancer_Type))];
    const stages = ['Stage I', 'Stage II', 'Stage III', 'Stage IV'];
    
    cancerTypes.forEach(cancer => {
        stages.forEach(stage => {
            const patients = filteredPatients.filter(p => p.Cancer_Type === cancer && p.Stage === stage);
            if (patients.length > 0) {
                const alive = patients.filter(p => p.Status === 'Alive').length;
                const rate = (alive / patients.length) * 100;
                combinations.push({
                    cancer,
                    stage,
                    patients: patients.length,
                    alive,
                    rate
                });
            }
        });
    });
    
    // Sort by survival rate (lowest first)
    combinations.sort((a, b) => a.rate - b.rate);
    
    // Show ALL combinations, not just top 10
    let tableRows = '';
    combinations.forEach(data => {
        const isBelowAvg = data.rate < overallRate;
        const rateColor = isBelowAvg ? '#f87171' : data.rate > 50 ? '#34d399' : '#fbbf24';
        const rowBg = isBelowAvg ? 'rgba(248, 113, 113, 0.1)' : 'transparent';
        const warningIcon = isBelowAvg ? MODAL_ICONS.alert : '';
        tableRows += `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); background: ${rowBg};">
                <td style="padding: 8px;"><strong>${data.cancer}</strong></td>
                <td style="text-align: center; padding: 8px;">${data.stage}</td>
                <td style="text-align: center; padding: 8px;">${data.alive}/${data.patients}</td>
                <td style="text-align: center; padding: 8px; color: ${rateColor};"><strong>${data.rate.toFixed(0)}%</strong> ${warningIcon}</td>
            </tr>`;
    });
    
    const belowAvgCount = combinations.filter(c => c.rate < overallRate).length;
    
    const content = `
        <div class="interpretation-content">
            <div class="interpretation-highlight">
                <h4>${MODAL_ICONS.alert}Critical Watch - All Survival Rates</h4>
                <p>All ${combinations.length} cancer type + stage combinations ranked by survival rate</p>
                <p style="font-size: 0.85rem; margin-top: 8px;">Overall average: <strong style="color: var(--text-accent);">${overallRate.toFixed(1)}%</strong> | <span style="color: #f87171;">${belowAvgCount} below average</span></p>
            </div>
            
            <div class="interpretation-highlight">
                <h4>${MODAL_ICONS.list}Complete Breakdown</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">${MODAL_ICONS.alert}Below overall average | Sorted lowest to highest</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <th style="text-align: left; padding: 8px; color: var(--text-muted);">Cancer</th>
                        <th style="text-align: center; padding: 8px; color: var(--text-muted);">Stage</th>
                        <th style="text-align: center; padding: 8px; color: var(--text-muted);">Alive/Total</th>
                        <th style="text-align: center; padding: 8px; color: var(--text-muted);">Rate</th>
                    </tr>
                    ${tableRows}
                </table>
            </div>
            
            <div class="tip-box">
                <span class="tip-icon">${MODAL_ICONS.bulb}</span>
                <p>Red highlighted rows are below the overall average survival rate. Later stages typically show lower survival due to disease progression.</p>
            </div>
        </div>
    `;
    
    openModal('Critical Watch - High Risk Cases', content);
}

// ==========================================
// CHART INTERPRETATION MODALS
// ==========================================
function showDistributionInterpretation(e) {
    // Prevent triggering when clicking on curve stats (survival chart)
    if (e.target.closest('.curve-stat')) return;
    
    const total = filteredPatients.length;
    const cancerCounts = {};
    filteredPatients.forEach(p => {
        cancerCounts[p.Cancer_Type] = (cancerCounts[p.Cancer_Type] || 0) + 1;
    });
    
    // Find the most common cancer
    let maxType = '';
    let maxCount = 0;
    Object.entries(cancerCounts).forEach(([type, count]) => {
        if (count > maxCount) {
            maxType = type;
            maxCount = count;
        }
    });
    
    const percentage = total > 0 ? ((maxCount / total) * 100).toFixed(1) : 0;
    
    // Build cancer type breakdown table
    const sortedCancers = Object.entries(cancerCounts).sort((a, b) => b[1] - a[1]);
    let tableRows = '';
    sortedCancers.forEach(([type, count]) => {
        const pct = ((count / total) * 100).toFixed(1);
        tableRows += `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 8px;"><strong>${type}</strong></td>
                <td style="text-align: center; padding: 8px; color: var(--color-cyan);">${count}</td>
                <td style="text-align: center; padding: 8px; color: var(--text-muted);">${pct}%</td>
            </tr>`;
    });
    
    const content = `
        <div class="interpretation-content">
            <div class="interpretation-highlight">
                <h4>${MODAL_ICONS.chart}How to read this chart</h4>
                <p>This pie chart shows how many patients have each type of cancer. The chart has <strong>${total} patients</strong> total.</p>
            </div>
            
            <div class="interpretation-highlight">
                <h4>${MODAL_ICONS.list}Patient count by cancer type</h4>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <th style="text-align: left; padding: 8px; color: var(--text-muted);">Cancer Type</th>
                        <th style="text-align: center; padding: 8px; color: var(--color-cyan);">Patients</th>
                        <th style="text-align: center; padding: 8px; color: var(--text-muted);">% of Total</th>
                    </tr>
                    ${tableRows}
                </table>
            </div>
            
            <div class="interpretation-highlight">
                <h4>${MODAL_ICONS.info}What does this mean?</h4>
                <ul>
                    <li><strong>Bigger slice</strong> = more patients have this cancer type</li>
                    <li><strong>Smaller slice</strong> = fewer patients have this cancer type</li>
                    <li><strong>${maxType}</strong> is the most common with ${maxCount} patients (${percentage}%)</li>
                </ul>
            </div>
            
            <div class="tip-box">
                <span class="tip-icon">${MODAL_ICONS.pointer}</span>
                <p><strong>Try it!</strong> Click on any slice to filter the whole dashboard by that cancer type.</p>
            </div>
        </div>
    `;
    openModal('Cancer Distribution', content);
}

function showStageInterpretation(e) {
    const stageCounts = { 'Stage I': 0, 'Stage II': 0, 'Stage III': 0, 'Stage IV': 0, 'Unknown': 0 };
    const stageSurvival = { 'Stage I': { alive: 0, total: 0 }, 'Stage II': { alive: 0, total: 0 }, 'Stage III': { alive: 0, total: 0 }, 'Stage IV': { alive: 0, total: 0 } };
    
    filteredPatients.forEach(p => {
        if (stageCounts.hasOwnProperty(p.Stage)) {
            stageCounts[p.Stage]++;
        }
        if (stageSurvival.hasOwnProperty(p.Stage)) {
            stageSurvival[p.Stage].total++;
            if (p.Status === 'Alive') stageSurvival[p.Stage].alive++;
        }
    });
    
    // Calculate survival rates and get actual counts
    const survivalRates = {};
    const aliveCounts = {};
    const deceasedCounts = {};
    Object.entries(stageSurvival).forEach(([stage, data]) => {
        survivalRates[stage] = data.total > 0 ? ((data.alive / data.total) * 100).toFixed(0) : 0;
        aliveCounts[stage] = data.alive;
        deceasedCounts[stage] = data.total - data.alive;
    });
    
    const content = `
        <div class="interpretation-content">
            <div class="interpretation-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            </div>
            
            <div class="interpretation-highlight">
                <h4>${MODAL_ICONS.chart}How to read this chart</h4>
                <p>Each bar represents ALL patients diagnosed at that cancer stage. The bar is split into two colors:</p>
                <ul>
                    <li><strong><span class="legend-chip" style="background:#34d399;"></span>Green segment</strong> = Patients who are <strong>ALIVE</strong></li>
                    <li><strong><span class="legend-chip" style="background:#f87171;"></span>Pink segment</strong> = Patients who are <strong>DECEASED</strong></li>
                </ul>
            </div>
            
            <div class="interpretation-highlight">
                <h4>${MODAL_ICONS.list}Actual patient counts from this data</h4>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <th style="text-align: left; padding: 8px; color: var(--text-muted);">Stage</th>
                        <th style="text-align: center; padding: 8px; color: #34d399;">Alive</th>
                        <th style="text-align: center; padding: 8px; color: #f87171;">Deceased</th>
                        <th style="text-align: center; padding: 8px; color: var(--text-primary);">Total</th>
                        <th style="text-align: center; padding: 8px; color: var(--color-cyan);">Survival %</th>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <td style="padding: 8px;"><strong>Stage I</strong></td>
                        <td style="text-align: center; padding: 8px; color: #34d399;">${aliveCounts['Stage I']}</td>
                        <td style="text-align: center; padding: 8px; color: #f87171;">${deceasedCounts['Stage I']}</td>
                        <td style="text-align: center; padding: 8px;">${stageSurvival['Stage I'].total}</td>
                        <td style="text-align: center; padding: 8px; color: var(--color-cyan);"><strong>${survivalRates['Stage I']}%</strong></td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <td style="padding: 8px;"><strong>Stage II</strong></td>
                        <td style="text-align: center; padding: 8px; color: #34d399;">${aliveCounts['Stage II']}</td>
                        <td style="text-align: center; padding: 8px; color: #f87171;">${deceasedCounts['Stage II']}</td>
                        <td style="text-align: center; padding: 8px;">${stageSurvival['Stage II'].total}</td>
                        <td style="text-align: center; padding: 8px; color: var(--color-cyan);"><strong>${survivalRates['Stage II']}%</strong></td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <td style="padding: 8px;"><strong>Stage III</strong></td>
                        <td style="text-align: center; padding: 8px; color: #34d399;">${aliveCounts['Stage III']}</td>
                        <td style="text-align: center; padding: 8px; color: #f87171;">${deceasedCounts['Stage III']}</td>
                        <td style="text-align: center; padding: 8px;">${stageSurvival['Stage III'].total}</td>
                        <td style="text-align: center; padding: 8px; color: var(--color-cyan);"><strong>${survivalRates['Stage III']}%</strong></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Stage IV</strong></td>
                        <td style="text-align: center; padding: 8px; color: #34d399;">${aliveCounts['Stage IV']}</td>
                        <td style="text-align: center; padding: 8px; color: #f87171;">${deceasedCounts['Stage IV']}</td>
                        <td style="text-align: center; padding: 8px;">${stageSurvival['Stage IV'].total}</td>
                        <td style="text-align: center; padding: 8px; color: var(--color-cyan);"><strong>${survivalRates['Stage IV']}%</strong></td>
                    </tr>
                </table>
            </div>
            
            <div class="interpretation-highlight">
                <h4>${MODAL_ICONS.info}How is the percentage calculated?</h4>
                <p>Survival % = (Alive patients / Total patients) x 100</p>
                <p><strong>Example for Stage I:</strong> ${aliveCounts['Stage I']} alive / ${stageSurvival['Stage I'].total} total = ${survivalRates['Stage I']}%</p>
            </div>
            
            <div class="interpretation-highlight">
                <h4>${MODAL_ICONS.document}What do the stages mean?</h4>
                <ul>
                    <li><strong>Stage I:</strong> Cancer just started, very small, hasn't spread</li>
                    <li><strong>Stage II:</strong> Cancer is bigger, but still in one area</li>
                    <li><strong>Stage III:</strong> Cancer has grown and may have spread nearby</li>
                    <li><strong>Stage IV:</strong> Cancer has spread to other body parts (most serious)</li>
                </ul>
            </div>
            
            <div class="tip-box">
                <span class="tip-icon">${MODAL_ICONS.bulb}</span>
                <p><strong>Key insight:</strong> Earlier stages (I & II) generally have higher survival rates because the cancer is caught before it spreads!</p>
            </div>
        </div>
    `;
    
    openModal('Stage at Diagnosis', content);
}

function showSurvivalAnalysisInterpretation(e) {
    // Calculate survival rates for all cancer type + stage combinations
    const cancerTypes = [...new Set(filteredPatients.map(p => p.Cancer_Type))].sort();
    const stages = ['Stage I', 'Stage II', 'Stage III', 'Stage IV'];
    
    // Collect all combinations with their rates
    const allCombinations = [];
    
    cancerTypes.forEach(cancer => {
        stages.forEach(stage => {
            const patients = filteredPatients.filter(p => 
                p.Cancer_Type === cancer && p.Stage === stage
            );
            
            if (patients.length > 0) {
                const alive = patients.filter(p => p.Status === 'Alive').length;
                const rate = (alive / patients.length) * 100;
                allCombinations.push({
                    cancer,
                    stage,
                    rate,
                    alive,
                    total: patients.length
                });
            }
        });
    });
    
    // Sort for top 5 highest and top 5 lowest
    const sortedByRate = [...allCombinations].sort((a, b) => b.rate - a.rate);
    const top5Highest = sortedByRate.slice(0, 5);
    const top5Lowest = sortedByRate.slice(-5).reverse();
    
    const stageColors = {
        'Stage I': '#10b981',
        'Stage II': '#fbbf24',
        'Stage III': '#fb923c',
        'Stage IV': '#ef4444'
    };

    const bestCombo = sortedByRate[0] || { cancer: 'N/A', stage: '--', rate: 0, alive: 0, total: 0 };
    const worstCombo = sortedByRate[sortedByRate.length - 1] || bestCombo;
    const rateGap = (bestCombo.rate - worstCombo.rate).toFixed(1);
    
    const content = `
        <div class="interpretation-content">
            <div class="interpretation-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
            </div>
            
            <div class="interpretation-highlight">
                <h4>${MODAL_ICONS.chart}How to read this chart</h4>
                <p>This chart shows the <strong>survival rate</strong> for each cancer type, broken down by stage at diagnosis. Each group of bars represents a cancer type, with 4 bars showing survival rates for Stages I through IV.</p>
            </div>
            
            <div class="interpretation-highlight" style="border-left-color: #10b981;">
                <h4 style="color: #10b981;">Top 5 Highest Survival Rates</h4>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <th style="text-align: left; padding: 8px; color: var(--text-muted);">Cancer Type</th>
                        <th style="text-align: center; padding: 8px; color: var(--text-muted);">Stage</th>
                        <th style="text-align: center; padding: 8px; color: var(--text-muted);">Alive/Total</th>
                        <th style="text-align: right; padding: 8px; color: #10b981;">Rate</th>
                    </tr>
                    ${top5Highest.map((item, i) => `
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 8px;"><strong>${i + 1}. ${item.cancer}</strong></td>
                            <td style="text-align: center; padding: 8px; color: ${stageColors[item.stage]};">${item.stage}</td>
                            <td style="text-align: center; padding: 8px;">${item.alive}/${item.total}</td>
                            <td style="text-align: right; padding: 8px; color: #10b981;"><strong>${item.rate.toFixed(1)}%</strong></td>
                        </tr>
                    `).join('')}
                </table>
            </div>
            
            <div class="interpretation-highlight" style="border-left-color: #ef4444;">
                <h4 style="color: #ef4444;">Top 5 Lowest Survival Rates</h4>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <th style="text-align: left; padding: 8px; color: var(--text-muted);">Cancer Type</th>
                        <th style="text-align: center; padding: 8px; color: var(--text-muted);">Stage</th>
                        <th style="text-align: center; padding: 8px; color: var(--text-muted);">Alive/Total</th>
                        <th style="text-align: right; padding: 8px; color: #ef4444;">Rate</th>
                    </tr>
                    ${top5Lowest.map((item, i) => `
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <td style="padding: 8px;"><strong>${i + 1}. ${item.cancer}</strong></td>
                            <td style="text-align: center; padding: 8px; color: ${stageColors[item.stage]};">${item.stage}</td>
                            <td style="text-align: center; padding: 8px;">${item.alive}/${item.total}</td>
                            <td style="text-align: right; padding: 8px; color: #ef4444;"><strong>${item.rate.toFixed(1)}%</strong></td>
                        </tr>
                    `).join('')}
                </table>
            </div>
            
            <div class="key-insight-box">
                <div class="key-insight-title">${MODAL_ICONS.bulb}Key insight</div>
                <div class="key-insight-body">Best outcome: <strong>${bestCombo.cancer} - ${bestCombo.stage}</strong> at ${bestCombo.rate.toFixed(1)}% (alive ${bestCombo.alive}/${bestCombo.total}). Toughest spot: <strong>${worstCombo.cancer} - ${worstCombo.stage}</strong> at ${worstCombo.rate.toFixed(1)}%. The gap of <strong>${rateGap}%</strong> highlights how early-stage detection changes survival odds.</div>
            </div>
        </div>
    `;
    
    openModal('Survival Rate by Cancer Type and Stage', content);
}

function showSurvivalInterpretation(e) {
    // Don't trigger if clicking on curve stats
    if (e.target.closest('.curve-stat')) return;
    
    // Get the actual survival percentages
    // Count patients by survival period (derive percentages directly for accuracy)
    const totalPatients = filteredPatients.length;
    const alive1yr = filteredPatients.filter(p => p.Survival_Months >= 12).length;
    const alive3yr = filteredPatients.filter(p => p.Survival_Months >= 36).length;
    const alive5yr = filteredPatients.filter(p => p.Survival_Months >= 60).length;

    const pct = (count) => totalPatients ? ((count / totalPatients) * 100).toFixed(1) : '0.0';
    const s1yr = `${pct(alive1yr)}%`;
    const s3yr = `${pct(alive3yr)}%`;
    const s5yr = `${pct(alive5yr)}%`;

    const s1Value = parseFloat(s1yr) || 0;
    const s3Value = parseFloat(s3yr) || 0;
    const s5Value = parseFloat(s5yr) || 0;
    const earlyDrop = Math.max(0, 100 - s1Value).toFixed(1);
    const midDrop = Math.max(0, s1Value - s3Value).toFixed(1);
    const lateDrop = Math.max(0, s3Value - s5Value).toFixed(1);
    
    const content = `
        <div class="interpretation-content">
            <div class="interpretation-highlight">
                <h4>${MODAL_ICONS.chart}How to read this chart</h4>
                <p>This line shows how many patients are still alive as time passes. It starts at 100% (everyone) and goes down as months go by.</p>
            </div>
            
            <div class="interpretation-highlight">
                <h4>${MODAL_ICONS.list}Survival rates from this data</h4>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <th style="text-align: left; padding: 8px; color: var(--text-muted);">Time Period</th>
                        <th style="text-align: center; padding: 8px; color: #34d399;">Still Alive</th>
                        <th style="text-align: center; padding: 8px; color: var(--text-muted);">Out of</th>
                        <th style="text-align: center; padding: 8px; color: var(--color-cyan);">Rate</th>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <td style="padding: 8px;"><strong>1 Year</strong> (12 months)</td>
                        <td style="text-align: center; padding: 8px; color: #34d399;">${alive1yr}</td>
                        <td style="text-align: center; padding: 8px;">${totalPatients}</td>
                        <td style="text-align: center; padding: 8px; color: var(--color-cyan);"><strong>${s1yr}</strong></td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <td style="padding: 8px;"><strong>3 Years</strong> (36 months)</td>
                        <td style="text-align: center; padding: 8px; color: #34d399;">${alive3yr}</td>
                        <td style="text-align: center; padding: 8px;">${totalPatients}</td>
                        <td style="text-align: center; padding: 8px; color: var(--color-cyan);"><strong>${s3yr}</strong></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>5 Years</strong> (60 months)</td>
                        <td style="text-align: center; padding: 8px; color: #34d399;">${alive5yr}</td>
                        <td style="text-align: center; padding: 8px;">${totalPatients}</td>
                        <td style="text-align: center; padding: 8px; color: var(--color-cyan);"><strong>${s5yr}</strong></td>
                    </tr>
                </table>
            </div>
            
            <div class="interpretation-highlight">
                <h4>${MODAL_ICONS.info}How to read the curve</h4>
                <ul>
                    <li><strong>Left to right (->):</strong> Time passing in months</li>
                    <li><strong>Top to bottom (down):</strong> Percentage of patients still alive</li>
                    <li><strong>Flat line:</strong> Good! Patients are surviving longer</li>
                    <li><strong>Steep drop:</strong> Many patients didn't make it past this point</li>
                </ul>
            </div>
            
            <div class="key-insight-box">
                <div class="key-insight-title">${MODAL_ICONS.bulb}Key insight</div>
                <div class="key-insight-body">Most of the drop happens in the first year (about ${earlyDrop}% fewer still with us). After that the curve eases: only ${midDrop}% more drop from years 1 to 3, and ${lateDrop}% from years 3 to 5. People who make it past the first year tend to stay steady longer.</div>
            </div>
            
            <div class="tip-box">
                <span class="tip-icon">${MODAL_ICONS.pointer}</span>
                <p><strong>Try clicking</strong> on 1-Year, 3-Year, or 5-Year buttons above the chart to filter patients by how long they survived!</p>
            </div>
        </div>
    `;
    
    openModal('Survival Curve', content);
}

function showAgeDiagnosisInterpretation(e) {
    // Filter patients with actual age data
    const patientsWithAge = filteredPatients.filter(p => typeof p.Age === 'number' && !Number.isNaN(p.Age));
    if (patientsWithAge.length === 0) {
        const noDataContent = `
            <div class="interpretation-content">
                <div class="interpretation-highlight">
                    <h4><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>No age data available</h4>
                    <p>Age information is missing for the current selection, so this analysis cannot be generated.</p>
                </div>
            </div>`;
        openModal('Age at Diagnosis Distribution', noDataContent);
        return;
    }
    
    const cancerTypes = [...new Set(patientsWithAge.map(p => p.Cancer_Type))].sort();
    const ageGroups = AGE_GROUPS || ['10-30', '31-50', '51-70', '71-90'];
    const ageLabels = ageGroupDescriptions || {
        '10-30': 'Young adults',
        '31-50': 'Working age',
        '51-70': 'Prime diagnosis',
        '71-90': 'Senior patients'
    };
    
    const ageTotals = ageGroups.reduce((acc, group) => ({ ...acc, [group]: 0 }), {});
    patientsWithAge.forEach(p => {
        const group = getAgeGroupFromValue(p.Age);
        if (group) {
            ageTotals[group]++;
        }
    });
    const totalPatients = patientsWithAge.length;
    const getShare = (group) => totalPatients ? Math.round((ageTotals[group] / totalPatients) * 100) : 0;
    const midBandShare = totalPatients ? Math.round(((ageTotals['31-50'] + ageTotals['51-70']) / totalPatients) * 100) : 0;
    
    // Find peak age group per cancer type
    const cancerPeaks = [];
    cancerTypes.forEach(cancer => {
        const cancerPatients = patientsWithAge.filter(p => p.Cancer_Type === cancer);
        if (cancerPatients.length === 0) return;
        const counts = ageGroups.reduce((acc, group) => ({ ...acc, [group]: 0 }), {});
        cancerPatients.forEach(p => {
            const group = getAgeGroupFromValue(p.Age);
            if (group) counts[group]++;
        });
        const peakEntry = Object.entries(counts).reduce((max, entry) => entry[1] > max[1] ? entry : max, ['10-30', 0]);
        const peakGroup = peakEntry[0];
        const peakCount = peakEntry[1];
        if (peakCount === 0) return;
        cancerPeaks.push({ cancer, peakGroup, count: peakCount, total: cancerPatients.length });
    });
    
    // Sort by youngest peak group first
    const groupOrder = { '10-30': 0, '31-50': 1, '51-70': 2, '71-90': 3 };
    cancerPeaks.sort((a, b) => groupOrder[a.peakGroup] - groupOrder[b.peakGroup]);
    
    const youngestPeak = cancerPeaks.filter(c => c.peakGroup === '10-30' || c.peakGroup === '31-50');
    const oldestPeak = cancerPeaks.filter(c => c.peakGroup === '71-90');
    
    const content = `
        <div class="interpretation-content">
            <div class="interpretation-highlight">
                <h4><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/></svg>How to read this chart</h4>
                <ul class="age-reading-list">
                    <li><strong>Horizontal axis:</strong> each cancer type from left to right.</li>
                    <li><strong>Stacked colors:</strong> show how many patients in every age band.
                        Taller colors mean more patients for that cancer-age combination.</li>
                    <li><strong>Legend shares:</strong> numbers beside each color show that age group's share of total diagnoses.</li>
                </ul>
            </div>

            <div class="interpretation-stats">
                ${ageGroups.map(group => `
                    <div class="stat-item">
                        <span class="stat-number">${getShare(group)}%</span>
                        <span class="stat-label">${ageLabels[group]}<br>${ageTotals[group]} patients</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="key-findings">
                <h4><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h10M4 18h6"/></svg>Age patterns by cancer type</h4>
                <ul>
                    ${youngestPeak.length > 0 ? `<li><strong>Younger onset:</strong> ${youngestPeak.map(c => c.cancer).join(', ')} peak before age 50.</li>` : ''}
                    <li><strong>Prime diagnosis (51-70):</strong> Most cancers reach their highest counts in this band.</li>
                    ${oldestPeak.length > 0 ? `<li><strong>Senior-heavy:</strong> ${oldestPeak.map(c => c.cancer).join(', ')} are dominated by ages 71-90.</li>` : ''}
                    <li><strong>Screening tip:</strong> targeting ages 31-70 captures ${midBandShare}% of cases.</li>
                </ul>
            </div>
            
            <div class="peak-age-list">
                <h4>Peak age group by cancer type</h4>
                <div class="peak-items">
                    ${cancerPeaks.map(c => `
                        <div class="peak-item">
                            <span class="peak-cancer">${c.cancer}</span>
                            <span class="peak-age age-${c.peakGroup.replace('-', '')}">${c.peakGroup}</span>
                            <span class="peak-percent">${c.total ? Math.round((c.count / c.total) * 100) : 0}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="key-insight-box">
                <div class="key-insight-title">${MODAL_ICONS.bulb}Key insight</div>
                <div class="key-insight-body">Most diagnoses cluster between ages 31-70, covering ${midBandShare}% of patients. Younger-onset cancers show up in ${youngestPeak.length > 0 ? youngestPeak.map(c => c.cancer).join(', ') : 'few types here'}, while ${oldestPeak.length > 0 ? oldestPeak.map(c => c.cancer).join(', ') : 'no strong older-skew types in this view'} lean older (71-90). Screening efforts aimed at 31-70 catch the bulk of cases.</div>
            </div>
        </div>
    `;
    
    openModal('Age at Diagnosis Distribution', content);
}

function showBubbleInterpretation(e) {
    // Don't trigger if clicking on dropdown
    if (e.target.closest('.bubble-filter-dropdown')) return;
    
    // Calculate averages per cancer type
    const cancerStats = {};
    filteredPatients.forEach(p => {
        if (!cancerStats[p.Cancer_Type]) {
            cancerStats[p.Cancer_Type] = { total: 0, survivalSum: 0, alive: 0 };
        }
        cancerStats[p.Cancer_Type].total++;
        cancerStats[p.Cancer_Type].survivalSum += parseInt(p.Survival_Months) || 0;
        if (p.Status === 'Alive') cancerStats[p.Cancer_Type].alive++;
    });
    
    // Build table rows
    let tableRows = '';
    const sortedTypes = Object.entries(cancerStats).sort((a, b) => 
        (b[1].survivalSum / b[1].total) - (a[1].survivalSum / a[1].total)
    );
    
    sortedTypes.forEach(([type, stats]) => {
        const avgSurvival = stats.total ? (stats.survivalSum / stats.total).toFixed(1) : '0.0';
        const survivalRate = stats.total ? ((stats.alive / stats.total) * 100).toFixed(0) : '0';
        tableRows += `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 8px;"><strong>${type}</strong></td>
                <td style="text-align: center; padding: 8px;">${stats.total}</td>
                <td style="text-align: center; padding: 8px; color: var(--color-cyan);">${avgSurvival} mo</td>
                <td style="text-align: center; padding: 8px; color: #34d399;">${survivalRate}%</td>
            </tr>`;
    });

    const byAvg = [...sortedTypes].sort((a, b) => (b[1].survivalSum / b[1].total) - (a[1].survivalSum / a[1].total));
    const byRate = [...sortedTypes].sort((a, b) => ((b[1].alive / b[1].total) - (a[1].alive / a[1].total)));
    const bestAvgEntry = byAvg[0] || ['N/A', { total: 0, survivalSum: 0, alive: 0 }];
    const worstAvgEntry = byAvg[byAvg.length - 1] || bestAvgEntry;
    const bestRateEntry = byRate[0] || bestAvgEntry;
    const bestAvgMonths = bestAvgEntry[1].total ? (bestAvgEntry[1].survivalSum / bestAvgEntry[1].total).toFixed(1) : '0.0';
    const worstAvgMonths = worstAvgEntry[1].total ? (worstAvgEntry[1].survivalSum / worstAvgEntry[1].total).toFixed(1) : '0.0';
    const bestRatePct = bestRateEntry[1].total ? ((bestRateEntry[1].alive / bestRateEntry[1].total) * 100).toFixed(0) : '0';
    
    const content = `
        <div class="interpretation-content">
            <div class="interpretation-highlight">
                <h4>${MODAL_ICONS.chart}How to read this chart</h4>
                <p>Each icon represents one cancer type. The position shows the <strong>stage</strong> (up/down) and <strong>average survival time</strong> (left/right).</p>
            </div>
            
            <div class="interpretation-highlight">
                <h4>${MODAL_ICONS.list}Average survival by cancer type</h4>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <th style="text-align: left; padding: 8px; color: var(--text-muted);">Cancer Type</th>
                        <th style="text-align: center; padding: 8px; color: var(--text-muted);">Patients</th>
                        <th style="text-align: center; padding: 8px; color: var(--color-cyan);">Avg Survival</th>
                        <th style="text-align: center; padding: 8px; color: #34d399;">Alive %</th>
                    </tr>
                    ${tableRows}
                </table>
            </div>
            
            <div class="interpretation-highlight">
                <h4>${MODAL_ICONS.info}What to look for</h4>
                <ul>
                    <li><strong>Icons on the right:</strong> Longer survival time (better outcomes)</li>
                    <li><strong>Icons on the left:</strong> Shorter survival time</li>
                    <li><strong>Icons at the top:</strong> Stage IV (most advanced)</li>
                    <li><strong>Icons at the bottom:</strong> Stage I (earliest stage)</li>
                </ul>
            </div>

            <div class="key-insight-box">
                <div class="key-insight-title">${MODAL_ICONS.bulb}Key insight</div>
                <div class="key-insight-body">Bubbles farther to the right mean longer average survival; bubbles to the left mean shorter survival. Lower rows are earlier stages (Stage I at the bottom), higher rows are later stages (Stage IV at the top). Use right vs. left for time, and bottom vs. top for stage severity when reading the plot.</div>
            </div>
            
            <div class="tip-box">
                <span class="tip-icon">${MODAL_ICONS.bulb}</span>
                <p><strong>Use the dropdown</strong> in the top-right corner to show/hide specific cancer types and compare them!</p>
            </div>
        </div>
    `;
    
    openModal('Stage vs Survival', content);
}

function openStudyInsightModal() {
    const content = `
        <div class="interpretation-content">
            <div class="interpretation-highlight">
                <h4>${MODAL_ICONS.document}Study overview</h4>
                <p>A comprehensive survival dashboard built on The Cancer Genome Atlas (TCGA) clinical data, showing how cancer type and stage at diagnosis shape survival outcomes.</p>
            </div>

            <div class="interpretation-highlight">
                <h4>${MODAL_ICONS.list}Data lineage</h4>
                <ul>
                    <li>Source: TCGA Pan-Cancer Atlas clinical dataset.</li>
                    <li>Original: 11,160 patients across 33 cancer types.</li>
                    <li>Filtered: 4,670 patients across 8 focus cancers (BRCA, LUAD, LUSC, COAD, PRAD, STAD, BLCA, LIHC).</li>
                    <li>Working sample: 356 patients retained for this dashboard.</li>
                </ul>
            </div>

            <div class="interpretation-highlight">
                <h4>${MODAL_ICONS.info}Why 356 samples?</h4>
                <p>The sample size was computed for 95% confidence, 5% margin of error, 50% proportion, and a 4,670 population base. This keeps results statistically reliable while staying responsive for the UI.</p>
            </div>

            <div class="key-insight-box">
                <div class="key-insight-title">${MODAL_ICONS.bulb}Overall takeaway</div>
                <div class="key-insight-body">This slice of TCGA data spotlights how early-stage detection widens the survival gap across all eight cancers. Use the filters and comparisons to see how type, stage, and time-to-survival interact for the 356-patient cohort.</div>
            </div>
        </div>
    `;

    openModal('Dataset and Method Summary', content);
}
