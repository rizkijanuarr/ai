// ============================================
// Evaluation Section Logic
// ============================================

/**
 * Toggle Evaluation Section
 */
function toggleEvaluationSection() {
    const section = document.getElementById('evaluationSection');
    const isHidden = section.classList.contains('hidden');

    if (isHidden) {
        section.classList.remove('hidden');
        // Load evaluation data when opening
        loadEvaluationData();
        // Smooth scroll to section
        setTimeout(() => {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    } else {
        section.classList.add('hidden');
        // Scroll back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Load Evaluation Data
 */
async function loadEvaluationData() {
    const loadingEl = document.getElementById('evaluationLoading');
    const contentEl = document.getElementById('evaluationContent');

    try {
        // Show loading
        loadingEl.classList.remove('hidden');
        contentEl.classList.add('hidden');

        // Call API
        const response = await API.getEvaluationMetrics();

        if (response.success) {
            displayEvaluationData(response.data);
            loadingEl.classList.add('hidden');
            contentEl.classList.remove('hidden');
        } else {
            loadingEl.innerHTML = `
                <p style="color: rgba(255, 255, 255, 0.7);">❌ Gagal memuat data evaluasi</p>
            `;
        }

    } catch (error) {
        console.error('Error loading evaluation:', error);
        loadingEl.innerHTML = `
            <p style="color: rgba(255, 255, 255, 0.7);">❌ Gagal memuat data evaluasi</p>
        `;
    }
}

/**
 * Display Evaluation Data
 */
function displayEvaluationData(data) {
    const contentEl = document.getElementById('evaluationContent');

    const html = `
        <!-- Summary Cards -->
        <div class="evaluation-summary fade-in">
            <div class="summary-card">
                <div class="summary-icon">📊</div>
                <div class="summary-value">${Utils.formatNumber(data.total_samples)}</div>
                <div class="summary-label">Total Samples</div>
            </div>
            <div class="summary-card">
                <div class="summary-icon">✅</div>
                <div class="summary-value">${Utils.formatNumber(data.legal_count)}</div>
                <div class="summary-label">Legal</div>
            </div>
            <div class="summary-card">
                <div class="summary-icon">❌</div>
                <div class="summary-value">${Utils.formatNumber(data.illegal_count)}</div>
                <div class="summary-label">Illegal</div>
            </div>
        </div>

        <!-- Metrics Cards -->
        <div class="metrics-grid fade-in">
            <div class="metric-card">
                <h4>Accuracy</h4>
                <div class="metric-value">${(data.metrics.accuracy * 100).toFixed(1)}%</div>
                <div class="metric-bar">
                    <div class="metric-fill" style="width: ${data.metrics.accuracy * 100}%"></div>
                </div>
            </div>
            <div class="metric-card">
                <h4>Precision</h4>
                <div class="metric-value">${(data.metrics.precision * 100).toFixed(1)}%</div>
                <div class="metric-bar">
                    <div class="metric-fill" style="width: ${data.metrics.precision * 100}%"></div>
                </div>
            </div>
            <div class="metric-card">
                <h4>Recall</h4>
                <div class="metric-value">${(data.metrics.recall * 100).toFixed(1)}%</div>
                <div class="metric-bar">
                    <div class="metric-fill" style="width: ${data.metrics.recall * 100}%"></div>
                </div>
            </div>
            <div class="metric-card">
                <h4>F1-Score</h4>
                <div class="metric-value">${(data.metrics.f1_score * 100).toFixed(1)}%</div>
                <div class="metric-bar">
                    <div class="metric-fill" style="width: ${data.metrics.f1_score * 100}%"></div>
                </div>
            </div>
        </div>

        <!-- Confusion Matrix & K-Fold -->
        <div class="evaluation-details fade-in">
            <!-- Confusion Matrix -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Confusion Matrix</h3>
                    <p class="card-subtitle">Matriks prediksi vs aktual</p>
                </div>
                <div class="card-body">
                    <div class="confusion-matrix">
                        <div class="cm-row">
                            <div class="cm-cell cm-header"></div>
                            <div class="cm-cell cm-header">Predicted Legal</div>
                            <div class="cm-cell cm-header">Predicted Illegal</div>
                        </div>
                        <div class="cm-row">
                            <div class="cm-cell cm-header">Actual Legal</div>
                            <div class="cm-cell cm-tp">
                                <div class="cm-label">True Positive</div>
                                <div class="cm-value">${Utils.formatNumber(data.confusion_matrix.true_positive)}</div>
                            </div>
                            <div class="cm-cell cm-fn">
                                <div class="cm-label">False Negative</div>
                                <div class="cm-value">${Utils.formatNumber(data.confusion_matrix.false_negative)}</div>
                            </div>
                        </div>
                        <div class="cm-row">
                            <div class="cm-cell cm-header">Actual Illegal</div>
                            <div class="cm-cell cm-fp">
                                <div class="cm-label">False Positive</div>
                                <div class="cm-value">${Utils.formatNumber(data.confusion_matrix.false_positive)}</div>
                            </div>
                            <div class="cm-cell cm-tn">
                                <div class="cm-label">True Negative</div>
                                <div class="cm-value">${Utils.formatNumber(data.confusion_matrix.true_negative)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- K-Fold Results -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">K-Fold Cross Validation</h3>
                    <p class="card-subtitle">Validasi dengan ${data.k_fold_results.k}-Fold</p>
                </div>
                <div class="card-body">
                    <div class="kfold-stats">
                        <div class="kfold-stat">
                            <div class="kfold-label">Mean Accuracy</div>
                            <div class="kfold-value">${(data.k_fold_results.mean_accuracy * 100).toFixed(1)}%</div>
                        </div>
                        <div class="kfold-stat">
                            <div class="kfold-label">Std Deviation</div>
                            <div class="kfold-value">${data.k_fold_results.std_deviation.toFixed(3)}</div>
                        </div>
                    </div>
                    <div class="kfold-scores">
                        ${data.k_fold_results.fold_scores.map((score, index) => `
                            <div class="kfold-score-item">
                                <div class="kfold-score-label">Fold ${index + 1}</div>
                                <div class="kfold-score-bar">
                                    <div class="kfold-score-fill" style="width: ${score * 100}%"></div>
                                </div>
                                <div class="kfold-score-value">${(score * 100).toFixed(1)}%</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>

        <!-- Interpretation -->
        <div class="card fade-in">
            <div class="card-header">
                <h3 class="card-title">📋 Interpretasi Hasil</h3>
            </div>
            <div class="card-body">
                <div class="interpretation-badges mb-3">
                    ${UIComponents.createBadge(data.interpretation.performance_level, 'success')}
                    ${UIComponents.createBadge(data.interpretation.stability, 'success')}
                </div>
                <p style="color: rgba(255, 255, 255, 0.9); line-height: 1.6; margin-bottom: 1rem;">
                    ${data.interpretation.summary}
                </p>
                <div class="recommendations">
                    <h4 style="font-size: 1rem; margin-bottom: 0.5rem; color: var(--secondary);">💡 Rekomendasi:</h4>
                    <ul style="color: rgba(255, 255, 255, 0.8); line-height: 1.6;">
                        ${data.interpretation.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;

    contentEl.innerHTML = html;
}

// Make function available globally
window.toggleEvaluationSection = toggleEvaluationSection;
