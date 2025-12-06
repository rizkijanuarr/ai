# Flow Bisnis

```mermaid
flowchart LR
    A[User] --> B[Input URL]
    B --> C[Flask API]
    C --> D[Scrape Website<br/>(meta-graph / meta-tags)]
    D --> E[Pre-process]
    E --> F[IndoBERT Classifier]
    F --> G{Output}
    G --> |Legal| H[Legal]
    G --> |Ilegal| I[Ilegal]
```

## Langkah Detail
1. **User & Input URL**  
   Pengguna mengirim URL melalui antarmuka (web / REST).

2. **Flask API**  
   Endpoint Flask menerima URL, mem-validasi, lalu meneruskannya ke modul scraping.

3. **Scrape Konten**  
   • Mengambil HTML.  
   • Mengekstraksi `<meta property="og:*">`, `<meta name="description">`, dsb.  
   • Menyusun dokumen teks (meta-graph atau standar meta-tag).

4. **Pre-processing**  
   • Normalisasi (lower-case, remove punctuation, dsb).  
   • Tokenisasi sesuai vocab IndoBERT.  
   • Padding & encoding.

5. **IndoBERT**  
   • Fine-tuned untuk klasifikasi legalitas konten.  
   • Menghasilkan probabilitas kelas.

6. **Output**  
   Threshold > 0.5 → “Legal”, else “Ilegal”.  
   Respons dikirim kembali ke klien.

---

## Evaluasi Model

| Metric | Rumus |
| ------ | ----- |
| Accuracy | (TP + TN) / (TP + FP + TN + FN) |
| Precision | TP / (TP + FP) |
| Recall | TP / (TP + FN) |
| F1-Score | 2 × Precision × Recall / (Precision + Recall) |

```python
from sklearn.metrics import confusion_matrix, classification_report

y_pred = model.predict(X_test)
cm      = confusion_matrix(y_test, y_pred, labels=[1,0])  # 1=Legal, 0=Ilegal
print(cm)                     # [[TP FP]\n [FN TN]]
print(classification_report(y_test, y_pred, target_names=['Ilegal', 'Legal']))
```

### Visualisasi Confusion Matrix

```python
import seaborn as sns, matplotlib.pyplot as plt
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=['Legal', 'Ilegal'],
            yticklabels=['Legal', 'Ilegal'])
plt.xlabel('Predicted'); plt.ylabel('True'); plt.show()
```
