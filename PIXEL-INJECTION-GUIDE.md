# 📊 Guide d'injection des pixels Google

## ℹ️ Contexte

Les pixels Google Ads et Analytics **ne sont pas intégrés dans le code Next.js**.  
Ils doivent être injectés directement dans le HTML **après le build**.

**Raison :** Vous conservez le contrôle total sur les pixels sans avoir à rebuild l'application.

---

## ✅ Ce qui EST déjà implémenté

- ✅ **Google Consent Mode v2** : Initialisé automatiquement
- ✅ **Gestion des cookies RGPD** : Bandeau fonctionnel
- ✅ **Context de consentement** : Mise à jour automatique de `gtag('consent', 'update', ...)`
- ✅ **dataLayer** : Initialisé pour recevoir les événements

**Les pixels que vous injecterez utiliseront automatiquement le Consent Mode.**

---

## 📍 Où injecter les pixels

### Fichier à modifier après build

```
.next/server/app/layout.html
```

Ou si vous utilisez un autre outil de build (ex: export statique) :
```
out/_next/static/chunks/[hash].js
```

### Position recommandée

Injectez vos pixels **dans le `<head>`** avant la fermeture `</head>` :

```html
<head>
  <!-- Contenu existant de Next.js -->
  
  <!-- 📊 VOS PIXELS GOOGLE À INJECTER ICI -->
  
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
  
  <!-- Google Analytics 4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>
  
  <!-- Google Ads -->
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('config', 'AW-XXXXXXXXXX');
  </script>
  
  <!-- FIN DES PIXELS -->
</head>
```

---

## 🔄 Workflow recommandé

### Étape 1 : Build Next.js
```bash
npm run build
```

### Étape 2 : Script d'injection automatique (optionnel)

Créez un script pour automatiser l'injection :

```bash
#!/bin/bash
# inject-pixels.sh

LAYOUT_FILE=".next/server/app/layout.html"

# Vos pixels Google
PIXELS='<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":
new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src=
"https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,"script","dataLayer","GTM-XXXXXXX");</script>'

# Injecter avant </head>
sed -i "s|</head>|${PIXELS}\n</head>|" "$LAYOUT_FILE"

echo "✅ Pixels injectés avec succès !"
```

Rendez-le exécutable :
```bash
chmod +x inject-pixels.sh
```

Utilisez-le après chaque build :
```bash
npm run build && ./inject-pixels.sh
```

### Étape 3 : Déploiement
```bash
vercel --prod
# Ou
netlify deploy --prod
```

---

## 🧪 Vérification post-injection

### 1. Vérifiez le Consent Mode

Ouvrez DevTools → Console :

```
✅ Google Consent Mode v2 initialized (default: denied)
ℹ️  Google pixels will be injected post-build
```

### 2. Testez avec Google Tag Assistant

1. Installez : https://tagassistant.google.com/
2. Ouvrez votre site
3. Vérifiez :
   - ✅ Consent Mode v2 détecté
   - ✅ Tags Google chargés
   - ✅ Aucun tag actif avant consentement

### 3. Vérifiez la console réseau

DevTools → Network → Filtrez "google" :

- **Avant consentement** : Aucun appel à Google Analytics/Ads
- **Après consentement** : Appels visibles

---

## 📝 Template de pixels recommandé

Voici un template complet que vous pouvez personnaliser :

```html
<!-- 🔒 Début injection pixels Google - Compatible Consent Mode v2 -->

<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>

<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    page_path: window.location.pathname,
    anonymize_ip: true
  });
</script>

<!-- Google Ads -->
<script>
  gtag('config', 'AW-XXXXXXXXXX');
</script>

<!-- Google Ads Conversion Tracking (Form Submit) -->
<script>
  // Écouter l'événement de soumission du formulaire
  window.addEventListener('load', function() {
    const form = document.querySelector('form');
    if (form) {
      form.addEventListener('submit', function() {
        gtag('event', 'conversion', {
          'send_to': 'AW-XXXXXXXXXX/CONVERSION_LABEL',
          'value': 1.0,
          'currency': 'EUR'
        });
      });
    }
  });
</script>

<!-- Google Tag Manager (noscript) -->
<noscript>
  <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
  height="0" width="0" style="display:none;visibility:hidden"></iframe>
</noscript>

<!-- 🔒 Fin injection pixels Google -->
```

**Remplacez :**
- `GTM-XXXXXXX` : Votre ID Google Tag Manager
- `G-XXXXXXXXXX` : Votre ID Google Analytics 4
- `AW-XXXXXXXXXX` : Votre ID Google Ads
- `CONVERSION_LABEL` : Votre label de conversion Google Ads

---

## ⚙️ Alternative : Injection via CDN/Proxy

Si vous ne voulez pas modifier les fichiers après build, vous pouvez :

### Option 1 : Cloudflare Workers
Injectez les pixels via un Worker Cloudflare qui modifie le HTML à la volée.

### Option 2 : Vercel Edge Middleware
Utilisez un middleware Edge pour injecter le HTML.

Exemple :
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Injecter les pixels dans le HTML
  const html = response.body;
  // ... logique d'injection
  
  return response;
}
```

---

## 🎯 Avantages de cette méthode

✅ **Flexibilité** : Changez les pixels sans rebuild  
✅ **Performance** : Pixels chargés uniquement après consentement  
✅ **Conformité RGPD** : Consent Mode v2 déjà en place  
✅ **Séparation des responsabilités** : Code Next.js vs tracking marketing  

---

## 📞 Support

Si vous avez besoin d'aide pour l'injection :
- Email technique : contact@oeko.fr
- Email marketing : brandwoodadvertising@gmail.com

---

**Guide créé le 30 janvier 2026**
