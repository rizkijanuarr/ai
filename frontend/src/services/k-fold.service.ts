import { api } from "./api-client";
import { API_CONFIG } from "@/config/api";
import type { KFoldRequest, KFoldResponse } from "@/types/api";

/**
 * K-Fold Cross Validation Service
 * Handles K-Fold cross validation API calls
 */
export const kFoldService = {
    /**
     * Get K-Fold cross validation results
     * @param isLegal - Filter by legal (1) or illegal (0)
     * @returns K-Fold results for k=3 and k=5
     */
    getKFold: async (isLegal: number): Promise<KFoldResponse> => {
        const requestBody: KFoldRequest = {
            is_legal: isLegal,
        };

        return api.post<KFoldResponse>(
            API_CONFIG.ENDPOINTS.K_FOLD_CROSS_VALIDATION,
            requestBody
        );
    },
};
