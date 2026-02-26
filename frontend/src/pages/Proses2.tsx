
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
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

            {/* Detailed Explanation Section - DYNAMIC */}
            <div className="mt-12 mb-8">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                📚 Penjelasan Detail K-Fold Cross Validation
              </h2>

              {/* What is K-Fold */}
              <Card className="bg-slate-900 border-slate-800 mb-6">
                <CardHeader>
                  <CardTitle className="text-white text-xl">🎯 Apa itu K-Fold Cross Validation?</CardTitle>
                  <CardDescription>Konsep dasar dan tujuan K-Fold Cross Validation</CardDescription>
                </CardHeader>
                <CardContent className="text-slate-300 space-y-4">
                  <p className="text-sm leading-relaxed">
                    K-Fold Cross Validation adalah teknik evaluasi model yang membagi dataset menjadi <span className="font-bold text-white">K bagian (folds)</span> yang sama besar.
                    Model dilatih dan diuji sebanyak K kali, dimana setiap kali 1 fold digunakan sebagai test set dan K-1 fold sisanya sebagai training set.
                  </p>

                  <div className="bg-slate-800 p-4 rounded-lg">
                    <p className="font-semibold text-white mb-2">Keunggulan K-Fold:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>✅ Evaluasi lebih <span className="text-green-400 font-semibold">robust</span> dan <span className="text-green-400 font-semibold">reliable</span></li>
                      <li>✅ Mengurangi <span className="text-blue-400 font-semibold">bias</span> dari pemilihan data test</li>
                      <li>✅ Mengukur <span className="text-purple-400 font-semibold">konsistensi</span> model di berbagai subset data</li>
                      <li>✅ Memberikan <span className="text-orange-400 font-semibold">confidence interval</span> melalui standard deviation</li>
                      <li>✅ Lebih <span className="text-yellow-400 font-semibold">representatif</span> untuk performa di production</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-blue-900/20 border border-blue-800 p-4 rounded">
                      <h4 className="font-bold text-blue-400 mb-2">📊 Data Aktual ({data.keterangan_legal})</h4>
                      <p className="text-sm mb-2">Total Samples: <span className="font-bold text-white">{data.total_samples.toLocaleString()}</span></p>
                      <p className="text-sm mb-2">Legal: <span className="font-bold text-green-400">{data.legal_count.toLocaleString()}</span></p>
                      <p className="text-sm">Illegal: <span className="font-bold text-red-400">{data.illegal_count.toLocaleString()}</span></p>
                    </div>

                    <div className="bg-purple-900/20 border border-purple-800 p-4 rounded">
                      <h4 className="font-bold text-purple-400 mb-2">🔢 K-Fold Configuration</h4>
                      <p className="text-sm mb-2">K=3: <span className="font-bold text-white">{data.k_fold_3.fold_results.length} folds</span></p>
                      <p className="text-sm">K=5: <span className="font-bold text-white">{data.k_fold_5.fold_results.length} folds</span></p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* How K-Fold Works */}
              <Card className="bg-slate-900 border-slate-800 mb-6">
                <CardHeader>
                  <CardTitle className="text-white text-xl">🔄 Cara Kerja K-Fold Cross Validation</CardTitle>
                  <CardDescription>Proses step-by-step K-Fold dengan data {data.keterangan_legal}</CardDescription>
                </CardHeader>
                <CardContent className="text-slate-300 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                      <div>
                        <p className="font-semibold text-white">Shuffle Dataset</p>
                        <p className="text-sm">Dataset dengan <span className="font-bold text-white">{data.total_samples.toLocaleString()} samples</span> di-shuffle secara random (seed=42 untuk reproducibility)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                      <div>
                        <p className="font-semibold text-white">Split into K Folds</p>
                        <p className="text-sm">Dataset dibagi menjadi K bagian yang sama besar:</p>
                        <div className="mt-2 space-y-2">
                          <div className="bg-slate-800 p-3 rounded">
                            <p className="text-xs font-semibold text-white mb-1">K=3 (3-Fold):</p>
                            {data.k_fold_3.fold_results.map((fold, idx) => (
                              <p key={idx} className="text-xs">
                                Fold {fold.fold}: <span className="text-blue-400 font-semibold">{fold.test_size} samples</span>
                              </p>
                            ))}
                          </div>
                          <div className="bg-slate-800 p-3 rounded">
                            <p className="text-xs font-semibold text-white mb-1">K=5 (5-Fold):</p>
                            {data.k_fold_5.fold_results.map((fold, idx) => (
                              <p key={idx} className="text-xs">
                                Fold {fold.fold}: <span className="text-purple-400 font-semibold">{fold.test_size} samples</span>
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                      <div>
                        <p className="font-semibold text-white">Train & Test K Times</p>
                        <p className="text-sm">Untuk setiap fold:</p>
                        <ul className="list-disc list-inside mt-2 ml-4 space-y-1 text-sm">
                          <li>Gunakan 1 fold sebagai <span className="text-orange-400 font-semibold">test set</span></li>
                          <li>Gunakan K-1 fold sisanya sebagai <span className="text-green-400 font-semibold">training set</span></li>
                          <li>Hitung metrics: Accuracy, Precision, Recall, F1-Score</li>
                          <li>Simpan hasil untuk averaging nanti</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">4</div>
                      <div>
                        <p className="font-semibold text-white">Calculate Average Metrics</p>
                        <p className="text-sm">Hitung rata-rata dari semua fold:</p>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="bg-slate-800 p-2 rounded text-xs">
                            <p className="font-semibold text-white">K=3 Results:</p>
                            <p>Avg Accuracy: <span className="text-green-400 font-bold">{formatPercent(data.k_fold_3.average_accuracy)}</span></p>
                            <p>Avg F1-Score: <span className="text-orange-400 font-bold">{formatPercent(data.k_fold_3.average_f1_score)}</span></p>
                          </div>
                          <div className="bg-slate-800 p-2 rounded text-xs">
                            <p className="font-semibold text-white">K=5 Results:</p>
                            <p>Avg Accuracy: <span className="text-green-400 font-bold">{formatPercent(data.k_fold_5.average_accuracy)}</span></p>
                            <p>Avg F1-Score: <span className="text-orange-400 font-bold">{formatPercent(data.k_fold_5.average_f1_score)}</span></p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">5</div>
                      <div>
                        <p className="font-semibold text-white">Calculate Standard Deviation</p>
                        <p className="text-sm">Ukur konsistensi model dengan standard deviation:</p>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="bg-slate-800 p-2 rounded text-xs">
                            <p className="font-semibold text-white">K=3 Consistency:</p>
                            <p>Std Accuracy: <span className="text-blue-400 font-bold">±{formatPercent(data.k_fold_3.std_accuracy)}</span></p>
                            <p>Std F1-Score: <span className="text-purple-400 font-bold">±{formatPercent(data.k_fold_3.std_f1_score)}</span></p>
                          </div>
                          <div className="bg-slate-800 p-2 rounded text-xs">
                            <p className="font-semibold text-white">K=5 Consistency:</p>
                            <p>Std Accuracy: <span className="text-blue-400 font-bold">±{formatPercent(data.k_fold_5.std_accuracy)}</span></p>
                            <p>Std F1-Score: <span className="text-purple-400 font-bold">±{formatPercent(data.k_fold_5.std_f1_score)}</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Formulas */}
              <Card className="bg-slate-900 border-slate-800 mb-6">
                <CardHeader>
                  <CardTitle className="text-white text-xl">🧮 Rumus Perhitungan K-Fold</CardTitle>
                  <CardDescription>Formula matematika dengan data aktual {data.keterangan_legal}</CardDescription>
                </CardHeader>
                <CardContent className="text-slate-300 space-y-6">
                  {/* Fold Size Calculation */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-bold text-white mb-2">1. Pembagian Fold Size</h3>
                    <div className="bg-slate-800 p-4 rounded mb-3 font-mono text-sm">
                      fold_size = ⌊total_samples / k⌋<br/>
                      sisa = total_samples mod k
                    </div>
                    <p className="text-sm mb-2"><span className="font-semibold text-white">Arti:</span> Setiap fold mendapat ukuran yang sama, sisa ditambahkan ke fold terakhir</p>

                    <div className="space-y-3 mt-3">
                      <div className="bg-slate-800 p-3 rounded text-sm">
                        <p className="font-semibold text-white mb-2">Perhitungan K=3 ({data.keterangan_legal}):</p>
                        <p>Total Samples = {data.total_samples}</p>
                        <p>fold_size = ⌊{data.total_samples} / 3⌋ = {Math.floor(data.total_samples / 3)}</p>
                        <p>sisa = {data.total_samples} mod 3 = {data.total_samples % 3}</p>
                        <div className="mt-2 space-y-1">
                          {data.k_fold_3.fold_results.map((fold, idx) => (
                            <p key={idx} className="text-blue-400">
                              Fold {fold.fold}: {fold.test_size} samples
                              {idx === data.k_fold_3.fold_results.length - 1 && data.total_samples % 3 !== 0 &&
                                <span className="text-yellow-400 text-xs ml-2">(+{data.total_samples % 3} sisa)</span>
                              }
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="bg-slate-800 p-3 rounded text-sm">
                        <p className="font-semibold text-white mb-2">Perhitungan K=5 ({data.keterangan_legal}):</p>
                        <p>Total Samples = {data.total_samples}</p>
                        <p>fold_size = ⌊{data.total_samples} / 5⌋ = {Math.floor(data.total_samples / 5)}</p>
                        <p>sisa = {data.total_samples} mod 5 = {data.total_samples % 5}</p>
                        <div className="mt-2 space-y-1">
                          {data.k_fold_5.fold_results.map((fold, idx) => (
                            <p key={idx} className="text-purple-400">
                              Fold {fold.fold}: {fold.test_size} samples
                              {idx === data.k_fold_5.fold_results.length - 1 && data.total_samples % 5 !== 0 &&
                                <span className="text-yellow-400 text-xs ml-2">(+{data.total_samples % 5} sisa)</span>
                              }
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Average Metrics */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="text-lg font-bold text-white mb-2">2. Average Metrics</h3>
                    <div className="bg-slate-800 p-4 rounded mb-3 font-mono text-sm">
                      Average = (1/k) × Σ(metric_i) untuk i=1 hingga k
                    </div>
                    <p className="text-sm mb-2"><span className="font-semibold text-white">Arti:</span> Rata-rata dari semua fold untuk setiap metrik</p>

                    <div className="bg-slate-800 p-3 rounded text-sm mt-3">
                      <p className="font-semibold text-white mb-2">Contoh: Average Accuracy K=3</p>
                      {data.k_fold_3.fold_results.map((fold, idx) => (
                        <p key={idx}>Fold {fold.fold} Accuracy = {formatPercent(fold.accuracy)}</p>
                      ))}
                      <p className="mt-2">Average = ({data.k_fold_3.fold_results.map(f => f.accuracy.toFixed(3)).join(' + ')}) / 3</p>
                      <p className="text-green-400 font-bold mt-2">
                        Average Accuracy = {formatPercent(data.k_fold_3.average_accuracy)}
                      </p>
                    </div>
                  </div>

                  {/* Standard Deviation */}
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="text-lg font-bold text-white mb-2">3. Standard Deviation (Konsistensi)</h3>
                    <div className="bg-slate-800 p-4 rounded mb-3 font-mono text-sm">
                      σ = √[(1/k) × Σ(metric_i - average)²]
                    </div>
                    <p className="text-sm mb-2"><span className="font-semibold text-white">Arti:</span> Mengukur seberapa konsisten model di berbagai fold</p>

                    <div className="bg-slate-800 p-3 rounded text-sm mt-3">
                      <p className="font-semibold text-white mb-2">Interpretasi Standard Deviation:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li className="text-green-400">σ &lt; 0.01 (1%) = <span className="font-bold">Sangat Konsisten</span> ✅</li>
                        <li className="text-blue-400">0.01 ≤ σ &lt; 0.05 (1-5%) = <span className="font-bold">Cukup Konsisten</span> ⚠️</li>
                        <li className="text-red-400">σ ≥ 0.05 (≥5%) = <span className="font-bold">Tidak Konsisten</span> ❌</li>
                      </ul>
                      <div className="mt-3 p-2 bg-slate-700 rounded">
                        <p className="font-semibold text-white">Hasil Aktual ({data.keterangan_legal}):</p>
                        <p className="text-sm">K=3 Std Accuracy: <span className="text-blue-400 font-bold">±{formatPercent(data.k_fold_3.std_accuracy)}</span></p>
                        <p className="text-sm">K=5 Std Accuracy: <span className="text-purple-400 font-bold">±{formatPercent(data.k_fold_5.std_accuracy)}</span></p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* K=3 vs K=5 Comparison */}
              <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-white text-xl">⚖️ Perbandingan K=3 vs K=5</CardTitle>
                  <CardDescription>Analisis perbedaan dan rekomendasi untuk data {data.keterangan_legal}</CardDescription>
                </CardHeader>
                <CardContent className="text-slate-300 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* K=3 */}
                    <div className="bg-blue-900/20 border border-blue-800 p-4 rounded">
                      <h4 className="font-bold text-blue-400 mb-3 text-lg">K=3 (3-Fold)</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-semibold text-white">Jumlah Evaluasi:</span> 3x</p>
                        <p><span className="font-semibold text-white">Fold Size:</span> ~{Math.floor(data.total_samples / 3)} samples</p>
                        <p><span className="font-semibold text-white">Avg Accuracy:</span> <span className="text-green-400 font-bold">{formatPercent(data.k_fold_3.average_accuracy)}</span></p>
                        <p><span className="font-semibold text-white">Std Accuracy:</span> <span className="text-blue-400 font-bold">±{formatPercent(data.k_fold_3.std_accuracy)}</span></p>

                        <div className="mt-3 pt-3 border-t border-slate-700">
                          <p className="font-semibold text-white mb-2">Keunggulan:</p>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            <li className="text-green-400">✅ Lebih cepat (3x evaluasi)</li>
                            <li className="text-green-400">✅ Cocok dataset kecil (&lt;1000)</li>
                          </ul>
                          <p className="font-semibold text-white mb-2 mt-2">Kekurangan:</p>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            <li className="text-red-400">❌ Variance bisa lebih tinggi</li>
                            <li className="text-red-400">❌ Kurang robust</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* K=5 */}
                    <div className="bg-purple-900/20 border border-purple-800 p-4 rounded">
                      <h4 className="font-bold text-purple-400 mb-3 text-lg">K=5 (5-Fold)</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-semibold text-white">Jumlah Evaluasi:</span> 5x</p>
                        <p><span className="font-semibold text-white">Fold Size:</span> ~{Math.floor(data.total_samples / 5)} samples</p>
                        <p><span className="font-semibold text-white">Avg Accuracy:</span> <span className="text-green-400 font-bold">{formatPercent(data.k_fold_5.average_accuracy)}</span></p>
                        <p><span className="font-semibold text-white">Std Accuracy:</span> <span className="text-purple-400 font-bold">±{formatPercent(data.k_fold_5.std_accuracy)}</span></p>

                        <div className="mt-3 pt-3 border-t border-slate-700">
                          <p className="font-semibold text-white mb-2">Keunggulan:</p>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            <li className="text-green-400">✅ Lebih robust & reliable</li>
                            <li className="text-green-400">✅ Variance lebih rendah</li>
                            <li className="text-green-400">✅ Cocok dataset besar (&gt;1000)</li>
                          </ul>
                          <p className="font-semibold text-white mb-2 mt-2">Kekurangan:</p>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            <li className="text-red-400">❌ Lebih lambat (5x evaluasi)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-orange-900/20 border border-orange-800 p-4 rounded mt-4">
                    <h4 className="font-bold text-orange-400 mb-2">💡 Rekomendasi untuk Dataset Ini</h4>
                    <p className="text-sm mb-2">
                      Dataset {data.keterangan_legal} memiliki <span className="font-bold text-white">{data.total_samples.toLocaleString()} samples</span>
                    </p>
                    {data.total_samples >= 1000 ? (
                      <div className="bg-slate-800 p-3 rounded text-sm">
                        <p className="text-green-400 font-bold mb-2">✅ Rekomendasi: Gunakan K=5</p>
                        <p className="text-xs">Dataset cukup besar (&gt;1000 samples), K=5 akan memberikan evaluasi yang lebih robust dan reliable dengan variance yang lebih rendah.</p>
                      </div>
                    ) : (
                      <div className="bg-slate-800 p-3 rounded text-sm">
                        <p className="text-blue-400 font-bold mb-2">⚠️ Rekomendasi: Gunakan K=3</p>
                        <p className="text-xs">Dataset relatif kecil (&lt;1000 samples), K=3 sudah cukup untuk evaluasi yang baik dengan waktu komputasi yang lebih cepat.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Interpretation Guide */}
              <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-xl">💡 Panduan Interpretasi Hasil K-Fold</CardTitle>
                  <CardDescription>Cara membaca dan memahami hasil K-Fold Cross Validation</CardDescription>
                </CardHeader>
                <CardContent className="text-slate-300 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded">
                      <h4 className="font-bold text-green-400 mb-2">✅ Model Bagus & Konsisten</h4>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Average Accuracy &gt; 90%</li>
                        <li>Std Deviation &lt; 1%</li>
                        <li>Semua fold punya accuracy serupa</li>
                        <li>F1-Score &gt; 90%</li>
                      </ul>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded">
                      <h4 className="font-bold text-yellow-400 mb-2">⚠️ Perlu Investigasi</h4>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Std Deviation &gt; 5%</li>
                        <li>Ada fold dengan accuracy sangat rendah</li>
                        <li>Perbedaan besar antar fold</li>
                        <li>Average accuracy &lt; 80%</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-800 p-4 rounded mt-4">
                    <h4 className="font-bold text-blue-400 mb-2">🎯 Hasil Aktual Dataset Ini</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mt-3">
                      <div className="bg-slate-800 p-3 rounded">
                        <p className="font-semibold text-white mb-1">K=3 Performance:</p>
                        <p className="text-xs">Average Accuracy: <span className="text-green-400 font-bold">{formatPercent(data.k_fold_3.average_accuracy)}</span></p>
                        <p className="text-xs">Consistency: <span className="text-blue-400 font-bold">±{formatPercent(data.k_fold_3.std_accuracy)}</span></p>
                        <p className="text-xs mt-2 text-slate-400">{data.k_fold_3_penjelasan.accuracy}</p>
                      </div>
                      <div className="bg-slate-800 p-3 rounded">
                        <p className="font-semibold text-white mb-1">K=5 Performance:</p>
                        <p className="text-xs">Average Accuracy: <span className="text-green-400 font-bold">{formatPercent(data.k_fold_5.average_accuracy)}</span></p>
                        <p className="text-xs">Consistency: <span className="text-purple-400 font-bold">±{formatPercent(data.k_fold_5.std_accuracy)}</span></p>
                        <p className="text-xs mt-2 text-slate-400">{data.k_fold_5_penjelasan.accuracy}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}

        {/* Infographic Section */}
        <div className="mt-12 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            📊 Infografis Proses K-Fold Cross Validation
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
                  src="/proses-2/Proses_2_Diagram.png"
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
                  src="/proses-2/Proses_2_Penjelasan.png"
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
                  src="/proses-2/Proses_2_Penjelasan_Angka.png"
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
