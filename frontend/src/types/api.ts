// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string | null;
  errors: string | null;
}

// Dataset Types
export interface DatasetData {
  id: number;
  link: string;
  title: string;
  description: string;
  keyword: string;
  is_legal: number;
  is_ilegal: number;
}

// Request Types
export interface DatasetByLinkRequest {
  link: string;
}

export interface ListDatasetRequest {
  is_legal?: number;
  limit_data?: number;
  page?: number;
}

// Response Types
export type DatasetByLinkResponse = ApiResponse<DatasetData>;

export interface ListDatasetResponse extends ApiResponse<DatasetData[]> {
  current_page: number;
  total_data: number;
  has_next: boolean;
  is_first: boolean;
  is_last: boolean;
}

// Confusion Matrix Types
export interface ConfusionMatrixRequest {
  is_legal: number;
}

export interface ConfusionMatrixData {
  is_legal: number;
  legal_count: number;
  illegal_count: number;
  ts_count: number;
  tp_count: number;
  tn_count: number;
  fp_count: number;
  fn_count: number;
  accuracy_count: number;
  precision_count: number;
  recall_count: number;
  f1_score_count: number;
  keterangan_legal: string;
  ts_penjelasan: string;
  tp_penjelasan: string;
  tn_penjelasan: string;
  fp_penjelasan: string;
  fn_penjelasan: string;
  accuracy_penjelasan: string;
  precision_penjelasan: string;
  recall_penjelasan: string;
  f1_score_penjelasan: string;
}

export type ConfusionMatrixResponse = ApiResponse<ConfusionMatrixData>;

// K-Fold Cross Validation Types
export interface KFoldRequest {
  is_legal: number;
}

export interface FoldResult {
  fold: number;
  test_size: number;
  tp: number;
  tn: number;
  fp: number;
  fn: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
}

export interface KFoldResults {
  k: number;
  fold_results: FoldResult[];
  average_accuracy: number;
  average_precision: number;
  average_recall: number;
  average_f1_score: number;
  std_accuracy: number;
  std_f1_score: number;
}

export interface KFoldPenjelasan {
  accuracy: string;
  precision: string;
  recall: string;
  f1_score: string;
}

export interface FoldKesimpulan {
  test_size: number;
  metrics_summary: string;
  confusion_matrix: string;
  interpretasi: string;
}

export interface KFoldData {
  is_legal: number;
  keterangan_legal: string;
  total_samples: number;
  legal_count: number;
  illegal_count: number;
  k_fold_3: KFoldResults;
  k_fold_5: KFoldResults;
  k_fold_3_penjelasan: KFoldPenjelasan;
  k_fold_5_penjelasan: KFoldPenjelasan;
  k_fold_kesimpulan: {
    k_fold_3: Record<string, FoldKesimpulan>;
    k_fold_5: Record<string, FoldKesimpulan>;
  };
}

export type KFoldResponse = ApiResponse<KFoldData>;

// Epoch Training Types
export interface EpochTrainingRequest {
  is_legal: number;
  max_epochs: number;
}

export interface EpochData {
  epoch: number;
  train_accuracy: number;
  train_loss: number;
}

export interface EpochSummary {
  initial_train_accuracy: number;
  initial_train_loss: number;
  final_train_accuracy: number;
  final_train_loss: number;
  improvement_train_accuracy: number;
  improvement_train_loss: number;
  total_epochs_run: number;
}

export interface EpochPenjelasan {
  training_mode: string;
  final_performance: string;
  improvement: string;
  no_validation: string;
  recommendation: string;
}

export interface EpochTrainingData {
  is_legal: number;
  keterangan_legal: string;
  max_epochs: number;
  patience: number | null;
  total_samples: number;
  train_samples: number;
  validation_samples: number;
  validation_split: number;
  epochs: EpochData[];
  best_epoch: number;
  early_stopped_at_epoch: number | null;
  summary: EpochSummary;
  penjelasan: EpochPenjelasan;
}

export type EpochTrainingResponse = ApiResponse<EpochTrainingData>;

// Batch Size Types
export interface BatchSizeRequest {
  is_legal: number;
  batch_sizes: number[];
}

export interface BatchSizeResult {
  batch_size: number;
  iterations_per_epoch: number;
  last_batch_size: number;
  speed_category: string;
  memory_efficiency: string;
  convergence_quality: string;
}

export interface BatchSizeComparison {
  smallest_batch: BatchSizeResult;
  recommended_batch: BatchSizeResult;
  largest_batch: BatchSizeResult;
}

export interface BatchSizePenjelasan {
  batch_size_concept: string;
  iterations_calculation: string;
  trade_offs: string;
  recommendation: string;
}

export interface BatchSizeData {
  is_legal: number;
  keterangan_legal: string;
  total_samples: number;
  batch_size_results: BatchSizeResult[];
  comparison: BatchSizeComparison;
  penjelasan: BatchSizePenjelasan;
}

export type BatchSizeResponse = ApiResponse<BatchSizeData>;

// Optimizer Comparison Types
export interface OptimizerRequest {
  is_legal: number;
  optimizers: string[];
}

export interface OptimizerCharacteristics {
  pros: string[];
  cons: string[];
}

export interface OptimizerResult {
  optimizer: string;
  full_name: string;
  learning_rate: number;
  convergence_speed: string;
  stability: string;
  epochs_to_converge: number;
  final_accuracy: number;
  characteristics: OptimizerCharacteristics;
}

export interface OptimizerComparison {
  recommended: OptimizerResult;
  fastest_convergence: OptimizerResult;
  highest_accuracy: OptimizerResult;
  most_stable: OptimizerResult;
}

export interface OptimizerPenjelasan {
  optimizer_concept: string;
  sgd_explanation: string;
  rmsprop_explanation: string;
  adam_explanation: string;
  recommendation: string;
}

export interface OptimizerData {
  is_legal: number;
  keterangan_legal: string;
  total_samples: number;
  optimizer_results: OptimizerResult[];
  comparison: OptimizerComparison;
  penjelasan: OptimizerPenjelasan;
}

export type OptimizerResponse = ApiResponse<OptimizerData>;
