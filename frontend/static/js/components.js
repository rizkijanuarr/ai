// ============================================
// Reusable UI Components
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
            <span style="flex: 1;">${message}</span>
            <button class="alert-close" onclick="clearAlert()" title="Tutup">✖️</button>
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
        warning: '⚠️',
        info: 'ℹ️'
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
 * Create Card Component
 * @param {object} options - Card options
 * @returns {string} HTML string
 */
function createCard({ title, subtitle, content, footer }) {
    return `
        <div class="card fade-in">
            ${title ? `
                <div class="card-header">
                    <h3 class="card-title">${title}</h3>
                    ${subtitle ? `<p class="card-subtitle">${subtitle}</p>` : ''}
                </div>
            ` : ''}
            ${content ? `<div class="card-body">${content}</div>` : ''}
            ${footer ? `<div class="card-footer">${footer}</div>` : ''}
        </div>
    `;
}

// Export components
window.UIComponents = {
    createAlert,
    getAlertIcon,
    createBadge,
    createCard
};
