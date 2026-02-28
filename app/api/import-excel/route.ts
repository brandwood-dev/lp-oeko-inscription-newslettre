import { NextRequest } from 'next/server';
import * as XLSX from 'xlsx';
import { BrevoContactService } from '@/lib/services/brevo-contact.service';

// Fonction pour valider un email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Fonction pour normaliser un téléphone
function normalizePhone(phone: any): string {
  if (!phone) return '';
  return String(phone).replace(/\s/g, '');
}

// Fonction pour convertir en booléen
function toBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const v = value.toLowerCase().trim();
    return v === 'oui' || v === 'yes' || v === 'true' || v === '1';
  }
  if (typeof value === 'number') return value === 1;
  return false;
}

// Fonction pour transformer une ligne Excel
function transformRowToFormData(row: any) {
  // Helper function to find value from multiple possible column names
  const findValue = (columnNames: string[]): string => {
    for (const colName of columnNames) {
      if (row[colName] !== undefined && row[colName] !== null && row[colName] !== '') {
        return String(row[colName]).trim();
      }
    }
    return '';
  };

  const portable = normalizePhone(findValue(['Telephone Portable Prospect', 'Téléphone Portable Prospect', 'Téléphone Portable', 'Téléphone portable', 'TelPortable', 'tel_portable', 'Portable', 'portable', 'Téléphone_Portable_Prospect', 'téléphone_portable_prospect']));
  const domicile = normalizePhone(findValue(['Telephone Domicile Prospect', 'Téléphone Domicile Prospect', 'Téléphone Domicile', 'Téléphone domicile', 'TelDomicile', 'tel_domicile', 'Fixe', 'fixe', 'Téléphone_Domicile_Prospect', 'téléphone_domicile_prospect']));

  return {
    nom: findValue(['Nom Prospect', 'Nom', 'nom', 'NOM', 'Nom_Prospect', 'nom_prospect']),
    prenom: findValue(['Prénom Prospect', 'Prenom Prospect', 'Prénom', 'Prenom', 'prenom', 'PRENOM', 'Prénom_Prospect', 'Prenom_Prospect', 'prénom_prospect']),
    adresse: findValue(['Adresse 1 Prospect', 'Adresse 1', 'Adresse', 'adresse', 'ADRESSE', 'Adresse_1_Prospect', 'adresse_1_prospect']),
    codePostal: findValue(['Code Postal Prospect', 'Code Postal', 'Code postal', 'CodePostal', 'code_postal', 'CP', 'Code_Postal_Prospect', 'code_postal_prospect']),
    ville: findValue(['Ville Prospect', 'Ville', 'ville', 'VILLE', 'Ville_Prospect', 'ville_prospect']),
    telephonePortable: portable || domicile, // Use domicile if portable is empty
    telephoneDomicile: domicile,
    email: findValue(['Adresse Mail Prospect', 'Adresse Mail', 'Email', 'email', 'EMAIL', 'Adresse_Mail_Prospect', 'adresse_mail_prospect']).toLowerCase(),
    accepteCGU: toBoolean(row.CGU || row.cgu || row.AccepteCGU || row.accepte_cgu || true),
    accepteMarketing: toBoolean(row.Marketing || row.marketing || row.AccepteMarketing || row.accepte_marketing || true), // TRUE par défaut pour l'import Excel
    website: '',
  };
}

// Fonction pour valider un contact
function validateContact(formData: any): string[] {
  const errors: string[] = [];

  // OBLIGATOIRES: Nom, Prénom, Email (au moins 1 caractère, pas de validation de longueur)
  if (!formData.nom || formData.nom.trim().length === 0) {
    errors.push('Nom obligatoire');
  }

  if (!formData.prenom || formData.prenom.trim().length === 0) {
    errors.push('Prénom obligatoire');
  }

  if (!formData.email || !isValidEmail(formData.email)) {
    errors.push('Email obligatoire et valide');
  }

  // Tous les autres champs sont OPTIONNELS

  return errors;
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  // Créer un stream pour envoyer les résultats en temps réel
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Lire le fichier uploadé
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: 'Aucun fichier fourni' })}\n\n`));
          controller.close();
          return;
        }

        // Get source URL from FormData or fallback to headers
        const sourceUrl = (formData.get('sourceUrl') as string) ||
                         request.headers.get('origin') ||
                         request.headers.get('referer') ||
                         'http://localhost:3000';

        console.log('📦 Import Excel - Source URL received:', sourceUrl);

        // Lire le contenu du fichier
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Parser le fichier Excel
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet);

        console.log(`📊 ${rows.length} lignes trouvées dans le fichier`);

        // Debug: afficher les colonnes de la première ligne
        if (rows.length > 0) {
          console.log('🔍 Colonnes détectées:', Object.keys(rows[0]));
          console.log('🔍 Première ligne de données:', rows[0]);
        }

        // Initialiser le service Brevo
        const brevoService = new BrevoContactService();

        // Statistiques
        const stats = {
          total: rows.length,
          processed: 0,
          success: 0,
          failed: 0,
          marketing: 0,
        };

        // Traiter chaque ligne
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const rowIndex = i + 2; // +2 car Excel commence à 1 et on a une ligne d'en-tête

          // Transformer les données
          const formData = transformRowToFormData(row);

          // Envoyer les données de la ligne au frontend AVANT traitement
          const rowData = {
            type: 'row',
            data: formData,
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(rowData)}\n\n`));

          // Petite pause pour voir le formulaire se remplir
          await new Promise((resolve) => setTimeout(resolve, 300));

          // Valider les données
          const validationErrors = validateContact(formData);

          if (validationErrors.length > 0) {
            const result = {
              type: 'result',
              result: {
                row: rowIndex,
                email: formData.email || 'N/A',
                nom: formData.nom || 'N/A',
                prenom: formData.prenom || 'N/A',
                status: 'error' as const,
                message: validationErrors.join(', '),
                addedToMarketing: false,
              },
            };

            controller.enqueue(encoder.encode(`data: ${JSON.stringify(result)}\n\n`));
            stats.failed++;
            stats.processed++;
            continue;
          }

          // Envoyer à Brevo avec l'URL source
          try {
            await brevoService.addOrUpdateContact(formData, sourceUrl);

            const result = {
              type: 'result',
              result: {
                row: rowIndex,
                email: formData.email,
                nom: formData.nom,
                prenom: formData.prenom,
                status: 'success' as const,
                message: 'Contact ajouté avec succès',
                addedToMarketing: formData.accepteMarketing,
              },
            };

            controller.enqueue(encoder.encode(`data: ${JSON.stringify(result)}\n\n`));
            stats.success++;
            if (formData.accepteMarketing) {
              stats.marketing++;
            }
          } catch (error: any) {
            const result = {
              type: 'result',
              result: {
                row: rowIndex,
                email: formData.email,
                nom: formData.nom,
                prenom: formData.prenom,
                status: 'error' as const,
                message: error.message || 'Erreur Brevo',
                addedToMarketing: false,
              },
            };

            controller.enqueue(encoder.encode(`data: ${JSON.stringify(result)}\n\n`));
            stats.failed++;
          }

          stats.processed++;

          // Petite pause pour ne pas surcharger l'API Brevo
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        // Envoyer les statistiques finales
        const complete = {
          type: 'complete',
          stats: stats,
        };

        controller.enqueue(encoder.encode(`data: ${JSON.stringify(complete)}\n\n`));

        console.log('✅ Import terminé:', stats);
        controller.close();

      } catch (error: any) {
        console.error('❌ Erreur lors de l\'import:', error);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
