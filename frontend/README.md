# Frontend React + Vite + TypeScript

Aplikasi frontend untuk sistem deteksi website legal/ilegal menggunakan AI (IndoBERT).

## 🚀 Migrasi dari Next.js ke React

Aplikasi ini telah berhasil dimigrasi dari Next.js ke React + Vite dengan mempertahankan:
- ✅ Semua styling dan theme (Tailwind CSS + shadcn/ui)
- ✅ Semua fitur dan fungsionalitas
- ✅ Struktur API calls dan services
- ✅ UI Components (13 components)
- ✅ Semua halaman (Home, Dataset, Proses 1-5)

## 📦 Tech Stack

- **React 19** - UI Library
- **Vite** - Build tool & dev server
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components
- **Recharts** - Data visualization
- **Sonner** - Toast notifications
- **Radix UI** - Headless UI primitives

## 🛠️ Installation

```bash
npm install
```

## 🏃 Development

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## 🏗️ Build

```bash
npm run build
```

Output akan ada di folder `dist/`

## 📁 Project Structure

```
frontend/
├── public/              # Static assets (logo, images)
│   ├── logo-vokasi.png
│   ├── logo.jpg
│   └── proses-1/       # Infographic images
│       proses-2/
│       proses-3/
│       proses-4/
│       proses-5/
├── src/
│   ├── components/     # React components
│   │   ├── ui/        # shadcn/ui components
│   │   ├── Navbar.tsx
│   │   ├── SearchForm.tsx
│   │   └── CommandMenu.tsx
│   ├── pages/         # Page components
│   │   ├── Home.tsx
│   │   ├── DatasetModel.tsx
│   │   ├── Proses1.tsx
│   │   ├── Proses2.tsx
│   │   ├── Proses3.tsx
│   │   ├── Proses4.tsx
│   │   └── Proses5.tsx
│   ├── services/      # API services
│   │   ├── api-client.ts
│   │   ├── dataset.service.ts
│   │   ├── confusion-matrix.service.ts
│   │   ├── k-fold.service.ts
│   │   ├── epoch-training.service.ts
│   │   ├── batch-size.service.ts
│   │   └── optimizer.service.ts
│   ├── types/         # TypeScript types
│   │   └── api.ts
│   ├── config/        # Configuration
│   │   └── api.ts
│   ├── constants/     # Constants
│   │   ├── keywords.ts
│   │   └── dataset-stats.ts
│   ├── lib/           # Utilities
│   │   └── utils.ts
│   ├── App.tsx        # Main app with routes
│   ├── main.tsx       # Entry point
│   └── index.css      # Global styles
├── .env               # Environment variables
├── vite.config.ts     # Vite configuration
├── tailwind.config.js # Tailwind configuration
└── tsconfig.json      # TypeScript configuration
```

## 🔧 Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://127.0.0.1:5002
```

## 📝 Available Routes

- `/` - Home page with search
- `/dataset-model` - Dataset listing with pagination
- `/proses-1` - Confusion Matrix
- `/proses-2` - K-Fold Cross Validation
- `/proses-3` - Epoch Training
- `/proses-4` - Batch Size Comparison
- `/proses-5` - Optimizer Comparison

## 🎨 Features

### Home Page
- YouTube video background
- Search form untuk analisa URL
- Dialog hasil analisa dengan badge status

### Dataset Model
- Grid view dengan pagination
- Filter Legal/Illegal
- Skeleton loading state
- Tooltip untuk URL panjang

### Proses 1-5
- Data visualization dengan Recharts
- Real-time data fetching
- Loading states
- Infographic images
- Responsive design

## 🔌 API Integration

Semua API calls menggunakan service layer dengan:
- Error handling
- Type safety
- Timeout management
- Toast notifications

## 🎯 Key Differences from Next.js

1. **Routing**: Next.js App Router → React Router
2. **Images**: `next/image` → `<img>` tag
3. **Client Components**: Removed `"use client"` directive
4. **Environment**: `process.env` → `import.meta.env`
5. **Build**: Next.js → Vite

## 📦 Dependencies

Main dependencies:
- react & react-dom
- react-router-dom
- @radix-ui/* (UI primitives)
- recharts (charts)
- sonner (toasts)
- lucide-react (icons)
- tailwindcss
- class-variance-authority
- clsx & tailwind-merge

## 🚀 Deployment

Build the project:
```bash
npm run build
```

Serve the `dist/` folder with any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Nginx
- Apache

## 📄 License

Private project for TA Sitti Aulia Sabina Rahmannissa
