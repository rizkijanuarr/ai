// ============================================
// API Configuration
// ============================================

const API_CONFIG = {
    BASE_URL: '/api/v1',
    ENDPOINTS: {
        SCRAPE: '/api/v1/scrape',
        LIST_DATASET: '/api/v1/list-dataset',
        DETAIL_DATASET: '/api/v1/detail-dataset',
        SEARCH_DATASET: '/api/v1/search-dataset',
        DATASET_BY_LINK: '/api/v1/dataset-by-link',
        EVALUATION: '/api/v1/evaluation-metrics'
    }
};

// Export for use in other modules
window.API_CONFIG = API_CONFIG;
