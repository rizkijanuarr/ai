"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
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
            📊 Penjelasan Proses Confusion Matrix
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
                  src="/proses-1/Proses 1 - Diagram.png"
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
                  src="/proses-1/Proses 1 - Penjelasan.png"
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
                  src="/proses-1/Proses 1 - Penjelasan Angka.png"
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
