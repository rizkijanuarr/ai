// ============================================
// API Functions
// ============================================

/**
 * Generic API Call
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} API response
 */
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Analyze URL (Scrape)
 * @param {string} url - URL to analyze
 * @returns {Promise} Analysis result
 */
async function analyzeUrl(url) {
    return apiCall(API_CONFIG.ENDPOINTS.SCRAPE, {
        method: 'POST',
        body: JSON.stringify({ url })
    });
}

/**
 * Get Dataset List
 * @param {object} params - Query parameters
 * @returns {Promise} Dataset list
 */
async function getDatasetList(params = {}) {
    const { is_legal = null, limit_data = 10, page = 1 } = params;

    const queryParams = new URLSearchParams();
    if (is_legal !== null) queryParams.append('is_legal', is_legal);
    queryParams.append('limit_data', limit_data);
    queryParams.append('page', page);

    return apiCall(`${API_CONFIG.ENDPOINTS.LIST_DATASET}?${queryParams}`);
}

/**
 * Get Dataset Detail by ID
 * @param {number} id - Dataset ID
 * @returns {Promise} Dataset detail
 */
async function getDatasetDetail(id) {
    return apiCall(`${API_CONFIG.ENDPOINTS.DETAIL_DATASET}/${id}`);
}

/**
 * Get Dataset by Link
 * @param {string} link - Website link
 * @returns {Promise} Dataset detail
 */
async function getDatasetByLink(link) {
    return apiCall(API_CONFIG.ENDPOINTS.DATASET_BY_LINK, {
        method: 'POST',
        body: JSON.stringify({ link })
    });
}

/**
 * Search Dataset
 * @param {string} searchQuery - Search query
 * @param {object} params - Additional parameters
 * @returns {Promise} Search results
 */
async function searchDataset(searchQuery, params = {}) {
    const { is_legal = null, limit_data = 10, page = 1 } = params;

    return apiCall(API_CONFIG.ENDPOINTS.SEARCH_DATASET, {
        method: 'POST',
        body: JSON.stringify({
            search_query: searchQuery,
            is_legal,
            limit_data,
            page
        })
    });
}

/**
 * Get Evaluation Metrics
 * @returns {Promise} Evaluation metrics
 */
async function getEvaluationMetrics() {
    return apiCall(API_CONFIG.ENDPOINTS.EVALUATION);
}

// Export API functions
window.API = {
    analyzeUrl,
    getDatasetList,
    getDatasetDetail,
    getDatasetByLink,
    searchDataset,
    getEvaluationMetrics
};
