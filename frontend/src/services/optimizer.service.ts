import { api } from "./api-client";
import { API_CONFIG } from "@/config/api";
import type { OptimizerRequest, OptimizerResponse } from "@/types/api";

/**
 * Optimizer Service
 * Handles optimizer comparison API calls
 */
export const optimizerService = {
    /**
     * Get optimizer comparison results
     * @param isLegal - Filter by legal (1) or illegal (0)
     * @param optimizers - Array of optimizers to compare
     * @returns Optimizer comparison results
     */
    getOptimizerComparison: async (
        isLegal: number,
        optimizers: string[] = ["sgd", "rmsprop", "adam"]
    ): Promise<OptimizerResponse> => {
        const requestBody: OptimizerRequest = {
            is_legal: isLegal,
            optimizers: optimizers,
        };

        return api.post<OptimizerResponse>(
            API_CONFIG.ENDPOINTS.OPTIMIZER,
            requestBody
        );
    },
};
