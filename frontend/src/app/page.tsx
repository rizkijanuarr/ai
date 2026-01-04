import { SearchForm } from "@/components/search-form";
import { Navbar } from "@/components/navbar";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section with Video Background */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* YouTube Video Background */}
        <div className="absolute inset-0 z-0">
          <iframe
            className="absolute top-1/2 left-1/2 w-[177.77777778vh] h-[56.25vw] min-h-screen min-w-full -translate-x-1/2 -translate-y-1/2"
            src="https://www.youtube.com/embed/Q7aV_ZhKWb4?autoplay=1&mute=1&loop=1&playlist=Q7aV_ZhKWb4&controls=0&showinfo=0&rel=0&modestbranding=1&vq=hd1080&playsinline=1"
            title="Background Video"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/60 via-slate-900/70 to-slate-950/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-32 pt-[180px]">
          <div className="max-w-4xl mx-auto text-center space-y-4">

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight drop-shadow-lg">
                Tetap Fokus. Tetap Maju.
                <br />
                <span className="text-orange-400 italic">
                  Lindungi Diri Anda.
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto drop-shadow-md">
                Deteksi website legal atau ilegal dengan teknologi AI (IndoBERT) dan analisa kata kunci
              </p>
            </div>

            {/* Search Form */}
            <div className="pt-2 max-w-3xl mx-auto">
              <SearchForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
