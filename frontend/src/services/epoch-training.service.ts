import { api } from "./api-client";
import { API_CONFIG } from "@/config/api";
import type { EpochTrainingRequest, EpochTrainingResponse } from "@/types/api";

/**
 * Epoch Training Service
 * Handles epoch training API calls
 */
export const epochTrainingService = {
  /**
   * Get epoch training results
   * @param isLegal - Filter by legal (1) or illegal (0)
   * @param maxEpochs - Maximum number of epochs
   * @returns Epoch training results
   */
  getEpochTraining: async (isLegal: number, maxEpochs: number = 10): Promise<EpochTrainingResponse> => {
    const requestBody: EpochTrainingRequest = {
      is_legal: isLegal,
      max_epochs: maxEpochs,
    };

    return api.post<EpochTrainingResponse>(
      API_CONFIG.ENDPOINTS.EPOCH_TRAINING,
      requestBody
    );
  },
};
