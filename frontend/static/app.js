// ============================================
// API Configuration
// ============================================
const API_URL = '/api/v1/scrape';

// ============================================
// DOM Elements
// ============================================
const form = document.getElementById('analyzeForm');
const urlInput = document.getElementById('urlInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const btnText = document.getElementById('btnText');
const btnLoading = document.getElementById('btnLoading');
const alertContainer = document.getElementById('alertContainer');
const resultSection = document.getElementById('resultSection');

// Result elements
const statusBadge = document.getElementById('statusBadge');
const resultUrl = document.getElementById('resultUrl');
const resultProb = document.getElementById('resultProb');
const resultIp = document.getElementById('resultIp');
const resultLocation = document.getElementById('resultLocation');
const resultSnippet = document.getElementById('resultSnippet');

// ============================================
// Reusable Component Functions
// ============================================

/**
 * Create Alert Component
 * @param {string} message - Alert message
 * @param {string} type - Alert type (success, danger, warning)
 * @returns {string} HTML string
 */
function createAlert(message, type = 'danger') {
    return `
        <div class="alert alert-${type}">
            <span>${getAlertIcon(type)}</span>
            <span>${message}</span>
        </div>
    `;
}

/**
 * Get Alert Icon
 * @param {string} type - Alert type
 * @returns {string} Icon emoji
 */
function getAlertIcon(type) {
    const icons = {
        success: '✅',
        danger: '❌',
        warning: '⚠️'
    };
    return icons[type] || '❌';
}

/**
 * Create Badge Component
 * @param {string} label - Badge label
 * @param {string} type - Badge type (success, danger)
 * @returns {string} HTML string
 */
function createBadge(label, type) {
    const icon = type === 'success' ? '✅' : '❌';
    return `
        <span class="badge badge-${type}">
            <span>${icon}</span>
            <span>${label}</span>
        </span>
    `;
}

/**
 * Show Alert
 * @param {string} message - Alert message
 * @param {string} type - Alert type
 */
function showAlert(message, type = 'danger') {
    alertContainer.innerHTML = createAlert(message, type);

    // Auto hide after 5 seconds
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 5000);
}

/**
 * Clear Alert
 */
function clearAlert() {
    alertContainer.innerHTML = '';
}

/**
 * Set Loading State
 * @param {boolean} isLoading - Loading state
 */
function setLoading(isLoading) {
    if (isLoading) {
        analyzeBtn.disabled = true;
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
    } else {
        analyzeBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
    }
}

/**
 * Show Result Section
 */
function showResult() {
    resultSection.classList.remove('hidden');

    // Smooth scroll to result
    setTimeout(() => {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

/**
 * Hide Result Section
 */
function hideResult() {
    resultSection.classList.add('hidden');
}

/**
 * Reset Form
 */
function resetForm() {
    form.reset();
    hideResult();
    clearAlert();
    urlInput.focus();
}

// ============================================
// API Functions
// ============================================

/**
 * Analyze URL
 * @param {string} url - URL to analyze
 */
async function analyzeUrl(url) {
    try {
        setLoading(true);
        clearAlert();
        hideResult();

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Success - Display result
            displayResult(data.data);
            showAlert('Analisa berhasil! ✅', 'success');
        } else {
            // Error - Show error message
            const errorMsg = data.errors?.[0]?.message || data.message || 'Terjadi kesalahan saat menganalisa';
            showAlert(errorMsg, 'danger');
        }

    } catch (error) {
        console.error('Error:', error);
        showAlert('Gagal terhubung ke server. Pastikan server sedang berjalan.', 'danger');
    } finally {
        setLoading(false);
    }
}

/**
 * Display Result
 * @param {object} data - Result data
 */
function displayResult(data) {
    // Determine badge type
    const badgeType = data.label === 'Legal' ? 'success' : 'danger';

    // Update status badge
    statusBadge.innerHTML = createBadge(data.label, badgeType);

    // Update result values
    resultUrl.textContent = truncateUrl(data.url);
    resultUrl.title = data.url; // Show full URL on hover

    resultProb.textContent = formatProbability(data.probability);
    resultIp.textContent = data.ip || 'Unknown';
    resultLocation.textContent = data.location || 'Unknown';
    resultSnippet.textContent = truncateText(data.snippet, 200);

    // Show result section
    showResult();
}

// ============================================
// Utility Functions
// ============================================

/**
 * Format Probability
 * @param {number} prob - Probability value (0-1)
 * @returns {string} Formatted probability
 */
function formatProbability(prob) {
    return `${(prob * 100).toFixed(1)}%`;
}

/**
 * Truncate URL
 * @param {string} url - URL to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated URL
 */
function truncateUrl(url, maxLength = 40) {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
}

/**
 * Truncate Text
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength = 200) {
    if (!text || text.length <= maxLength) return text || '-';
    return text.substring(0, maxLength) + '...';
}

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} Is valid URL
 */
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// ============================================
// Event Listeners
// ============================================

/**
 * Form Submit Handler
 */
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = urlInput.value.trim();

    // Validate URL
    if (!url) {
        showAlert('Mohon masukkan URL website', 'warning');
        return;
    }

    if (!isValidUrl(url)) {
        showAlert('URL tidak valid. Pastikan format URL benar (contoh: https://example.com)', 'warning');
        return;
    }

    // Analyze URL
    await analyzeUrl(url);
});

/**
 * Input Focus Handler
 */
urlInput.addEventListener('focus', () => {
    clearAlert();
});

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🤖 AI Website Classifier initialized');
    urlInput.focus();
});

// Make resetForm available globally
window.resetForm = resetForm;
