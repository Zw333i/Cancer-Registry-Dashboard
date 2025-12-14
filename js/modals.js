/* ========================================
   CANCER REGISTRY DASHBOARD
   Modal Functions & Chart Interpretations
   ======================================== */

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
        const indicator = data.rate < parseFloat(rate) ? '↓' : '↑';
        cancerRows += `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 8px;"><strong>${data.type}</strong></td>
                <td style="text-align: center; padding: 8px;">${data.alive}/${data.total}</td>
                <td style="text-align: center; padding: 8px; color: ${rateColor};"><strong>${data.rate}%</strong> ${indicator}</td>
            </tr>`;
    });
    
    const content = `
        <div class="interpretation-content">
            <div class="interpretation-highlight">
                <h4>📊 Overall Survival Rate</h4>
                <p style="font-size: 2rem; color: var(--color-alive); font-weight: 700;">${rate}%</p>
                <p>${alive} alive out of ${total} patients</p>
            </div>
            
            <div class="interpretation-highlight">
                <h4>📋 Survival Rate by Cancer Type</h4>
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
                <span class="tip-icon">💡</span>
                <p>↑ Above average | ↓ Below average survival rate. Click cancer types in the sidebar to filter.</p>
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
    let hopeIcon = '🌟';
    let hopeText = 'Strong Hope';
    let hopeColor = '#34d399';
    if (avgMonths < 24) {
        hopeIcon = '💪';
        hopeText = 'Fighting Spirit';
        hopeColor = '#fbbf24';
    } else if (avgMonths < 12) {
        hopeIcon = '🙏';
        hopeText = 'Courage Required';
        hopeColor = '#f87171';
    }
    
    let cancerRows = '';
    cancerData.forEach((data, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        const barWidth = Math.min((data.avgMonths / Math.max(...cancerData.map(d => d.avgMonths))) * 100, 100);
        cancerRows += `
            <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span>${medal} <strong>${data.type}</strong></span>
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
                <h4>${hopeIcon} ${hopeText} Indicator</h4>
                <p style="font-size: 2rem; color: ${hopeColor}; font-weight: 700;">${avgMonths} months</p>
                <p>Average survival time across ${total} patients (~${avgYears} years)</p>
            </div>
            
            <div class="interpretation-highlight">
                <h4>📋 Average Survival by Cancer Type</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">Ranked from longest to shortest survival</p>
                ${cancerRows}
            </div>
            
            <div class="tip-box">
                <span class="tip-icon">💡</span>
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
        const warningIcon = isBelowAvg ? '⚠️' : '';
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
                <h4>⚠️ Critical Watch - All Survival Rates</h4>
                <p>All ${combinations.length} cancer type + stage combinations ranked by survival rate</p>
                <p style="font-size: 0.85rem; margin-top: 8px;">Overall average: <strong style="color: var(--text-accent);">${overallRate.toFixed(1)}%</strong> | <span style="color: #f87171;">${belowAvgCount} below average</span></p>
            </div>
            
            <div class="interpretation-highlight">
                <h4>📋 Complete Breakdown</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">⚠️ = Below overall average | Sorted lowest to highest</p>
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
                <span class="tip-icon">💡</span>
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
                <h4>📊 How to read this chart</h4>
                <p>This pie chart shows how many patients have each type of cancer. The chart has <strong>${total} patients</strong> total.</p>
            </div>
            
            <div class="interpretation-highlight">
                <h4>📋 Patient count by cancer type</h4>
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
                <h4>🔍 What does this mean?</h4>
                <ul>
                    <li><strong>Bigger slice</strong> = more patients have this cancer type</li>
                    <li><strong>Smaller slice</strong> = fewer patients have this cancer type</li>
                    <li><strong>${maxType}</strong> is the most common with ${maxCount} patients (${percentage}%)</li>
                </ul>
            </div>
            
            <div class="tip-box">
                <span class="tip-icon">👆</span>
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
                <h4>📊 How to read this chart</h4>
                <p>Each bar represents ALL patients diagnosed at that cancer stage. The bar is split into two colors:</p>
                <ul>
                    <li><strong style="color: #34d399;">🟢 GREEN part</strong> = Patients who are <strong>ALIVE</strong></li>
                    <li><strong style="color: #f87171;">🔴 PINK part</strong> = Patients who are <strong>DECEASED</strong></li>
                </ul>
            </div>
            
            <div class="interpretation-highlight">
                <h4>📋 Actual patient counts from this data</h4>
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
                <h4>🧮 How is the percentage calculated?</h4>
                <p>Survival % = (Alive patients ÷ Total patients) × 100</p>
                <p><strong>Example for Stage I:</strong> ${aliveCounts['Stage I']} alive ÷ ${stageSurvival['Stage I'].total} total = ${survivalRates['Stage I']}%</p>
            </div>
            
            <div class="interpretation-highlight">
                <h4>🏥 What do the stages mean?</h4>
                <ul>
                    <li><strong>Stage I:</strong> Cancer just started, very small, hasn't spread</li>
                    <li><strong>Stage II:</strong> Cancer is bigger, but still in one area</li>
                    <li><strong>Stage III:</strong> Cancer has grown and may have spread nearby</li>
                    <li><strong>Stage IV:</strong> Cancer has spread to other body parts (most serious)</li>
                </ul>
            </div>
            
            <div class="tip-box">
                <span class="tip-icon">💡</span>
                <p><strong>Key insight:</strong> Earlier stages (I & II) generally have higher survival rates because the cancer is caught before it spreads!</p>
            </div>
        </div>
    `;
    
    openModal('Stage at Diagnosis', content);
}

function showSurvivalInterpretation(e) {
    // Don't trigger if clicking on curve stats
    if (e.target.closest('.curve-stat')) return;
    
    // Get the actual survival percentages
    const s1yr = document.getElementById('survival1yr')?.textContent || '0%';
    const s3yr = document.getElementById('survival3yr')?.textContent || '0%';
    const s5yr = document.getElementById('survival5yr')?.textContent || '0%';
    
    // Count patients by survival period
    const totalPatients = filteredPatients.length;
    const alive1yr = filteredPatients.filter(p => p.Survival_Months >= 12).length;
    const alive3yr = filteredPatients.filter(p => p.Survival_Months >= 36).length;
    const alive5yr = filteredPatients.filter(p => p.Survival_Months >= 60).length;
    
    const content = `
        <div class="interpretation-content">
            <div class="interpretation-highlight">
                <h4>📊 How to read this chart</h4>
                <p>This line shows how many patients are still alive as time passes. It starts at 100% (everyone) and goes down as months go by.</p>
            </div>
            
            <div class="interpretation-highlight">
                <h4>📋 Survival rates from this data</h4>
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
                <h4>🔍 How to read the curve</h4>
                <ul>
                    <li><strong>Left to right (→):</strong> Time passing in months</li>
                    <li><strong>Top to bottom (↓):</strong> Percentage of patients still alive</li>
                    <li><strong>Flat line:</strong> Good! Patients are surviving longer</li>
                    <li><strong>Steep drop:</strong> Many patients didn't make it past this point</li>
                </ul>
            </div>
            
            <div class="tip-box">
                <span class="tip-icon">👆</span>
                <p><strong>Try clicking</strong> on 1-Year, 3-Year, or 5-Year buttons above the chart to filter patients by how long they survived!</p>
            </div>
        </div>
    `;
    
    openModal('Survival Curve', content);
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
        const avgSurvival = (stats.survivalSum / stats.total).toFixed(1);
        const survivalRate = ((stats.alive / stats.total) * 100).toFixed(0);
        tableRows += `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 8px;"><strong>${type}</strong></td>
                <td style="text-align: center; padding: 8px;">${stats.total}</td>
                <td style="text-align: center; padding: 8px; color: var(--color-cyan);">${avgSurvival} mo</td>
                <td style="text-align: center; padding: 8px; color: #34d399;">${survivalRate}%</td>
            </tr>`;
    });
    
    const content = `
        <div class="interpretation-content">
            <div class="interpretation-highlight">
                <h4>📊 How to read this chart</h4>
                <p>Each icon represents one cancer type. The position shows the <strong>stage</strong> (up/down) and <strong>average survival time</strong> (left/right).</p>
            </div>
            
            <div class="interpretation-highlight">
                <h4>📋 Average survival by cancer type</h4>
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
                <h4>🔍 What to look for</h4>
                <ul>
                    <li><strong>Icons on the right:</strong> Longer survival time (better outcomes)</li>
                    <li><strong>Icons on the left:</strong> Shorter survival time</li>
                    <li><strong>Icons at the top:</strong> Stage IV (most advanced)</li>
                    <li><strong>Icons at the bottom:</strong> Stage I (earliest stage)</li>
                </ul>
            </div>
            
            <div class="tip-box">
                <span class="tip-icon">💡</span>
                <p><strong>Use the dropdown</strong> in the top-right corner to show/hide specific cancer types and compare them!</p>
            </div>
        </div>
    `;
    
    openModal('Stage vs Survival', content);
}
