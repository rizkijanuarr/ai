# PENGUJIAN DATA

Dokumentasi ini menjelaskan tahapan-tahapan proses pengujian data dalam machine learning, khususnya untuk klasifikasi website ilegal vs legal.

---

## PROSES 1 - CONFUSION MATRIX

### Untuk klasifikasi website ilegal vs legal:

|                    | **Prediksi Ilegal** | **Prediksi Legal** |
|--------------------|---------------------|--------------------|
| **Aktual Ilegal**  | TP                  | FN                 |
| **Aktual Legal**   | FP                  | TN                 |

### Rumus metrik evaluasi

#### • Accuracy

$$Accuracy = \frac{TP + TN}{TP + TN + FP + FN}$$

#### • Precision

$$Precision = \frac{TP}{TP + FP}$$

#### • Recall

$$Recall = \frac{TP}{TP + FN}$$

#### • F1-Score

$$F1 = 2 \times \frac{Precision \times Recall}{Precision + Recall}$$

---

## PROSES 2 - K-FOLD CROSS VALIDATION (k = 3 dan 5)

Dataset $D$ dibagi menjadi $k$ bagian sama besar:

$$D = \{D_1, D_2, \ldots, D_k\}$$

### Model dilatih sebanyak $k$ kali:

• 1 fold → data uji

• $k - 1$ fold → data latih

### Rumus rata-rata performa

Misal akurasi tiap fold:

$$Acc_1, Acc_2, \ldots, Acc_k$$

Maka:

$$Accuracy_{avg} = \frac{1}{k} \sum_{i=1}^{k} Acc_i$$

---

## PROSES 3 - EPOCH + EARLY STOPPING

### Loss function (umum untuk klasifikasi biner)

$$Loss = -\frac{1}{N} \sum_{i=1}^{N} [y_i \log(\hat{y}_i) + (1 - y_i) \log(1 - \hat{y}_i)]$$

### Early stopping

Training dihentikan jika:

$$Loss_{val}^{(t)} \geq Loss_{val}^{(t-p)}$$

dengan:

• $t$ = epoch saat ini

• $p$ = patience

🔴 **Tujuan: mencegah overfitting.**

---

## PROSES 4 - BATCH SIZE

### Jika:

• jumlah data = $N$

• batch size = $B$

### Jumlah iterasi per epoch:

$$Iterasi = \frac{N}{B}$$

🔴 **Batch size tidak punya rumus evaluasi**, tapi ini **rumus operasional** yang sering ditulis di metodologi.

---

## PROSES 5 - OPTIMIZER (cukup rumus inti saja)

### a) SGD

$$w_{t+1} = w_t - \alpha \nabla L(w_t)$$

### b) RMSprop

$$v_t = \beta v_{t-1} + (1 - \beta)(\nabla L)^2$$

$$w_{t+1} = w_t - \frac{\alpha}{\sqrt{v_t + \epsilon}} \nabla L$$

### c) Adam

$$m_t = \beta_1 m_{t-1} + (1 - \beta_1)\nabla L$$

$$v_t = \beta_2 v_{t-1} + (1 - \beta_2)(\nabla L)^2$$

$$w_{t+1} = w_t - \frac{\alpha}{\sqrt{v_t + \epsilon}}$$

---

## Catatan

Dokumentasi ini mencakup semua komponen penting dalam pengujian model machine learning:
- **Evaluasi performa** menggunakan confusion matrix dan metrik turunannya
- **Validasi model** menggunakan K-Fold Cross Validation
- **Optimasi training** dengan epoch, early stopping, dan batch size
- **Algoritma optimasi** untuk update bobot model

Setiap tahapan memiliki peran penting dalam memastikan model yang dihasilkan akurat, robust, dan tidak overfitting.
