
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { confusionMatrixService } from "@/services/confusion-matrix.service";
import { ApiError } from "@/services/api-client";
import { toast } from "sonner";
import type { ConfusionMatrixData } from "@/types/api";

export default function Proses1Page() {
  const [data, setData] = useState<ConfusionMatrixData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<number>(1); // Default to Legal

  const fetchData = async (isLegal: number) => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const response = await confusionMatrixService.getMatrix(isLegal);

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
      // Ensure minimum 500ms loading for skeleton display
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

  const handleFilterChange = (isLegal: number) => {
    setFilter(isLegal);
  };

  // Format percentage
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

        {/* Content */}
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-8">
          <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
            Confusion Matrix
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl drop-shadow-md">
            Proses 1 - Analisis performa model klasifikasi dengan confusion matrix.
            Evaluasi akurasi, precision, recall, dan F1-score.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 1 ? "default" : "outline"}
            onClick={() => handleFilterChange(1)}
            size="sm"
            className={filter === 1 ? "bg-green-600 hover:bg-green-700" : ""}
          >
            Legal
          </Button>
          <Button
            variant={filter === 0 ? "default" : "outline"}
            onClick={() => handleFilterChange(0)}
            size="sm"
            className={filter === 0 ? "bg-red-600 hover:bg-red-700" : ""}
          >
            Illegal
          </Button>
        </div>

        {/* Loading State - Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-12 w-24 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : data ? (
          <>
            {/* Detailed Explanation Section - DYNAMIC */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                📚 Penjelasan Detail Confusion Matrix
              </h2>

              {/* Flow Diagram Explanation */}
              <Card className="bg-slate-900 border-slate-800 mb-6">
                <CardHeader>
                  <CardTitle className="text-white text-xl">🔄 Alur Proses Sistem</CardTitle>
                  <CardDescription>Bagaimana sistem menghitung confusion matrix untuk data {data.keterangan_legal}</CardDescription>
                </CardHeader>
                <CardContent className="text-slate-300 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                      <div>
                        <p className="font-semibold text-white">Client Request</p>
                        <p className="text-sm">User mengirim request POST ke endpoint <code className="bg-slate-800 px-2 py-1 rounded">/api/v1/confusion-matrix</code> dengan parameter <code className="bg-slate-800 px-2 py-1 rounded">is_legal={filter}</code></p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                      <div>
                        <p className="font-semibold text-white">Controller Layer</p>
                        <p className="text-sm">TugasAkhirControllerImplV1 menerima request, melakukan validasi input, dan membuat ConfusionMatrixRequestV1 object</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                      <div>
                        <p className="font-semibold text-white">Service Layer</p>
                        <p className="text-sm">TugasAkhirServiceImplV1 memproses business logic dan memanggil repository untuk mengambil data</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">4</div>
                      <div>
                        <p className="font-semibold text-white">Load Data dari CSV</p>
                        <p className="text-sm">Sistem membaca file <code className="bg-slate-800 px-2 py-1 rounded">ALL_DATA_COMBINED_MERGED.csv</code> dan melakukan filter: <span className="font-bold text-white">{data.keterangan_legal}</span> ({data.ts_count.toLocaleString()} samples)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">5</div>
                      <div>
                        <p className="font-semibold text-white">Evaluation Service</p>
                        <p className="text-sm">EvaluationServiceV1 menghitung confusion matrix dengan cara:
                          <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                            <li>Loop setiap data dan prediksi menggunakan keyword-based classifier</li>
                            <li>Hitung TP={data.tp_count}, TN={data.tn_count}, FP={data.fp_count}, FN={data.fn_count}</li>
                            <li>Hitung metrics: Accuracy={formatPercent(data.accuracy_count)}, Precision={data.precision_count === 0 ? "N/A" : formatPercent(data.precision_count)}, Recall={data.recall_count === 0 ? "N/A" : formatPercent(data.recall_count)}, F1={data.f1_score_count === 0 ? "N/A" : formatPercent(data.f1_score_count)}</li>
                          </ul>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">6</div>
                      <div>
                        <p className="font-semibold text-white">Return Response</p>
                        <p className="text-sm">Sistem mengembalikan JSON response dengan semua metrics dan penjelasan dalam Bahasa Indonesia</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Confusion Matrix Components Explanation - DYNAMIC */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* True Positive Explanation */}
                <Card className="bg-green-900/10 border-green-800">
                  <CardHeader>
                    <CardTitle className="text-green-400 flex items-center gap-2">
                      <span className="text-2xl">✅</span> True Positive (TP)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-300 space-y-3">
                    <p className="font-semibold text-white">Definisi:</p>
                    <p className="text-sm">Model memprediksi <span className="text-red-400 font-bold">ILLEGAL</span> dan ternyata memang <span className="text-red-400 font-bold">ILLEGAL</span></p>

                    <div className="bg-slate-800 p-3 rounded text-sm mt-3">
                      <p className="font-semibold text-white mb-2">Hasil Aktual ({data.keterangan_legal}):</p>
                      <p className="text-3xl font-bold text-green-400 mb-2">{data.tp_count.toLocaleString()}</p>
                      <p className="text-xs">{data.tp_penjelasan}</p>
                    </div>

                    <p className="text-xs text-slate-400 mt-3">
                      TP tinggi = Model bagus mendeteksi website illegal
                    </p>
                  </CardContent>
                </Card>

                {/* True Negative Explanation */}
                <Card className="bg-blue-900/10 border-blue-800">
                  <CardHeader>
                    <CardTitle className="text-blue-400 flex items-center gap-2">
                      <span className="text-2xl">✅</span> True Negative (TN)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-300 space-y-3">
                    <p className="font-semibold text-white">Definisi:</p>
                    <p className="text-sm">Model memprediksi <span className="text-green-400 font-bold">LEGAL</span> dan ternyata memang <span className="text-green-400 font-bold">LEGAL</span></p>

                    <div className="bg-slate-800 p-3 rounded text-sm mt-3">
                      <p className="font-semibold text-white mb-2">Hasil Aktual ({data.keterangan_legal}):</p>
                      <p className="text-3xl font-bold text-blue-400 mb-2">{data.tn_count.toLocaleString()}</p>
                      <p className="text-xs">{data.tn_penjelasan}</p>
                    </div>

                    <p className="text-xs text-slate-400 mt-3">
                      TN tinggi = Model bagus mengidentifikasi website legal
                    </p>
                  </CardContent>
                </Card>

                {/* False Positive Explanation */}
                <Card className="bg-orange-900/10 border-orange-800">
                  <CardHeader>
                    <CardTitle className="text-orange-400 flex items-center gap-2">
                      <span className="text-2xl">⚠️</span> False Positive (FP)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-300 space-y-3">
                    <p className="font-semibold text-white">Definisi:</p>
                    <p className="text-sm">Model memprediksi <span className="text-red-400 font-bold">ILLEGAL</span> padahal sebenarnya <span className="text-green-400 font-bold">LEGAL</span></p>

                    <div className="bg-slate-800 p-3 rounded text-sm mt-3">
                      <p className="font-semibold text-white mb-2">Hasil Aktual ({data.keterangan_legal}):</p>
                      <p className="text-3xl font-bold text-orange-400 mb-2">{data.fp_count.toLocaleString()}</p>
                      <p className="text-xs">{data.fp_penjelasan}</p>
                    </div>

                    <p className="text-xs text-slate-400 mt-3">
                      FP tinggi = Banyak website legal yang salah dituduh illegal (False Alarm)
                    </p>
                  </CardContent>
                </Card>

                {/* False Negative Explanation */}
                <Card className="bg-red-900/10 border-red-800">
                  <CardHeader>
                    <CardTitle className="text-red-400 flex items-center gap-2">
                      <span className="text-2xl">❌</span> False Negative (FN)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-300 space-y-3">
                    <p className="font-semibold text-white">Definisi:</p>
                    <p className="text-sm">Model memprediksi <span className="text-green-400 font-bold">LEGAL</span> padahal sebenarnya <span className="text-red-400 font-bold">ILLEGAL</span></p>

                    <div className="bg-slate-800 p-3 rounded text-sm mt-3">
                      <p className="font-semibold text-white mb-2">Hasil Aktual ({data.keterangan_legal}):</p>
                      <p className="text-3xl font-bold text-red-400 mb-2">{data.fn_count.toLocaleString()}</p>
                      <p className="text-xs">{data.fn_penjelasan}</p>
                    </div>

                    <p className="text-xs text-slate-400 mt-3">
                      FN tinggi = Banyak website illegal yang lolos dari deteksi (Miss Detection)
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Metrics Formulas - DYNAMIC */}
              <Card className="bg-slate-900 border-slate-800 mb-6">
                <CardHeader>
                  <CardTitle className="text-white text-xl">🧮 Rumus Perhitungan Metrics</CardTitle>
                  <CardDescription>Formula matematika untuk setiap metrik evaluasi dengan data {data.keterangan_legal}</CardDescription>
                </CardHeader>
                <CardContent className="text-slate-300 space-y-6">
                  {/* Accuracy */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="text-lg font-bold text-white mb-2">1. Accuracy (Akurasi)</h3>
                    <div className="bg-slate-800 p-4 rounded mb-3 font-mono text-sm">
                      Accuracy = (TP + TN) / (TP + TN + FP + FN)
                    </div>
                    <p className="text-sm mb-2"><span className="font-semibold text-white">Arti:</span> Persentase prediksi yang benar dari total data</p>
                    <div className="bg-slate-800 p-3 rounded text-sm">
                      <p className="font-semibold text-white mb-2">Perhitungan Aktual ({data.keterangan_legal}):</p>
                      <p>TP = {data.tp_count}, TN = {data.tn_count}, FP = {data.fp_count}, FN = {data.fn_count}</p>
                      <p>Accuracy = ({data.tp_count} + {data.tn_count}) / ({data.tp_count} + {data.tn_count} + {data.fp_count} + {data.fn_count})</p>
                      <p>Accuracy = {data.tp_count + data.tn_count} / {data.ts_count}</p>
                      <p className="text-green-400 font-bold mt-2">Accuracy = {data.accuracy_count.toFixed(3)} = {formatPercent(data.accuracy_count)}</p>
                      <p className="text-xs text-slate-400 mt-2">{data.accuracy_penjelasan}</p>
                    </div>
                  </div>

                  {/* Precision */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-bold text-white mb-2">2. Precision (Presisi)</h3>
                    <div className="bg-slate-800 p-4 rounded mb-3 font-mono text-sm">
                      Precision = TP / (TP + FP)
                    </div>
                    <p className="text-sm mb-2"><span className="font-semibold text-white">Arti:</span> Dari semua yang diprediksi ILLEGAL, berapa yang benar-benar ILLEGAL?</p>
                    <div className="bg-slate-800 p-3 rounded text-sm">
                      <p className="font-semibold text-white mb-2">Perhitungan Aktual ({data.keterangan_legal}):</p>
                      <p>TP = {data.tp_count}, FP = {data.fp_count}</p>
                      {data.tp_count + data.fp_count > 0 ? (
                        <>
                          <p>Precision = {data.tp_count} / ({data.tp_count} + {data.fp_count})</p>
                          <p>Precision = {data.tp_count} / {data.tp_count + data.fp_count}</p>
                          <p className="text-blue-400 font-bold mt-2">Precision = {data.precision_count.toFixed(3)} = {formatPercent(data.precision_count)}</p>
                        </>
                      ) : (
                        <p className="text-yellow-400 font-bold mt-2">Precision = N/A (tidak ada data illegal untuk dideteksi)</p>
                      )}
                      <p className="text-xs text-slate-400 mt-2">{data.precision_penjelasan}</p>
                    </div>
                  </div>

                  {/* Recall */}
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="text-lg font-bold text-white mb-2">3. Recall (Sensitivitas)</h3>
                    <div className="bg-slate-800 p-4 rounded mb-3 font-mono text-sm">
                      Recall = TP / (TP + FN)
                    </div>
                    <p className="text-sm mb-2"><span className="font-semibold text-white">Arti:</span> Dari semua yang sebenarnya ILLEGAL, berapa yang berhasil terdeteksi?</p>
                    <div className="bg-slate-800 p-3 rounded text-sm">
                      <p className="font-semibold text-white mb-2">Perhitungan Aktual ({data.keterangan_legal}):</p>
                      <p>TP = {data.tp_count}, FN = {data.fn_count}</p>
                      {data.tp_count + data.fn_count > 0 ? (
                        <>
                          <p>Recall = {data.tp_count} / ({data.tp_count} + {data.fn_count})</p>
                          <p>Recall = {data.tp_count} / {data.tp_count + data.fn_count}</p>
                          <p className="text-purple-400 font-bold mt-2">Recall = {data.recall_count.toFixed(3)} = {formatPercent(data.recall_count)}</p>
                        </>
                      ) : (
                        <p className="text-yellow-400 font-bold mt-2">Recall = N/A (tidak ada data illegal untuk dideteksi)</p>
                      )}
                      <p className="text-xs text-slate-400 mt-2">{data.recall_penjelasan}</p>
                    </div>
                  </div>

                  {/* F1-Score */}
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h3 className="text-lg font-bold text-white mb-2">4. F1-Score</h3>
                    <div className="bg-slate-800 p-4 rounded mb-3 font-mono text-sm">
                      F1-Score = 2 × (Precision × Recall) / (Precision + Recall)
                    </div>
                    <p className="text-sm mb-2"><span className="font-semibold text-white">Arti:</span> Harmonic mean dari Precision dan Recall (balance antara keduanya)</p>
                    <div className="bg-slate-800 p-3 rounded text-sm">
                      <p className="font-semibold text-white mb-2">Perhitungan Aktual ({data.keterangan_legal}):</p>
                      {data.precision_count > 0 && data.recall_count > 0 ? (
                        <>
                          <p>Precision = {data.precision_count.toFixed(3)}, Recall = {data.recall_count.toFixed(3)}</p>
                          <p>F1 = 2 × ({data.precision_count.toFixed(3)} × {data.recall_count.toFixed(3)}) / ({data.precision_count.toFixed(3)} + {data.recall_count.toFixed(3)})</p>
                          <p>F1 = 2 × {(data.precision_count * data.recall_count).toFixed(3)} / {(data.precision_count + data.recall_count).toFixed(3)}</p>
                          <p>F1 = {(2 * data.precision_count * data.recall_count).toFixed(3)} / {(data.precision_count + data.recall_count).toFixed(3)}</p>
                          <p className="text-orange-400 font-bold mt-2">F1-Score = {data.f1_score_count.toFixed(3)} = {formatPercent(data.f1_score_count)}</p>
                        </>
                      ) : (
                        <p className="text-yellow-400 font-bold mt-2">F1-Score = N/A (Precision atau Recall = 0)</p>
                      )}
                      <p className="text-xs text-slate-400 mt-2">{data.f1_score_penjelasan}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interpretation Guide */}
              <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-xl">💡 Panduan Interpretasi Hasil</CardTitle>
                  <CardDescription>Cara membaca dan memahami hasil confusion matrix</CardDescription>
                </CardHeader>
                <CardContent className="text-slate-300 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded">
                      <h4 className="font-bold text-green-400 mb-2">✅ Hasil Bagus</h4>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Accuracy &gt; 90%</li>
                        <li>Precision &gt; 90%</li>
                        <li>Recall &gt; 90%</li>
                        <li>F1-Score &gt; 90%</li>
                        <li>FP dan FN rendah</li>
                      </ul>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded">
                      <h4 className="font-bold text-yellow-400 mb-2">⚠️ Perlu Perbaikan</h4>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Accuracy &lt; 80%</li>
                        <li>Precision rendah = Banyak false alarm</li>
                        <li>Recall rendah = Banyak yang terlewat</li>
                        <li>F1-Score &lt; 80%</li>
                        <li>FP atau FN tinggi</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-800 p-4 rounded mt-4">
                    <h4 className="font-bold text-blue-400 mb-2">🎯 Trade-off Precision vs Recall</h4>
                    <p className="text-sm mb-3">Dalam sistem klasifikasi website illegal, kita harus memilih prioritas:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="bg-slate-800 p-3 rounded">
                        <p className="font-semibold text-white mb-1">Prioritas Precision Tinggi:</p>
                        <p className="text-xs">Hindari false alarm (website legal dituduh illegal). Cocok untuk sistem yang harus sangat hati-hati.</p>
                      </div>
                      <div className="bg-slate-800 p-3 rounded">
                        <p className="font-semibold text-white mb-1">Prioritas Recall Tinggi:</p>
                        <p className="text-xs">Tangkap semua website illegal meski ada false alarm. Cocok untuk sistem keamanan yang agresif.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Total Samples */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Total Samples (TS)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">
                    {data.ts_count.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-400">
                    {data.ts_penjelasan}
                  </p>
                </CardContent>
              </Card>

              {/* Accuracy */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    {formatPercent(data.accuracy_count)}
                  </div>
                  <p className="text-xs text-slate-400">
                    {data.accuracy_penjelasan}
                  </p>
                </CardContent>
              </Card>

              {/* Precision */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Precision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-500 mb-2">
                    {data.precision_count === 0 ? "N/A" : formatPercent(data.precision_count)}
                  </div>
                  <p className="text-xs text-slate-400">
                    {data.precision_penjelasan}
                  </p>
                </CardContent>
              </Card>

              {/* Recall */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Recall
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-500 mb-2">
                    {data.recall_count === 0 ? "N/A" : formatPercent(data.recall_count)}
                  </div>
                  <p className="text-xs text-slate-400">
                    {data.recall_penjelasan}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Confusion Matrix Grid */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Confusion Matrix</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* True Positive */}
                <Card className="bg-green-900/20 border-green-800">
                  <CardHeader>
                    <CardTitle className="text-green-400">
                      True Positive (TP)
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Correctly predicted as positive
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-green-400 mb-2">
                      {data.tp_count.toLocaleString()}
                    </div>
                    <p className="text-sm text-slate-300">
                      {data.tp_penjelasan}
                    </p>
                  </CardContent>
                </Card>

                {/* True Negative */}
                <Card className="bg-blue-900/20 border-blue-800">
                  <CardHeader>
                    <CardTitle className="text-blue-400">
                      True Negative (TN)
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Correctly predicted as negative
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-blue-400 mb-2">
                      {data.tn_count.toLocaleString()}
                    </div>
                    <p className="text-sm text-slate-300">
                      {data.tn_penjelasan}
                    </p>
                  </CardContent>
                </Card>

                {/* False Positive */}
                <Card className="bg-orange-900/20 border-orange-800">
                  <CardHeader>
                    <CardTitle className="text-orange-400">
                      False Positive (FP)
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Incorrectly predicted as positive
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-orange-400 mb-2">
                      {data.fp_count.toLocaleString()}
                    </div>
                    <p className="text-sm text-slate-300">
                      {data.fp_penjelasan}
                    </p>
                  </CardContent>
                </Card>

                {/* False Negative */}
                <Card className="bg-red-900/20 border-red-800">
                  <CardHeader>
                    <CardTitle className="text-red-400">
                      False Negative (FN)
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Incorrectly predicted as negative
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-red-400 mb-2">
                      {data.fn_count.toLocaleString()}
                    </div>
                    <p className="text-sm text-slate-300">
                      {data.fn_penjelasan}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* F1 Score */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">F1 Score</CardTitle>
                <CardDescription className="text-slate-400">
                  Harmonic mean of precision and recall
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold text-orange-500 mb-4">
                  {data.f1_score_count === 0 ? "N/A" : formatPercent(data.f1_score_count)}
                </div>
                <p className="text-sm text-slate-300">
                  {data.f1_score_penjelasan}
                </p>
              </CardContent>
            </Card>
          </>
        ) : null}

        {/* Infographic Section */}
        <div className="mt-12 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            📊 Infografis Proses Confusion Matrix
          </h2>
          <div className="grid grid-cols-1 gap-8">
            {/* Image 1 - Diagram */}
            <Card className="bg-slate-900 border-slate-800 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">Diagram Proses</CardTitle>
                <CardDescription>Alur kerja confusion matrix</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/proses-1/Proses_1_Diagram.png"
                  alt="Proses 1 - Diagram"
                  className="w-full h-auto rounded-lg"
                />
              </CardContent>
            </Card>

            {/* Image 2 - Penjelasan */}
            <Card className="bg-slate-900 border-slate-800 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">Penjelasan Hasil</CardTitle>
                <CardDescription>Interpretasi metrik confusion matrix</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/proses-1/Proses_1_Penjelasan.png"
                  alt="Proses 1 - Penjelasan"
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
                  src="/proses-1/Proses_1_Penjelasan_Angka.png"
                  alt="Proses 1 - Penjelasan Angka"
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
