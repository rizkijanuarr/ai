# 📦 INSTALASI PACKAGE

## 🎯 Prerequisites

Sebelum instalasi, pastikan sistem sudah memiliki:

- **Python**: 3.14 atau lebih tinggi
- **pip**: Package manager Python
- **Git**: Untuk clone repository
- **Internet Connection**: Untuk download dependencies & AI model

---

## ⚡ Langkah Otomatis Install & Running Project

**Cara tercepat untuk install dan running project (Recommended untuk semua user):**

### **🪟 Windows**

```cmd
REM 1. Clone repository
git clone https://github.com/rizkijanuarr/ai
cd ai

REM 2. Run script otomatis (Install + Run)
running_command.bat
```

**Selesai!** Server akan otomatis berjalan di `http://localhost:5002`

---

### **🍎🐧 macOS / Linux**

```bash
# 1. Clone repository
git clone https://github.com/rizkijanuarr/ai
cd ai

# 2. Berikan permission execute
chmod +x running_command.sh

# 3. Run script otomatis (Install + Run)
./running_command.sh
```

**Selesai!** Server akan otomatis berjalan di `http://localhost:5002`

---

### **✅ Apa yang Dilakukan Script Otomatis?**

Script `running_command.bat` (Windows) dan `running_command.sh` (macOS/Linux) akan:

1. ✅ **Check & Create** virtual environment (jika belum ada)
2. ✅ **Activate** virtual environment
3. ✅ **Upgrade** pip ke versi terbaru
4. ✅ **Install** semua dependencies dari `requirements.txt`
5. ✅ **Kill** process yang menggunakan port 5002 (jika ada)
6. ✅ **Run** aplikasi Flask

**Total waktu:** ~5-10 menit (tergantung kecepatan internet)

---

### **🌐 Akses Aplikasi**

Setelah script selesai, buka browser dan akses:

- **API Endpoint**: <http://localhost:5002/api/v1/scrape>
- **Swagger UI (API Docs)**: <http://localhost:5002/apidocs>
- **Health Check**: <http://localhost:5002/>

---

### **🔄 Running Project Selanjutnya**

Setelah instalasi pertama, untuk running project lagi cukup:

**Windows:**

```cmd
cd ai
running_command.bat
```

**macOS/Linux:**

```bash
cd ai
./running_command.sh
```

Script akan otomatis skip instalasi jika dependencies sudah terinstall.

---

### **🛑 Stop Server**

Untuk stop server:

- Tekan `Ctrl + C` di terminal/command prompt

---

## 📖 Metode Instalasi Lainnya

Jika ingin instalasi manual atau custom setup, pilih salah satu metode berikut:

