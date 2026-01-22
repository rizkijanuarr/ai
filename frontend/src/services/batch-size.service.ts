import { api } from "./api-client";
import { API_CONFIG } from "@/config/api";
import type { BatchSizeRequest, BatchSizeResponse } from "@/types/api";

/**
 * Batch Size Service
 * Handles batch size comparison API calls
 */
export const batchSizeService = {
    /**
     * Get batch size comparison results
     * @param isLegal - Filter by legal (1) or illegal (0)
     * @param batchSizes - Array of batch sizes to compare
     * @returns Batch size comparison results
     */
    getBatchSizeComparison: async (
        isLegal: number,
        batchSizes: number[] = [16, 32, 64, 128]
    ): Promise<BatchSizeResponse> => {
        const requestBody: BatchSizeRequest = {
            is_legal: isLegal,
            batch_sizes: batchSizes,
        };

        return api.post<BatchSizeResponse>(
            API_CONFIG.ENDPOINTS.BATCH_SIZE,
            requestBody
        );
    },
};
