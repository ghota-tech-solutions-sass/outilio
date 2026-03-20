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
      "Convertissez votre salaire brut en net et inversement. Cadre, non-cadre, fonction publique. Estimation impot incluse.",
    href: "/outils/calculateur-salaire",
    icon: "\u{1F4B0}",
    badge: "Populaire",
    category: "Finance",
  },
  {
    title: "Simulateur pret immobilier",
    description:
      "Calculez vos mensualites, le cout total du credit et visualisez le tableau d'amortissement complet.",
    href: "/outils/calculateur-pret-immobilier",
    icon: "\u{1F3E0}",
    badge: "Populaire",
    category: "Immobilier",
  },
  {
    title: "Generateur de factures",
    description:
      "Creez des factures conformes en PDF gratuitement. TVA, multi-lignes, impression directe.",
    href: "/outils/generateur-facture",
    icon: "\u{1F4C4}",
    badge: "Pro",
    category: "Business",
  },
  {
    title: "Generateur de QR Code",
    description:
      "QR codes personnalises : couleurs, taille. Pour vos liens, textes, emails ou Wi-Fi.",
    href: "/outils/generateur-qr-code",
    icon: "\u{1F4F1}",
    category: "Outils",
  },
  {
    title: "Generateur de mot de passe",
    description:
      "Mots de passe securises et personnalisables. Indicateur de force. 100% local.",
    href: "/outils/generateur-mot-de-passe",
    icon: "\u{1F512}",
    category: "Securite",
  },
  {
    title: "Compteur de mots",
    description:
      "Mots, caracteres, phrases, paragraphes. Temps de lecture et de parole estimes.",
    href: "/outils/compteur-mots",
    icon: "\u{1F4DD}",
    category: "Texte",
  },
  {
    title: "Convertisseur JSON / CSV",
    description:
      "Convertissez vos donnees entre JSON et CSV instantanement. Telechargement inclus.",
    href: "/outils/convertisseur-json-csv",
    icon: "\u{1F504}",
    category: "Dev",
  },
  {
    title: "Calculateur de TVA",
    description:
      "HT vers TTC et inversement. Tous les taux francais : 20%, 10%, 5,5%, 2,1%.",
    href: "/outils/calculateur-tva",
    icon: "\u{1F4B1}",
    badge: "Nouveau",
    category: "Finance",
  },
  {
    title: "Calculateur de pourcentage",
    description:
      "X% de Y, variation en %, part d'un total. Trois modes de calcul.",
    href: "/outils/calculateur-pourcentage",
    icon: "\u{1F4CA}",
    category: "Maths",
  },
  {
    title: "Calculateur IMC",
    description:
      "Indice de Masse Corporelle selon les normes OMS. Poids ideal inclus.",
    href: "/outils/calculateur-imc",
    icon: "\u{2696}\uFE0F",
    category: "Sante",
  },
  {
    title: "Generateur Lorem Ipsum",
    description:
      "Texte factice pour vos maquettes. Paragraphes, phrases ou mots.",
    href: "/outils/generateur-lorem-ipsum",
    icon: "\u{1F4D6}",
    category: "Texte",
  },
  {
    title: "Mentions legales",
    description:
      "Generez des mentions legales conformes RGPD pour votre site web.",
    href: "/outils/generateur-mentions-legales",
    icon: "\u{2696}\uFE0F",
    badge: "Pro",
    category: "Legal",
  },
  {
    title: "Simulateur impot sur le revenu",
    description:
      "Bareme mis a jour, quotient familial, taux marginal. Detail par tranche d'imposition.",
    href: "/outils/simulateur-impot",
    icon: "\u{1F4CB}",
    badge: "Populaire",
    category: "Finance",
  },
  {
    title: "Freelance vs CDI",
    description:
      "Comparez revenus nets : TJM, charges, impots. Micro, EURL, SASU vs salarie.",
    href: "/outils/freelance-vs-cdi",
    icon: "\u{1F4BC}",
    badge: "Nouveau",
    category: "Carriere",
  },
  {
    title: "Rentabilite locative",
    description:
      "Rendement brut/net, cashflow, effort d'epargne. Simulateur investissement immobilier.",
    href: "/outils/calculateur-rentabilite-locative",
    icon: "\u{1F3D8}\uFE0F",
    category: "Immobilier",
  },
  {
    title: "Age depart retraite",
    description:
      "Reforme 2023 : age legal, trimestres requis selon votre annee de naissance.",
    href: "/outils/calculateur-retraite",
    icon: "\u{1F9D3}",
    category: "Retraite",
  },
  {
    title: "Convertisseur couleurs",
    description:
      "HEX, RGB, HSL. Color picker, sliders, copie en un clic. Pour designers et devs.",
    href: "/outils/convertisseur-couleurs",
    icon: "\u{1F3A8}",
    category: "Design",
  },
  {
    title: "Calculateur de dates",
    description:
      "Jours entre deux dates, ajout/soustraction de jours. Echeances et delais.",
    href: "/outils/calculateur-date",
    icon: "\u{1F4C5}",
    badge: "Nouveau",
    category: "Outils",
  },
  {
    title: "Politique de confidentialite",
    description:
      "Generez une politique de confidentialite conforme RGPD pour votre site web.",
    href: "/outils/generateur-politique-confidentialite",
    icon: "\u{1F6E1}\uFE0F",
    badge: "Pro",
    category: "Legal",
  },
  {
    title: "Calculateur heures de travail",
    description:
      "Heures travaillees, pauses, heures sup. et totaux hebdomadaires.",
    href: "/outils/calculateur-heures-travail",
    icon: "\u{23F0}",
    category: "Travail",
  },
  {
    title: "Convertisseur d'unites",
    description:
      "Longueur, poids, temperature, surface, volume. Conversion instantanee.",
    href: "/outils/convertisseur-unites",
    icon: "\u{1F4CF}",
    badge: "Nouveau",
    category: "Conversion",
  },
  {
    title: "Calculateur d'age",
    description:
      "Age exact en annees/mois/jours. Decompte prochain anniversaire.",
    href: "/outils/calculateur-age",
    icon: "\u{1F382}",
    category: "Outils",
  },
  {
    title: "Calculateur pret auto",
    description:
      "Mensualites, cout total et tableau d'amortissement pour votre credit automobile.",
    href: "/outils/calculateur-pret-auto",
    icon: "\u{1F697}",
    badge: "Nouveau",
    category: "Finance",
  },
  {
    title: "Consommation essence",
    description:
      "L/100km, cout par kilometre et estimation du budget carburant de vos trajets.",
    href: "/outils/calculateur-consommation-essence",
    icon: "\u{26FD}",
    badge: "Nouveau",
    category: "Auto",
  },
  {
    title: "Calories brulees",
    description:
      "Estimez les calories depensees par activite : course, velo, natation, marche et plus.",
    href: "/outils/calculateur-calories",
    icon: "\u{1F525}",
    badge: "Nouveau",
    category: "Sante",
  },
  {
    title: "Texte stylise Unicode",
    description:
      "Convertissez en gras, italique, barre, monospace, bulle. Copiez-collez partout.",
    href: "/outils/generateur-texte-stylise",
    icon: "\u{2728}",
    badge: "Nouveau",
    category: "Texte",
  },
  {
    title: "Minuteur et chronometre",
    description:
      "Compte a rebours avec alarme sonore et chronometre avec tours. 100% en ligne.",
    href: "/outils/minuteur",
    icon: "\u{23F1}\uFE0F",
    badge: "Nouveau",
    category: "Outils",
  },
  {
    title: "Calculateur de remise",
    description:
      "Prix apres reduction, montant economise. Cumulez plusieurs remises en cascade.",
    href: "/outils/calculateur-remise",
    icon: "\u{1F3F7}\uFE0F",
    badge: "Nouveau",
    category: "Shopping",
  },
  {
    title: "Email professionnel",
    description:
      "Generez des emails pro : relance, remerciement, prise de contact, reunion, demission.",
    href: "/outils/generateur-email-professionnel",
    icon: "\u{1F4E7}",
    badge: "Nouveau",
    category: "Business",
  },
  {
    title: "Convertisseur de devises",
    description:
      "EUR, USD, GBP, CHF, CAD, JPY, MAD, XOF. Conversion instantanee entre devises.",
    href: "/outils/calculateur-taux-change",
    icon: "\u{1F4B1}",
    badge: "Nouveau",
    category: "Finance",
  },
  {
    title: "Calculateur d'epargne",
    description:
      "Simulez la croissance de votre epargne avec les interets composes. Graphique de projection.",
    href: "/outils/calculateur-epargne",
    icon: "\u{1F4B0}",
    badge: "Nouveau",
    category: "Finance",
  },
  {
    title: "Mot de passe WiFi",
    description:
      "Generez des mots de passe WiFi securises et lisibles. QR code pour partager facilement.",
    href: "/outils/generateur-mot-de-passe-wifi",
    icon: "\u{1F4F6}",
    badge: "Nouveau",
    category: "Securite",
  },
  {
    title: "Calculateur de surface",
    description:
      "Rectangle, cercle, triangle, trapeze. Aire en m2 et conversion en autres unites.",
    href: "/outils/calculateur-surface",
    icon: "\u{1F4D0}",
    badge: "Nouveau",
    category: "Maths",
  },
  {
    title: "Convertisseur de temps",
    description:
      "Secondes, minutes, heures, jours, semaines, mois, annees. Conversion bidirectionnelle.",
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
    category: "Outils",
  },
  {
    title: "Generateur de slug URL",
    description:
      "Transformez n'importe quel texte en slug SEO-friendly. Accents, espaces, caracteres speciaux.",
    href: "/outils/generateur-slug",
    icon: "\u{1F517}",
    badge: "Nouveau",
    category: "Dev",
  },
  {
    title: "Calculateur de marge",
    description:
      "Marge commerciale, taux de marge, markup et benefice. Calcul direct et inverse.",
    href: "/outils/calculateur-marge",
    icon: "\u{1F4C8}",
    badge: "Nouveau",
    category: "Business",
  },
  {
    title: "Encodeur Base64",
    description:
      "Encodez du texte en Base64 et decodez du Base64 en texte. Copie en un clic.",
    href: "/outils/encodeur-base64",
    icon: "\u{1F510}",
    badge: "Nouveau",
    category: "Dev",
  },
  {
    title: "Calculateur d'inflation",
    description:
      "Pouvoir d'achat dans le temps. Donnees IPC francaises de 1970 a 2025.",
    href: "/outils/calculateur-inflation",
    icon: "\u{1F4C9}",
    badge: "Nouveau",
    category: "Finance",
  },
  {
    title: "Generateur robots.txt",
    description:
      "Creez un fichier robots.txt valide. Presets, chemins bloques, sitemap. Pour le SEO.",
    href: "/outils/generateur-robots-txt",
    icon: "\u{1F916}",
    badge: "Nouveau",
    category: "SEO",
  },
  {
    title: "Empreinte carbone CO2",
    description:
      "Estimez vos emissions CO2 : voiture, avion, train, energie. Equivalences et conseils.",
    href: "/outils/calculateur-co2",
    icon: "\u{1F331}",
    badge: "Nouveau",
    category: "Environnement",
  },
  {
    title: "Generateur d'avatar",
    description:
      "Creez un avatar avec vos initiales. Cercle colore, styles varies. Telechargez en PNG.",
    href: "/outils/generateur-avatar",
    icon: "\u{1F464}",
    badge: "Nouveau",
    category: "Design",
  },
  {
    title: "Calculateur grossesse",
    description:
      "Date prevue d'accouchement, semaine, trimestre et etapes cles de la grossesse.",
    href: "/outils/calculateur-grossesse",
    icon: "\u{1F930}",
    badge: "Nouveau",
    category: "Sante",
  },
  {
    title: "Convertisseur numeration",
    description:
      "Decimal, binaire, octal, hexadecimal. Conversion bidirectionnelle instantanee.",
    href: "/outils/convertisseur-numeration",
    icon: "\u{1F522}",
    badge: "Nouveau",
    category: "Dev",
  },
  {
    title: "Calculateur beton",
    description:
      "Volume en m3, nombre de sacs 25kg/35kg. Dalle, fondation, poteau. Pour vos travaux.",
    href: "/outils/calculateur-beton",
    icon: "\u{1F3D7}\uFE0F",
    badge: "Nouveau",
    category: "Construction",
  },
  {
    title: "Signature email HTML",
    description:
      "Creez une signature email pro : nom, poste, reseaux sociaux. Copiez le HTML en un clic.",
    href: "/outils/generateur-signature-email",
    icon: "\u{270D}\uFE0F",
    badge: "Nouveau",
    category: "Business",
  },
  {
    title: "Calculateur alcoolemie",
    description:
      "Taux d'alcoolemie estime, temps de retour a zero. Outil educatif base sur Widmark.",
    href: "/outils/calculateur-alcoolemie",
    icon: "\u{1F37B}",
    badge: "Nouveau",
    category: "Sante",
  },
  {
    title: "Convertisseur temperature",
    description:
      "Celsius, Fahrenheit, Kelvin. Thermometre visuel et formules de conversion.",
    href: "/outils/convertisseur-temperature",
    icon: "\u{1F321}\uFE0F",
    badge: "Nouveau",
    category: "Conversion",
  },
  {
    title: "Calculateur pourboire",
    description:
      "Pourboire ideal, partage de l'addition. Comparaison des taux et arrondi.",
    href: "/outils/calculateur-pourboire",
    icon: "\u{1F4B5}",
    badge: "Nouveau",
    category: "Restaurant",
  },
  {
    title: "Mot de passe prononcable",
    description:
      "Mots de passe faciles a prononcer et retenir. Syllabes, force et options.",
    href: "/outils/generateur-mdp-prononcable",
    icon: "\u{1F5E3}\uFE0F",
    badge: "Nouveau",
    category: "Securite",
  },
  {
    title: "Comparateur de texte",
    description:
      "Comparez deux textes et visualisez les differences ligne par ligne. Ajouts en vert, suppressions en rouge.",
    href: "/outils/comparateur-texte",
    icon: "\u{1F50D}",
    badge: "Nouveau",
    category: "Dev",
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
    title: "Generateur de gradient",
    description:
      "Creez des degrades CSS : lineaire, radial, couleurs, angle. Apercu et code CSS pret a copier.",
    href: "/outils/generateur-gradient",
    icon: "\u{1F308}",
    badge: "Nouveau",
    category: "Design",
  },
  {
    title: "Testeur de Regex",
    description:
      "Testez vos expressions regulieres en temps reel. Groupes, drapeaux, bibliotheque de patterns.",
    href: "/outils/generateur-regex",
    icon: "\u{1F9EA}",
    badge: "Nouveau",
    category: "Dev",
  },
  {
    title: "Compresseur d'image",
    description:
      "Reduisez la taille de vos images JPEG/WebP. Curseur de qualite, comparaison avant/apres, ratio de compression.",
    href: "/outils/compresseur-image",
    icon: "\u{1F5DC}\uFE0F",
    badge: "Nouveau",
    category: "Image",
  },
  {
    title: "Redimensionneur d'image",
    description:
      "Changez les dimensions de vos images en pixels ou pourcentage. Ratio d'aspect verrouillable, apercu en direct.",
    href: "/outils/redimensionneur-image",
    icon: "\u{1F4D0}",
    badge: "Nouveau",
    category: "Image",
  },
  {
    title: "Convertisseur format image",
    description:
      "Convertissez entre PNG, JPEG, WebP et BMP. Comparaison des tailles avant/apres conversion.",
    href: "/outils/convertisseur-image",
    icon: "\u{1F504}",
    badge: "Nouveau",
    category: "Image",
  },
  {
    title: "Editeur photo",
    description:
      "Retouche IA : suppression fond, bokeh, super resolution. Courbes, calques, 15 filtres VSCO, histogramme.",
    href: "/outils/editeur-photo",
    icon: "\u{1F3A8}",
    badge: "Nouveau",
    category: "Image",
  },
  {
    title: "Fusionneur PDF",
    description:
      "Fusionnez plusieurs fichiers PDF en un seul document. Glissez-deposez, reordonnez par drag & drop.",
    href: "/outils/fusionneur-pdf",
    icon: "\u{1F4C4}",
    badge: "Nouveau",
    category: "PDF",
  },
  {
    title: "PDF vers Texte",
    description:
      "Analysez vos PDF : metadonnees, pages, dimensions. Extrayez et telechargez des pages individuelles.",
    href: "/outils/pdf-vers-texte",
    icon: "\u{1F4D1}",
    badge: "Nouveau",
    category: "PDF",
  },
  {
    title: "Compresseur Video",
    description:
      "Compressez vos videos dans le navigateur. 3 niveaux de qualite, barre de progression, telechargement.",
    href: "/outils/compresseur-video",
    icon: "\u{1F3AC}",
    badge: "Nouveau",
    category: "Video",
  },
  {
    title: "Extracteur Audio",
    description:
      "Extrayez la piste audio de vos videos. Forme d'onde, telechargement WebM. 100% local.",
    href: "/outils/extracteur-audio",
    icon: "\u{1F3B5}",
    badge: "Nouveau",
    category: "Audio",
  },
  {
    title: "Frais de notaire",
    description:
      "Estimez les frais de notaire pour votre achat immobilier. Ancien, neuf, 101 departements. Detail complet.",
    href: "/outils/calculateur-frais-notaire",
    icon: "\u{1F3E0}",
    badge: "Nouveau",
    category: "Immobilier",
  },
  {
    title: "Simulateur auto-entrepreneur",
    description:
      "Cotisations, IR, CFE, revenu net. Taux 2025-2026 par activite. ACRE et versement liberatoire.",
    href: "/outils/simulateur-auto-entrepreneur",
    icon: "\u{1F4BC}",
    badge: "Nouveau",
    category: "Business",
  },
  {
    title: "Frais kilometriques",
    description:
      "Bareme fiscal officiel. Voiture, moto, cyclomoteur. Majoration vehicule electrique +20%.",
    href: "/outils/calculateur-frais-kilometriques",
    icon: "\u{1F697}",
    badge: "Nouveau",
    category: "Auto",
  },
  {
    title: "Generateur de CV",
    description:
      "Creez votre CV en ligne. 2 templates (classique, moderne), preview live, export PDF gratuit.",
    href: "/outils/generateur-cv",
    icon: "\u{1F4C4}",
    badge: "Nouveau",
    category: "Business",
  },
  {
    title: "Convertisseur tailles vetements",
    description:
      "Correspondance EU, US, UK. Vetements et chaussures, homme et femme. Tableau complet.",
    href: "/outils/convertisseur-tailles",
    icon: "\u{1F455}",
    badge: "Nouveau",
    category: "Conversion",
  },
  {
    title: "Test vitesse de frappe",
    description:
      "Mesurez votre vitesse de frappe en WPM. Textes francais, precision, 30s/60s/120s.",
    href: "/outils/testeur-vitesse-frappe",
    icon: "\u{2328}\uFE0F",
    badge: "Nouveau",
    category: "Outils",
  },
  {
    title: "Scanner QR Code",
    description:
      "Scannez un QR code via camera ou image. Detection automatique, historique des scans.",
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
    category: "Finance",
  },
  {
    title: "Calculateur DPE",
    description:
      "Estimez la classe energetique de votre logement. Jauge A-G, emissions CO2, cout annuel.",
    href: "/outils/calculateur-dpe",
    icon: "\u{1F3E0}",
    badge: "Nouveau",
    category: "Immobilier",
  },
  {
    title: "Editeur Markdown",
    description:
      "Editez du Markdown avec preview temps reel. Toolbar, raccourcis clavier, export HTML et .md.",
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
    category: "Audio",
  },
  {
    title: "Calculateur de peinture",
    description:
      "Surface murs, ouvertures, couches, rendement. Litres et pots necessaires pour votre piece.",
    href: "/outils/calculateur-peinture",
    icon: "\u{1F3A8}",
    badge: "Nouveau",
    category: "Construction",
  },
  {
    title: "Rachat de credit",
    description:
      "Comparez vos credits actuels vs un rachat unique. Economie mensuelle, cout total, verdict.",
    href: "/outils/calculateur-rachat-credit",
    icon: "\u{1F4B3}",
    badge: "Nouveau",
    category: "Finance",
  },
  {
    title: "Timer Pomodoro",
    description:
      "Methode Pomodoro : 25min travail, 5min pause. Timer circulaire, notifications, statistiques.",
    href: "/outils/pomodoro",
    icon: "\u{1F345}",
    badge: "Nouveau",
    category: "Outils",
  },
  {
    title: "Editeur Video",
    description:
      "Couper, convertir, redimensionner, GIF, capturer image, vitesse, rotation. 8 operations, 100% navigateur.",
    href: "/outils/editeur-video",
    icon: "\u{1F3AC}",
    badge: "Nouveau",
    category: "Video",
  },
  {
    title: "Calculateur TJM Freelance",
    description:
      "Calculez votre Taux Journalier Moyen ideal. Salaire net, charges, conges, frais pro. TJM et taux horaire.",
    href: "/outils/calculateur-tjm-freelance",
    icon: "\u{1F4B8}",
    badge: "Nouveau",
    category: "Business",
  },
  {
    title: "Partage de frais",
    description:
      "Qui doit combien a qui ? Ajoutez les depenses du groupe, l'outil calcule les remboursements optimaux.",
    href: "/outils/calculateur-partage-frais",
    icon: "\u{1F91D}",
    badge: "Nouveau",
    category: "Quotidien",
  },
  {
    title: "Calculateur TDEE / Calories",
    description:
      "Depense energetique totale, metabolisme de base (Mifflin-St Jeor), objectifs perte/prise de poids, repartition macros.",
    href: "/outils/calculateur-tdee-calories",
    icon: "\u{1F525}",
    badge: "Nouveau",
    category: "Sante",
  },
  {
    title: "Simulateur Flat Tax Crypto",
    description:
      "Plus-values crypto, flat tax 30% (IR 12,8% + PS 17,2%), seuil 305\u20AC. Fiscalite crypto France 2026.",
    href: "/outils/simulateur-flat-tax-crypto",
    icon: "\u{1FA99}",
    badge: "Nouveau",
    category: "Finance",
  },
  {
    title: "Simulateur allocation chomage (ARE)",
    description:
      "Estimez votre ARE : salaire journalier de reference, duree d'indemnisation, montant mensuel et total.",
    href: "/outils/simulateur-allocation-chomage",
    icon: "\u{1F4BC}",
    badge: "Nouveau",
    category: "Emploi",
  },
  {
    title: "Simulateur droits de succession",
    description:
      "Calculez les droits de succession : abattements par lien de parente, bareme progressif, net herite.",
    href: "/outils/simulateur-droits-succession",
    icon: "\u{1F4DC}",
    badge: "Nouveau",
    category: "Finance",
  },
  {
    title: "Simulateur plus-value immobiliere",
    description:
      "Calculez l'impot sur la plus-value de votre bien : abattements IR/PS par duree de detention, surtaxe, impot total et plus-value nette.",
    href: "/outils/simulateur-plus-value-immobiliere",
    icon: "\u{1F3E0}",
    badge: "Nouveau",
    category: "Immobilier",
  },
  {
    title: "Simulateur prime d'activite",
    description:
      "Estimez votre prime d'activite 2026. Montant forfaitaire, majorations, bonification, forfait logement. Calcul selon votre situation.",
    href: "/outils/simulateur-prime-activite",
    icon: "\u{1F4B6}",
    badge: "Nouveau",
    category: "Emploi",
  },
  {
    title: "Indemnite rupture conventionnelle",
    description:
      "Calculez votre indemnite de rupture conventionnelle. Indemnite legale, fiscalite, CSG/CRDS, montant net estime.",
    href: "/outils/simulateur-rupture-conventionnelle",
    icon: "\u{1F4CB}",
    badge: "Nouveau",
    category: "Emploi",
  },
  {
    title: "Simulateur PTZ 2026",
    description:
      "Eligibilite au Pret a Taux Zero 2026. Montant PTZ, duree, differe, mensualites par zone et revenus.",
    href: "/outils/simulateur-ptz-2026",
    icon: "\u{1F3E0}",
    badge: "Nouveau",
    category: "Immobilier",
  },
];
