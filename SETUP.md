# 🚀 Configuration LP OEKO RAVALEMENT DE FAÇADE 2026

Ce guide vous explique comment configurer toutes les intégrations du projet.

---

## 📋 Table des matières

1. [Configuration Brevo (Email & CRM)](#1-configuration-brevo)
2. [Configuration Google Sheets](#2-configuration-google-sheets)
3. [Configuration Google Ads & Analytics](#3-configuration-google-ads--analytics)
4. [Test des intégrations](#4-test-des-intégrations)
5. [Déploiement](#5-déploiement)

---

## 1. Configuration Brevo

### Étape 1.1 : Obtenir la clé API Brevo

1. Connectez-vous à votre compte Brevo : https://app.brevo.com
   - Email : `reseaux@oeko.fr`
   - Mot de passe : `Contact@91@`

2. Allez dans **Settings** → **API Keys**
   - URL directe : https://app.brevo.com/settings/keys/api

3. Cliquez sur **Generate a new API key**
   - Nom : `LP Ravalement Façade 2026`
   - Copiez la clé générée

4. Dans votre fichier `.env.local`, ajoutez :
   ```bash
   BREVO_API_KEY=votre_clé_api_ici
   ```

### Étape 1.2 : Configurer SMTP Brevo

1. Allez dans **Settings** → **SMTP & API**
   - URL : https://app.brevo.com/settings/keys/smtp

2. Notez vos identifiants SMTP :
   - Host : `smtp-relay.brevo.com`
   - Port : `587`
   - Login : (affiché dans l'interface)
   - Password : (utilisez le mot de passe SMTP)

3. Dans `.env.local` :
   ```bash
   BREVO_SMTP_HOST=smtp-relay.brevo.com
   BREVO_SMTP_PORT=587
   BREVO_SMTP_USER=votre_login_smtp
   BREVO_SMTP_PASSWORD=votre_password_smtp
   EMAIL_TO=contact@oeko.fr
   ```

### Étape 1.3 : Créer la liste de contacts

1. Allez dans **Contacts** → **Lists**
2. Cliquez sur **Create a new list**
3. Nom : `LP RAVALEMENT DE FAÇADE 2026`
4. Une fois créée, cliquez sur la liste
5. Dans l'URL, notez l'ID de la liste (ex: `/contacts/list/id/123`)
6. Dans `.env.local` :
   ```bash
   BREVO_LIST_ID=123
   ```

### Étape 1.4 : Créer les attributs personnalisés (optionnel mais recommandé)

1. Allez dans **Contacts** → **Settings** → **Contact attributes**
2. Créez les attributs suivants :
   - `VILLE` (Type : Text)
   - `TYPE_BIEN` (Type : Text)
   - `MESSAGE` (Type : Text)
   - `SOURCE` (Type : Text)

---

## 2. Configuration Google Sheets

### Étape 2.1 : Créer le Google Sheet

1. Créez un nouveau Google Sheet
2. Nommez-le : **LP RAVALEMENT DE FAÇADE 2026**
3. Partagez-le avec :
   - `contact@oeko.fr` (Éditeur)
   - `brandwoodadvertising@gmail.com` (Éditeur)
4. Dans l'URL du Sheet, copiez l'ID :
   ```
   https://docs.google.com/spreadsheets/d/VOTRE_SHEET_ID/edit
   ```
5. Dans `.env.local` :
   ```bash
   GOOGLE_SHEET_ID=VOTRE_SHEET_ID
   GOOGLE_SHEET_NAME="LP RAVALEMENT DE FAÇADE 2026"
   ```

### Étape 2.2 : Créer un Service Account Google

1. Allez sur Google Cloud Console : https://console.cloud.google.com/

2. **Créez un nouveau projet** (ou sélectionnez un existant)
   - Nom : `LP OEKO Ravalement`

3. **Activez l'API Google Sheets** :
   - Dans le menu, allez dans **APIs & Services** → **Library**
   - Cherchez "Google Sheets API"
   - Cliquez sur **Enable**

4. **Créez un Service Account** :
   - Allez dans **APIs & Services** → **Credentials**
   - Cliquez sur **Create Credentials** → **Service Account**
   - Nom : `oeko-lp-sheets-service`
   - Rôle : **Editor**
   - Cliquez sur **Done**

5. **Téléchargez le fichier JSON** :
   - Cliquez sur le service account créé
   - Allez dans l'onglet **Keys**
   - Cliquez sur **Add Key** → **Create new key**
   - Choisissez **JSON**
   - Le fichier se télécharge automatiquement

6. **Partagez le Google Sheet avec le Service Account** :
   - Ouvrez le fichier JSON téléchargé
   - Copiez l'email du service account (champ `client_email`)
   - Retournez sur votre Google Sheet
   - Cliquez sur **Partager**
   - Collez l'email du service account
   - Donnez les droits **Éditeur**

7. **Configurez la variable d'environnement** :
   - Ouvrez le fichier JSON
   - Copiez TOUT le contenu (une seule ligne)
   - Dans `.env.local` :
   ```bash
   GOOGLE_SERVICE_ACCOUNT_CREDENTIALS='{"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}'
   ```

   ⚠️ **IMPORTANT** :
   - Le JSON doit être sur UNE SEULE LIGNE
   - Entourez-le de guillemets simples `'...'`
   - Ne committez JAMAIS ce fichier dans git

---

## 3. Configuration Google Ads & Analytics

### Étape 3.1 : Google Tag Manager (GTM)

1. Créez un compte GTM : https://tagmanager.google.com/
2. Créez un conteneur pour votre site
3. Notez votre ID GTM (format : `GTM-XXXXXXX`)
4. Dans `.env.local` :
   ```bash
   NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
   ```

### Étape 3.2 : Google Analytics 4

1. Créez une propriété GA4 : https://analytics.google.com/
2. Notez votre Measurement ID (format : `G-XXXXXXXXXX`)
3. Dans `.env.local` :
   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

### Étape 3.3 : Google Ads

1. Créez un compte Google Ads : https://ads.google.com/
2. Configurez le suivi des conversions
3. Notez votre Conversion ID (format : `AW-XXXXXXXXXX`)
4. Dans `.env.local` :
   ```bash
   NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX
   ```

5. **Mettez à jour le code de conversion dans ContactForm.tsx** :
   - Ouvrez `components/ContactForm.tsx`
   - Ligne 72-76, remplacez `AW-CONVERSION_ID/CONVERSION_LABEL` par vos vraies valeurs

---

## 4. Test des intégrations

### Étape 4.1 : Vérifier le fichier .env.local

Assurez-vous que votre `.env.local` contient toutes les variables :

```bash
# Brevo
BREVO_API_KEY=xkeysib-...
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=...
BREVO_SMTP_PASSWORD=...
EMAIL_TO=contact@oeko.fr
BREVO_LIST_ID=123

# Google Sheets
GOOGLE_SHEET_ID=...
GOOGLE_SHEET_NAME="LP RAVALEMENT DE FAÇADE 2026"
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS='{"type":"service_account",...}'

# Google Tracking
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX
```

### Étape 4.2 : Lancer le serveur de développement

```bash
npm run dev
```

### Étape 4.3 : Tester le health check de l'API

Ouvrez votre navigateur et allez sur :
```
http://localhost:3000/api/submit-form
```

Vous devriez voir :
```json
{
  "status": "ok",
  "services": {
    "email": "connected",
    "googleSheets": "connected",
    "brevo": "connected"
  },
  "timestamp": "2026-01-30T..."
}
```

Si un service affiche "disconnected", vérifiez sa configuration.

### Étape 4.4 : Tester le formulaire complet

1. Allez sur http://localhost:3000
2. Scrollez jusqu'au formulaire
3. Remplissez toutes les informations
4. Soumettez le formulaire

**Vérifications après soumission :**

✅ **Email** : Vérifiez que vous avez reçu un email à `contact@oeko.fr`

✅ **Google Sheets** :
   - Ouvrez votre Google Sheet
   - Une nouvelle ligne doit être ajoutée avec toutes les données

✅ **Brevo** :
   - Allez sur https://app.brevo.com/contact/list
   - Ouvrez la liste "LP RAVALEMENT DE FAÇADE 2026"
   - Le contact doit apparaître

### Étape 4.5 : Tester les cookies & Consent Mode

1. Ouvrez les DevTools (F12)
2. Allez dans l'onglet **Console**
3. Rechargez la page
4. Vérifiez que vous voyez :
   ```
   Google Consent Mode v2 initialized with default: denied
   ```
5. Cliquez sur "Accepter tous les cookies"
6. Vérifiez que vous voyez :
   ```
   Google Consent Mode updated: { analytics_storage: 'granted', ad_storage: 'granted', ... }
   ```

7. **Test avec Google Tag Assistant** :
   - Installez l'extension : https://tagassistant.google.com/
   - Rechargez votre page
   - Vérifiez que le Consent Mode v2 est détecté

---

## 5. Déploiement

### Étape 5.1 : Configuration des variables d'environnement en production

**Pour Vercel :**

1. Allez dans votre projet Vercel
2. Settings → Environment Variables
3. Ajoutez TOUTES les variables de votre `.env.local`
4. ⚠️ **Assurez-vous d'ajouter les variables `NEXT_PUBLIC_*` aussi**

**Pour Netlify :**

1. Site settings → Environment variables
2. Ajoutez toutes les variables

### Étape 5.2 : Build et déploiement

```bash
npm run build
```

Si le build réussit, déployez :

```bash
# Vercel
vercel --prod

# Ou Netlify
netlify deploy --prod
```

### Étape 5.3 : Test en production

1. Testez le formulaire sur votre site en production
2. Vérifiez le health check : `https://votre-domaine.com/api/submit-form`
3. Vérifiez les 3 intégrations comme en développement

---

## 🔒 Sécurité

**⚠️ IMPORTANT - Ne JAMAIS committer :**

- Le fichier `.env.local`
- Le fichier JSON du Service Account Google
- Les clés API en clair

Le fichier `.gitignore` contient déjà :
```
.env.local
.env*.local
*.json
```

---

## 🆘 Dépannage

### Erreur : "Email sending failed"
- Vérifiez vos identifiants SMTP Brevo
- Testez la connexion : `npm run dev` puis visitez `/api/submit-form`

### Erreur : "Google Sheets update failed"
- Vérifiez que le Service Account a accès au Sheet
- Vérifiez que l'API Google Sheets est activée
- Vérifiez le format du JSON dans `GOOGLE_SERVICE_ACCOUNT_CREDENTIALS`

### Erreur : "Brevo contact creation failed"
- Vérifiez votre clé API Brevo
- Vérifiez que l'ID de liste existe
- Vérifiez que les attributs personnalisés sont créés

### Les cookies ne fonctionnent pas
- Vérifiez que les IDs Google sont bien préfixés par `NEXT_PUBLIC_`
- Ouvrez la console pour voir les logs de Consent Mode
- Testez avec Google Tag Assistant

---

## 📞 Support

Pour toute question :
- Email technique : contact@oeko.fr
- Email marketing : brandwoodadvertising@gmail.com

---

**Dernière mise à jour : 30 janvier 2026**
