"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { kFoldService } from "@/services/k-fold.service";
import { ApiError } from "@/services/api-client";
import { toast } from "sonner";
import type { KFoldData } from "@/types/api";

export default function Proses2Page() {
  const [data, setData] = useState<KFoldData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<number>(1);

  const fetchData = async (isLegal: number) => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const response = await kFoldService.getKFold(isLegal);

      if (response.success && response.data) {
        setData(response.data);
      } else {
        toast.error("Gagal memuat data", {
          description: response.message || "Terjadi kesalahan",
        });
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error("Error!", {
          description: error.message,
        });
      }
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 500 - elapsedTime);

      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    }
  };

  useEffect(() => {
    fetchData(filter);
  }, [filter]);

  const formatPercent = (value: number) => {
    return (value * 100).toFixed(1) + "%";
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-64 bg-slate-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] bg-repeat"></div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-8">
          <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
            K-Fold Cross Validation
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl drop-shadow-md">
            Proses 2 - Evaluasi model dengan K-Fold Cross Validation (k=3 dan k=5).
            Validasi performa model secara robust dengan multiple folds.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 1 ? "default" : "outline"}
            onClick={() => setFilter(1)}
            size="sm"
            className={filter === 1 ? "bg-green-600 hover:bg-green-700" : ""}
          >
            Legal
          </Button>
          <Button
            variant={filter === 0 ? "default" : "outline"}
            onClick={() => setFilter(0)}
            size="sm"
            className={filter === 0 ? "bg-red-600 hover:bg-red-700" : ""}
          >
            Illegal
          </Button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          </div>
        ) : data ? (
          <>
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Total Samples
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {data.total_samples.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {data.keterangan_legal}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Legal Count
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-500">
                    {data.legal_count.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Illegal Count
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-500">
                    {data.illegal_count.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* K-Fold Results Tabs */}
            <Tabs defaultValue="k3" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="k3">3-Fold Cross Validation</TabsTrigger>
                <TabsTrigger value="k5">5-Fold Cross Validation</TabsTrigger>
              </TabsList>

              {/* K=3 Tab */}
              <TabsContent value="k3" className="space-y-6">
                {/* Average Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-slate-400">Avg Accuracy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-500">
                        {formatPercent(data.k_fold_3.average_accuracy)}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        ±{formatPercent(data.k_fold_3.std_accuracy)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-slate-400">Avg Precision</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-500">
                        {formatPercent(data.k_fold_3.average_precision)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-slate-400">Avg Recall</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-500">
                        {formatPercent(data.k_fold_3.average_recall)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-slate-400">Avg F1-Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-500">
                        {formatPercent(data.k_fold_3.average_f1_score)}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        ±{formatPercent(data.k_fold_3.std_f1_score)}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Fold Results */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.k_fold_3.fold_results.map((fold) => (
                    <Card key={fold.fold} className="bg-slate-900 border-slate-800">
                      <CardHeader>
                        <CardTitle className="text-white">Fold {fold.fold}</CardTitle>
                        <CardDescription>Test Size: {fold.test_size}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Accuracy:</span>
                          <span className="text-green-400 font-semibold">{formatPercent(fold.accuracy)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Precision:</span>
                          <span className="text-blue-400 font-semibold">{formatPercent(fold.precision)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Recall:</span>
                          <span className="text-purple-400 font-semibold">{formatPercent(fold.recall)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">F1-Score:</span>
                          <span className="text-orange-400 font-semibold">{formatPercent(fold.f1_score)}</span>
                        </div>
                        <div className="pt-2 border-t border-slate-700">
                          <p className="text-xs text-slate-400">
                            TP={fold.tp}, TN={fold.tn}, FP={fold.fp}, FN={fold.fn}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Penjelasan */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Penjelasan 3-Fold</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-slate-300">
                    <p>• {data.k_fold_3_penjelasan.accuracy}</p>
                    <p>• {data.k_fold_3_penjelasan.precision}</p>
                    <p>• {data.k_fold_3_penjelasan.recall}</p>
                    <p>• {data.k_fold_3_penjelasan.f1_score}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* K=5 Tab */}
              <TabsContent value="k5" className="space-y-6">
                {/* Average Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-slate-400">Avg Accuracy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-500">
                        {formatPercent(data.k_fold_5.average_accuracy)}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        ±{formatPercent(data.k_fold_5.std_accuracy)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-slate-400">Avg Precision</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-500">
                        {formatPercent(data.k_fold_5.average_precision)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-slate-400">Avg Recall</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-500">
                        {formatPercent(data.k_fold_5.average_recall)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-slate-400">Avg F1-Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-500">
                        {formatPercent(data.k_fold_5.average_f1_score)}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        ±{formatPercent(data.k_fold_5.std_f1_score)}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Fold Results */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {data.k_fold_5.fold_results.map((fold) => (
                    <Card key={fold.fold} className="bg-slate-900 border-slate-800">
                      <CardHeader>
                        <CardTitle className="text-white text-sm">Fold {fold.fold}</CardTitle>
                        <CardDescription className="text-xs">Size: {fold.test_size}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Acc:</span>
                          <span className="text-green-400 font-semibold">{formatPercent(fold.accuracy)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Prec:</span>
                          <span className="text-blue-400 font-semibold">{formatPercent(fold.precision)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Rec:</span>
                          <span className="text-purple-400 font-semibold">{formatPercent(fold.recall)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">F1:</span>
                          <span className="text-orange-400 font-semibold">{formatPercent(fold.f1_score)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Penjelasan */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Penjelasan 5-Fold</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-slate-300">
                    <p>• {data.k_fold_5_penjelasan.accuracy}</p>
                    <p>• {data.k_fold_5_penjelasan.precision}</p>
                    <p>• {data.k_fold_5_penjelasan.recall}</p>
                    <p>• {data.k_fold_5_penjelasan.f1_score}</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : null}

        {/* Infographic Section */}
        <div className="mt-12 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            📊 Penjelasan Proses K-Fold Cross Validation
          </h2>
          <div className="grid grid-cols-1 gap-8">
            {/* Image 1 - Diagram */}
            <Card className="bg-slate-900 border-slate-800 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">Diagram Proses</CardTitle>
                <CardDescription>Alur kerja K-Fold cross validation</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/proses-2/Proses 2 - Diagram.png"
                  alt="Proses 2 - Diagram"
                  className="w-full h-auto rounded-lg"
                />
              </CardContent>
            </Card>

            {/* Image 2 - Penjelasan */}
            <Card className="bg-slate-900 border-slate-800 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">Penjelasan Hasil</CardTitle>
                <CardDescription>Interpretasi metrik K-Fold</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/proses-2/Proses 2 - Penjelasan.png"
                  alt="Proses 2 - Penjelasan"
                  className="w-full h-auto rounded-lg"
                />
              </CardContent>
            </Card>

            {/* Image 3 - Penjelasan Angka */}
            <Card className="bg-slate-900 border-slate-800 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">Penjelasan Angka</CardTitle>
                <CardDescription>Detail perhitungan dan rumus</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/proses-2/Proses 2 - Penjelasan Angka.png"
                  alt="Proses 2 - Penjelasan Angka"
                  className="w-full h-auto rounded-lg"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