1. **[Instalasi dari GitHub](#1-instalasi-dari-github-recommended)** ✅ Recommended
2. **[Instalasi Manual](#2-instalasi-manual)**
3. **[Instalasi Windows](#3-instalasi-windows)**
4. **[Instalasi macOS/Linux](#4-instalasi-macoslinux)**

---

## 1️⃣ Instalasi dari GitHub (Recommended)

### **Step-by-Step:**

```bash
# 1. Clone repository
git clone https://github.com/rizkijanuarr/ai
cd ai

# 2. Pilih platform:
# - Windows: Lanjut ke bagian "Instalasi Windows"
# - macOS/Linux: Lanjut ke bagian "Instalasi macOS/Linux"
```

---

## 2️⃣ Instalasi Manual

### **Langkah 1: Download Project**

**Option A: Download ZIP**

1. Kunjungi repository GitHub
2. Click tombol "Code" → "Download ZIP"
3. Extract file ZIP
4. Buka terminal/command prompt di folder hasil extract

**Option B: Clone dengan Git**

```bash
git clone https://github.com/rizkijanuarr/ai
cd ai
```

### **Langkah 2: Buat Virtual Environment**

```bash
# Buat virtual environment
python -m venv venv

# Atau gunakan python3 (macOS/Linux)
python3 -m venv venv
```

### **Langkah 3: Aktifkan Virtual Environment**

**Windows:**

```cmd
venv\Scripts\activate
```

**macOS/Linux:**

```bash
source venv/bin/activate
```

**Indikator berhasil:**

```
(venv) user@computer:~/ai$
```

### **Langkah 4: Upgrade pip**

```bash
pip install --upgrade pip
```

### **Langkah 5: Install Dependencies**

```bash
pip install -r requirements.txt
```

**Proses ini akan memakan waktu 5-15 menit** tergantung kecepatan internet.

### **Langkah 6: Run Application**

**Windows:**

```cmd
python app.py
```

**macOS/Linux:**

```bash
python3 app.py
```

### **Langkah 7: Verifikasi**

Buka browser dan akses:

- **API**: <http://localhost:5002/api/v1/scrape>
- **Swagger UI**: <http://localhost:5002/apidocs>

---

## 3️⃣ Instalasi Windows

### **🪟 Menggunakan Script Otomatis (Recommended)**

```cmd
# 1. Clone repository
git clone https://github.com/rizkijanuarr/ai
cd ai

# 2. Run script otomatis
running_command.bat
```

**Script akan otomatis:**

- ✅ Membuat virtual environment
- ✅ Mengaktifkan virtual environment
- ✅ Upgrade pip
- ✅ Install semua dependencies
- ✅ Kill process di port 5002 (jika ada)
- ✅ Run aplikasi

### **🔧 Manual Installation (Windows)**

**Step 1: Install Python**

1. Download Python dari <https://www.python.org/downloads/>
2. **PENTING**: Centang "Add Python to PATH" saat install
3. Verify installation:

   ```cmd
   python --version
   ```

**Step 2: Clone Repository**

```cmd
git clone https://github.com/rizkijanuarr/ai
cd ai
```

**Step 3: Buat Virtual Environment**

```cmd
python -m venv venv
```

**Step 4: Aktifkan Virtual Environment**

```cmd
venv\Scripts\activate
```

**Step 5: Install Dependencies**

```cmd
pip install --upgrade pip
pip install -r requirements.txt
```

**Step 6: Run Application**

```cmd
python app.py
```

### **🐛 Troubleshooting Windows**

**Problem: `python` command not found**

```cmd
# Gunakan py command
py -m venv venv
py app.py
```

**Problem: Execution Policy Error (PowerShell)**

```powershell
# Run sebagai Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Atau gunakan Command Prompt (cmd) instead
```

**Problem: Port 5002 already in use**

```cmd
# Cari process yang menggunakan port 5002
netstat -ano | findstr :5002

# Kill process (ganti PID dengan nomor yang muncul)
taskkill /F /PID <PID>
```

---

## 4️⃣ Instalasi macOS/Linux

### **🍎🐧 Menggunakan Script Otomatis (Recommended)**

```bash
# 1. Clone repository
git clone https://github.com/rizkijanuarr/ai
cd ai

# 2. Berikan permission execute
chmod +x running_command.sh

# 3. Run script otomatis
./running_command.sh
```

**Script akan otomatis:**

- ✅ Membuat virtual environment
- ✅ Mengaktifkan virtual environment
- ✅ Upgrade pip
- ✅ Install semua dependencies
- ✅ Kill process di port 5002 (jika ada)
- ✅ Run aplikasi

### **🔧 Manual Installation (macOS/Linux)**

**Step 1: Install Python**

**macOS (Homebrew):**

```bash
brew install python@3.10
```

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
```

**Fedora/RHEL:**

```bash
sudo dnf install python3 python3-pip
```

**Step 2: Clone Repository**

```bash
git clone https://github.com/your-username/ai-classifier.git
cd ai-classifier
```

**Step 3: Buat Virtual Environment**

```bash
python3 -m venv venv
```

**Step 4: Aktifkan Virtual Environment**

```bash
source venv/bin/activate
```

**Step 5: Install Dependencies**

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Step 6: Run Application**

```bash
python3 app.py
```

### **🐛 Troubleshooting macOS/Linux**

**Problem: `python3` command not found**

```bash
# Install Python 3
# macOS:
brew install python3

# Ubuntu:
sudo apt install python3
```

**Problem: Permission denied**

```bash
# Berikan permission
chmod +x running_command.sh

# Atau run dengan bash
bash running_command.sh
```

**Problem: Port 5002 already in use**

```bash
# Cari process yang menggunakan port 5002
lsof -i :5002

# Kill process
lsof -t -i :5002 | xargs kill -9
```

---

## 📋 Package Dependencies

### **Core Frameworks**

```
flask                  # Web framework
flask-cors             # CORS support
flasgger              # Swagger/OpenAPI documentation
```

### **Web Scraping**

```
requests              # HTTP library
beautifulsoup4        # HTML parsing
lxml                  # XML/HTML parser (faster)
```

### **AI & Machine Learning**

```
torch                 # PyTorch (deep learning framework)
transformers          # Hugging Face Transformers (IndoBERT)
scikit-learn          # Machine learning utilities
```

### **Data Processing**

```
pandas                # Data manipulation
numpy                 # Numerical computing
```

### **Utilities**

```
tqdm                  # Progress bars
colorlog              # Colored logging
duckduckgo-search     # Search engine API
deep-translator       # Translation API
```

### **Visualization** (Optional)

```
seaborn               # Statistical visualization
matplotlib            # Plotting library
```

---

## 💾 Disk Space Requirements

| Component | Size |
|-----------|------|
| Virtual Environment | ~500 MB |
| Dependencies | ~2-3 GB |
| - PyTorch | ~800 MB |
| - Transformers | ~500 MB |
| - Other packages | ~1-2 GB |
| IndoBERT Model (auto-download) | ~500 MB |
| **Total** | **~3-4 GB** |

---

## 🔥 Download IndoBERT Model (First Run)

Saat pertama kali menjalankan aplikasi, IndoBERT model akan di-download otomatis:

```
[INFO] Loading IndoBERT model (first time, may take a while)...
Downloading: 100%|████████████████████| 500MB/500MB [02:30<00:00, 3.3MB/s]
[INFO] IndoBERT model loaded successfully!
```

**Lokasi Model Cache:**

- **macOS/Linux**: `~/.cache/huggingface/transformers/`
- **Windows**: `C:\Users\<username>\.cache\huggingface\transformers\`

---

## 🧪 Verifikasi Instalasi

### **1. Check Python Version**

```bash
python --version
# Output: Python 3.14.x atau lebih tinggi
```

### **2. Check Virtual Environment**

```bash
# Pastikan (venv) muncul di prompt
(venv) user@computer:~/ai$
```

### **3. Check Installed Packages**

```bash
pip list | grep -E "flask|torch|transformers"
```

### **4. Test Import**

```bash
python -c "import flask, torch, transformers; print('✅ All packages installed successfully!')"
```

### **5. Test Application**

**Start server:**

```bash
# Windows
running_command.bat

# macOS/Linux
./running_command.sh
```

**Expected output:**

```
[INFO] Starting App...
--------------------------------
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5002
 * Running on http://192.168.x.x:5002
```

**Test API:**

```bash
curl -X POST http://localhost:5002/api/v1/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://google.com"}'
```

---

## 🔄 Update Dependencies

```bash
# Aktifkan virtual environment terlebih dahulu
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Update semua packages
pip install --upgrade -r requirements.txt

# Update package tertentu
pip install --upgrade flask torch transformers
```

---

## 🗑️ Uninstall

### **Hapus Virtual Environment**

```bash
# Deactivate virtual environment
deactivate

# Hapus folder venv
rm -rf venv  # macOS/Linux
rmdir /s venv  # Windows
```

### **Hapus Cache**

```bash
# macOS/Linux
rm -rf ~/.cache/huggingface

# Windows
rmdir /s %USERPROFILE%\.cache\huggingface
```

### **Hapus Project**

```bash
cd ..
rm -rf ai-classifier  # macOS/Linux
rmdir /s ai-classifier  # Windows
```

---

## 📊 Comparison: Script vs Manual

| Aspect | Script Otomatis | Manual |
|--------|----------------|--------|
| **Waktu Setup** | ~5 menit | ~15 menit |
| **Kemudahan** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Error Handling** | Otomatis | Manual |
| **Port Cleanup** | Otomatis | Manual |
| **Recommended For** | Semua user | Advanced user |

---

## 🎓 Best Practices

### **Development Setup**

```bash
# 1. Clone repository
git clone <repo-url>
cd ai-classifier

# 2. Create virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Upgrade pip
pip install --upgrade pip

# 4. Install dependencies
pip install -r requirements.txt

# 5. Install development tools (optional)
pip install pytest black flake8 mypy

# 6. Run application
./running_command.sh  # macOS/Linux
running_command.bat   # Windows
```

### **Production Setup**

```bash
# 1. Use specific Python version
python3.14 -m venv venv

# 2. Install with --no-cache-dir (save space)
pip install --no-cache-dir -r requirements.txt

# 3. Freeze dependencies
pip freeze > requirements-lock.txt

# 4. Use gunicorn (production server)
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5002 app:app
```

---

**Last Updated**: 2025-12-14  
**Version**: 1.0.0  
**Maintainer**: Tugas Akhir Team
