export interface Tool {
  title: string;
  description: string;
  href: string;
  icon: string;
  badge?: string;
  category: string;
}

export const tools: Tool[] = [
  {
    title: "Calculateur salaire net / brut",
    description:
      "Convertissez votre salaire brut en net et inversement. Cadre, non-cadre, fonction publique. Estimation impôt incluse.",
    href: "/outils/calculateur-salaire",
    icon: "\u{1F4B0}",
    badge: "Populaire",
    category: "Emploi",
  },
  {
    title: "Simulateur prêt immobilier",
    description:
      "Calculez vos mensualités, le coût total du crédit et visualisez le tableau d'amortissement complet.",
    href: "/outils/calculateur-pret-immobilier",
    icon: "\u{1F3E0}",
    badge: "Populaire",
    category: "Immobilier",
  },
  {
    title: "Générateur de factures",
    description:
      "Créez des factures conformes en PDF gratuitement. TVA, multi-lignes, impression directe.",
    href: "/outils/generateur-facture",
    icon: "\u{1F4C4}",
    badge: "Pro",
    category: "Business",
  },
  {
    title: "Générateur de QR Code",
    description:
      "QR codes personnalisés : couleurs, taille. Pour vos liens, textes, emails ou Wi-Fi.",
    href: "/outils/generateur-qr-code",
    icon: "\u{1F4F1}",
    category: "Outils",
  },
  {
    title: "Générateur de mot de passe",
    description:
      "Mots de passe sécurisés et personnalisables. Indicateur de force. 100% local.",
    href: "/outils/generateur-mot-de-passe",
    icon: "\u{1F512}",
    category: "Securite",
  },
  {
    title: "Compteur de mots",
    description:
      "Mots, caractères, phrases, paragraphes. Temps de lecture et de parole estimés.",
    href: "/outils/compteur-mots",
    icon: "\u{1F4DD}",
    category: "Texte",
  },
  {
    title: "Convertisseur JSON / CSV",
    description:
      "Convertissez vos données entre JSON et CSV instantanément. Téléchargement inclus.",
    href: "/outils/convertisseur-json-csv",
    icon: "\u{1F504}",
    category: "Dev",
  },
  {
    title: "Calculateur de TVA",
    description:
      "HT vers TTC et inversement. Tous les taux français : 20%, 10%, 5,5%, 2,1%.",
    href: "/outils/calculateur-tva",
    icon: "\u{1F4B1}",
    badge: "Nouveau",
    category: "Business",
  },
  {
    title: "Calculateur de pourcentage",
    description:
      "X% de Y, variation en %, part d'un total. Trois modes de calcul.",
    href: "/outils/calculateur-pourcentage",
    icon: "\u{1F4CA}",
    category: "Conversion",
  },
  {
    title: "Calculateur IMC",
    description:
      "Indice de Masse Corporelle selon les normes OMS. Poids idéal inclus.",
    href: "/outils/calculateur-imc",
    icon: "\u{2696}\uFE0F",
    category: "Sante",
  },
  {
    title: "Générateur Lorem Ipsum",
    description:
      "Texte factice pour vos maquettes. Paragraphes, phrases ou mots.",
    href: "/outils/generateur-lorem-ipsum",
    icon: "\u{1F4D6}",
    category: "Texte",
  },
  {
    title: "Mentions légales",
    description:
      "Générez des mentions légales conformes RGPD pour votre site web.",
    href: "/outils/generateur-mentions-legales",
    icon: "\u{2696}\uFE0F",
    badge: "Pro",
    category: "Business",
  },
  {
    title: "Simulateur impôt sur le revenu",
    description:
      "Barème mis à jour, quotient familial, taux marginal. Détail par tranche d'imposition.",
    href: "/outils/simulateur-impot",
    icon: "\u{1F4CB}",
    badge: "Populaire",
    category: "Finance",
  },
  {
    title: "Freelance vs CDI",
    description:
      "Comparez revenus nets : TJM, charges, impôts. Micro, EURL, SASU vs salarié.",
    href: "/outils/freelance-vs-cdi",
    icon: "\u{1F4BC}",
    badge: "Nouveau",
    category: "Business",
  },
  {
    title: "Rentabilité locative",
    description:
      "Rendement brut/net, cashflow, effort d'épargne. Simulateur investissement immobilier.",
    href: "/outils/calculateur-rentabilite-locative",
    icon: "\u{1F3D8}\uFE0F",
    category: "Immobilier",
  },
  {
    title: "Âge de départ à la retraite",
    description:
      "Âge légal et trimestres requis selon votre année de naissance, après la suspension de la réforme (LFSS 2026).",
    href: "/outils/calculateur-retraite",
    icon: "\u{1F9D3}",
    category: "Finance",
  },
  {
    title: "Convertisseur couleurs",
    description:
      "HEX, RGB, HSL. Color picker, sliders, copie en un clic. Pour designers et devs.",
    href: "/outils/convertisseur-couleurs",
    icon: "\u{1F3A8}",
    category: "Dev",
  },
  {
    title: "Calculateur de dates",
    description:
      "Jours entre deux dates, ajout/soustraction de jours. Échéances et délais.",
    href: "/outils/calculateur-date",
    icon: "\u{1F4C5}",
    badge: "Nouveau",
    category: "Conversion",
  },
  {
    title: "Politique de confidentialité",
    description:
      "Générez une politique de confidentialité conforme RGPD pour votre site web.",
    href: "/outils/generateur-politique-confidentialite",
    icon: "\u{1F6E1}\uFE0F",
    badge: "Pro",
    category: "Business",
  },
  {
    title: "Calculateur heures de travail",
    description:
      "Heures travaillées, pauses, heures sup. et totaux hebdomadaires.",
    href: "/outils/calculateur-heures-travail",
    icon: "\u{23F0}",
    category: "Emploi",
  },
  {
    title: "Convertisseur d'unités",
    description:
      "Longueur, poids, température, surface, volume. Conversion instantanée.",
    href: "/outils/convertisseur-unites",
    icon: "\u{1F4CF}",
    badge: "Nouveau",
    category: "Conversion",
  },
  {
    title: "Calculateur d'âge",
    description:
      "Âge exact en années/mois/jours. Décompte prochain anniversaire.",
    href: "/outils/calculateur-age",
    icon: "\u{1F382}",
    category: "Conversion",
  },
  {
    title: "Calculateur prêt auto",
    description:
      "Mensualités, coût total et tableau d'amortissement pour votre crédit automobile.",
    href: "/outils/calculateur-pret-auto",
    icon: "\u{1F697}",
    badge: "Nouveau",
    category: "Finance",
  },
  {
    title: "Consommation essence",
    description:
      "L/100km, coût par kilomètre et estimation du budget carburant de vos trajets.",
    href: "/outils/calculateur-consommation-essence",
    icon: "\u{26FD}",
    badge: "Nouveau",
    category: "Outils",
  },
  {
    title: "Calories brûlées",
    description:
      "Estimez les calories dépensées par activité : course, vélo, natation, marche et plus.",
    href: "/outils/calculateur-calories",
    icon: "\u{1F525}",
    badge: "Nouveau",
    category: "Sante",
  },
  {
    title: "Texte stylisé Unicode",
    description:
      "Convertissez en gras, italique, barré, monospace, bulle. Copiez-collez partout.",
    href: "/outils/generateur-texte-stylise",
    icon: "\u{2728}",
    badge: "Nouveau",
    category: "Texte",
  },
  {
    title: "Minuteur et chronomètre",
    description:
      "Compte à rebours avec alarme sonore et chronomètre avec tours. 100% en ligne.",
    href: "/outils/minuteur",
    icon: "\u{23F1}\uFE0F",
    badge: "Nouveau",
    category: "Outils",
  },
  {
    title: "Calculateur de remise",
    description:
      "Prix après réduction, montant économisé. Cumulez plusieurs remises en cascade.",
    href: "/outils/calculateur-remise",
    icon: "\u{1F3F7}\uFE0F",
    badge: "Nouveau",
    category: "Outils",
  },
  {
    title: "Email professionnel",
    description:
      "Générez des emails pro : relance, remerciement, prise de contact, réunion, démission.",
    href: "/outils/generateur-email-professionnel",
    icon: "\u{1F4E7}",
    badge: "Nouveau",
    category: "Emploi",
  },
  {
    title: "Convertisseur de devises",
    description:
      "EUR, USD, GBP, CHF, CAD, JPY, MAD, XOF. Conversion instantanée entre devises.",
    href: "/outils/calculateur-taux-change",
    icon: "\u{1F4B1}",
    badge: "Nouveau",
    category: "Finance",
  },
  {
    title: "Calculateur d'épargne",
    description:
      "Simulez la croissance de votre épargne avec les intérêts composés. Graphique de projection.",
    href: "/outils/calculateur-epargne",
    icon: "\u{1F4B0}",
    badge: "Nouveau",
    category: "Finance",
  },
  {
    title: "Mot de passe WiFi",
    description:
      "Générez des mots de passe WiFi sécurisés et lisibles. QR code pour partager facilement.",
    href: "/outils/generateur-mot-de-passe-wifi",
    icon: "\u{1F4F6}",
    badge: "Nouveau",
    category: "Securite",
  },
  {
    title: "Calculateur de surface",
    description:
      "Rectangle, cercle, triangle, trapèze. Aire en m² et conversion en autres unités.",
    href: "/outils/calculateur-surface",
    icon: "\u{1F4D0}",
    badge: "Nouveau",
    category: "Immobilier",
  },
  {
    title: "Convertisseur de temps",
    description:
      "Secondes, minutes, heures, jours, semaines, mois, années. Conversion bidirectionnelle.",
    href: "/outils/convertisseur-temps",
    icon: "\u{231A}",
    badge: "Nouveau",
    category: "Conversion",
  },
  {
    title: "Calculateur vitesse",
    description:
      "Vitesse, distance, temps : entrez 2 valeurs, obtenez la 3e. Conversions km/h, m/s, mph.",
    href: "/outils/calculateur-vitesse",
    icon: "\u{1F3CE}\uFE0F",
    badge: "Nouveau",
    category: "Conversion",
  },
  {
    title: "Générateur de slug URL",
    description:
      "Transformez n'importe quel texte en slug SEO-friendly. Accents, espaces, caractères spéciaux.",
    href: "/outils/generateur-slug",
    icon: "\u{1F517}",
    badge: "Nouveau",
    category: "Dev",
  },
  {
    title: "Calculateur de marge",
    description:
      "Marge commerciale, taux de marge, markup et bénéfice. Calcul direct et inverse.",
    href: "/outils/calculateur-marge",
    icon: "\u{1F4C8}",
    badge: "Nouveau",
    category: "Business",
  },
  {
    title: "Encodeur Base64",
    description:
      "Encodez du texte en Base64 et décodez du Base64 en texte. Copie en un clic.",
    href: "/outils/encodeur-base64",
    icon: "\u{1F510}",
    badge: "Nouveau",
    category: "Dev",
  },
  {
    title: "Calculateur d'inflation",
    description:
      "Pouvoir d'achat dans le temps. Données IPC françaises de 1970 à 2025.",
    href: "/outils/calculateur-inflation",
    icon: "\u{1F4C9}",
    badge: "Nouveau",
    category: "Finance",
  },
  {
    title: "Générateur robots.txt",
    description:
      "Créez un fichier robots.txt valide. Préréglages, chemins bloqués, sitemap. Pour le SEO.",
    href: "/outils/generateur-robots-txt",
    icon: "\u{1F916}",
    badge: "Nouveau",
    category: "Dev",
  },
  {
    title: "Empreinte carbone CO2",
    description:
      "Estimez vos émissions CO2 : voiture, avion, train, énergie. Équivalences et conseils.",
    href: "/outils/calculateur-co2",
    icon: "\u{1F331}",
    badge: "Nouveau",
    category: "Outils",
  },
  {
    title: "Générateur d'avatar",
    description:
      "Créez un avatar avec vos initiales. Cercle coloré, styles variés. Téléchargez en PNG.",
    href: "/outils/generateur-avatar",
    icon: "\u{1F464}",
    badge: "Nouveau",
    category: "Image",
  },
  {
    title: "Calculateur grossesse",
    description:
      "Date prévue d'accouchement, semaine, trimestre et étapes clés de la grossesse.",
    href: "/outils/calculateur-grossesse",
    icon: "\u{1F930}",
    badge: "Nouveau",
    category: "Sante",
  },
  {
    title: "Convertisseur numération",
    description:
      "Décimal, binaire, octal, hexadécimal. Conversion bidirectionnelle instantanée.",
    href: "/outils/convertisseur-numeration",
    icon: "\u{1F522}",
    badge: "Nouveau",
    category: "Dev",
  },
  {
    title: "Calculateur béton",
    description:
      "Volume en m³, nombre de sacs 25kg/35kg. Dalle, fondation, poteau. Pour vos travaux.",
    href: "/outils/calculateur-beton",
    icon: "\u{1F3D7}\uFE0F",
    badge: "Nouveau",
    category: "Immobilier",
  },
  {
    title: "Signature email HTML",
    description:
      "Créez une signature email pro : nom, poste, réseaux sociaux. Copiez le HTML en un clic.",
    href: "/outils/generateur-signature-email",
    icon: "\u{270D}\uFE0F",
    badge: "Nouveau",
    category: "Business",
  },
  {
    title: "Calculateur alcoolémie",
    description:
      "Taux d'alcoolémie estimé, temps de retour à zéro. Outil éducatif basé sur Widmark.",
    href: "/outils/calculateur-alcoolemie",
    icon: "\u{1F37B}",
    badge: "Nouveau",
    category: "Sante",
  },
  {
    title: "Convertisseur température",
    description:
      "Celsius, Fahrenheit, Kelvin. Thermomètre visuel et formules de conversion.",
    href: "/outils/convertisseur-temperature",
    icon: "\u{1F321}\uFE0F",
    badge: "Nouveau",
    category: "Conversion",
  },
  {
    title: "Calculateur pourboire",
    description:
      "Pourboire idéal, partage de l'addition. Comparaison des taux et arrondi.",
    href: "/outils/calculateur-pourboire",
    icon: "\u{1F4B5}",
    badge: "Nouveau",
    category: "Outils",
  },
  {
    title: "Mot de passe prononçable",
    description:
      "Mots de passe faciles à prononcer et retenir. Syllabes, force et options.",
    href: "/outils/generateur-mdp-prononcable",
    icon: "\u{1F5E3}\uFE0F",
    badge: "Nouveau",
    category: "Securite",
  },
  {
    title: "Comparateur de texte",
    description:
      "Comparez deux textes et visualisez les différences ligne par ligne. Ajouts en vert, suppressions en rouge.",
    href: "/outils/comparateur-texte",
    icon: "\u{1F50D}",
    badge: "Nouveau",
    category: "Texte",
  },
  {
    title: "Optimiseur JSON",
    description:
      "Formatez, validez, minifiez et triez du JSON. Coloration syntaxique et statistiques.",
    href: "/outils/optimiseur-json",
    icon: "\u{1F4CB}",
    badge: "Nouveau",
    category: "Dev",
  },
  {
    title: "Convertisseur PX / REM",
    description:
      "Convertissez pixels en rem et inversement. Tableau de correspondance. Pour le responsive.",
    href: "/outils/convertisseur-px-rem",
    icon: "\u{1F4D0}",
    badge: "Nouveau",
    category: "Dev",
  },
  {
    title: "Générateur de gradient",
    description:
      "Créez des dégradés CSS : linéaire, radial, couleurs, angle. Aperçu et code CSS prêt à copier.",
    href: "/outils/generateur-gradient",
    icon: "\u{1F308}",
    badge: "Nouveau",
    category: "Dev",
  },
  {
    title: "Testeur de Regex",
    description:
      "Testez vos expressions régulières en temps réel. Groupes, drapeaux, bibliothèque de patterns.",
    href: "/outils/generateur-regex",
    icon: "\u{1F9EA}",
    badge: "Nouveau",
    category: "Dev",
  },
  {
    title: "Compresseur d'image",
    description:
      "Réduisez la taille de vos images JPEG/WebP. Curseur de qualité, comparaison avant/après, ratio de compression.",
    href: "/outils/compresseur-image",
    icon: "\u{1F5DC}\uFE0F",
    badge: "Nouveau",
    category: "Image",
  },
  {
    title: "Redimensionneur d'image",
    description:
      "Changez les dimensions de vos images en pixels ou pourcentage. Ratio d'aspect verrouillable, aperçu en direct.",
    href: "/outils/redimensionneur-image",
    icon: "\u{1F4D0}",
    badge: "Nouveau",
    category: "Image",
  },
  {
    title: "Convertisseur format image",
    description:
      "Convertissez entre PNG, JPEG, WebP et BMP. Comparaison des tailles avant/après conversion.",
    href: "/outils/convertisseur-image",
    icon: "\u{1F504}",
    badge: "Nouveau",
    category: "Image",
  },
  {
    title: "Éditeur photo",
    description:
      "Retouche IA : suppression fond, bokeh, super-résolution. Courbes, calques, 15 filtres VSCO, histogramme.",
    href: "/outils/editeur-photo",
    icon: "\u{1F3A8}",
    badge: "Nouveau",
    category: "Image",
  },
  {
    title: "Fusionneur PDF",
    description:
      "Fusionnez plusieurs fichiers PDF en un seul document. Glissez-déposez, réordonnez par drag & drop.",
    href: "/outils/fusionneur-pdf",
    icon: "\u{1F4C4}",
    badge: "Nouveau",
    category: "Image",
  },
  {
    title: "PDF vers Texte",
    description:
      "Analysez vos PDF : métadonnées, pages, dimensions. Extrayez et téléchargez des pages individuelles.",
    href: "/outils/pdf-vers-texte",
    icon: "\u{1F4D1}",
    badge: "Nouveau",
    category: "Image",
  },
  {
    title: "Compresseur Vidéo",
    description:
      "Compressez vos vidéos en MP4 (H.264) dans le navigateur : 3 niveaux de qualité, réduction en 1080p, 720p ou 480p, taille avant/après.",
    href: "/outils/compresseur-video",
    icon: "\u{1F3AC}",
    badge: "Nouveau",
    category: "Image",
  },
  {
    title: "Extracteur Audio",
    description:
      "Extrayez la piste audio de vos vidéos sans réencodage (M4A, MP3, OGG...) ou convertissez-la en MP3 ou WAV. Forme d'onde incluse.",
    href: "/outils/extracteur-audio",
    icon: "\u{1F3B5}",
    badge: "Nouveau",
    category: "Image",
  },
  {
    title: "Frais de notaire",
    description:
      "Estimez les frais de notaire pour votre achat immobilier. Ancien, neuf, 101 départements. Détail complet.",
    href: "/outils/calculateur-frais-notaire",
    icon: "\u{1F3E0}",
    badge: "Nouveau",
    category: "Immobilier",
  },
  {
    title: "Simulateur auto-entrepreneur",
    description:
      "Cotisations, IR, CFE, revenu net. Taux 2025-2026 par activité. ACRE et versement libératoire.",
    href: "/outils/simulateur-auto-entrepreneur",
    icon: "\u{1F4BC}",
    badge: "Nouveau",
    category: "Business",
  },
  {
    title: "Frais kilométriques",
    description:
      "Barème fiscal officiel. Voiture, moto, cyclomoteur. Majoration véhicule électrique +20%.",
    href: "/outils/calculateur-frais-kilometriques",
    icon: "\u{1F697}",
    badge: "Nouveau",
    category: "Finance",
  },
  {
    title: "Générateur de CV",
    description:
      "Créez votre CV en ligne. 2 templates (classique, moderne), preview live, export PDF gratuit.",
    href: "/outils/generateur-cv",
    icon: "\u{1F4C4}",
    badge: "Nouveau",
    category: "Emploi",
  },
  {
    title: "Convertisseur tailles vêtements",
    description:
      "Correspondance EU, US, UK. Vêtements et chaussures, homme et femme. Tableau complet.",
    href: "/outils/convertisseur-tailles",
    icon: "\u{1F455}",
    badge: "Nouveau",
    category: "Conversion",
  },
  {
    title: "Test vitesse de frappe",
    description:
      "Mesurez votre vitesse de frappe en WPM. Textes français, précision, 30s/60s/120s.",
    href: "/outils/testeur-vitesse-frappe",
    icon: "\u{2328}\uFE0F",
    badge: "Nouveau",
    category: "Outils",
  },
  {
    title: "Scanner QR Code",
    description:
      "Scannez un QR code via caméra ou image. Détection automatique, historique des scans.",
    href: "/outils/scanner-qr-code",
    icon: "\u{1F4F7}",
    badge: "Nouveau",
    category: "Outils",
  },
  {
    title: "Simulateur APL",
    description:
      "Estimez votre aide au logement. Zones 1/2/3, loyer, revenus, composition du foyer.",
    href: "/outils/simulateur-apl",
    icon: "\u{1F3E0}",
    badge: "Nouveau",
    category: "Immobilier",
  },
  {
    title: "Calculateur DPE",
    description:
      "Estimez la classe énergétique de votre logement. Jauge A-G, émissions CO2, coût annuel.",
    href: "/outils/calculateur-dpe",
    icon: "\u{1F3E0}",
    badge: "Nouveau",
    category: "Immobilier",
  },
  {
    title: "Éditeur Markdown",
    description:
      "Éditez du Markdown avec preview temps réel. Toolbar, raccourcis clavier, export HTML et .md.",
    href: "/outils/editeur-markdown",
    icon: "\u{1F4DD}",
    badge: "Nouveau",
    category: "Dev",
  },
  {
    title: "Convertisseur audio",
    description:
      "Convertissez vos fichiers audio : MP3, WAV, OGG, AAC. Bitrate configurable. 100% local.",
    href: "/outils/convertisseur-audio",
    icon: "\u{1F3B5}",
    badge: "Nouveau",
    category: "Image",
  },
  {
    title: "Calculateur de peinture",
    description:
      "Surface murs, ouvertures, couches, rendement. Litres et pots nécessaires pour votre pièce.",
    href: "/outils/calculateur-peinture",
    icon: "\u{1F3A8}",
    badge: "Nouveau",
    category: "Immobilier",
  },
  {
    title: "Rachat de crédit",
    description:
      "Comparez vos crédits actuels vs un rachat unique. Économie mensuelle, coût total, verdict.",
    href: "/outils/calculateur-rachat-credit",
    icon: "\u{1F4B3}",
    badge: "Nouveau",
    category: "Immobilier",
  },
  {
    title: "Timer Pomodoro",
    description:
      "Méthode Pomodoro : 25min travail, 5min pause. Timer circulaire, notifications, statistiques.",
    href: "/outils/pomodoro",
    icon: "\u{1F345}",
    badge: "Nouveau",
    category: "Outils",
  },
  {
    title: "Éditeur Vidéo",
    description:
      "Couper, convertir, redimensionner, GIF, capturer image, vitesse, rotation. 8 operations, 100% navigateur.",
    href: "/outils/editeur-video",
    icon: "\u{1F3AC}",
    badge: "Nouveau",
    category: "Image",
  },
  {
    title: "Calculateur TJM Freelance",
    description:
      "Calculez votre Taux Journalier Moyen idéal. Salaire net, charges, congés, frais pro. TJM et taux horaire.",
    href: "/outils/calculateur-tjm-freelance",
    icon: "\u{1F4B8}",
    badge: "Nouveau",
    category: "Business",
  },
  {
    title: "Partage de frais",
    description:
      "Qui doit combien à qui ? Ajoutez les dépenses du groupe, l'outil calcule les remboursements optimaux.",
    href: "/outils/calculateur-partage-frais",
    icon: "\u{1F91D}",
    badge: "Nouveau",
    category: "Outils",
  },
  {
    title: "Calculateur TDEE / Calories",
    description:
      "Dépense énergétique totale, métabolisme de base (Mifflin-St Jeor), objectifs perte/prise de poids, répartition macros.",
    href: "/outils/calculateur-tdee-calories",
    icon: "\u{1F525}",
    badge: "Nouveau",
    category: "Sante",
  },
  {
    title: "Simulateur Flat Tax Crypto",
    description:
      "Plus-values crypto, flat tax 31,4% (IR 12,8% + PS 18,6%), seuil 305\u20AC. Fiscalité crypto France 2026.",
    href: "/outils/simulateur-flat-tax-crypto",
    icon: "\u{1FA99}",
    badge: "Nouveau",
    category: "Finance",
  },
  {
    title: "Simulateur allocation chômage (ARE)",
    description:
      "Estimez votre ARE : salaire journalier de référence, durée d'indemnisation, montant mensuel et total.",
    href: "/outils/simulateur-allocation-chomage",
    icon: "\u{1F4BC}",
    badge: "Nouveau",
    category: "Emploi",
  },
  {
    title: "Simulateur droits de succession",
    description:
      "Calculez les droits de succession : abattements par lien de parenté, barème progressif, net hérité.",
    href: "/outils/simulateur-droits-succession",
    icon: "\u{1F4DC}",
    badge: "Nouveau",
    category: "Finance",
  },
  {
    title: "Simulateur plus-value immobilière",
    description:
      "Calculez l'impôt sur la plus-value de votre bien : abattements IR/PS par durée de détention, surtaxe, impôt total et plus-value nette.",
    href: "/outils/simulateur-plus-value-immobiliere",
    icon: "\u{1F3E0}",
    badge: "Nouveau",
    category: "Immobilier",
  },
  {
    title: "Simulateur prime d'activité",
    description:
      "Estimez votre prime d'activité 2026. Montant forfaitaire, majorations, bonification, forfait logement. Calcul selon votre situation.",
    href: "/outils/simulateur-prime-activite",
    icon: "\u{1F4B6}",
    badge: "Nouveau",
    category: "Emploi",
  },
  {
    title: "Indemnité rupture conventionnelle",
    description:
      "Calculez votre indemnité de rupture conventionnelle. Indemnité légale, fiscalité, CSG/CRDS, montant net estimé.",
    href: "/outils/simulateur-rupture-conventionnelle",
    icon: "\u{1F4CB}",
    badge: "Nouveau",
    category: "Emploi",
  },
  {
    title: "Simulateur PTZ 2026",
    description:
      "Éligibilité au Prêt à Taux Zéro 2026. Montant PTZ, durée, différé, mensualités par zone et revenus.",
    href: "/outils/simulateur-ptz-2026",
    icon: "\u{1F3E0}",
    badge: "Nouveau",
    category: "Immobilier",
  },
  {
    title: "Simulateur MaPrimeRénov' 2026",
    description:
      "Catégorie de revenus, prime par geste (pompe à chaleur) ou rénovation d'ampleur, écrêtement et reste à charge. Règles au 1er septembre 2026.",
    href: "/outils/simulateur-maprimerenov",
    icon: "\u{1F3E1}",
    badge: "Nouveau",
    category: "Immobilier",
  },
  {
    title: "Capacité d'emprunt 2026",
    description:
      "Combien pouvez-vous emprunter ? Mensualité max à 35 % (HCSF), capital, budget total avec apport, reste à vivre et sensibilité taux/durée.",
    href: "/outils/capacite-emprunt",
    icon: "\u{1F4CA}",
    badge: "Nouveau",
    category: "Immobilier",
  },
  {
    title: "Économie assurance emprunteur (loi Lemoine)",
    description:
      "Changez d'assurance de prêt à tout moment : coût restant de votre contrat, coût d'une délégation, économie totale et mensuelle.",
    href: "/outils/assurance-emprunteur",
    icon: "\u{1F6E1}\u{FE0F}",
    badge: "Nouveau",
    category: "Immobilier",
  },
  {
    title: "Quel statut juridique choisir ?",
    description:
      "Micro, EI, EURL ou SASU : cotisations, impôts, net, protection sociale et coûts 2026. Recommandation personnalisée.",
    href: "/outils/choisir-statut-juridique",
    icon: "\u{1F3DB}\u{FE0F}",
    badge: "Nouveau",
    category: "Business",
  },
];
