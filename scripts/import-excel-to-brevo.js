/**
 * Script d'import Excel vers Brevo
 *
 * Ce script lit un fichier Excel et envoie chaque ligne vers l'API /api/submit-contact
 * qui ajoute les contacts dans Brevo avec gestion des listes marketing
 *
 * Usage:
 *   node scripts/import-excel-to-brevo.js <fichier.xlsx>
 *
 * Exemple:
 *   node scripts/import-excel-to-brevo.js contacts.xlsx
 */

const XLSX = require('xlsx');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:3000';
const DELAY_BETWEEN_REQUESTS = 500; // ms (pour éviter de surcharger l'API)

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Sleep function
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Valider un email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valider un code postal français
 */
function isValidCodePostal(codePostal) {
  return /^[0-9]{5}$/.test(String(codePostal));
}

/**
 * Normaliser un numéro de téléphone
 */
function normalizePhone(phone) {
  if (!phone) return '';
  return String(phone).replace(/\s/g, '');
}

/**
 * Convertir une valeur Excel en booléen
 */
function toBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const v = value.toLowerCase().trim();
    return v === 'oui' || v === 'yes' || v === 'true' || v === '1';
  }
  if (typeof value === 'number') return value === 1;
  return false;
}

/**
 * Lire et parser le fichier Excel
 */
