// API Configuration
export const API_CONFIG = {
    BASE_URL: (import.meta as any).env?.VITE_API_URL || "http://127.0.0.1:5002",
    ENDPOINTS: {
        DATASET_BY_LINK: "/api/v1/dataset-by-link",
        LIST_DATASET: "/api/v1/list-dataset",
        CONFUSION_MATRIX: "/api/v1/confusion-matrix",
        K_FOLD_CROSS_VALIDATION: "/api/v1/k-fold-cross-validation",
        EPOCH_TRAINING: "/api/v1/epoch-training",
        BATCH_SIZE: "/api/v1/batch-size",
        OPTIMIZER: "/api/v1/optimizer",
    },
    TIMEOUT: 30000, // 30 seconds
} as const;

// API Headers
export const getHeaders = (): HeadersInit => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true", // Bypass Ngrok warning page
});
