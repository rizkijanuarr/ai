import { api } from "./api-client";
import { API_CONFIG } from "@/config/api";
import type {
  ConfusionMatrixRequest,
  ConfusionMatrixResponse,
} from "@/types/api";

/**
 * Confusion Matrix Service
 * Handles confusion matrix API calls
 */
export const confusionMatrixService = {
  /**
   * Get confusion matrix data
   * @param isLegal - Filter by legal (1) or illegal (0)
   * @returns Confusion matrix metrics
   */
  getMatrix: async (isLegal: number): Promise<ConfusionMatrixResponse> => {
    const requestBody: ConfusionMatrixRequest = {
      is_legal: isLegal,
    };

    return api.post<ConfusionMatrixResponse>(
      API_CONFIG.ENDPOINTS.CONFUSION_MATRIX,
      requestBody
    );
  },
};
