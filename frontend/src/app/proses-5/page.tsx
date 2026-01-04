"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { optimizerService } from "@/services/optimizer.service";
import { ApiError } from "@/services/api-client";
import { toast } from "sonner";
import type { OptimizerData } from "@/types/api";
import { CheckCircle2, XCircle } from "lucide-react";

export default function Proses5Page() {
  const [data, setData] = useState<OptimizerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<number>(1);

  const fetchData = async (isLegal: number) => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const response = await optimizerService.getOptimizerComparison(isLegal);

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

  const getSpeedColor = (speed: string) => {
    switch (speed.toLowerCase()) {
      case 'fast': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'slow': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStabilityColor = (stability: string) => {
    switch (stability.toLowerCase()) {
      case 'high': return 'text-green-400';
      case 'moderate': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

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
            Optimizer Comparison
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl drop-shadow-md">
            Proses 5 - Perbandingan optimizer untuk training.
            Analisis SGD, RMSprop, dan Adam untuk convergence speed dan stability.
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
                <Skeleton key={i} className="h-96" />
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

            {/* Optimizer Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {data.optimizer_results.map((optimizer) => {
                const isRecommended = optimizer.optimizer === data.comparison.recommended.optimizer;

                return (
                  <Card
                    key={optimizer.optimizer}
                    className={`${
                      isRecommended
                        ? 'bg-gradient-to-br from-green-900/20 to-slate-900 border-green-800 ring-2 ring-green-500/50'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        {optimizer.optimizer}
                        {isRecommended && (
                          <Badge className="bg-green-600">Recommended</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{optimizer.full_name}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-800 p-3 rounded-lg">
                          <p className="text-xs text-slate-400 mb-1">Epochs</p>
                          <p className="text-xl font-bold text-white">{optimizer.epochs_to_converge}</p>
                        </div>
                        <div className="bg-slate-800 p-3 rounded-lg">
                          <p className="text-xs text-slate-400 mb-1">Accuracy</p>
                          <p className="text-xl font-bold text-green-400">
                            {formatPercent(optimizer.final_accuracy)}
                          </p>
                        </div>
                        <div className="bg-slate-800 p-3 rounded-lg">
                          <p className="text-xs text-slate-400 mb-1">Speed</p>
                          <Badge className={getSpeedColor(optimizer.convergence_speed)}>
                            {optimizer.convergence_speed}
                          </Badge>
                        </div>
                        <div className="bg-slate-800 p-3 rounded-lg">
                          <p className="text-xs text-slate-400 mb-1">Stability</p>
                          <span className={`font-semibold ${getStabilityColor(optimizer.stability)}`}>
                            {optimizer.stability}
                          </span>
                        </div>
                      </div>

                      {/* Learning Rate */}
                      <div className="pt-3 border-t border-slate-700">
                        <p className="text-xs text-slate-400">Learning Rate</p>
                        <p className="text-sm font-mono text-blue-400">{optimizer.learning_rate}</p>
                      </div>

                      {/* Pros */}
                      <div>
                        <p className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          Pros
                        </p>
                        <ul className="space-y-1">
                          {optimizer.characteristics.pros.slice(0, 3).map((pro, idx) => (
                            <li key={idx} className="text-xs text-slate-300 flex items-start gap-1">
                              <span className="text-green-400 mt-0.5">•</span>
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Cons */}
                      <div>
                        <p className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          Cons
                        </p>
                        <ul className="space-y-1">
                          {optimizer.characteristics.cons.slice(0, 3).map((con, idx) => (
                            <li key={idx} className="text-xs text-slate-300 flex items-start gap-1">
                              <span className="text-red-400 mt-0.5">•</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Convergence Speed Chart */}
            <Card className="bg-slate-900 border-slate-800 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Epochs to Converge Comparison</CardTitle>
                <CardDescription>Lower is faster</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.optimizer_results}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="optimizer"
                      stroke="#94a3b8"
                      label={{ value: 'Optimizer', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      label={{ value: 'Epochs', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                      labelStyle={{ color: '#94a3b8' }}
                    />
                    <Legend />
                    <Bar
                      dataKey="epochs_to_converge"
                      fill="#22c55e"
                      name="Epochs to Converge"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Comparison Table */}
            <Card className="bg-slate-900 border-slate-800 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Detailed Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Optimizer</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">Epochs</th>
                        <th className="text-center py-3 px-4 text-slate-400 font-medium">Speed</th>
                        <th className="text-center py-3 px-4 text-slate-400 font-medium">Stability</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">Accuracy</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">LR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.optimizer_results.map((optimizer) => (
                        <tr key={optimizer.optimizer} className="border-b border-slate-800 hover:bg-slate-800/50">
                          <td className="py-3 px-4 text-white font-bold">
                            {optimizer.optimizer}
                            {optimizer.optimizer === data.comparison.recommended.optimizer && (
                              <Badge className="ml-2 bg-green-600 text-xs">Recommended</Badge>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right text-green-400 font-mono">
                            {optimizer.epochs_to_converge}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge className={getSpeedColor(optimizer.convergence_speed)}>
                              {optimizer.convergence_speed}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={getStabilityColor(optimizer.stability)}>
                              {optimizer.stability}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-blue-400 font-mono">
                            {formatPercent(optimizer.final_accuracy)}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-400 font-mono">
                            {optimizer.learning_rate}
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
              <CardContent className="space-y-4 text-sm text-slate-300">
                <div>
                  <strong className="text-white">Optimizer Concept:</strong>
                  <p className="mt-1">{data.penjelasan.optimizer_concept}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-800 p-4 rounded-lg">
                    <strong className="text-orange-400">SGD:</strong>
                    <p className="mt-2 text-xs">{data.penjelasan.sgd_explanation}</p>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg">
                    <strong className="text-yellow-400">RMSprop:</strong>
                    <p className="mt-2 text-xs">{data.penjelasan.rmsprop_explanation}</p>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg">
                    <strong className="text-green-400">Adam:</strong>
                    <p className="mt-2 text-xs">{data.penjelasan.adam_explanation}</p>
                  </div>
                </div>
                <div className="bg-green-900/20 border border-green-800 p-4 rounded-lg">
                  <strong className="text-green-400">Recommendation:</strong>
                  <p className="mt-1">{data.penjelasan.recommendation}</p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}

        {/* Infographic Section */}
        <div className="mt-12 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            📊 Penjelasan Proses Optimizer Comparison
          </h2>
          <div className="grid grid-cols-1 gap-8">
            <Card className="bg-slate-900 border-slate-800 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">Diagram Proses</CardTitle>
                <CardDescription>Alur kerja optimizer comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/proses-5/Proses 5 - Diagram.png"
                  alt="Proses 5 - Diagram"
                  className="w-full h-auto rounded-lg"
                />
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">Penjelasan Hasil</CardTitle>
                <CardDescription>Interpretasi optimizer comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/proses-5/Proses 5 - Penjelasan.png"
                  alt="Proses 5 - Penjelasan"
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
                  src="/proses-5/Proses 5 - Penjelasan Angka.png"
                  alt="Proses 5 - Penjelasan Angka"
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
