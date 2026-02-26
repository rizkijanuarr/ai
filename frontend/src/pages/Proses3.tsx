
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
            <Card className="bg-slate-900 border-slate-800 mb-8">
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

            {/* Detailed Explanation Section - DYNAMIC */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                📚 Penjelasan Detail Epoch Training
              </h2>

              {/* What is Epoch */}
              <Card className="bg-slate-900 border-slate-800 mb-6">
                <CardHeader>
                  <CardTitle className="text-white text-xl">🎯 Apa itu Epoch?</CardTitle>
                  <CardDescription>Konsep dasar epoch dalam machine learning</CardDescription>
                </CardHeader>
                <CardContent className="text-slate-300 space-y-4">
                  <p className="text-sm leading-relaxed">
                    <span className="font-bold text-white">Epoch</span> adalah satu kali iterasi lengkap melalui seluruh dataset training.
                    Dalam setiap epoch, model melihat semua data training, menghitung error (loss), dan mengupdate parameter (weights) untuk meningkatkan performa.
                  </p>

                  <div className="bg-slate-800 p-4 rounded-lg">
                    <p className="font-semibold text-white mb-2">Analogi Sederhana:</p>
                    <p className="text-sm">
                      Bayangkan belajar untuk ujian. <span className="text-blue-400 font-semibold">1 Epoch = 1x membaca semua materi</span>.
                      Semakin banyak epoch (membaca berulang), semakin paham materinya. Tapi kalau terlalu banyak, bisa <span className="text-red-400 font-semibold">overfitting</span> (hafal tapi tidak paham konsep).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-blue-900/20 border border-blue-800 p-4 rounded">
                      <h4 className="font-bold text-blue-400 mb-2">📊 Data Training</h4>
                      <p className="text-sm mb-2">Total Samples: <span className="font-bold text-white">{data.train_samples.toLocaleString()}</span></p>
                      <p className="text-xs text-slate-400">{data.keterangan_legal}</p>
                    </div>

                    <div className="bg-green-900/20 border border-green-800 p-4 rounded">
                      <h4 className="font-bold text-green-400 mb-2">🔢 Epochs Run</h4>
                      <p className="text-sm mb-2">Total: <span className="font-bold text-white">{data.summary.total_epochs_run}</span> / {data.max_epochs}</p>
                      <p className="text-xs text-slate-400">Best Epoch: {data.best_epoch}</p>
                    </div>

                    <div className="bg-orange-900/20 border border-orange-800 p-4 rounded">
                      <h4 className="font-bold text-orange-400 mb-2">📈 Improvement</h4>
                      <p className="text-sm mb-2">Accuracy: <span className="font-bold text-green-400">+{formatPercent(data.summary.improvement_train_accuracy)}</span></p>
                      <p className="text-sm">Loss: <span className="font-bold text-blue-400">-{data.summary.improvement_train_loss.toFixed(4)}</span></p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* How Epoch Training Works */}
              <Card className="bg-slate-900 border-slate-800 mb-6">
                <CardHeader>
                  <CardTitle className="text-white text-xl">🔄 Cara Kerja Epoch Training</CardTitle>
                  <CardDescription>Proses step-by-step training dengan data {data.keterangan_legal}</CardDescription>
                </CardHeader>
                <CardContent className="text-slate-300 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                      <div>
                        <p className="font-semibold text-white">Initialize Model</p>
                        <p className="text-sm">Model dimulai dengan random weights. Pada epoch pertama, performa biasanya buruk (accuracy rendah, loss tinggi)</p>
                        <div className="bg-slate-800 p-2 rounded mt-2 text-xs">
                          <p>Epoch 1: Accuracy = <span className="text-yellow-400 font-bold">{formatPercent(data.epochs[0].train_accuracy)}</span>, Loss = <span className="text-red-400 font-bold">{data.epochs[0].train_loss.toFixed(4)}</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                      <div>
                        <p className="font-semibold text-white">Training Loop (Epoch 1 to {data.summary.total_epochs_run})</p>
                        <p className="text-sm">Untuk setiap epoch:</p>
                        <ul className="list-disc list-inside mt-2 ml-4 space-y-1 text-sm">
                          <li>Loop semua <span className="text-blue-400 font-semibold">{data.train_samples.toLocaleString()} samples</span></li>
                          <li>Predict setiap sample dengan model saat ini</li>
                          <li>Hitung <span className="text-red-400 font-semibold">Loss</span> (seberapa salah prediksi)</li>
                          <li>Update weights menggunakan gradient descent</li>
                          <li>Hitung <span className="text-green-400 font-semibold">Accuracy</span> untuk epoch ini</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                      <div>
                        <p className="font-semibold text-white">Monitor Progress</p>
                        <p className="text-sm">Setiap epoch, metrics dicatat untuk monitoring:</p>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="bg-slate-800 p-2 rounded text-xs">
                            <p className="font-semibold text-white mb-1">Accuracy Trend:</p>
                            <p>Start: <span className="text-yellow-400">{formatPercent(data.summary.initial_train_accuracy)}</span></p>
                            <p>Final: <span className="text-green-400">{formatPercent(data.summary.final_train_accuracy)}</span></p>
                            <p className="text-green-400 mt-1">↑ +{formatPercent(data.summary.improvement_train_accuracy)}</p>
                          </div>
                          <div className="bg-slate-800 p-2 rounded text-xs">
                            <p className="font-semibold text-white mb-1">Loss Trend:</p>
                            <p>Start: <span className="text-red-400">{data.summary.initial_train_loss.toFixed(4)}</span></p>
                            <p>Final: <span className="text-blue-400">{data.summary.final_train_loss.toFixed(4)}</span></p>
                            <p className="text-blue-400 mt-1">↓ -{data.summary.improvement_train_loss.toFixed(4)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">4</div>
                      <div>
                        <p className="font-semibold text-white">Convergence Check</p>
                        <p className="text-sm">Training berhenti ketika:</p>
                        <ul className="list-disc list-inside mt-2 ml-4 space-y-1 text-sm">
                          <li>Mencapai <span className="text-orange-400 font-semibold">max_epochs</span> ({data.max_epochs})</li>
                          <li>Loss sudah tidak turun lagi (converged)</li>
                          <li>Accuracy sudah mencapai target (misal 95%)</li>
                        </ul>
                        <div className="bg-slate-800 p-2 rounded mt-2 text-xs">
                          <p>Training stopped at epoch <span className="text-orange-400 font-bold">{data.summary.total_epochs_run}</span></p>
                          <p className="text-slate-400 mt-1">{data.penjelasan.training_mode}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">5</div>
                      <div>
                        <p className="font-semibold text-white">Select Best Model</p>
                        <p className="text-sm">Model terbaik dipilih berdasarkan lowest loss atau highest accuracy</p>
                        <div className="bg-slate-800 p-2 rounded mt-2 text-xs">
                          <p className="font-semibold text-white">Best Epoch: <span className="text-orange-400">{data.best_epoch}</span></p>
                          <p>Accuracy: <span className="text-green-400 font-bold">{formatPercent(data.epochs[data.best_epoch - 1].train_accuracy)}</span></p>
                          <p>Loss: <span className="text-blue-400 font-bold">{data.epochs[data.best_epoch - 1].train_loss.toFixed(4)}</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Formulas */}
              <Card className="bg-slate-900 border-slate-800 mb-6">
                <CardHeader>
                  <CardTitle className="text-white text-xl">🧮 Rumus Perhitungan Metrics</CardTitle>
                  <CardDescription>Formula matematika dengan data aktual {data.keterangan_legal}</CardDescription>
                </CardHeader>
                <CardContent className="text-slate-300 space-y-6">
                  {/* Loss Function */}
                  <div className="border-l-4 border-red-500 pl-4">
                    <h3 className="text-lg font-bold text-white mb-2">1. Loss Function (Binary Cross-Entropy)</h3>
                    <div className="bg-slate-800 p-4 rounded mb-3 font-mono text-sm">
                      Loss = -(1/N) × Σ[y × log(ŷ) + (1-y) × log(1-ŷ)]
                    </div>
                    <p className="text-sm mb-2"><span className="font-semibold text-white">Arti:</span> Mengukur seberapa salah prediksi model. Loss tinggi = prediksi buruk, Loss rendah = prediksi bagus</p>

                    <div className="bg-slate-800 p-3 rounded text-sm mt-3">
                      <p className="font-semibold text-white mb-2">Keterangan:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li><span className="text-blue-400">N</span> = Jumlah samples ({data.train_samples.toLocaleString()})</li>
                        <li><span className="text-green-400">y</span> = Label aktual (0 atau 1)</li>
                        <li><span className="text-purple-400">ŷ</span> = Prediksi model (probabilitas 0-1)</li>
                      </ul>
                      <div className="mt-3 p-2 bg-slate-700 rounded">
                        <p className="font-semibold text-white text-xs mb-1">Contoh Perhitungan:</p>
                        <p className="text-xs">Epoch 1: Loss = <span className="text-red-400 font-bold">{data.epochs[0].train_loss.toFixed(4)}</span> (buruk, model baru)</p>
                        <p className="text-xs">Epoch {data.summary.total_epochs_run}: Loss = <span className="text-blue-400 font-bold">{data.summary.final_train_loss.toFixed(4)}</span> (bagus, model terlatih)</p>
                        <p className="text-xs text-green-400 mt-1">Improvement: -{data.summary.improvement_train_loss.toFixed(4)} ✅</p>
                      </div>
                    </div>
                  </div>

                  {/* Accuracy */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="text-lg font-bold text-white mb-2">2. Accuracy</h3>
                    <div className="bg-slate-800 p-4 rounded mb-3 font-mono text-sm">
                      Accuracy = (Correct Predictions) / (Total Predictions)
                    </div>
                    <p className="text-sm mb-2"><span className="font-semibold text-white">Arti:</span> Persentase prediksi yang benar dari total data</p>

                    <div className="bg-slate-800 p-3 rounded text-sm mt-3">
                      <p className="font-semibold text-white mb-2">Progression per Epoch:</p>
                      <div className="space-y-1 text-xs max-h-48 overflow-y-auto">
                        {data.epochs.map((epoch, idx) => {
                          const prevAccuracy = idx > 0 ? data.epochs[idx - 1].train_accuracy : 0;
                          const delta = idx > 0 ? epoch.train_accuracy - prevAccuracy : 0;
                          return (
                            <div key={epoch.epoch} className="flex justify-between items-center p-1 hover:bg-slate-700 rounded">
                              <span>Epoch {epoch.epoch}:</span>
                              <div className="flex items-center gap-2">
                                <span className="text-green-400 font-bold">{formatPercent(epoch.train_accuracy)}</span>
                                {idx > 0 && (
                                  <span className={delta > 0 ? "text-green-400" : "text-slate-500"}>
                                    ({delta > 0 ? '+' : ''}{formatPercent(delta)})
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 p-2 bg-slate-700 rounded">
                        <p className="font-semibold text-white text-xs">Summary:</p>
                        <p className="text-xs">Initial: <span className="text-yellow-400">{formatPercent(data.summary.initial_train_accuracy)}</span></p>
                        <p className="text-xs">Final: <span className="text-green-400 font-bold">{formatPercent(data.summary.final_train_accuracy)}</span></p>
                        <p className="text-xs text-green-400 mt-1">Total Improvement: +{formatPercent(data.summary.improvement_train_accuracy)} 🎯</p>
                      </div>
                    </div>
                  </div>

                  {/* Convergence */}
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="text-lg font-bold text-white mb-2">3. Convergence (Konvergensi)</h3>
                    <div className="bg-slate-800 p-4 rounded mb-3 text-sm">
                      <p className="font-semibold text-white mb-2">Definisi:</p>
                      <p>Model dikatakan <span className="text-purple-400 font-bold">converged</span> ketika loss tidak turun lagi secara signifikan di epoch berikutnya.</p>
                    </div>

                    <div className="bg-slate-800 p-3 rounded text-sm mt-3">
                      <p className="font-semibold text-white mb-2">Indikator Convergence:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li className="text-green-400">✅ Loss turun konsisten setiap epoch</li>
                        <li className="text-green-400">✅ Accuracy naik konsisten setiap epoch</li>
                        <li className="text-yellow-400">⚠️ Loss mulai stabil (tidak turun banyak)</li>
                        <li className="text-red-400">❌ Loss naik = overfitting!</li>
                      </ul>
                      <div className="mt-3 p-2 bg-slate-700 rounded">
                        <p className="font-semibold text-white text-xs mb-1">Status Training Ini:</p>
                        <p className="text-xs">{data.penjelasan.final_performance}</p>
                        <p className="text-xs mt-2 text-slate-400">{data.penjelasan.improvement}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interpretation Guide */}
              <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-xl">💡 Panduan Interpretasi Grafik</CardTitle>
                  <CardDescription>Cara membaca grafik accuracy dan loss</CardDescription>
                </CardHeader>
                <CardContent className="text-slate-300 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Good Training */}
                    <div className="bg-green-900/20 border border-green-800 p-4 rounded">
                      <h4 className="font-bold text-green-400 mb-3">✅ Training Bagus</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="font-semibold text-white">Accuracy:</p>
                          <p className="text-xs">📈 Naik konsisten setiap epoch</p>
                          <p className="text-xs">🎯 Mencapai &gt;90% di akhir</p>
                        </div>
                        <div>
                          <p className="font-semibold text-white">Loss:</p>
                          <p className="text-xs">📉 Turun konsisten setiap epoch</p>
                          <p className="text-xs">🎯 Mendekati 0 di akhir</p>
                        </div>
                        <div className="mt-2 pt-2 border-t border-green-700">
                          <p className="text-xs text-green-400">✅ Model belajar dengan baik!</p>
                        </div>
                      </div>
                    </div>

                    {/* Overfitting */}
                    <div className="bg-red-900/20 border border-red-800 p-4 rounded">
                      <h4 className="font-bold text-red-400 mb-3">❌ Overfitting</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="font-semibold text-white">Accuracy:</p>
                          <p className="text-xs">📈 Naik terus (terlalu tinggi)</p>
                          <p className="text-xs">⚠️ Mencapai 100% (mencurigakan)</p>
                        </div>
                        <div>
                          <p className="font-semibold text-white">Loss:</p>
                          <p className="text-xs">📉 Turun terus ke 0</p>
                          <p className="text-xs">⚠️ Terlalu rendah (overfitting)</p>
                        </div>
                        <div className="mt-2 pt-2 border-t border-red-700">
                          <p className="text-xs text-red-400">❌ Model hafal data, tidak generalize!</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Current Training Status */}
                  <div className="bg-blue-900/20 border border-blue-800 p-4 rounded mt-4">
                    <h4 className="font-bold text-blue-400 mb-2">🎯 Status Training Dataset Ini</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="bg-slate-800 p-3 rounded">
                        <p className="font-semibold text-white mb-1">Accuracy Performance:</p>
                        <p className="text-xs">Start: <span className="text-yellow-400">{formatPercent(data.summary.initial_train_accuracy)}</span></p>
                        <p className="text-xs">Final: <span className="text-green-400 font-bold">{formatPercent(data.summary.final_train_accuracy)}</span></p>
                        <p className="text-xs text-green-400 mt-1">Improvement: +{formatPercent(data.summary.improvement_train_accuracy)}</p>
                      </div>
                      <div className="bg-slate-800 p-3 rounded">
                        <p className="font-semibold text-white mb-1">Loss Performance:</p>
                        <p className="text-xs">Start: <span className="text-red-400">{data.summary.initial_train_loss.toFixed(4)}</span></p>
                        <p className="text-xs">Final: <span className="text-blue-400 font-bold">{data.summary.final_train_loss.toFixed(4)}</span></p>
                        <p className="text-xs text-blue-400 mt-1">Reduction: -{data.summary.improvement_train_loss.toFixed(4)}</p>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-slate-800 rounded">
                      <p className="font-semibold text-white text-sm mb-1">💡 Recommendation:</p>
                      <p className="text-xs text-slate-300">{data.penjelasan.recommendation}</p>
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
            📊 Infografis Proses Epoch Training
          </h2>
          <div className="grid grid-cols-1 gap-8">
            <Card className="bg-slate-900 border-slate-800 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">Diagram Proses</CardTitle>
                <CardDescription>Alur kerja epoch training</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/proses-3/Proses_3_Diagram.png"
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
                  src="/proses-3/Proses_3_Penjelasan.png"
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
                  src="/proses-3/Proses_3_Penjelasan_Angka.png"
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
