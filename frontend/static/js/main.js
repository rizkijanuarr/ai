// ============================================
// Main Application Logic
// ============================================

// DOM Elements
const DOM = {
    form: document.getElementById('analyzeForm'),
    urlInput: document.getElementById('urlInput'),
    analyzeBtn: document.getElementById('analyzeBtn'),
    btnText: document.getElementById('btnText'),
    btnLoading: document.getElementById('btnLoading'),
    alertContainer: document.getElementById('alertContainer'),
    resultSection: document.getElementById('resultSection'),

    // Result elements (optional - might not exist on all pages)
    statusBadge: document.getElementById('statusBadge'),
    resultUrl: document.getElementById('resultUrl'),
    resultProb: document.getElementById('resultProb'),
    resultIp: document.getElementById('resultIp'),
    resultLocation: document.getElementById('resultLocation'),
    resultSnippet: document.getElementById('resultSnippet')
};

// ============================================
// UI State Management
// ============================================

/**
 * Show Alert
 * @param {string} message - Alert message
 * @param {string} type - Alert type
 */
function showAlert(message, type = 'danger') {
    if (!DOM.alertContainer) return;

    DOM.alertContainer.innerHTML = UIComponents.createAlert(message, type);

    // NO AUTO-HIDE - User must close manually
}

/**
 * Clear Alert
 */
function clearAlert() {
    if (DOM.alertContainer) {
        DOM.alertContainer.innerHTML = '';
    }
}

/**
 * Set Loading State
 * @param {boolean} isLoading - Loading state
 */
function setLoading(isLoading) {
    if (!DOM.analyzeBtn) return;

    if (isLoading) {
        DOM.analyzeBtn.disabled = true;
        DOM.btnText.classList.add('hidden');
        DOM.btnLoading.classList.remove('hidden');
    } else {
        DOM.analyzeBtn.disabled = false;
        DOM.btnText.classList.remove('hidden');
        DOM.btnLoading.classList.add('hidden');
    }
}

/**
 * Show Result Section
 */
function showResult() {
    if (!DOM.resultSection) return;

    DOM.resultSection.classList.remove('hidden');

    // Smooth scroll to result
    setTimeout(() => {
        DOM.resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

/**
 * Hide Result Section
 */
function hideResult() {
    if (DOM.resultSection) {
        DOM.resultSection.classList.add('hidden');
    }
}

/**
 * Reset Form
 */
function resetForm() {
    if (DOM.form) {
        DOM.form.reset();
    }
    hideResult();
    clearAlert();
    if (DOM.urlInput) {
        DOM.urlInput.focus();
    }
}

// ============================================
// Business Logic
// ============================================

/**
 * Handle URL Lookup in Dataset
 * @param {string} url - URL to lookup
 */
async function handleAnalyze(url) {
    try {
        setLoading(true);
        clearAlert();

        const response = await API.getDatasetByLink(url);

        if (response.success) {
            // Show success alert first
            showAlert('Website ditemukan di dataset! ✅', 'success');

            // Then show result card after a short delay
            setTimeout(() => {
                displayDatasetResult(response.data);
            }, 100);
        } else {
            const errorMsg = response.errors?.[0]?.message || response.message || 'Website tidak ditemukan di dataset';
            showAlert(errorMsg, 'warning');
        }

    } catch (error) {
        console.error('Error:', error);
        showAlert('Website tidak ditemukan di dataset. Coba URL lain atau gunakan fitur Dataset Model untuk melihat semua data.', 'warning');
    } finally {
        setLoading(false);
    }
}

/**
 * Display Dataset Result
 * @param {object} data - Dataset data
 */
function displayDatasetResult(data) {
    // Determine badge type based on is_legal
    const badgeType = data.is_legal === 1 ? 'success' : 'danger';
    const badgeLabel = data.is_legal === 1 ? 'Legal' : 'Ilegal';

    // Create result card
    const resultHTML = `
        <div class="card fade-in" style="max-width: 800px; margin: 2rem auto;">
            <div class="card-header">
                <h3 class="card-title">✅ Website Ditemukan di Dataset</h3>
                <p class="card-subtitle">Berikut informasi website yang Anda cari</p>
            </div>
            <div class="card-body">
                <div class="text-center mb-3">
                    ${UIComponents.createBadge(badgeLabel, badgeType)}
                </div>
                <div class="result-grid">
                    <div class="result-item">
                        <div class="result-label">ID Dataset</div>
                        <div class="result-value">#${data.id}</div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Keyword</div>
                        <div class="result-value">${data.keyword}</div>
                    </div>
                </div>
                <div class="result-item mt-3">
                    <div class="result-label">Title</div>
                    <div class="result-value" style="font-size: 1rem;">${data.title}</div>
                </div>
                <div class="result-item mt-3">
                    <div class="result-label">Description</div>
                    <div class="result-value" style="font-size: 0.875rem; line-height: 1.5;">${data.description}</div>
                </div>
                <div class="result-item mt-3">
                    <div class="result-label">Link</div>
                    <div class="result-value">
                        <a href="${data.link}" target="_blank" style="color: var(--primary); word-break: break-all;">
                            ${data.link}
                        </a>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <div class="text-center">
                    <button class="btn btn-outline" onclick="resetForm()">
                        🔄 Cek Website Lain
                    </button>
                </div>
            </div>
        </div>
    `;

    // Append card after alert (not replace)
    DOM.alertContainer.insertAdjacentHTML('beforeend', resultHTML);
}

/**
 * Display Analysis Result
 * @param {object} data - Result data
 */
function displayResult(data) {
    if (!DOM.statusBadge) return;

    // Determine badge type
    const badgeType = data.label === 'Legal' ? 'success' : 'danger';

    // Update status badge
    DOM.statusBadge.innerHTML = UIComponents.createBadge(data.label, badgeType);

    // Update result values
    DOM.resultUrl.textContent = Utils.truncateUrl(data.url);
    DOM.resultUrl.title = data.url; // Show full URL on hover

    DOM.resultProb.textContent = Utils.formatProbability(data.probability);
    DOM.resultIp.textContent = data.ip || 'Unknown';
    DOM.resultLocation.textContent = data.location || 'Unknown';
    DOM.resultSnippet.textContent = Utils.truncateText(data.snippet, 200);

    // Show result section
    showResult();
}

// ============================================
// Event Listeners
// ============================================

/**
 * Form Submit Handler
 */
if (DOM.form) {
    DOM.form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const url = DOM.urlInput.value.trim();

        // Validate URL
        if (!url) {
            showAlert('Mohon masukkan URL website', 'warning');
            return;
        }

        if (!Utils.isValidUrl(url)) {
            showAlert('URL tidak valid. Pastikan format URL benar (contoh: https://example.com)', 'warning');
            return;
        }

        // Analyze URL
        await handleAnalyze(url);
    });
}

/**
 * Input Focus Handler
 */
if (DOM.urlInput) {
    DOM.urlInput.addEventListener('focus', () => {
        clearAlert();
    });
}

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🤖 AI Website Classifier initialized');
    console.log('📦 Modules loaded:', {
        API: !!window.API,
        Utils: !!window.Utils,
        UIComponents: !!window.UIComponents,
        API_CONFIG: !!window.API_CONFIG
    });

    if (DOM.urlInput) {
        DOM.urlInput.focus();
    }
});

// Make functions available globally
window.resetForm = resetForm;
window.clearAlert = clearAlert;
