import { API_CONFIG, getHeaders } from "@/config/api";

// Custom Error Class
export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public errors?: string
    ) {
        super(message);
        this.name = "ApiError";
    }
}

// Generic API Request Handler
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        const response = await fetch(url, {
            ...options,
            headers: {
                ...getHeaders(),
                ...options.headers,
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Parse response
        const data = await response.json();

        // Check if response is successful
        if (!response.ok) {
            throw new ApiError(
                data.message || "Terjadi kesalahan pada server",
                response.status,
                data.errors
            );
        }

        // Check API success flag
        if (!data.success) {
            throw new ApiError(
                data.message || "Request gagal",
                response.status,
                data.errors
            );
        }

        return data;
    } catch (error) {
        // Handle timeout
        if (error instanceof Error && error.name === "AbortError") {
            throw new ApiError("Request timeout. Silakan coba lagi.");
        }

        // Handle network errors
        if (error instanceof TypeError) {
            throw new ApiError(
                "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
            );
        }

        // Re-throw ApiError
        if (error instanceof ApiError) {
            throw error;
        }

        // Unknown error
        throw new ApiError("Terjadi kesalahan yang tidak diketahui");
    }
}

// API Methods
export const api = {
    // GET Request
    get: <T>(endpoint: string, options?: RequestInit): Promise<T> => {
        return apiRequest<T>(endpoint, {
            ...options,
            method: "GET",
        });
    },

    // GET Request with Body (unusual but some backends require it)
    getWithBody: <T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> => {
        return apiRequest<T>(endpoint, {
            ...options,
            method: "GET",
            body: body ? JSON.stringify(body) : undefined,
        });
    },

    // POST Request
    post: <T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> => {
        return apiRequest<T>(endpoint, {
            ...options,
            method: "POST",
            body: body ? JSON.stringify(body) : undefined,
        });
    },

    // PUT Request
    put: <T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> => {
        return apiRequest<T>(endpoint, {
            ...options,
            method: "PUT",
            body: body ? JSON.stringify(body) : undefined,
        });
    },

    // DELETE Request
    delete: <T>(endpoint: string, options?: RequestInit): Promise<T> => {
        return apiRequest<T>(endpoint, {
            ...options,
            method: "DELETE",
        });
    },
};
