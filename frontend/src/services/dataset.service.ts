import { api } from "./api-client";
import { API_CONFIG } from "@/config/api";
import type {
  DatasetByLinkRequest,
  DatasetByLinkResponse,
  ListDatasetRequest,
  ListDatasetResponse,
} from "@/types/api";

/**
 * Dataset Service
 * Handles all dataset-related API calls
 */
export const datasetService = {
  /**
   * Get dataset by link
   * @param link - Website URL to check
   * @returns Dataset information including classification
   */
  getByLink: async (link: string): Promise<DatasetByLinkResponse> => {
    const requestBody: DatasetByLinkRequest = { link };

    return api.post<DatasetByLinkResponse>(
      API_CONFIG.ENDPOINTS.DATASET_BY_LINK,
      requestBody
    );
  },

  /**
   * Get list of datasets with pagination
   * @param params - Filter and pagination parameters
   * @returns Paginated list of datasets
   */
  getList: async (params: ListDatasetRequest = {}): Promise<ListDatasetResponse> => {
    // Build query parameters
    const queryParams = new URLSearchParams({
      is_legal: (params.is_legal !== undefined ? params.is_legal : 1).toString(),
      limit_data: (params.limit_data || 10).toString(),
      page: (params.page || 1).toString(),
    });

    const endpoint = `${API_CONFIG.ENDPOINTS.LIST_DATASET}?${queryParams.toString()}`;

    return api.get<ListDatasetResponse>(endpoint);
  },
};
