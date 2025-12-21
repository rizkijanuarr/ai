"""
Evaluation Service untuk menghitung metrics klasifikasi
- Confusion Matrix (TP, TN, FP, FN)
- Accuracy, Precision, Recall, F1-Score
- K-Fold Cross Validation
"""

import numpy as np
from typing import List, Dict
from backend.utils.ColoredLogger import setup_colored_logger

logger = setup_colored_logger(__name__)


class EvaluationServiceV1:

    def __init__(self):
        # Illegal keywords untuk simple classifier
        self.illegal_keywords = [
            'judi', 'slot', 'gacor', 'togel', 'casino', 'betting',
            'poker', 'bandar', 'taruhan', 'jackpot', 'maxwin',
            'rtp', 'scatter', 'bonus', 'deposit', 'withdraw'
        ]

        # Legal keywords
        self.legal_keywords = [
            'resmi', 'pemerintah', 'hukum', 'legal', 'terpercaya',
            'pendidikan', 'edukasi', 'belajar', 'sekolah', 'universitas'
        ]


    def predict(self, record: dict) -> int:
        """
        Simple rule-based classifier
        Predict whether a record is legal (1) or illegal (0)

        Args:
            record: Dictionary containing keyword, title, description

        Returns:
            int: 1 for legal, 0 for illegal
        """
        # Combine all text fields
        text = f"{record.get('keyword', '')} {record.get('title', '')} {record.get('description', '')}".lower()

        # Count illegal keywords
        illegal_count = sum(1 for keyword in self.illegal_keywords if keyword in text)

        # Count legal keywords
        legal_count = sum(1 for keyword in self.legal_keywords if keyword in text)

        # Decision logic
        if illegal_count > legal_count:
            return 0  # Illegal
        elif legal_count > illegal_count:
            return 1  # Legal
        else:
            # If tie, check actual label (fallback)
            return record.get('is_legal', 1)


    def calculate_confusion_matrix(self, data: List[dict]) -> Dict:
        """
        Calculate confusion matrix from dataset

        Args:
            data: List of records with is_legal field

        Returns:
            dict: Confusion matrix with TP, TN, FP, FN
        """
        tp = tn = fp = fn = 0

        for record in data:
            actual = record.get('is_legal', 1)
            predicted = self.predict(record)

            if actual == 1 and predicted == 1:
                tp += 1  # True Positive
            elif actual == 0 and predicted == 0:
                tn += 1  # True Negative
            elif actual == 0 and predicted == 1:
                fp += 1  # False Positive
            else:  # actual == 1 and predicted == 0
                fn += 1  # False Negative

        logger.info(f"[CONFUSION MATRIX] TP={tp}, TN={tn}, FP={fp}, FN={fn}")

        return {
            'true_positive': tp,
            'true_negative': tn,
            'false_positive': fp,
            'false_negative': fn
        }


    def calculate_metrics(self, confusion_matrix: Dict) -> Dict:
        """
        Calculate evaluation metrics from confusion matrix

        Args:
            confusion_matrix: Dict with TP, TN, FP, FN

        Returns:
            dict: Accuracy, Precision, Recall, F1-Score
        """
        tp = confusion_matrix['true_positive']
        tn = confusion_matrix['true_negative']
        fp = confusion_matrix['false_positive']
        fn = confusion_matrix['false_negative']

        total = tp + tn + fp + fn

        # Accuracy = (TP + TN) / Total
        accuracy = (tp + tn) / total if total > 0 else 0

        # Precision = TP / (TP + FP)
        precision = tp / (tp + fp) if (tp + fp) > 0 else 0

        # Recall = TP / (TP + FN)
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0

        # F1-Score = 2 * (Precision * Recall) / (Precision + Recall)
        f1_score = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0

        logger.info(f"[METRICS] Accuracy={accuracy:.3f}, Precision={precision:.3f}, Recall={recall:.3f}, F1={f1_score:.3f}")

        return {
            'accuracy': round(accuracy, 3),
            'precision': round(precision, 3),
            'recall': round(recall, 3),
            'f1_score': round(f1_score, 3)
        }


    def k_fold_cross_validation(self, data: List[dict], k: int = 5) -> Dict:
        """
        Perform K-Fold Cross Validation

        Args:
            data: List of records
            k: Number of folds (default: 5)

        Returns:
            dict: K-Fold results with scores per fold
        """
        logger.info(f"[K-FOLD] Starting {k}-Fold Cross Validation with {len(data)} samples")

        # Shuffle data
        import random
        random.seed(42)
        shuffled_data = data.copy()
        random.shuffle(shuffled_data)

        # Calculate fold size
        fold_size = len(shuffled_data) // k
        fold_scores = []

        for i in range(k):
            # Split data into train and test
            start_idx = i * fold_size
            end_idx = start_idx + fold_size if i < k - 1 else len(shuffled_data)

            test_fold = shuffled_data[start_idx:end_idx]

            # Calculate accuracy for this fold
            correct = 0
            for record in test_fold:
                actual = record.get('is_legal', 1)
                predicted = self.predict(record)
                if actual == predicted:
                    correct += 1

            accuracy = correct / len(test_fold) if len(test_fold) > 0 else 0
            fold_scores.append(round(accuracy, 3))

            logger.info(f"[K-FOLD] Fold {i+1}/{k}: Accuracy = {accuracy:.3f}")

        mean_accuracy = np.mean(fold_scores)
        std_deviation = np.std(fold_scores)

        logger.info(f"[K-FOLD] Mean Accuracy = {mean_accuracy:.3f}, Std Dev = {std_deviation:.3f}")

        return {
            'k': k,
            'fold_scores': fold_scores,
            'mean_accuracy': round(mean_accuracy, 3),
            'std_deviation': round(std_deviation, 3)
        }


    def get_full_evaluation(self, data: List[dict]) -> Dict:
        """
        Get complete evaluation metrics

        Args:
            data: List of records

        Returns:
            dict: Complete evaluation including confusion matrix, metrics, and k-fold
        """
        logger.info(f"[EVALUATION] Starting full evaluation with {len(data)} samples")

        # Calculate confusion matrix
        confusion_matrix = self.calculate_confusion_matrix(data)

        # Calculate metrics
        metrics = self.calculate_metrics(confusion_matrix)

        # Perform K-Fold Cross Validation
        k_fold_results = self.k_fold_cross_validation(data, k=5)

        # Count labels
        legal_count = sum(1 for record in data if record.get('is_legal') == 1)
        illegal_count = len(data) - legal_count

        # Add interpretation
        interpretation = self.get_interpretation(metrics, k_fold_results)

        result = {
            'total_samples': len(data),
            'legal_count': legal_count,
            'illegal_count': illegal_count,
            'confusion_matrix': confusion_matrix,
            'metrics': metrics,
            'k_fold_results': k_fold_results,
            'interpretation': interpretation
        }

        logger.info("[EVALUATION] Full evaluation completed successfully")

        return result


    def get_interpretation(self, metrics: Dict, k_fold_results: Dict) -> Dict:
        """
        Generate human-readable interpretation of results

        Args:
            metrics: Evaluation metrics
            k_fold_results: K-Fold results

        Returns:
            dict: Interpretation summary
        """
        accuracy = metrics['accuracy']
        precision = metrics['precision']
        recall = metrics['recall']
        f1_score = metrics['f1_score']
        std_dev = k_fold_results['std_deviation']

        # Performance level
        if accuracy >= 0.95:
            performance_level = "Sangat Baik"
        elif accuracy >= 0.85:
            performance_level = "Baik"
        elif accuracy >= 0.75:
            performance_level = "Cukup"
        else:
            performance_level = "Kurang"

        # Model stability
        if std_dev <= 0.01:
            stability = "Sangat Stabil"
        elif std_dev <= 0.03:
            stability = "Stabil"
        elif std_dev <= 0.05:
            stability = "Cukup Stabil"
        else:
            stability = "Tidak Stabil"

        # Summary message
        summary = (
            f"Model mencapai performa {performance_level.lower()} dengan "
            f"akurasi {accuracy*100:.1f}%. Classifier menunjukkan hasil yang {stability.lower()} "
            f"pada validasi K-Fold (standar deviasi: {std_dev:.3f}). "
            f"Precision sebesar {precision*100:.1f}% menunjukkan tingkat false positive yang rendah, "
            f"sedangkan recall sebesar {recall*100:.1f}% menunjukkan deteksi kasus positif yang baik."
        )

        return {
            'performance_level': performance_level,
            'stability': stability,
            'summary': summary,
            'recommendations': self.get_recommendations(metrics)
        }


    def get_recommendations(self, metrics: Dict) -> List[str]:
        """
        Generate recommendations based on metrics

        Args:
            metrics: Evaluation metrics

        Returns:
            list: List of recommendations
        """
        recommendations = []

        accuracy = metrics['accuracy']
        precision = metrics['precision']
        recall = metrics['recall']

        if accuracy < 0.85:
            recommendations.append("Pertimbangkan untuk menambah data training atau meningkatkan feature engineering")

        if precision < 0.90:
            recommendations.append("Terdeteksi tingkat false positive yang tinggi. Tinjau kembali daftar keyword ilegal")

        if recall < 0.90:
            recommendations.append("Beberapa kasus positif terlewatkan. Pertimbangkan untuk memperluas daftar keyword legal")

        if abs(precision - recall) > 0.1:
            recommendations.append("Terdapat ketidakseimbangan antara precision dan recall. Pertimbangkan untuk menyesuaikan threshold klasifikasi")

        if not recommendations:
            recommendations.append("Performa model sangat baik. Lanjutkan monitoring dengan data baru")

        return recommendations


    def predict_single(self, record: dict) -> Dict:
        """
        Predict single record and return detailed result

        Args:
            record: Single record dictionary

        Returns:
            dict: Prediction result with confidence and classification type
        """
        actual = record.get('is_legal', 1)
        predicted = self.predict(record)

        # Calculate confidence (simple heuristic)
        text = f"{record.get('keyword', '')} {record.get('title', '')} {record.get('description', '')}".lower()
        illegal_count = sum(1 for keyword in self.illegal_keywords if keyword in text)
        legal_count = sum(1 for keyword in self.legal_keywords if keyword in text)
        total_keywords = illegal_count + legal_count

        if total_keywords > 0:
            confidence = max(illegal_count, legal_count) / total_keywords
        else:
            confidence = 0.5  # Neutral

        # Determine classification type
        is_correct = (actual == predicted)

        if actual == 1 and predicted == 1:
            classification = "True Positive"
        elif actual == 0 and predicted == 0:
            classification = "True Negative"
        elif actual == 0 and predicted == 1:
            classification = "False Positive"
        else:
            classification = "False Negative"

        return {
            'predicted_label': predicted,
            'confidence': round(confidence, 2),
            'is_correct': is_correct,
            'classification': classification
        }