function readExcelFile(filePath) {
  console.log(`${colors.cyan}📖 Lecture du fichier: ${filePath}${colors.reset}\n`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Fichier non trouvé: ${filePath}`);
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);

  console.log(`${colors.green}✅ ${data.length} lignes trouvées${colors.reset}\n`);

  return data;
}

/**
 * Transformer une ligne Excel en objet formulaire
 */
function transformRowToFormData(row, index) {
  // Adapter les noms de colonnes selon votre fichier Excel
  // Vous pouvez modifier ces clés selon les noms exacts dans votre Excel
  const formData = {
    nom: String(row.Nom || row.nom || row.NOM || '').trim(),
    prenom: String(row.Prénom || row.Prenom || row.prenom || row.PRENOM || '').trim(),
    adresse: String(row.Adresse || row.adresse || row.ADRESSE || '').trim(),
    codePostal: String(row['Code Postal'] || row['Code postal'] || row.CodePostal || row.code_postal || row.CP || '').trim(),
    ville: String(row.Ville || row.ville || row.VILLE || '').trim(),
    telephonePortable: normalizePhone(row['Téléphone Portable'] || row['Téléphone portable'] || row.TelPortable || row.tel_portable || row.Portable || row.portable || ''),
    telephoneDomicile: normalizePhone(row['Téléphone Domicile'] || row['Téléphone domicile'] || row.TelDomicile || row.tel_domicile || row.Fixe || row.fixe || ''),
    email: String(row.Email || row.email || row.EMAIL || '').trim().toLowerCase(),
    accepteCGU: toBoolean(row.CGU || row.cgu || row.AccepteCGU || row.accepte_cgu || true),
    accepteMarketing: toBoolean(row.Marketing || row.marketing || row.AccepteMarketing || row.accepte_marketing || false),
    website: '', // Honeypot (toujours vide)
  };

  return formData;
}

/**
 * Valider les données d'un contact
 */
function validateContact(formData, rowIndex) {
  const errors = [];

  if (!formData.nom || formData.nom.length < 2) {
    errors.push('Nom invalide ou manquant');
  }

  if (!formData.prenom || formData.prenom.length < 2) {
    errors.push('Prénom invalide ou manquant');
  }

  if (!formData.adresse || formData.adresse.length < 5) {
    errors.push('Adresse invalide ou manquante');
  }

  if (!formData.codePostal || !isValidCodePostal(formData.codePostal)) {
    errors.push(`Code postal invalide: "${formData.codePostal}"`);
  }

  if (!formData.ville || formData.ville.length < 2) {
    errors.push('Ville invalide ou manquante');
  }

  if (!formData.telephonePortable || formData.telephonePortable.length < 10) {
    errors.push('Téléphone portable invalide ou manquant');
  }

  if (!formData.email || !isValidEmail(formData.email)) {
    errors.push(`Email invalide: "${formData.email}"`);
  }

  return errors;
}

/**
 * Envoyer un contact vers l'API
 */
async function sendContactToAPI(formData) {
  try {
    const response = await axios.post(`${API_URL}/api/submit-contact`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 secondes
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('\n' + '='.repeat(60));
  console.log(`${colors.blue}🚀 Import Excel vers Brevo${colors.reset}`);
  console.log('='.repeat(60) + '\n');

  // Vérifier les arguments
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error(`${colors.red}❌ Erreur: Veuillez spécifier un fichier Excel${colors.reset}`);
    console.log(`\nUsage: node scripts/import-excel-to-brevo.js <fichier.xlsx>\n`);
    process.exit(1);
  }

  const filePath = path.resolve(args[0]);

  try {
    // Lire le fichier Excel
    const rows = readExcelFile(filePath);

    // Statistiques
    const stats = {
      total: rows.length,
      processed: 0,
      success: 0,
      failed: 0,
      errors: [],
    };

    // Horodatage de début
    const startTime = Date.now();

    console.log(`${colors.cyan}📊 Début du traitement...${colors.reset}\n`);

    // Traiter chaque ligne
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowIndex = i + 2; // +2 car Excel commence à 1 et on a une ligne d'en-tête

      console.log(`${colors.cyan}[${i + 1}/${rows.length}]${colors.reset} Traitement ligne ${rowIndex}...`);

      // Transformer les données
      const formData = transformRowToFormData(row, rowIndex);

      // Valider les données
      const validationErrors = validateContact(formData, rowIndex);

      if (validationErrors.length > 0) {
        console.log(`${colors.red}  ❌ Erreurs de validation:${colors.reset}`);
        validationErrors.forEach(err => console.log(`     - ${err}`));

        stats.failed++;
        stats.errors.push({
          row: rowIndex,
          email: formData.email,
          errors: validationErrors,
        });

        console.log('');
        continue;
      }

      // Envoyer à l'API
      const result = await sendContactToAPI(formData);

      if (result.success) {
        console.log(`${colors.green}  ✅ Contact ajouté: ${formData.email}${colors.reset}`);
        if (formData.accepteMarketing) {
          console.log(`${colors.blue}     📩 Ajouté à la liste marketing${colors.reset}`);
        }
        stats.success++;
      } else {
        console.log(`${colors.red}  ❌ Erreur API: ${result.error}${colors.reset}`);
        stats.failed++;
        stats.errors.push({
          row: rowIndex,
          email: formData.email,
          errors: [result.error],
        });
      }

      stats.processed++;

      console.log('');

      // Pause entre les requêtes
      if (i < rows.length - 1) {
        await sleep(DELAY_BETWEEN_REQUESTS);
      }
    }

    // Durée totale
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    // Rapport final
    console.log('\n' + '='.repeat(60));
    console.log(`${colors.blue}📊 RAPPORT FINAL${colors.reset}`);
    console.log('='.repeat(60));
    console.log(`📅 Date: ${new Date().toLocaleString('fr-FR')}`);
    console.log(`📁 Fichier: ${path.basename(filePath)}`);
    console.log(`⏱️  Durée: ${duration}s`);
    console.log('='.repeat(60));
    console.log(`${colors.cyan}Total:${colors.reset}     ${stats.total}`);
    console.log(`${colors.cyan}Traités:${colors.reset}   ${stats.processed}`);
    console.log(`${colors.green}Succès:${colors.reset}    ${stats.success}`);
    console.log(`${colors.red}Échecs:${colors.reset}    ${stats.failed}`);
    console.log('='.repeat(60));

    // Détails des erreurs
    if (stats.errors.length > 0) {
      console.log(`\n${colors.yellow}⚠️  Détails des erreurs:${colors.reset}\n`);
      stats.errors.forEach(err => {
        console.log(`${colors.red}❌ Ligne ${err.row}${colors.reset} (${err.email || 'pas d\'email'})`);
        err.errors.forEach(e => console.log(`   - ${e}`));
        console.log('');
      });
    }

    // Sauvegarder le rapport
    const reportPath = path.join(__dirname, `import-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      file: filePath,
      duration: duration,
      stats: stats,
    }, null, 2));

    console.log(`${colors.green}✅ Rapport sauvegardé: ${reportPath}${colors.reset}\n`);

    // Message final
    if (stats.failed === 0) {
      console.log(`${colors.green}🎉 Import terminé avec succès !${colors.reset}\n`);
    } else {
      console.log(`${colors.yellow}⚠️  Import terminé avec ${stats.failed} erreur(s)${colors.reset}\n`);
    }

  } catch (error) {
    console.error(`\n${colors.red}❌ Erreur fatale:${colors.reset}`, error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Exécuter
main();
