'use client';

import { useState } from 'react';
import { Upload, CheckCircle2, XCircle, Loader2, FileSpreadsheet, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ImportResult {
  row: number;
  email: string;
  nom: string;
  prenom: string;
  status: 'success' | 'error';
  message?: string;
  addedToMarketing?: boolean;
}

export default function ContactFormSimple() {
  const router = useRouter();

  // Form data
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    adresse: '',
    codePostal: '',
    ville: '',
    telephonePortable: '',
    telephoneDomicile: '',
    email: '',
    accepteCGU: false,
    accepteMarketing: false,
    website: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Import Excel data
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ImportResult[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
    marketing: 0,
  });

  // Handle manual form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.accepteCGU) {
      toast.error('Vous devez accepter les Conditions Générales d\'Utilisation.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Capture the source URL
      // Priority: 1. Current page URL (window.location.href)
      //           2. Parent page URL (if in iframe)
      //           3. Referrer (if cross-origin iframe)
      let sourceUrl = window.location.href;

      // Log for debugging
      console.log('📍 Current URL:', window.location.href);
      console.log('📍 Referrer:', document.referrer);
      console.log('📍 Is iframe:', window.parent !== window);

      try {
        // If embedded in iframe, try to get parent URL
        if (window.parent !== window && window.parent.location.href) {
          sourceUrl = window.parent.location.href;
          console.log('✅ Using parent URL:', sourceUrl);
        }
      } catch (e) {
        // Cross-origin iframe - use document.referrer as fallback
        if (document.referrer) {
          sourceUrl = document.referrer;
          console.log('✅ Using referrer:', sourceUrl);
        }
      }

      console.log('🎯 Final source URL to send:', sourceUrl);

      const response = await fetch('/api/submit-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          sourceUrl, // Add the source URL to the payload
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      toast.success('Contact ajouté avec succès !');

      // Reset form
      setFormData({
        nom: '',
        prenom: '',
        adresse: '',
        codePostal: '',
        ville: '',
        telephonePortable: '',
        telephoneDomicile: '',
        email: '',
        accepteCGU: false,
        accepteMarketing: false,
        website: '',
      });

    } catch (err: any) {
      console.error('Form submission error:', err);
      toast.error(err.message || 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file selection
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

  // Handle Excel import
  const handleImport = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }

    setIsProcessing(true);
    setResults([]);

    // Capture the source URL (same logic as manual form)
    let sourceUrl = window.location.href;
    try {
      if (window.parent !== window && window.parent.location.href) {
        sourceUrl = window.parent.location.href;
      }
    } catch (e) {
      if (document.referrer) {
        sourceUrl = document.referrer;
      }
    }

    console.log('📦 Excel Import - Source URL:', sourceUrl);

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('sourceUrl', sourceUrl);

    try {
      const response = await fetch('/api/import-excel', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'import');
      }

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

            if (data.type === 'row') {
              // Remplir le formulaire avec les données de la ligne Excel
              setFormData({
                nom: data.data.nom,
                prenom: data.data.prenom,
                adresse: data.data.adresse,
                codePostal: data.data.codePostal,
                ville: data.data.ville,
                telephonePortable: data.data.telephonePortable,
                telephoneDomicile: data.data.telephoneDomicile || '',
                email: data.data.email,
                accepteCGU: true, // Cocher automatiquement
                accepteMarketing: data.data.accepteMarketing,
                website: '',
              });

              // Petite pause pour voir le formulaire rempli
              await new Promise(resolve => setTimeout(resolve, 300));
            } else if (data.type === 'result') {
              setResults((prev) => [...prev, data.result]);

              setStats((prev) => ({
                total: prev.total + 1,
                success: prev.success + (data.result.status === 'success' ? 1 : 0),
                failed: prev.failed + (data.result.status === 'error' ? 1 : 0),
                marketing: prev.marketing + (data.result.addedToMarketing ? 1 : 0),
              }));
            } else if (data.type === 'complete') {
              toast.success(`Import terminé ! ${data.stats.success} succès, ${data.stats.failed} échecs`);

              // Reset formulaire après import
              setFormData({
                nom: '',
                prenom: '',
                adresse: '',
                codePostal: '',
                ville: '',
                telephonePortable: '',
                telephoneDomicile: '',
                email: '',
                accepteCGU: false,
                accepteMarketing: false,
                website: '',
              });
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

  // Download report
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
    <section className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-[#352c5b] to-[#4a3f7a]">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Formulaire de Contact
          </h1>
          <p className="text-white/80 text-lg">
            Ajoutez un contact manuellement ou importez depuis Excel
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* LEFT: Upload Excel + Form */}
          <div className="space-y-6">
            {/* Upload Excel Card */}
            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#352c5b]/10 rounded-full flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6 text-[#352c5b]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#352c5b]">Import Excel</h2>
                  <p className="text-xs text-gray-600">Formats : .xlsx, .xls, .csv</p>
                </div>
              </div>

              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#352c5b] hover:bg-gray-50 transition-all mb-3"
              >
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <p className="text-sm text-gray-600">
                    {file ? (
                      <span className="font-semibold text-[#352c5b]">{file.name}</span>
                    ) : (
                      <span className="font-semibold">Sélectionner un fichier</span>
                    )}
                  </p>
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
                className="w-full bg-[#352c5b] hover:bg-[#352c5b]/90 text-white"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Import en cours...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Importer Excel
                  </>
                )}
              </Button>
            </Card>

            {/* Form Card */}
            <Card className="p-6 bg-white shadow-lg">
              <h2 className="text-lg font-semibold text-[#352c5b] mb-4">
                Formulaire de Contact
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                {/* Nom + Prénom */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="nom" className="text-sm">Nom *</Label>
                    <Input
                      id="nom"
                      type="text"
                      required
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="prenom" className="text-sm">Prénom *</Label>
                    <Input
                      id="prenom"
                      type="text"
                      required
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      className="h-9"
                    />
                  </div>
                </div>

                {/* Adresse */}
                <div className="space-y-1">
                  <Label htmlFor="adresse" className="text-sm">Adresse *</Label>
                  <Input
                    id="adresse"
                    type="text"
                    required
                    value={formData.adresse}
                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                    className="h-9"
                  />
                </div>

                {/* Code Postal + Ville */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="codePostal" className="text-sm">Code postal *</Label>
                    <Input
                      id="codePostal"
                      type="text"
                      required
                      pattern="[0-9]{5}"
                      maxLength={5}
                      value={formData.codePostal}
                      onChange={(e) => setFormData({ ...formData, codePostal: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ville" className="text-sm">Ville *</Label>
                    <Input
                      id="ville"
                      type="text"
                      required
                      value={formData.ville}
                      onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                      className="h-9"
                    />
                  </div>
                </div>

                {/* Téléphones */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="telephonePortable" className="text-sm">Tél portable *</Label>
                    <Input
                      id="telephonePortable"
                      type="tel"
                      required
                      value={formData.telephonePortable}
                      onChange={(e) => setFormData({ ...formData, telephonePortable: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="telephoneDomicile" className="text-sm">Tél domicile</Label>
                    <Input
                      id="telephoneDomicile"
                      type="tel"
                      value={formData.telephoneDomicile}
                      onChange={(e) => setFormData({ ...formData, telephoneDomicile: e.target.value })}
                      className="h-9"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-sm">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-9"
                  />
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded">
                    <Checkbox
                      id="accepteCGU"
                      checked={formData.accepteCGU}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, accepteCGU: checked as boolean })
                      }
                      className="mt-0.5"
                      required
                    />
                    <label htmlFor="accepteCGU" className="text-xs text-gray-700 cursor-pointer">
                      🔒 J'accepte les CGU et la Politique de Confidentialité *
                    </label>
                  </div>

                  <div className="flex items-start space-x-2 p-3 bg-blue-50 border border-blue-200 rounded">
                    <Checkbox
                      id="accepteMarketing"
                      checked={formData.accepteMarketing}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, accepteMarketing: checked as boolean })
                      }
                      className="mt-0.5"
                    />
                    <label htmlFor="accepteMarketing" className="text-xs text-gray-700 cursor-pointer">
                      📩 J'accepte de recevoir les offres de Oeko (optionnel)
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#352c5b] hover:bg-[#352c5b]/90 text-white"
                >
                  {isSubmitting ? 'Envoi...' : 'Envoyer'}
                </Button>
              </form>
            </Card>

            {/* Stats */}
            {(stats.total > 0 || isProcessing) && (
              <Card className="p-4 bg-white shadow-lg">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#352c5b]">{stats.total}</div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{stats.success}</div>
                    <div className="text-xs text-gray-600">Succès</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                    <div className="text-xs text-gray-600">Échecs</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{stats.marketing}</div>
                    <div className="text-xs text-gray-600">Marketing</div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* RIGHT: Results Table */}
          <div>
            {results.length > 0 && (
              <Card className="p-6 bg-white shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-[#352c5b]">
                    Résultats ({results.length})
                  </h3>
                  <Button
                    onClick={downloadReport}
                    variant="outline"
                    size="sm"
                    className="border-[#352c5b] text-[#352c5b] hover:bg-[#352c5b] hover:text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Rapport
                  </Button>
                </div>

                <div className="overflow-auto max-h-[600px]">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2 font-semibold text-gray-700">Ligne</th>
                        <th className="text-left py-2 px-2 font-semibold text-gray-700">Nom</th>
                        <th className="text-left py-2 px-2 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-2 px-2 font-semibold text-gray-700">Statut</th>
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
                          <td className="py-2 px-2 text-gray-700">{result.row}</td>
                          <td className="py-2 px-2 text-gray-700">{result.nom} {result.prenom}</td>
                          <td className="py-2 px-2 text-gray-700 font-mono">{result.email}</td>
                          <td className="py-2 px-2">
                            {result.status === 'success' ? (
                              <div className="flex items-center text-green-600">
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                <span className="font-semibold">OK</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-red-600">
                                <XCircle className="w-4 h-4 mr-1" />
                                <span className="text-xs">{result.message}</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {results.length === 0 && !isProcessing && (
              <Card className="p-8 bg-blue-50 border-blue-200 text-center">
                <FileSpreadsheet className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Importer des contacts
                </h3>
                <p className="text-sm text-blue-800">
                  Sélectionnez un fichier Excel et cliquez sur "Importer"
                  <br />
                  <span className="text-xs">Le formulaire se remplira automatiquement pour chaque ligne</span>
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
