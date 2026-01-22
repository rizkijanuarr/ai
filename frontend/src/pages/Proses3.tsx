
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { epochTrainingService } from "@/services/epoch-training.service";
import { ApiError } from "@/services/api-client";
import { toast } from "sonner";
import type { EpochTrainingData } from "@/types/api";

export default function Proses3Page() {
  const [data, setData] = useState<EpochTrainingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<number>(1);
  const [maxEpochs] = useState(10);

  const fetchData = async (isLegal: number) => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const response = await epochTrainingService.getEpochTraining(isLegal, maxEpochs);

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
    return (value * 100).toFixed(2) + "%";
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
            Epoch Training
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl drop-shadow-md">
            Proses 3 - Visualisasi training progress dengan epoch.
            Monitor accuracy dan loss improvement selama training.
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        ) : data ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Total Epochs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {data.summary.total_epochs_run}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Max: {data.max_epochs}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Final Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-500">
                    {formatPercent(data.summary.final_train_accuracy)}
                  </div>
                  <p className="text-xs text-green-400 mt-1">
                    +{formatPercent(data.summary.improvement_train_accuracy)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Final Loss
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-500">
                    {data.summary.final_train_loss.toFixed(4)}
                  </div>
                  <p className="text-xs text-blue-400 mt-1">
                    -{data.summary.improvement_train_loss.toFixed(4)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Training Samples
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-500">
                    {data.train_samples.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {data.keterangan_legal}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Training Progress Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Accuracy Chart */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Training Accuracy</CardTitle>
                  <CardDescription>Accuracy improvement per epoch</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.epochs}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis
                        dataKey="epoch"
                        stroke="#94a3b8"
                        label={{ value: 'Epoch', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        label={{ value: 'Accuracy', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                        domain={[0, 1]}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                        labelStyle={{ color: '#94a3b8' }}
                        formatter={(value: any) => formatPercent(value as number)}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="train_accuracy"
                        stroke="#22c55e"
                        strokeWidth={2}
                        name="Accuracy"
                        dot={{ fill: '#22c55e', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Loss Chart */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Training Loss</CardTitle>
                  <CardDescription>Loss reduction per epoch</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.epochs}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis
                        dataKey="epoch"
                        stroke="#94a3b8"
                        label={{ value: 'Epoch', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        label={{ value: 'Loss', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                        labelStyle={{ color: '#94a3b8' }}
                        formatter={(value: any) => (value as number).toFixed(4)}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="train_loss"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Loss"
                        dot={{ fill: '#3b82f6', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Epoch Details Table */}
            <Card className="bg-slate-900 border-slate-800 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Epoch Details</CardTitle>
                <CardDescription>Training metrics per epoch</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Epoch</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">Accuracy</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">Loss</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">Acc Δ</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">Loss Δ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.epochs.map((epoch, index) => {
                        const prevEpoch = index > 0 ? data.epochs[index - 1] : null;
                        const accDelta = prevEpoch ? epoch.train_accuracy - prevEpoch.train_accuracy : 0;
                        const lossDelta = prevEpoch ? epoch.train_loss - prevEpoch.train_loss : 0;

                        return (
                          <tr key={epoch.epoch} className="border-b border-slate-800 hover:bg-slate-800/50">
                            <td className="py-3 px-4 text-white font-medium">
                              {epoch.epoch}
                              {epoch.epoch === data.best_epoch && (
                                <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-0.5 rounded">Best</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right text-green-400 font-mono">
                              {formatPercent(epoch.train_accuracy)}
                            </td>
                            <td className="py-3 px-4 text-right text-blue-400 font-mono">
                              {epoch.train_loss.toFixed(4)}
                            </td>
                            <td className={`py-3 px-4 text-right font-mono ${accDelta > 0 ? 'text-green-400' : 'text-slate-500'}`}>
                              {index > 0 ? (accDelta > 0 ? '+' : '') + formatPercent(accDelta) : '-'}
                            </td>
                            <td className={`py-3 px-4 text-right font-mono ${lossDelta < 0 ? 'text-blue-400' : 'text-slate-500'}`}>
                              {index > 0 ? (lossDelta < 0 ? '' : '+') + lossDelta.toFixed(4) : '-'}
                            </td>
                          </tr>
                        );
                      })}
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
                  <strong className="text-white">Training Mode:</strong>
                  <p className="mt-1">{data.penjelasan.training_mode}</p>
                </div>
                <div>
                  <strong className="text-white">Final Performance:</strong>
                  <p className="mt-1">{data.penjelasan.final_performance}</p>
                </div>
                <div>
                  <strong className="text-white">Improvement:</strong>
                  <p className="mt-1">{data.penjelasan.improvement}</p>
                </div>
                <div>
                  <strong className="text-white">Recommendation:</strong>
                  <p className="mt-1">{data.penjelasan.recommendation}</p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}

        {/* Infographic Section */}
        <div className="mt-12 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            📊 Penjelasan Proses Epoch Training
          </h2>
          <div className="grid grid-cols-1 gap-8">
            <Card className="bg-slate-900 border-slate-800 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">Diagram Proses</CardTitle>
                <CardDescription>Alur kerja epoch training</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/proses-3/Proses 3 - Diagram.png"
                  alt="Proses 3 - Diagram"
                  className="w-full h-auto rounded-lg"
                />
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">Penjelasan Hasil</CardTitle>
                <CardDescription>Interpretasi metrik epoch training</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/proses-3/Proses 3 - Penjelasan.png"
                  alt="Proses 3 - Penjelasan"
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
                  src="/proses-3/Proses 3 - Penjelasan Angka.png"
                  alt="Proses 3 - Penjelasan Angka"
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
