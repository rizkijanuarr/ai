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

/**
 * Format Number
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
    return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Debounce Function
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {function} Debounced function
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export utilities
window.Utils = {
    formatProbability,
    truncateUrl,
    truncateText,
    isValidUrl,
    formatNumber,
    debounce
};
