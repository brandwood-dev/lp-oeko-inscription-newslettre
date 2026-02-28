'use client';

import { useState } from 'react';
import { Upload, CheckCircle2, XCircle, Loader2, FileSpreadsheet, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

interface ImportResult {
  row: number;
  email: string;
  nom: string;
  prenom: string;
  status: 'success' | 'error';
  message?: string;
  addedToMarketing?: boolean;
}

export default function ImportExcelPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ImportResult[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
    marketing: 0,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.match(/\.(xlsx|xls|csv)$/)) {
        toast.error('Veuillez sélectionner un fichier Excel (.xlsx, .xls) ou CSV');
        return;
      }
      setFile(selectedFile);
      setResults([]);
      setStats({ total: 0, success: 0, failed: 0, marketing: 0 });
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }

    setIsProcessing(true);
    setResults([]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/import-excel', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'import');
      }

      // Stream des résultats
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Impossible de lire la réponse');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() && line.startsWith('data: ')) {
            const data = JSON.parse(line.substring(6));

            if (data.type === 'result') {
              setResults((prev) => [...prev, data.result]);

              // Update stats
              setStats((prev) => ({
                total: prev.total + 1,
                success: prev.success + (data.result.status === 'success' ? 1 : 0),
                failed: prev.failed + (data.result.status === 'error' ? 1 : 0),
                marketing: prev.marketing + (data.result.addedToMarketing ? 1 : 0),
              }));
            } else if (data.type === 'complete') {
              toast.success(`Import terminé ! ${data.stats.success} succès, ${data.stats.failed} échecs`);
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Import error:', error);
      toast.error(error.message || 'Erreur lors de l\'import');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      file: file?.name,
      stats: stats,
      results: results,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `import-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#352c5b] mb-3">
              Import Excel vers Brevo
            </h1>
            <p className="text-gray-600 text-lg">
              Importez vos contacts depuis un fichier Excel et suivez le traitement en temps réel
            </p>
          </div>

          {/* Upload Card */}
          <Card className="p-8 mb-8 bg-white shadow-lg">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-[#352c5b]/10 rounded-full flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-10 h-10 text-[#352c5b]" />
              </div>

              <h2 className="text-2xl font-semibold text-[#352c5b] mb-2">
                Sélectionnez votre fichier Excel
              </h2>
              <p className="text-gray-600 mb-6 text-center max-w-md">
                Format accepté : .xlsx, .xls, .csv
                <br />
                Colonnes requises : Nom, Prénom, Adresse, Code Postal, Ville, Téléphone Portable, Email, CGU, Marketing
              </p>

              <div className="w-full max-w-md">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#352c5b] hover:bg-gray-50 transition-all"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      {file ? (
                        <span className="font-semibold text-[#352c5b]">{file.name}</span>
                      ) : (
                        <>
                          <span className="font-semibold">Cliquez pour sélectionner</span> ou glissez-déposez
                        </>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Excel ou CSV</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    disabled={isProcessing}
                  />
                </label>

                <Button
                  onClick={handleImport}
                  disabled={!file || isProcessing}
                  className="w-full mt-4 bg-[#352c5b] hover:bg-[#352c5b]/90 text-white py-6 text-lg"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Import en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Démarrer l'import
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Stats */}
          {(stats.total > 0 || isProcessing) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-4 bg-white shadow">
                <div className="text-2xl font-bold text-[#352c5b]">{stats.total}</div>
                <div className="text-sm text-gray-600">Total traité</div>
              </Card>
              <Card className="p-4 bg-white shadow">
                <div className="text-2xl font-bold text-green-600">{stats.success}</div>
                <div className="text-sm text-gray-600">Succès</div>
              </Card>
              <Card className="p-4 bg-white shadow">
                <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                <div className="text-sm text-gray-600">Échecs</div>
              </Card>
              <Card className="p-4 bg-white shadow">
                <div className="text-2xl font-bold text-blue-600">{stats.marketing}</div>
                <div className="text-sm text-gray-600">Marketing</div>
              </Card>
            </div>
          )}

          {/* Results Table */}
          {results.length > 0 && (
            <Card className="p-6 bg-white shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-[#352c5b]">
                  Résultats de l'import
                </h3>
                <Button
                  onClick={downloadReport}
                  variant="outline"
                  size="sm"
                  className="border-[#352c5b] text-[#352c5b] hover:bg-[#352c5b] hover:text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger le rapport
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Ligne</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Nom</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Prénom</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Marketing</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Statut</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-100 ${
                          result.status === 'success' ? 'bg-green-50' : 'bg-red-50'
                        }`}
                      >
                        <td className="py-3 px-4 text-gray-700">{result.row}</td>
                        <td className="py-3 px-4 text-gray-700">{result.nom}</td>
                        <td className="py-3 px-4 text-gray-700">{result.prenom}</td>
                        <td className="py-3 px-4 text-gray-700 font-mono text-sm">
                          {result.email}
                        </td>
                        <td className="py-3 px-4">
                          {result.addedToMarketing ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Oui
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Non
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {result.status === 'success' ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle2 className="w-5 h-5 mr-2" />
                              <span className="font-semibold">Succès</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600">
                              <XCircle className="w-5 h-5 mr-2" />
                              <span className="font-semibold">Échec</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {result.message || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Instructions */}
          {results.length === 0 && !isProcessing && (
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                📋 Instructions
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• Préparez votre fichier Excel avec les colonnes requises</li>
                <li>• Sélectionnez le fichier ci-dessus</li>
                <li>• Cliquez sur "Démarrer l'import"</li>
                <li>• Suivez la progression en temps réel</li>
                <li>• Téléchargez le rapport une fois terminé</li>
              </ul>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
