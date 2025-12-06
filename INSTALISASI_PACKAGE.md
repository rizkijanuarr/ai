# Instalasi & Package

## Paket Utama
| Package | Kegunaan |
|---------|----------|
| Flask | REST API & routing |
| flask-cors | Cross-Origin Resource Sharing (CORS) |
| flasgger | Swagger UI & Documentation |
| requests | Mengambil halaman web |
| beautifulsoup4 | Parsing HTML & meta-tag |
| lxml | Parser cepat untuk BeautifulSoup |
| transformers | Memuat model IndoBERT |
| torch | Backend deep learning |
| scikit-learn | Confusion matrix & metrik |
| pandas | Manipulasi dataset |
| seaborn | Visualisasi confusion matrix |
| matplotlib | Visualisasi dasar |
| tqdm | Progress bar |

## Langkah Instalasi Cepat
1. Buat & aktifkan virtual environment
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # macOS / Linux
   # venv\Scripts\activate  # Windows
   ```
2. Instal dependensi
   ```bash
   pip install -r requirements.txt
   ```
3. Jalankan aplikasi Flask
   ```bash
   lsof -t -i :5002 | xargs kill -9
   python3 app.py
   ```
   Aplikasi akan berjalan di `http://localhost:5002`.
   Dokumentasi Swagger dapat diakses di `http://localhost:5002/apidocs`.

## Paket Opsional
- python-dotenv – variabel lingkungan
- gunicorn / uvicorn – deployment production
- black, isort, flake8 – formatting & linting
- pytest – testing otomatis

## Memperbarui requirements.txt
Tambah paket baru? Jalankan:
```bash
pip freeze > requirements.txt
```
