"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowUp, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { datasetService } from "@/services/dataset.service";
import { ApiError } from "@/services/api-client";
import type { DatasetData } from "@/types/api";

export function SearchForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DatasetData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.info("Masukkan URL yang Valid!");
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      toast.info("Format URL tidak valid! Contoh: https://example.com");
      return;
    }

    setLoading(true);

    try {
      // Call API
      const response = await datasetService.getByLink(url);

      if (response.success && response.data) {
        setResult(response.data);
        setDialogOpen(true);
        toast.success("Data berhasil diambil!");
      } else {
        toast.error("Gagal mengambil data", {
          description: response.message || "Terjadi kesalahan",
        });
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error("Error!", {
          description: error.message,
        });
      } else {
        toast.error("Error!", {
          description: "Terjadi kesalahan yang tidak diketahui",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUrl("");
    setResult(null);
    setDialogOpen(false);
  };

  // Determine classification
  const getClassification = (): "LEGAL" | "ILLEGAL" => {
    if (!result) return "LEGAL";
    return result.is_legal === 1 ? "LEGAL" : "ILLEGAL";
  };

  const isLegal = getClassification() === "LEGAL";

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full mx-auto">
        {/* Integrated Input with Button */}
        <div className="relative">
          <Input
            type="url"
            placeholder="Masukan Domain/URL berdasarakan yang sudah ada di Dataset Model..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-16 pr-20 text-base bg-white/95 backdrop-blur-sm border-white/20 focus:border-orange-500 text-white placeholder:text-slate-400 shadow-lg rounded-lg"
            disabled={loading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={loading}
            className="absolute right-2 top-2 h-12 w-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ArrowUp className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>

      {/* Result Dialog - Default shadcn/ui Style */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Hasil Analisa Website</DialogTitle>
            <DialogDescription>
              Klasifikasi berdasarkan AI (IndoBERT) dan analisa kata kunci
            </DialogDescription>
          </DialogHeader>

          {result && (
            <div className="space-y-4 py-4">
              {/* Classification Status */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge
                    variant={isLegal ? "default" : "destructive"}
                    className="text-sm"
                  >
                    {isLegal ? "✓ LEGAL" : "✗ ILLEGAL"}
                  </Badge>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">ID Dataset</p>
                  <p className="text-lg font-bold">#{result.id}</p>
                </div>
              </div>

              <Separator />

              {/* URL */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">URL Website</p>
                </div>
                <a
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-orange-400 hover:text-orange-300 hover:underline break-all font-mono"
                >
                  {result.link}
                </a>
              </div>

              <Separator />

              {/* Title */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Title</p>
                <p className="text-sm text-muted-foreground">{result.title}</p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground">{result.description}</p>
              </div>

              {/* Keyword */}
              {result.keyword && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Keyword Detected</p>
                    <div className="flex flex-wrap gap-2">
                      {result.keyword.split(',').map((keyword, index) => (
                        <Badge key={index} variant="secondary">
                          {keyword.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Tutup
            </Button>
            <Button onClick={handleReset}>
              <ArrowUp className="mr-2 h-4 w-4" />
              Analisa URL Lain
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
