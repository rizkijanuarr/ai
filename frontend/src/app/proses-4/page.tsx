"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { batchSizeService } from "@/services/batch-size.service";
import { ApiError } from "@/services/api-client";
import { toast } from "sonner";
import type { BatchSizeData, BatchSizeResult } from "@/types/api";

export default function Proses4Page() {
  const [data, setData] = useState<BatchSizeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<number>(1);

  const fetchData = async (isLegal: number) => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const response = await batchSizeService.getBatchSizeComparison(isLegal);

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

  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getSpeedColor = (speed: string) => {
    switch (speed.toLowerCase()) {
      case 'very_fast': return 'text-green-400';
      case 'fast': return 'text-blue-400';
      case 'moderate': return 'text-yellow-400';
      case 'slow': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getMemoryColor = (efficiency: string) => {
    switch (efficiency.toLowerCase()) {
      case 'very_high': return 'text-green-400';
      case 'high': return 'text-blue-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
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
            Batch Size Comparison
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl drop-shadow-md">
            Proses 4 - Perbandingan berbagai batch size untuk training.
            Analisis trade-off antara speed, memory, dan convergence quality.
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
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          </div>
        ) : data ? (
          <>
            {/* Summary */}
            <Card className="bg-slate-900 border-slate-800 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Dataset Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Total Samples</p>
                    <p className="text-2xl font-bold text-white">{data.total_samples.toLocaleString()}</p>
                  </div>
                  <div className="h-12 w-px bg-slate-700"></div>
                  <div>
                    <p className="text-sm text-slate-400">Filter</p>
                    <Badge className={filter === 1 ? "bg-green-600" : "bg-red-600"}>
                      {data.keterangan_legal}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Smallest Batch */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    Smallest Batch
                    <Badge variant="outline" className="text-orange-400 border-orange-400">
                      Slow
                    </Badge>
                  </CardTitle>
                  <CardDescription>Best convergence, slowest speed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center py-4 bg-slate-800 rounded-lg">
                    <div className="text-4xl font-bold text-orange-400">
                      {data.comparison.smallest_batch.batch_size}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Batch Size</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Iterations:</span>
                      <span className="text-white font-semibold">
                        {data.comparison.smallest_batch.iterations_per_epoch}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Quality:</span>
                      <Badge className={getQualityColor(data.comparison.smallest_batch.convergence_quality)}>
                        {data.comparison.smallest_batch.convergence_quality}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Memory:</span>
                      <span className={getMemoryColor(data.comparison.smallest_batch.memory_efficiency)}>
                        {data.comparison.smallest_batch.memory_efficiency}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Batch */}
              <Card className="bg-gradient-to-br from-green-900/20 to-slate-900 border-green-800 ring-2 ring-green-500/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    Recommended
                    <Badge className="bg-green-600">Best Balance</Badge>
                  </CardTitle>
                  <CardDescription>Optimal trade-off</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center py-4 bg-green-900/30 rounded-lg border border-green-700">
                    <div className="text-4xl font-bold text-green-400">
                      {data.comparison.recommended_batch.batch_size}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Batch Size</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Iterations:</span>
                      <span className="text-white font-semibold">
                        {data.comparison.recommended_batch.iterations_per_epoch}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Quality:</span>
                      <Badge className={getQualityColor(data.comparison.recommended_batch.convergence_quality)}>
                        {data.comparison.recommended_batch.convergence_quality}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Memory:</span>
                      <span className={getMemoryColor(data.comparison.recommended_batch.memory_efficiency)}>
                        {data.comparison.recommended_batch.memory_efficiency}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Largest Batch */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    Largest Batch
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Fast
                    </Badge>
                  </CardTitle>
                  <CardDescription>Fastest speed, lower convergence</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center py-4 bg-slate-800 rounded-lg">
                    <div className="text-4xl font-bold text-green-400">
                      {data.comparison.largest_batch.batch_size}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Batch Size</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Iterations:</span>
                      <span className="text-white font-semibold">
                        {data.comparison.largest_batch.iterations_per_epoch}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Quality:</span>
                      <Badge className={getQualityColor(data.comparison.largest_batch.convergence_quality)}>
                        {data.comparison.largest_batch.convergence_quality}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Memory:</span>
                      <span className={getMemoryColor(data.comparison.largest_batch.memory_efficiency)}>
                        {data.comparison.largest_batch.memory_efficiency}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Iterations Chart */}
            <Card className="bg-slate-900 border-slate-800 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Iterations per Epoch Comparison</CardTitle>
                <CardDescription>Lower iterations = faster training</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.batch_size_results}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="batch_size"
                      stroke="#94a3b8"
                      label={{ value: 'Batch Size', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      label={{ value: 'Iterations', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                      labelStyle={{ color: '#94a3b8' }}
                    />
                    <Legend />
                    <Bar
                      dataKey="iterations_per_epoch"
                      fill="#3b82f6"
                      name="Iterations per Epoch"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* All Results Table */}
            <Card className="bg-slate-900 border-slate-800 mb-8">
              <CardHeader>
                <CardTitle className="text-white">All Batch Size Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Batch Size</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">Iterations</th>
                        <th className="text-center py-3 px-4 text-slate-400 font-medium">Speed</th>
                        <th className="text-center py-3 px-4 text-slate-400 font-medium">Memory</th>
                        <th className="text-center py-3 px-4 text-slate-400 font-medium">Quality</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">Last Batch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.batch_size_results.map((result) => (
                        <tr key={result.batch_size} className="border-b border-slate-800 hover:bg-slate-800/50">
                          <td className="py-3 px-4 text-white font-bold">
                            {result.batch_size}
                            {result.batch_size === data.comparison.recommended_batch.batch_size && (
                              <Badge className="ml-2 bg-green-600 text-xs">Recommended</Badge>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right text-blue-400 font-mono">
                            {result.iterations_per_epoch}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={getSpeedColor(result.speed_category)}>
                              {result.speed_category.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={getMemoryColor(result.memory_efficiency)}>
                              {result.memory_efficiency.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge className={getQualityColor(result.convergence_quality)}>
                              {result.convergence_quality}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right text-slate-400 font-mono">
                            {result.last_batch_size}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Penjelasan */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Penjelasan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-300">
                <div>
                  <strong className="text-white">Batch Size Concept:</strong>
                  <p className="mt-1">{data.penjelasan.batch_size_concept}</p>
                </div>
                <div>
                  <strong className="text-white">Iterations Calculation:</strong>
                  <p className="mt-1">{data.penjelasan.iterations_calculation}</p>
                </div>
                <div>
                  <strong className="text-white">Trade-offs:</strong>
                  <p className="mt-1">{data.penjelasan.trade_offs}</p>
                </div>
                <div>
                  <strong className="text-white">Recommendation:</strong>
                  <p className="mt-1 text-green-400">{data.penjelasan.recommendation}</p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}

        {/* Infographic Section */}
        <div className="mt-12 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            📊 Penjelasan Proses Batch Size Comparison
          </h2>
          <div className="grid grid-cols-1 gap-8">
            <Card className="bg-slate-900 border-slate-800 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">Diagram Proses</CardTitle>
                <CardDescription>Alur kerja batch size comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/proses-4/Proses 4 - Diagram.png"
                  alt="Proses 4 - Diagram"
                  className="w-full h-auto rounded-lg"
                />
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">Penjelasan Hasil</CardTitle>
                <CardDescription>Interpretasi batch size comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/proses-4/Proses 4 - Penjelasan.png"
                  alt="Proses 4 - Penjelasan"
                  className="w-full h-auto rounded-lg"
                />
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">Penjelasan Angka</CardTitle>
                <CardDescription>Detail perhitungan dan rumus</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/proses-4/Proses 4 - Penjelasan Angka.png"
                  alt="Proses 4 - Penjelasan Angka"
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
