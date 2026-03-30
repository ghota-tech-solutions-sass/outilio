export interface CategoryContent {
  name: string;
  icon: string;
  intro: string;
  useCases: string[];
  guide: string;
  faqItems: { question: string; answer: string }[];
}

export const categoryContent: Record<string, CategoryContent> = {
  finance: {
    name: "Finance",
    icon: "\u{1F4B0}",
    intro:
      "Nos outils finance vous aident a maitriser votre budget, optimiser votre fiscalite et prendre des decisions eclairees sur votre argent. Que vous soyez salarie, independant ou investisseur, chaque calculateur integre les baremes et reglementations francaises a jour pour 2026.",
    useCases: [
      "Calculer votre salaire net a partir du brut en tenant compte de votre statut (cadre, non-cadre, fonction publique)",
      "Simuler votre impot sur le revenu avec le quotient familial et le bareme progressif 2026",
      "Estimer la fiscalite de vos plus-values crypto avec la flat tax a 30%",
      "Comparer un rachat de credit avec vos mensualites actuelles pour voir l'economie reelle",
    ],
    guide: `Gerer ses finances personnelles en France implique de comprendre un ecosysteme fiscal complexe : baremes progressifs de l'impot sur le revenu, cotisations sociales qui varient selon le statut, CSG/CRDS, prelevements sociaux sur les revenus du capital. Nos outils finance sont conçus pour rendre ces calculs accessibles a tous, sans avoir besoin de consulter un expert-comptable pour chaque question.

Le calculateur salaire brut/net est probablement l'outil le plus utilise. Il distingue les cadres des non-cadres, car les cotisations diffèrent sensiblement : un cadre cotise davantage a l'Agirc-Arrco (retraite complementaire) mais beneficie d'une meilleure couverture. En 2026, le plafond annuel de la Securite sociale (PASS) a ete revalorise, ce qui impacte directement le calcul des cotisations. Notre simulateur integre ces mises a jour des que les taux officiels sont publies.

Pour l'impot sur le revenu, le simulateur applique le bareme progressif par tranches (0%, 11%, 30%, 41%, 45% en 2026), la decote pour les revenus modestes, et le systeme du quotient familial avec ses plafonnements. C'est un outil indispensable avant toute decision importante : negociation salariale, passage en freelance, choix entre imposition au bareme ou flat tax pour vos revenus de capitaux. Le simulateur flat tax crypto, par exemple, vous permet de comparer la flat tax a 30% (12,8% d'IR + 17,2% de prelevements sociaux) avec l'option du bareme progressif, qui peut etre plus avantageuse si vos revenus globaux sont modestes.

Au-dela de la fiscalite, nos outils couvrent aussi l'epargne et l'investissement. Le calculateur d'epargne vous montre la puissance des interets composes sur 10, 20 ou 30 ans — un euro place a 4% pendant 30 ans vaut plus de 3 euros. Le simulateur APL estime vos droits aux aides au logement selon votre zone geographique (1, 2 ou 3) et vos revenus. Le convertisseur de devises et le calculateur d'inflation completent la boite a outils pour suivre votre pouvoir d'achat dans le temps.

Conseil pratique : utilisez le simulateur d'impot en debut d'annee avec vos revenus reels de l'annee precedente pour verifier que votre taux de prelevement a la source est correct. Un taux trop eleve signifie un remboursement tardif, un taux trop bas signifie une regularisation douloureuse. Nos outils sont la pour vous donner la visibilite necessaire et eviter les mauvaises surprises.`,
    faqItems: [
      {
        question:
          "Les taux utilises dans vos simulateurs sont-ils a jour pour 2026 ?",
        answer:
          "Oui. Nous mettons a jour les baremes des que les taux officiels sont publies par l'administration fiscale ou l'URSSAF. Cela concerne le bareme de l'impot sur le revenu, les cotisations sociales, le PASS, les taux de CSG/CRDS et la flat tax. La date de derniere mise a jour est indiquee sur chaque outil.",
      },
      {
        question:
          "Vos calculateurs peuvent-ils remplacer un expert-comptable ?",
        answer:
          "Nos outils fournissent des estimations fiables basees sur les regles generales. Ils sont parfaits pour se faire une premiere idee, comparer des scenarios ou verifier un bulletin de paie. Cependant, pour des situations complexes (optimisation fiscale, montages patrimoniaux, cas particuliers), l'avis d'un professionnel reste recommande.",
      },
      {
        question:
          "Mes donnees financieres sont-elles en securite ?",
        answer:
          "Absolument. Tous les calculs sont effectues localement dans votre navigateur. Aucune donnee n'est envoyee a un serveur, stockee ou partagee. Vous pouvez meme utiliser les outils hors ligne une fois la page chargee. Votre vie privee financiere est totalement preservee.",
      },
    ],
  },

  immobilier: {
    name: "Immobilier",
    icon: "\u{1F3E0}",
    intro:
      "Nos simulateurs immobiliers couvrent chaque etape de votre projet : du calcul de mensualites au DPE, en passant par les frais de notaire, la rentabilite locative et le PTZ 2026. Tout est calcule selon la reglementation francaise en vigueur.",
    useCases: [
      "Simuler les mensualites et le cout total d'un pret immobilier avec tableau d'amortissement",
      "Estimer les frais de notaire pour un achat dans l'ancien ou le neuf, departement par departement",
      "Calculer la rentabilite nette d'un investissement locatif avec charges et fiscalite",
      "Verifier votre eligibilite au Pret a Taux Zero 2026 selon votre zone et vos revenus",
    ],
    guide: `L'achat immobilier est souvent le projet financier le plus important d'une vie. En France, il s'accompagne d'un cadre reglementaire specifique : taux d'usure, assurance emprunteur obligatoire, frais de notaire reglementes, zonage pour le PTZ, normes DPE pour la location. Nos outils sont concus pour vous donner une vision claire a chaque etape.

Le simulateur de pret immobilier calcule vos mensualites selon le montant emprunte, la duree et le taux. En 2026, les taux immobiliers se sont stabilises autour de 3-3,5% sur 20 ans apres la hausse des annees precedentes. Le tableau d'amortissement detaille vous montre, mois par mois, la part de capital et d'interets dans chaque echeance. C'est essentiel pour comprendre qu'en debut de pret, vous payez surtout des interets — un argument de plus pour negocier le taux au centime pres.

Les frais de notaire representent 7 a 8% du prix dans l'ancien et 2 a 3% dans le neuf. Notre calculateur detaille les droits de mutation par departement (certains appliquent un taux majore), les emoluments du notaire (bareme reglemente), les frais de formalites et la contribution de securite immobiliere. Ne les sous-estimez pas : sur un achat a 300 000 euros dans l'ancien, c'est entre 21 000 et 24 000 euros a prevoir en plus.

Pour l'investissement locatif, la rentabilite brute ne suffit pas. Notre calculateur integre les charges de copropriete, la taxe fonciere, l'assurance PNO, les frais de gestion et la vacance locative pour donner une rentabilite nette realiste. Il calcule aussi le cashflow mensuel et l'effort d'epargne necessaire. Un rendement brut de 7% peut se transformer en 3,5% net une fois toutes les charges deduites.

Le simulateur PTZ 2026 integre les nouvelles zones eligibles et les plafonds de revenus actualises. Le PTZ couvre jusqu'a 50% du cout de l'operation en zone tendue (A et B1) pour le neuf, et est desormais etendu a l'ancien avec travaux dans certaines zones. C'est un levier puissant pour les primo-accedants : un pret a 0% sur 25 ans avec differe de remboursement pouvant aller jusqu'a 15 ans.

Le simulateur de plus-value immobiliere vous aide a anticiper la fiscalite en cas de revente. L'abattement pour duree de detention s'applique a partir de la 6e annee (6% par an pour l'IR, 1,65% pour les prelevements sociaux), avec exoneration totale a 22 ans pour l'IR et 30 ans pour les PS. A cela s'ajoute la surtaxe applicable aux plus-values superieures a 50 000 euros.`,
    faqItems: [
      {
        question:
          "Comment fonctionne le simulateur PTZ 2026 ?",
        answer:
          "Le simulateur prend en compte votre zone geographique (A, A bis, B1, B2, C), vos revenus fiscaux de reference N-2, la composition de votre foyer et le cout de l'operation. Il calcule le montant maximum du PTZ, la duree de remboursement et la periode de differe. Les plafonds de revenus et les quotites applicables sont ceux en vigueur au 1er janvier 2026.",
      },
      {
        question:
          "Vos frais de notaire sont-ils precis au centime ?",
        answer:
          "Nos estimations sont tres proches de la realite car nous utilisons les baremes officiels et les taux departementaux a jour. Cependant, certains frais annexes (debours specifiques, frais de dossier de la banque) peuvent varier. Comptez une marge de +/- 500 euros par rapport a l'estimation pour un achat classique.",
      },
      {
        question:
          "Comment interpreter le DPE de mon logement ?",
        answer:
          "Le DPE classe les logements de A (tres performant, moins de 70 kWh/m2/an) a G (passoire thermique, plus de 420 kWh/m2/an). Depuis 2025, les logements classes G sont interdits a la location. Les classes F suivront en 2028. Notre calculateur estime votre classe a partir des caracteristiques du logement et vous donne le cout energetique annuel estime.",
      },
    ],
  },

  business: {
    name: "Business",
    icon: "\u{1F4BC}",
    intro:
      "Des outils concrets pour les entrepreneurs, freelances et independants. Generez des factures conformes, calculez vos marges, estimez vos charges auto-entrepreneur et creez des documents professionnels — le tout gratuitement et sans inscription.",
    useCases: [
      "Generer une facture conforme avec TVA, multi-lignes et export PDF",
      "Calculer votre TJM ideal en tenant compte des charges, conges et frais pro",
      "Simuler vos revenus nets en auto-entrepreneur selon votre activite et vos options fiscales",
      "Creer un CV professionnel avec preview en temps reel et export PDF",
    ],
    guide: `Lancer une activite en France implique des obligations administratives et comptables precises. Que vous soyez auto-entrepreneur, en EURL/SASU ou freelance en portage salarial, nos outils business vous font gagner du temps sur les taches recurrentes et vous aident a prendre les bonnes decisions financieres.

Le generateur de factures produit des documents conformes aux exigences legales francaises : mentions obligatoires (numero de facture, date, identite du vendeur et de l'acheteur, description des prestations, montant HT et TTC), gestion de la TVA (avec les quatre taux en vigueur : 20%, 10%, 5,5% et 2,1%) et la mention "TVA non applicable, article 293 B du CGI" pour les auto-entrepreneurs en franchise de base. Vous pouvez ajouter plusieurs lignes, appliquer des remises et imprimer ou sauvegarder en PDF.

Pour les freelances, le calculateur de TJM (Taux Journalier Moyen) est un outil strategique. Il ne s'agit pas simplement de diviser un salaire cible par le nombre de jours ouvrables. Le calcul integre les charges sociales (environ 22% pour un auto-entrepreneur en prestation de services, 45% en EURL a l'IS), les conges (5 semaines + jours feries = environ 47 jours par an), les frais professionnels (coworking, materiel, logiciels, comptable), et la marge de securite pour les periodes creuses (intercontrat). Un freelance dev qui vise 4 000 euros nets par mois en EURL doit facturer un TJM d'environ 550-600 euros HT.

Le simulateur auto-entrepreneur integre les taux de cotisations 2025-2026 par type d'activite : 12,3% pour la vente de marchandises, 21,2% pour les prestations de services BIC, 23,1% pour les professions liberales BNC. Il simule aussi l'option pour le versement liberatoire de l'impot sur le revenu (1%, 1,7% ou 2,2% selon l'activite) et l'ACRE (exoneration partielle la premiere annee). N'oubliez pas la CFE (Cotisation Fonciere des Entreprises), souvent oubliee par les nouveaux entrepreneurs — elle varie de 200 a 2 000 euros selon la commune.

Pour la communication professionnelle, le generateur d'emails propose des templates adaptes aux situations courantes : relance client, prise de contact, remerciement, invitation a une reunion, ou meme demission. Le generateur de signature email cree un bloc HTML compatible avec Gmail, Outlook et Apple Mail, avec vos coordonnees et liens vers vos reseaux sociaux. Ce sont des petits details qui font une grande difference dans l'image professionnelle que vous projetez.`,
    faqItems: [
      {
        question:
          "Les factures generees sont-elles conformes a la legislation francaise ?",
        answer:
          "Oui. Nos factures incluent toutes les mentions obligatoires definies par le Code de commerce (article L441-9) : identite des parties, date, numerotation, designation des produits/services, prix unitaire HT, taux de TVA, montant total. Attention cependant : a partir de 2026, la facturation electronique devient obligatoire pour les grandes entreprises. Nos factures PDF restent valables pour les TPE/micro-entreprises.",
      },
      {
        question:
          "Comment choisir entre auto-entrepreneur et EURL/SASU ?",
        answer:
          "L'auto-entreprise est ideale pour demarrer (charges simplifiees, pas de comptabilite complexe) tant que votre CA reste sous les plafonds (188 700 euros en vente, 77 700 euros en services). Au-dela, ou si vous avez besoin de deduire des frais importants, l'EURL ou la SASU deviennent plus avantageuses. Utilisez notre comparateur Freelance vs CDI pour simuler les deux scenarios avec vos chiffres reels.",
      },
      {
        question:
          "Le calculateur de TJM prend-il en compte les charges sociales ?",
        answer:
          "Oui, c'est meme son principal interet. Vous renseignez votre revenu net souhaite, votre statut juridique, vos jours de conges et vos frais fixes. L'outil calcule les cotisations sociales correspondantes, ajoute une marge pour l'intercontrat et les imprevu, et vous donne un TJM et un taux horaire recommandes.",
      },
    ],
  },

  dev: {
    name: "Dev",
    icon: "\u{1F4BB}",
    intro:
      "Une boite a outils pour les developpeurs : convertisseurs de donnees, formateurs de code, testeurs de regex, encodeurs et utilitaires CSS. Chaque outil fonctionne 100% cote client — aucune donnee n'est envoyee a un serveur.",
    useCases: [
      "Convertir des donnees entre JSON et CSV pour des imports/exports de base de donnees",
      "Tester et debugger des expressions regulieres avec mise en surbrillance des captures",
      "Convertir des valeurs PX en REM pour un design responsive coherent",
      "Formater, valider et minifier du JSON pour le debug d'API",
    ],
    guide: `Les developpeurs jonglent quotidiennement avec des formats de donnees, des encodages, des conversions d'unites CSS et des expressions regulieres. Avoir des outils fiables et rapides sous la main evite d'installer des packages NPM pour des taches ponctuelles ou de chercher des one-liners sur Stack Overflow.

Le convertisseur JSON/CSV est un classique : vous avez une API qui renvoie du JSON, votre client veut un fichier Excel, ou inversement. L'outil gere les objets imbriques, les tableaux, les valeurs null, et produit un CSV propre avec encodage UTF-8 (important pour les caracteres accentues francais). Dans l'autre sens, il transforme un CSV en JSON structure, pret a etre envoye dans un body de requete POST.

L'optimiseur JSON va plus loin que le simple pretty-print. Il valide la syntaxe (et pointe exactement la ligne de l'erreur), formate avec indentation configurable, minifie pour reduire la taille des payloads API, et trie les cles alphabetiquement — pratique pour comparer deux reponses JSON qui ont les memes donnees dans un ordre different. La coloration syntaxique facilite la lecture de structures complexes.

Le testeur de regex est un outil qui fait gagner enormement de temps. Au lieu de modifier votre code, recompiler et tester, vous ecrivez votre pattern, collez votre texte de test, et voyez instantanement les correspondances, les groupes de capture, et les backreferences. La bibliotheque de patterns inclut des classiques : validation d'email, extraction de numeros de telephone francais (06/07, +33), detection de dates au format JJ/MM/AAAA, parsing d'URLs.

Pour le CSS, le convertisseur PX/REM est indispensable en design responsive. Avec une base de 16px (la valeur par defaut des navigateurs), 1rem = 16px. Le tableau de correspondance rapide vous donne les valeurs les plus courantes : 12px = 0.75rem, 14px = 0.875rem, 16px = 1rem, 18px = 1.125rem, 24px = 1.5rem. Le generateur de gradient CSS cree des degrades lineaires ou radiaux avec un apercu en temps reel et le code CSS copie en un clic.

L'encodeur Base64 sert a encoder du texte ou des donnees pour les transmettre dans des URLs, des headers HTTP, ou des champs JSON qui n'acceptent pas les caracteres speciaux. C'est aussi utile pour les data URIs : encoder une petite image en Base64 pour l'integrer directement dans du CSS ou du HTML sans requete HTTP supplementaire. Le generateur de slug URL, lui, transforme n'importe quel titre en URL SEO-friendly : suppression des accents, remplacement des espaces par des tirets, suppression des caracteres speciaux.`,
    faqItems: [
      {
        question:
          "Mes donnees sont-elles envoyees a un serveur quand j'utilise vos outils dev ?",
        answer:
          "Non, jamais. Tous les traitements (conversion JSON/CSV, validation, encodage Base64, regex) sont executes en JavaScript directement dans votre navigateur. Aucune requete reseau n'est faite. C'est particulierement important quand vous travaillez avec des donnees sensibles : cles d'API, tokens, donnees utilisateurs.",
      },
      {
        question:
          "L'editeur Markdown supporte-t-il le GitHub Flavored Markdown ?",
        answer:
          "Oui. L'editeur supporte la syntaxe GFM : tableaux, listes de taches (checkboxes), blocs de code avec coloration syntaxique, strikethrough, et autolinks. L'export est disponible en HTML et en fichier .md. Les raccourcis clavier classiques (Ctrl+B pour gras, Ctrl+I pour italique) sont aussi supportes.",
      },
      {
        question:
          "Quels moteurs de regex sont supportes par le testeur ?",
        answer:
          "Le testeur utilise le moteur de regex JavaScript natif du navigateur. Il supporte tous les drapeaux standard : g (global), i (insensible a la casse), m (multiline), s (dotAll), u (unicode). Les lookbehind et lookahead sont supportes dans les navigateurs modernes (Chrome, Firefox, Edge, Safari 16.4+).",
      },
    ],
  },

  image: {
    name: "Image",
    icon: "\u{1F5BC}\uFE0F",
    intro:
      "Compressez, redimensionnez, convertissez et retouchez vos images directement dans votre navigateur. Aucun upload sur un serveur, aucune limite de taille, aucun filigrane. Vos photos restent sur votre machine.",
    useCases: [
      "Compresser des photos JPEG pour les alleguer avant envoi par email ou upload sur un site",
      "Redimensionner une image a des dimensions precises pour un reseau social ou un e-commerce",
      "Convertir entre PNG, JPEG, WebP et BMP pour optimiser le poids des fichiers",
      "Retoucher une photo : suppression d'arriere-plan, filtres, ajustement de luminosite et contraste",
    ],
    guide: `Le traitement d'image est une necessite quotidienne, que vous soyez photographe, designer, e-commercant ou simplement en train de preparer une piece jointe pour un email. Les logiciels professionnels comme Photoshop sont puissants mais couteux et surdimensionnes pour des operations simples. Nos outils couvrent les 4 operations les plus frequentes, directement dans le navigateur.

Le compresseur d'image reduit le poids de vos fichiers JPEG et WebP sans perte visible de qualite. Un curseur vous permet d'ajuster le ratio qualite/taille : a 80% de qualite, une photo de 5 Mo tombe generalement sous les 500 Ko avec une difference imperceptible a l'oeil nu. L'apercu avant/apres vous permet de verifier visuellement le resultat. C'est particulierement utile pour les sites web : Google recommande que les images ne depassent pas 100 Ko pour optimiser les Core Web Vitals.

Le redimensionneur d'image gere le changement de dimensions en pixels ou en pourcentage. Le ratio d'aspect est verrouillable pour eviter les deformations. Les presets pour les reseaux sociaux sont integres : 1080x1080 pour Instagram, 1200x630 pour Facebook/LinkedIn, 1500x500 pour la banniere Twitter. Pour l'e-commerce, les marketplaces imposent souvent des dimensions specifiques (par exemple, 1000x1000 px minimum sur Amazon).

Le convertisseur de format est essentiel pour l'optimisation web. Le WebP offre une compression 25 a 35% superieure au JPEG a qualite egale, et est supporte par tous les navigateurs modernes. Convertir vos PNG en WebP pour les illustrations et vos JPEG en WebP pour les photos peut reduire considerablement le temps de chargement de votre site. Le BMP reste utile pour certaines applications industrielles ou d'impression qui n'acceptent pas les formats compresses.

L'editeur photo est l'outil le plus complet de la gamme. Il propose des filtres type VSCO (clarendon, gingham, juno...), des ajustements fins (luminosite, contraste, saturation, temperature, ombres, hautes lumieres), et des fonctions avancees comme la suppression d'arriere-plan par IA, le flou d'arriere-plan (bokeh), et la super resolution pour agrandir des images sans pixelisation. L'histogramme en temps reel vous permet de controler la distribution tonale comme dans Lightroom. Tout est traite localement grace aux APIs Canvas et WebGL du navigateur.`,
    faqItems: [
      {
        question:
          "Quelle est la taille maximale d'image supportee ?",
        answer:
          "Il n'y a pas de limite stricte cote serveur puisque tout est traite localement. La limite depend de la memoire de votre navigateur. En pratique, les images jusqu'a 50 Mo et 8000x8000 pixels fonctionnent sans probleme sur un ordinateur moderne. Sur mobile, la limite est plus basse (environ 4000x4000 pixels).",
      },
      {
        question:
          "WebP ou JPEG : quel format choisir pour mon site web ?",
        answer:
          "Le WebP est generalement le meilleur choix pour le web en 2026 : il offre une meilleure compression a qualite egale et supporte la transparence (contrairement au JPEG). Tous les navigateurs modernes le supportent. Gardez le JPEG uniquement si vous devez garantir la compatibilite avec de tres vieux systemes ou logiciels.",
      },
      {
        question:
          "La suppression d'arriere-plan fonctionne-t-elle hors ligne ?",
        answer:
          "Oui. L'editeur photo utilise un modele d'IA embarque qui tourne directement dans votre navigateur via WebAssembly. Aucune image n'est envoyee a un serveur. Le premier chargement peut prendre quelques secondes pour telecharger le modele, mais ensuite il reste en cache.",
      },
    ],
  },

  outils: {
    name: "Outils",
    icon: "\u{1F527}",
    intro:
      "Des utilitaires polyvalents pour le quotidien : generateur de QR code, calculateur de dates, minuteur, chronometre, test de vitesse de frappe. Des petits outils qui rendent de grands services au quotidien.",
    useCases: [
      "Generer un QR code personnalise pour un lien, un texte, un email ou un reseau WiFi",
      "Calculer le nombre de jours entre deux dates ou une echeance future",
      "Chronometrer une activite ou lancer un compte a rebours avec alarme sonore",
      "Mesurer votre vitesse de frappe en mots par minute avec des textes francais",
    ],
    guide: `Cette categorie regroupe les outils du quotidien qui ne rentrent pas dans une case specifique mais qu'on utilise regulierement. Le point commun : ils sont simples, rapides et font exactement ce qu'on leur demande.

Le generateur de QR code est l'un des outils les plus populaires du site. Il ne se limite pas aux URLs : vous pouvez encoder du texte libre, une adresse email (avec sujet pre-rempli), les parametres d'un reseau WiFi (pour que vos invites se connectent en scannant le code), ou une carte de visite au format vCard. Les couleurs, la taille et la marge sont personnalisables. Le QR code se telecharge en PNG haute resolution. Astuce : pour un usage professionnel (menu de restaurant, flyer), generez un QR code de taille 1024x1024 pixels minimum pour garantir une impression nette.

Le calculateur de dates resout deux problemes courants : combien de jours separent deux dates (utile pour les delais legaux, les preavis, les echeances contractuelles), et quelle est la date dans X jours a partir d'aujourd'hui ou d'une date donnee. En France, de nombreux delais sont comptes en jours calendaires (delai de retractation de 14 jours, preavis de licenciement, delai de paiement de 30 jours). L'outil gere les annees bissextiles et les changements d'heure.

Le minuteur et le chronometre combinent deux fonctions en un seul outil. Le compte a rebours accepte des durees en heures, minutes et secondes, avec une alarme sonore a l'expiration. Le chronometre enregistre les tours (splits) avec le detail de chaque intervalle. C'est un outil precieux pour la cuisine (minuteur de cuisson), le sport (chrono d'entrainement), les presentations (gestion du temps de parole), ou la methode Pomodoro (travail par blocs de 25 minutes).

Le test de vitesse de frappe propose des textes en francais (pas en anglais comme la plupart des sites). Il mesure les WPM (mots par minute), la precision, et identifie les erreurs en temps reel. Trois durees sont disponibles : 30 secondes (test rapide), 60 secondes (standard) et 120 secondes (endurance). La vitesse moyenne d'un francophone est de 40-50 WPM. Un professionnel de la bureautique vise 60-80 WPM. Les developpeurs experimentés tournent autour de 70-90 WPM.

Le timer Pomodoro est un outil de productivite base sur la methode inventee par Francesco Cirillo : 25 minutes de travail concentre, 5 minutes de pause, avec une pause longue de 15-20 minutes toutes les 4 sessions. Des notifications vous alertent a chaque transition, et des statistiques de session vous aident a suivre votre productivite.`,
    faqItems: [
      {
        question:
          "Les QR codes generes sont-ils utilisables commercialement ?",
        answer:
          "Oui, sans aucune restriction. Les QR codes generes sont libres de droits. Vous pouvez les utiliser sur des supports imprimes (flyers, cartes de visite, affiches) ou numeriques (sites web, emails) a titre personnel ou commercial. Aucun filigrane, aucune limitation.",
      },
      {
        question:
          "Le minuteur fonctionne-t-il en arriere-plan ?",
        answer:
          "Oui, le minuteur continue de tourner meme si vous changez d'onglet ou minimisez le navigateur. L'alarme sonore se declenchera a la fin du compte a rebours. Veillez a ce que les notifications du navigateur soient autorisees pour recevoir l'alerte visuelle en plus du son.",
      },
      {
        question:
          "Comment le test de frappe mesure-t-il les WPM ?",
        answer:
          "Les WPM (Words Per Minute) sont calcules selon la norme standard : chaque groupe de 5 caracteres (espaces compris) compte comme un mot. Seuls les mots correctement saisis sont comptabilises. La precision est le ratio entre les frappes correctes et le total de frappes. C'est la meme methode que TypeRacer ou MonkeyType.",
      },
    ],
  },

  sante: {
    name: "Sante",
    icon: "\u{2695}\uFE0F",
    intro:
      "Des calculateurs sante bases sur des formules reconnues (OMS, Mifflin-St Jeor, Widmark) pour suivre votre forme au quotidien. IMC, calories, grossesse, alcoolemie — des outils informatifs pour mieux comprendre votre corps.",
    useCases: [
      "Calculer votre IMC et savoir dans quelle categorie OMS vous vous situez",
      "Estimer vos besoins caloriques quotidiens (TDEE) et vos macronutriments",
      "Suivre les etapes cles de votre grossesse semaine par semaine",
      "Estimer votre taux d'alcoolemie et le temps de retour a zero",
    ],
    guide: `Nos outils sante sont des aides a la comprehension de votre corps, bases sur des formules scientifiques reconnues. Ils ne remplacent pas un avis medical mais vous donnent des reperes utiles pour suivre votre forme, adapter votre alimentation ou comprendre les mecanismes biologiques de base.

Le calculateur d'IMC (Indice de Masse Corporelle) utilise la formule de l'OMS : poids en kg divise par la taille en metres au carre. Il classe le resultat dans les categories standard : insuffisance ponderale (< 18,5), poids normal (18,5-24,9), surpoids (25-29,9), et les differents degres d'obesite. L'outil indique aussi le poids ideal theorique selon votre taille. Attention : l'IMC a ses limites. Il ne distingue pas la masse musculaire de la masse grasse. Un sportif muscle peut avoir un IMC "surpoids" tout en etant en excellente sante.

Le calculateur TDEE (Total Daily Energy Expenditure) utilise la formule de Mifflin-St Jeor, consideree comme la plus precise pour la population generale. Il calcule d'abord votre metabolisme de base (les calories que votre corps brule au repos), puis applique un coefficient d'activite (sedentaire, legerement actif, moderement actif, tres actif, extremement actif). Le resultat est votre depense calorique quotidienne totale. L'outil propose ensuite des objectifs : maintien du poids, perte de poids (-500 kcal/jour pour perdre environ 0,5 kg/semaine), ou prise de masse (+300 kcal/jour). La repartition en macronutriments (proteines, glucides, lipides) est calculee selon les recommandations nutritionnelles standard.

Le calculateur de calories brulees estime la depense energetique pour plus de 20 activites physiques : course a pied, velo, natation, marche, musculation, yoga, et bien d'autres. Le calcul est base sur les equivalents metaboliques (MET) de chaque activite, multiplies par votre poids et la duree. C'est utile pour ajuster votre apport alimentaire en fonction de votre activite sportive.

Le calculateur de grossesse est concu pour les futures mamans. A partir de la date des dernieres regles, il calcule la date prevue d'accouchement (methode de Naegele : +7 jours, -3 mois, +1 an), la semaine de grossesse actuelle (SA et SG), le trimestre, et les etapes cles a venir (premiere echographie entre 11 et 13 SA, test de depistage prenatal, deuxieme echographie vers 22 SA, etc.).

Le calculateur d'alcoolemie utilise la formule de Widmark pour estimer le taux d'alcool dans le sang en fonction du nombre de verres consommes, du poids, du sexe et du temps ecoule. C'est un outil educatif : il rappelle que le seuil legal en France est de 0,5 g/l de sang (0,2 g/l pour les jeunes conducteurs) et que l'organisme elimine en moyenne 0,10 a 0,15 g/l par heure. Il ne doit en aucun cas servir a decider si vous etes apte a conduire — en cas de doute, ne prenez pas le volant.`,
    faqItems: [
      {
        question:
          "Ces outils sante ont-ils une valeur medicale ?",
        answer:
          "Non. Nos outils sante sont informatifs et bases sur des formules generales (OMS, Mifflin-St Jeor, Widmark). Ils ne tiennent pas compte de votre historique medical, de vos traitements ou de conditions specifiques. Pour tout probleme de sante, consultez un professionnel de sante qualifie.",
      },
      {
        question:
          "Quelle formule est utilisee pour le calcul du metabolisme de base ?",
        answer:
          "Nous utilisons la formule de Mifflin-St Jeor (1990), recommandee par l'Academy of Nutrition and Dietetics comme la plus precise pour la majorite de la population. Pour les hommes : (10 x poids en kg) + (6,25 x taille en cm) - (5 x age) + 5. Pour les femmes : meme formule, -161 au lieu de +5.",
      },
      {
        question:
          "Le calculateur d'alcoolemie est-il fiable ?",
        answer:
          "Le calculateur donne une estimation basee sur la formule de Widmark, qui est la reference en toxicologie. Cependant, l'alcoolemie reelle depend de nombreux facteurs individuels : alimentation, fatigue, medicaments, metabolisme personnel. Ne l'utilisez jamais pour decider de conduire. En cas de doute, abstenez-vous.",
      },
    ],
  },

  securite: {
    name: "Securite",
    icon: "\u{1F512}",
    intro:
      "Generez des mots de passe robustes et securises pour proteger vos comptes. Mots de passe aleatoires, prononcables ou WiFi — tous generes localement dans votre navigateur, jamais envoyes a un serveur.",
    useCases: [
      "Generer un mot de passe aleatoire de 20+ caracteres avec chiffres et symboles",
      "Creer un mot de passe prononcable facile a retenir mais suffisamment complexe",
      "Generer un mot de passe WiFi securise avec QR code pour le partager facilement",
    ],
    guide: `La securite des mots de passe est la premiere ligne de defense de votre vie numerique. En 2026, les attaques par force brute sont capables de tester des milliards de combinaisons par seconde. Un mot de passe de 8 caracteres minuscules se casse en quelques secondes. A 12 caracteres avec majuscules, chiffres et symboles, on passe a plusieurs milliers d'annees.

Notre generateur de mot de passe principal produit des sequences aleatoires avec un controle precis : longueur (de 4 a 128 caracteres), inclusion de majuscules, minuscules, chiffres et caracteres speciaux. L'indicateur de force evalue le mot de passe en temps reel selon l'entropie — une mesure mathematique de l'imprevisibilite. Visez au minimum 80 bits d'entropie pour un mot de passe critique (email principal, banque en ligne). En pratique, un mot de passe de 16 caracteres melangeant les quatre types de caracteres atteint environ 100 bits d'entropie.

Le generateur de mot de passe prononcable repond a un probleme reel : les mots de passe aleatoires sont tres securises mais impossibles a retenir. L'outil genere des sequences de syllabes qui forment des "pseudo-mots" faciles a prononcer (et donc a memoriser) tout en restant suffisamment aleatoires pour resister aux attaques par dictionnaire. Combinee avec des chiffres et des majuscules intercales, cette approche offre un bon compromis securite/memorisation.

Le generateur de mot de passe WiFi est specialise pour les reseaux sans fil. Il produit des cles WPA2/WPA3 securisees et inclut un generateur de QR code integre : vos invites n'ont qu'a scanner le code avec leur smartphone pour se connecter, sans taper manuellement une cle de 20 caracteres. C'est pratique a la maison, en Airbnb, ou dans un bureau partage.

Quelques bonnes pratiques a garder en tete : utilisez un mot de passe unique par service (jamais le meme partout), activez la double authentification (2FA) partout ou c'est possible, et stockez vos mots de passe dans un gestionnaire dedie (Bitwarden, 1Password, KeePass). Nos generateurs sont parfaits pour creer des mots de passe forts que vous enregistrez ensuite dans votre gestionnaire.

Rappel important : tous les mots de passe sont generes par le moteur cryptographique de votre navigateur (crypto.getRandomValues). Ils ne sont jamais envoyes, stockes ou enregistres nulle part. Une fois que vous quittez la page, le mot de passe n'existe plus que dans votre presse-papiers.`,
    faqItems: [
      {
        question:
          "Comment savoir si mon mot de passe est suffisamment fort ?",
        answer:
          "L'indicateur de force de nos outils mesure l'entropie en bits. En dessous de 40 bits, le mot de passe est faible (a eviter). Entre 60 et 80 bits, il est correct pour des comptes non critiques. Au-dessus de 80 bits, il est fort. Pour vos comptes bancaires, email principal et gestionnaire de mots de passe, visez 100+ bits (16 caracteres avec les 4 types).",
      },
      {
        question:
          "Les mots de passe generes sont-ils vraiment aleatoires ?",
        answer:
          "Oui. Nos generateurs utilisent l'API Web Crypto du navigateur (crypto.getRandomValues), qui fournit des nombres cryptographiquement aleatoires. Ce n'est pas un simple Math.random() — c'est le meme niveau de qualite aleatoire que celui utilise pour le chiffrement TLS de votre connexion bancaire.",
      },
      {
        question:
          "Faut-il changer ses mots de passe regulierement ?",
        answer:
          "Les recommandations ont evolue. Le NIST (autorite americaine en cybersecurite) et l'ANSSI (son equivalent francais) ne recommandent plus le changement periodique obligatoire. Changez un mot de passe uniquement s'il a ete compromis (fuite de donnees, phishing). L'important est d'avoir des mots de passe uniques, longs et aleatoires, stockes dans un gestionnaire.",
      },
    ],
  },

  conversion: {
    name: "Conversion",
    icon: "\u{1F504}",
    intro:
      "Convertissez instantanement entre les unites de mesure les plus courantes : longueur, poids, temperature, temps, et meme tailles de vetements. Des tableaux de correspondance complets et des conversions bidirectionnelles.",
    useCases: [
      "Convertir des kilometres en miles ou des kilogrammes en livres pour des produits internationaux",
      "Passer rapidement de Celsius a Fahrenheit pour une recette americaine",
      "Trouver la correspondance de taille de vetement entre les systemes EU, US et UK",
      "Convertir des durees entre secondes, minutes, heures, jours et semaines",
    ],
    guide: `La conversion d'unites est un besoin universel que l'on rencontre dans des contextes tres varies : cuisine (onces en grammes), bricolage (pouces en centimetres), voyage (miles en kilometres, Fahrenheit en Celsius), e-commerce international (tailles de vetements), programmation (millisecondes en heures). Nos convertisseurs couvrent les cas d'usage les plus frequents avec une interface simple et des resultats precis.

Le convertisseur d'unites est notre outil le plus polyvalent. Il gere 5 categories de mesures : longueur (mm, cm, m, km, pouces, pieds, yards, miles), poids (mg, g, kg, tonnes, onces, livres), temperature (Celsius, Fahrenheit, Kelvin), surface (mm2, cm2, m2, hectares, km2, pieds carres, acres), et volume (ml, cl, l, cm3, m3, gallons, onces liquides). Chaque conversion affiche la formule utilisee et permet la conversion inverse en un clic.

La temperature merite son propre outil car les formules ne sont pas lineaires. Celsius a Fahrenheit : (C x 9/5) + 32. Fahrenheit a Celsius : (F - 32) x 5/9. Celsius a Kelvin : C + 273,15. Notre convertisseur inclut un thermometre visuel et des reperes pratiques : 0°C = point de congelation de l'eau, 37°C = temperature corporelle, 100°C = point d'ebullition, 180°C = four moyen pour la patisserie. C'est particulierement utile quand vous suivez une recette americaine qui indique "350°F" — c'est 177°C, donc un four a 180°C.

Le convertisseur de temps gere la conversion entre toutes les unites temporelles courantes : secondes, minutes, heures, jours, semaines, mois et annees. Un mois est compte comme 30,4375 jours (365,25/12), et une annee comme 365,25 jours pour tenir compte des annees bissextiles. C'est utile pour les developpeurs qui travaillent avec des timestamps en millisecondes, pour les gestionnaires de projet qui planifient en semaines, ou pour calculer la duree d'un contrat.

Le convertisseur de tailles de vetements est un must pour l'achat en ligne international. Les systemes de tailles varient entre l'Europe (36, 38, 40...), les Etats-Unis (S, M, L ou 4, 6, 8...) et le Royaume-Uni (8, 10, 12...). Notre tableau couvre les vetements et les chaussures, pour homme et femme, avec les correspondances exactes par pays. Astuce : prenez toujours une taille au-dessus en cas de doute, surtout pour les marques asiatiques qui taillent souvent plus petit.`,
    faqItems: [
      {
        question:
          "Les conversions sont-elles precises au centime pres ?",
        answer:
          "Oui. Nos conversions utilisent les facteurs officiels du Systeme International (SI) et de la norme ISO. Les resultats sont affiches avec une precision de 6 decimales maximum, mais vous pouvez copier la valeur exacte. Pour les tailles de vetements, les correspondances suivent les tableaux des normes europeennes (EN 13402).",
      },
      {
        question:
          "Pourquoi la conversion de temperature n'est-elle pas lineaire ?",
        answer:
          "Les echelles Celsius et Fahrenheit ont des points zero et des increments differents. 0°C = 32°F, pas 0°F. Et 1 degre Celsius represente 1,8 degres Fahrenheit. C'est pourquoi il faut une formule (et pas un simple facteur multiplicatif) : °F = (°C x 1,8) + 32.",
      },
      {
        question:
          "Les tailles de vetements sont-elles fiables pour l'achat en ligne ?",
        answer:
          "Nos tableaux donnent les correspondances standard selon les normes internationales. Cependant, chaque marque peut avoir des ecarts. H&M taille generalement grand, Zara plutot petit. Pour les achats importants, consultez toujours le guide des tailles specifique de la marque en complement de notre convertisseur.",
      },
    ],
  },

  texte: {
    name: "Texte",
    icon: "\u{1F4DD}",
    intro:
      "Des outils pour analyser et manipuler du texte : compteur de mots, generateur Lorem Ipsum et stylisation Unicode. Parfaits pour les redacteurs, les etudiants et les community managers.",
    useCases: [
      "Compter les mots, caracteres et phrases d'un texte pour respecter une limite imposee",
      "Generer du texte Lorem Ipsum pour remplir des maquettes et prototypes",
      "Convertir du texte en gras, italique ou monospace Unicode pour les reseaux sociaux",
    ],
    guide: `Le texte est la matiere premiere du web. Que vous redigiez un article de blog, un post LinkedIn, un memoire universitaire, ou que vous mettiez en page une maquette, ces outils vous font gagner du temps au quotidien.

Le compteur de mots est l'outil de reference pour les redacteurs. Au-dela du simple decompte de mots, il analyse votre texte en profondeur : nombre de caracteres (avec et sans espaces), nombre de phrases, nombre de paragraphes. Il estime aussi le temps de lecture (base sur une vitesse moyenne de 200 mots par minute pour un texte courant, 150 pour un texte technique) et le temps de parole (130 mots par minute en presentation orale). C'est indispensable quand vous devez respecter une limite : 300 mots pour une meta description longue, 2 000-3 000 mots pour un article SEO, 500 mots pour un post LinkedIn, ou les 280 caracteres d'un tweet.

Le generateur Lorem Ipsum produit du texte factice en pseudo-latin pour remplir vos maquettes et prototypes. Vous choisissez le nombre de paragraphes, phrases ou mots. Le texte genere reproduit la distribution statistique du latin classique (longueur des mots, des phrases), ce qui donne un rendu visuel realiste sans distraire le lecteur par un contenu significatif. C'est la norme dans le design depuis l'invention de la typographie. Astuce : si vous voulez un aspect plus "naturel" en francais, vous pouvez generer un Lorem Ipsum et le completer avec quelques vraies phrases.

Le generateur de texte stylise Unicode est l'arme secrete des community managers. Les reseaux sociaux (LinkedIn, Instagram, Twitter, Facebook) n'acceptent pas le HTML — impossible de mettre du texte en gras ou en italique nativement. Mais les caracteres Unicode incluent des variantes stylistiques qui ressemblent a du gras, de l'italique, du monospace, des lettres cerclees, du barre, et bien d'autres. Notre outil convertit votre texte dans ces styles en un clic. Attention a l'accessibilite : les lecteurs d'ecran ne lisent pas toujours correctement ces caracteres, utilisez-les donc avec parcimonie pour des elements decoratifs (titres, mise en valeur) plutot que pour le corps du texte.

Conseil pratique pour le SEO : Google recommande des meta descriptions de 150-160 caracteres et des titres de 50-60 caracteres. Utilisez le compteur de mots pour verifier que vos metadonnees respectent ces limites. Un titre tronque dans les resultats de recherche perd en efficacite et en taux de clic.`,
    faqItems: [
      {
        question:
          "Le compteur de mots gere-t-il les caracteres speciaux et les emojis ?",
        answer:
          "Oui. Le compteur traite correctement les caracteres accentues francais, les emojis, les caracteres CJK (chinois, japonais, coreen) et les caracteres speciaux. Les emojis comptent comme un caractere chacun. Les mots sont separes par les espaces et les retours a la ligne.",
      },
      {
        question:
          "Les textes stylises Unicode fonctionnent-ils partout ?",
        answer:
          "Ils fonctionnent sur la plupart des plateformes modernes : LinkedIn, Twitter, Facebook, Instagram, WhatsApp, Telegram. En revanche, ils peuvent s'afficher incorrectement dans certains clients email anciens ou sur des systemes qui ne supportent pas Unicode 10+. Testez toujours le rendu avant de publier.",
      },
      {
        question:
          "Puis-je generer du Lorem Ipsum en francais ?",
        answer:
          "Notre generateur produit du Lorem Ipsum classique en pseudo-latin, qui est le standard international. Le texte latin a l'avantage d'etre visuellement neutre et de ne pas distraire lors de la revue de maquettes. Si vous avez besoin de texte factice en francais, vous pouvez utiliser notre outil puis remplacer manuellement les premiers mots par du francais pour l'aspect visuel.",
      },
    ],
  },

  legal: {
    name: "Legal",
    icon: "\u{2696}\uFE0F",
    intro:
      "Generez les documents juridiques obligatoires pour votre site web : mentions legales et politique de confidentialite conformes au RGPD. Remplissez un formulaire, obtenez un texte pret a publier.",
    useCases: [
      "Generer des mentions legales conformes pour votre site web professionnel ou personnel",
      "Creer une politique de confidentialite RGPD adaptee a votre activite",
    ],
    guide: `En France, tout site web accessible au public doit afficher des mentions legales (article 6 de la LCEN, loi pour la confiance dans l'economie numerique). L'absence de mentions legales est passible d'une amende pouvant aller jusqu'a 75 000 euros pour une personne physique et 375 000 euros pour une personne morale. Si votre site collecte des donnees personnelles (formulaire de contact, newsletter, analytics, cookies), vous devez egalement publier une politique de confidentialite conforme au RGPD.

Notre generateur de mentions legales produit un texte complet et a jour qui inclut toutes les informations obligatoires : identite de l'editeur (nom, prenom ou raison sociale, adresse, numero de telephone, email), numero SIRET pour les professionnels, directeur de la publication, hebergeur du site (nom, adresse, telephone), et le cas echeant le numero RCS, le capital social et le numero de TVA intracommunautaire. Vous remplissez un formulaire avec vos informations, et l'outil genere un texte structure, pret a copier-coller sur votre site.

La politique de confidentialite est le document qui explique aux visiteurs quelles donnees vous collectez, pourquoi, comment vous les traitez, et quels sont leurs droits. Depuis l'entree en vigueur du RGPD en mai 2018, les exigences se sont considerablement renforcees. Notre generateur vous guide a travers les points essentiels : finalite du traitement, base legale (consentement, interet legitime, obligation contractuelle), duree de conservation, destinataires des donnees, transferts hors UE, droits des personnes (acces, rectification, suppression, portabilite, opposition), et coordonnees du DPO si applicable.

Le document genere est un excellent point de depart. Pour la plupart des sites vitrines, blogs et petits e-commerces, il sera suffisant tel quel. Pour des activites plus complexes (marketplace, application mobile avec geolocalisation, traitement de donnees de sante), nous recommandons de faire valider le document par un juriste specialise en droit du numerique. Le cout d'une consultation juridique (200-500 euros) est negligeable compare aux amendes potentielles de la CNIL.

Points de vigilance en 2026 : la CNIL renforce ses controles sur les cookies et traceurs. Si vous utilisez Google Analytics, vous devez obtenir le consentement explicite des visiteurs avant de charger le script. Les bannieres de cookies "tout accepter" sans option "tout refuser" equivalente ne sont plus conformes. Notre generateur integre ces evolutions reglementaires.`,
    faqItems: [
      {
        question:
          "Les mentions legales generees sont-elles juridiquement valides ?",
        answer:
          "Nos mentions legales incluent toutes les informations requises par la LCEN (loi n°2004-575 du 21 juin 2004). Elles sont a jour des obligations en vigueur en 2026. Pour un site vitrine, blog ou petit e-commerce, elles sont suffisantes. Pour des activites reglementees (finance, sante, immobilier), des mentions specifiques peuvent etre requises — consultez un juriste.",
      },
      {
        question:
          "Dois-je mettre a jour ma politique de confidentialite regulierement ?",
        answer:
          "Oui, a chaque changement dans votre traitement de donnees : ajout d'un nouvel outil d'analytics, d'un service tiers (chat en ligne, CRM), changement d'hebergeur, ou modification des finalites de traitement. La CNIL recommande une revision au moins annuelle meme sans changement majeur.",
      },
      {
        question:
          "Mon blog personnel a-t-il besoin de mentions legales ?",
        answer:
          "Oui. Tout site web accessible au public, meme un blog personnel sans activite commerciale, doit afficher des mentions legales. Les personnes physiques peuvent indiquer le nom de leur hebergeur plutot que leur adresse personnelle. La politique de confidentialite n'est obligatoire que si vous collectez des donnees (formulaire, analytics, cookies).",
      },
    ],
  },

  carriere: {
    name: "Carriere",
    icon: "\u{1F4C8}",
    intro:
      "Comparez les statuts professionnels et optimisez vos choix de carriere. Notre simulateur Freelance vs CDI vous aide a prendre des decisions eclairees en comparant revenus nets, charges et avantages sociaux.",
    useCases: [
      "Comparer votre salaire CDI avec un equivalent en TJM freelance",
      "Evaluer l'impact du passage en freelance sur votre revenu net",
      "Comprendre les differences de charges sociales entre micro-entreprise, EURL et SASU",
      "Simuler differents scenarios de TJM pour negocier avec des clients",
    ],
    guide: `Le choix entre le salariat et le freelancing est l'une des decisions professionnelles les plus impactantes. En France, les deux statuts offrent des avantages et des inconvenients tres differents, et la comparaison ne se resume pas a un simple calcul de revenus. Notre outil Freelance vs CDI vous donne une vision complete et chiffree.

En CDI, votre salaire brut subit environ 22 a 25% de cotisations salariales avant d'arriver sur votre compte. Mais vous beneficiez de la Securite sociale, de la retraite complementaire Agirc-Arrco, du chomage, des conges payes (5 semaines + RTT eventuels), et d'une protection en cas de licenciement. Le cout total pour l'employeur est d'environ 1,5 fois votre salaire brut (charges patronales incluses). Quand un recruteur vous dit "le budget est de 60K", votre net mensuel sera d'environ 3 700 euros.

En freelance, la donne change completement. Un auto-entrepreneur en prestation de services paie 21,2% de cotisations sur son chiffre d'affaires, mais n'a pas de conges payes, pas de chomage, et une retraite reduite. En EURL a l'IS, les cotisations TNS (Travailleur Non Salarie) tournent autour de 45% de la remuneration nette, mais vous pouvez deduire vos frais professionnels et optimiser entre remuneration et dividendes. En SASU, vous etes assimile salarie avec des cotisations plus elevees (environ 80% du net en charges patronales + salariales) mais une meilleure couverture sociale.

Notre simulateur prend en compte tous ces parametres : statut juridique, TJM ou CA annuel, nombre de jours travailles (en deduisant les conges, jours feries et jours d'intercontrat), frais professionnels, et option pour le versement liberatoire de l'impot. Il calcule le revenu net apres charges et impots dans chaque scenario et les place cote a cote pour faciliter la comparaison.

Quelques reperes pratiques : pour egaliser un salaire net CDI de 3 000 euros par mois, un freelance auto-entrepreneur doit facturer environ 55 000 euros HT par an, soit un TJM de 350 euros sur 160 jours factures. En EURL, le TJM monte a environ 450 euros pour le meme net, mais avec la possibilite de deduire les frais et d'optimiser fiscalement. Ce sont des ordres de grandeur — notre simulateur vous donne les chiffres exacts pour votre situation.`,
    faqItems: [
      {
        question:
          "Le simulateur prend-il en compte l'ACRE ?",
        answer:
          "Oui. L'ACRE (Aide a la Creation ou a la Reprise d'Entreprise) reduit de moitie les cotisations sociales la premiere annee d'activite. Notre simulateur permet d'activer cette option pour voir l'impact sur votre revenu net la premiere annee. Attention : l'ACRE n'est plus automatique depuis 2020, il faut en faire la demande.",
      },
      {
        question:
          "Comment sont calcules les jours facturables ?",
        answer:
          "Sur 365 jours, on retire les week-ends (104 jours), les jours feries (environ 8 jours ouvrables), les conges (25 jours minimum), et les jours d'intercontrat/prospection (15 a 30 jours selon le secteur). Il reste en moyenne 200 a 220 jours ouvrables, dont 160 a 180 reellement facturables. Notre simulateur utilise 218 jours ouvrables par defaut, ajustables.",
      },
      {
        question:
          "Le versement liberatoire est-il toujours avantageux ?",
        answer:
          "Non. Le versement liberatoire (1% a 2,2% du CA selon l'activite) est avantageux si votre taux marginal d'imposition est superieur a ces pourcentages, c'est-a-dire si votre foyer fiscal est dans une tranche a 11% ou plus. Si votre revenu fiscal est faible (tranche a 0%), le versement liberatoire vous fait payer de l'impot inutilement.",
      },
    ],
  },

  retraite: {
    name: "Retraite",
    icon: "\u{1F9D3}",
    intro:
      "Simulez votre depart a la retraite selon la reforme 2023 : age legal, trimestres requis, decote et surcote. Notre calculateur prend en compte votre annee de naissance et votre carriere pour estimer votre age de depart.",
    useCases: [
      "Connaitre votre age legal de depart a la retraite selon votre annee de naissance",
      "Calculer le nombre de trimestres requis pour une retraite a taux plein",
      "Estimer l'impact d'une decote ou d'une surcote sur votre pension",
      "Planifier votre fin de carriere en fonction de l'age pivot",
    ],
    guide: `La reforme des retraites de 2023 a releve progressivement l'age legal de depart de 62 a 64 ans, avec un calendrier echelonne par generation. Comprendre ses droits et anticiper son depart est essentiel pour planifier sa fin de carriere et, le cas echeant, ajuster son epargne retraite supplementaire.

Le principe de base du systeme francais de retraite repose sur deux piliers : l'age legal et la duree de cotisation. L'age legal est celui a partir duquel vous pouvez partir, meme si vous n'avez pas tous vos trimestres. Avec la reforme 2023, il passe progressivement a 64 ans pour les generations nees a partir de 1968. Pour les generations intermediaires, l'augmentation est de 3 mois par an de naissance : ne en 1961, vous partez a 62 ans et 3 mois ; ne en 1962, a 62 ans et 6 mois ; et ainsi de suite.

La duree de cotisation requise pour le taux plein augmente egalement. Elle atteint 172 trimestres (43 ans) pour les generations nees a partir de 1965. Si vous partez a l'age legal sans avoir tous vos trimestres, une decote s'applique : 1,25% par trimestre manquant (dans la limite de 20 trimestres), soit jusqu'a 25% de reduction sur votre pension. A l'inverse, si vous continuez a travailler au-dela de l'age du taux plein avec tous vos trimestres, vous beneficiez d'une surcote de 1,25% par trimestre supplementaire, sans limite.

Notre calculateur prend en compte votre annee de naissance, le nombre de trimestres deja valides, et votre situation particuliere (carriere longue, handicap, penibilite). Il calcule votre age legal, le nombre de trimestres restants a valider, et la date la plus precoce a laquelle vous pourrez partir a taux plein.

A noter : le dispositif "carriere longue" permet un depart anticipe pour ceux qui ont commence a travailler avant 16, 18 ou 20 ans, sous conditions de duree de cotisation majoree. Le depart anticipe pour handicap reste possible des 55 ans sous conditions. L'age d'annulation de la decote (le fameux "taux plein automatique") reste fixe a 67 ans quelle que soit la generation.

Conseil : meme si votre retraite semble lointaine, verifier regulierement votre releve de carriere sur info-retraite.fr permet de detecter des erreurs (trimestres manquants, periodes non comptabilisees) et de les corriger avant qu'il ne soit trop tard. Notre calculateur vous aide a comprendre les chiffres de ce releve.`,
    faqItems: [
      {
        question:
          "La reforme 2023 s'applique-t-elle a tout le monde ?",
        answer:
          "La reforme concerne les salaries du prive, les fonctionnaires et la plupart des regimes speciaux. Le relevement de l'age legal s'applique progressivement aux personnes nees a partir du 1er septembre 1961. Les generations nees avant cette date ne sont pas impactees par le recul de l'age legal, mais la duree de cotisation pour le taux plein peut avoir augmente.",
      },
      {
        question:
          "Qu'est-ce que le dispositif carriere longue ?",
        answer:
          "Le dispositif carriere longue permet un depart anticipe (avant l'age legal) pour les personnes ayant commence a travailler tot. Il faut avoir cotise au moins 5 trimestres avant 16, 18 ou 20 ans, et justifier d'une duree d'assurance majoree. Avec la reforme 2023, de nouvelles bornes d'age ont ete creees : depart possible a 58, 60, 62 ou 63 ans selon l'age de debut de carriere.",
      },
      {
        question:
          "Comment calculer le montant de ma pension ?",
        answer:
          "Le montant de la pension de base se calcule ainsi : salaire annuel moyen des 25 meilleures annees x taux (50% au taux plein) x (nombre de trimestres cotises / nombre de trimestres requis). A cela s'ajoute la retraite complementaire Agirc-Arrco (points accumules x valeur du point). Notre outil se concentre sur l'age de depart et les trimestres. Pour une estimation complete du montant, rendez-vous sur info-retraite.fr.",
      },
    ],
  },

  design: {
    name: "Design",
    icon: "\u{1F3A8}",
    intro:
      "Des outils pour les designers et les developpeurs front-end : convertisseur de couleurs, generateur d'avatar et generateur de gradient CSS. Creez des visuels et des styles rapidement sans ouvrir Figma ou Photoshop.",
    useCases: [
      "Convertir une couleur HEX en RGB ou HSL pour un fichier CSS ou un design system",
      "Generer un avatar avec initiales pour un profil utilisateur ou une application",
      "Creer un degrade CSS lineaire ou radial avec apercu et code copie en un clic",
    ],
    guide: `Le design web et mobile repose sur des details : les bonnes couleurs, les bons degrades, les bons visuels de profil. Nos outils design simplifient les taches recurrentes que meme les designers experimentés font plusieurs fois par jour.

Le convertisseur de couleurs est l'outil le plus utilise. En design, on manipule trois formats principaux : HEX (#0d4f3c), RGB (rgb(13, 79, 60)), et HSL (hsl(160, 72%, 18%)). Chaque format a ses avantages. Le HEX est compact et universel dans le CSS. Le RGB est intuitif pour mixer les couleurs primaires. Le HSL est le plus pratique pour ajuster une couleur : la teinte (H) selectionne la couleur sur le cercle chromatique, la saturation (S) regle l'intensite, et la luminosite (L) va du noir au blanc. Besoin d'un vert plus clair ? Augmentez le L. Besoin d'un vert plus pastel ? Reduisez le S. Notre outil permet de convertir instantanement entre les trois formats, avec un color picker et des sliders pour ajuster finement.

Le generateur d'avatar produit des cercles colores avec des initiales, dans differents styles. C'est la solution standard pour les applications qui n'ont pas encore de photo de profil utilisateur. Au lieu d'afficher un pictogramme generique gris, vous generez un avatar colore et personnalise. Les couleurs sont derivees du nom pour etre coherentes (le meme nom donne toujours la meme couleur). L'export en PNG haute resolution permet l'integration dans n'importe quelle application.

Le generateur de gradient CSS cree des degrades visuellement riches avec un code CSS pret a l'emploi. Les tendances design 2025-2026 font la part belle aux degrades subtils : du quasi-blanc au gris tres leger pour les fonds de cartes, ou des degrades vifs pour les boutons CTA et les bannieres. L'outil supporte les degrades lineaires (avec angle personnalisable), radiaux (circulaires ou elliptiques), et coniques. Vous choisissez les couleurs avec un color picker, ajustez les points d'arret, et le code CSS se met a jour en temps reel. Les presets incluent des degrades populaires comme "Sunset", "Ocean", "Aurora" et "Midnight" pour demarrer rapidement.

Astuce design : pour un degrade de fond subtil et elegant, utilisez deux couleurs proches sur le cercle chromatique avec une faible variation de luminosite. Par exemple, #faf9f6 vers #f0ede8 (les couleurs de fond d'Outilis.fr) donne un effet papier chaud tres agreable. Pour un CTA accrocheur, un degrade entre votre couleur primaire et une teinte adjacente (par exemple, vert vers bleu-vert) attire l'oeil sans etre agressif.`,
    faqItems: [
      {
        question:
          "Quelle est la difference entre HEX, RGB et HSL ?",
        answer:
          "HEX est un code hexadecimal compact (#FF5733). RGB decrit les composantes rouge, vert, bleu de 0 a 255. HSL decrit la teinte (0-360°), la saturation (0-100%) et la luminosite (0-100%). Les trois representent la meme couleur, juste sous des angles differents. Utilisez HEX dans le CSS, RGB pour le melange programmatique de couleurs, et HSL pour les ajustements visuels.",
      },
      {
        question:
          "Les avatars generes sont-ils uniques ?",
        answer:
          "Les avatars sont determines par les initiales et le style choisi. Deux personnes avec les memes initiales auront un avatar similaire, mais les couleurs sont derivees du texte complet, ce qui les differencie. Pour des avatars vraiment uniques, variez les styles disponibles.",
      },
      {
        question:
          "Les degrades CSS generes sont-ils compatibles avec tous les navigateurs ?",
        answer:
          "Oui. Les proprietes CSS linear-gradient, radial-gradient et conic-gradient sont supportees par tous les navigateurs modernes (Chrome, Firefox, Safari, Edge). Le conic-gradient necessite Safari 12.1+ ou Chrome 69+. Pour les navigateurs anciens, l'outil genere aussi une couleur de fallback en background-color.",
      },
    ],
  },

  travail: {
    name: "Travail",
    icon: "\u{23F0}",
    intro:
      "Gerez votre temps de travail avec precision : heures travaillees, pauses, heures supplementaires et totaux hebdomadaires. Un outil conforme au Code du travail francais pour salaries et employeurs.",
    useCases: [
      "Calculer vos heures travaillees sur une journee ou une semaine en deduisant les pauses",
      "Compter vos heures supplementaires et leur majoration (25% puis 50%)",
      "Suivre votre temps de travail pour une feuille de pointage",
      "Verifier le respect des durees maximales legales de travail",
    ],
    guide: `Le Code du travail francais encadre strictement la duree du travail. La duree legale est de 35 heures par semaine, avec des durees maximales de 10 heures par jour, 48 heures par semaine, et 44 heures en moyenne sur 12 semaines consecutives. Les pauses sont obligatoires : au minimum 20 minutes consecutives pour 6 heures de travail continu. Notre calculateur vous aide a suivre votre temps de travail et a verifier le respect de ces regles.

L'outil fonctionne simplement : vous saisissez vos heures d'arrivee et de depart pour chaque jour, ainsi que vos pauses (dejeuner, pauses courtes). Le calcul donne le nombre d'heures travaillees par jour et le total hebdomadaire. Les heures supplementaires sont automatiquement identifiees et majorees selon le Code du travail : 25% pour les 8 premieres heures supplementaires (de la 36e a la 43e heure), puis 50% au-dela.

Pour les salaries en forfait jours (cadres autonomes), le calcul est different puisque le temps de travail n'est pas decompte en heures mais en jours. Le plafond legal est de 218 jours par an. Notre outil peut aussi servir dans ce contexte pour verifier que les amplitudes journalieres respectent le repos obligatoire de 11 heures entre deux journees de travail.

Ce calculateur est particulierement utile pour les salaries en temps partiel qui doivent verifier que leurs heures complementaires (au-dela du temps contractuel mais en dessous de 35h) sont bien majorees de 10%, et pour les employeurs de TPE qui gerent le pointage manuellement. Il sert aussi aux freelances et independants pour tracker le temps passe sur chaque mission et s'assurer que le TJM facture correspond bien au temps reel investi.

Bon a savoir : les conventions collectives peuvent prevoir des regles differentes du Code du travail sur les majorations d'heures supplementaires, les temps de pause ou les durees maximales. Verifiez toujours votre convention collective (Syntec, Metallurgie, Commerce, etc.) pour les specificites applicables a votre secteur.`,
    faqItems: [
      {
        question:
          "Les heures supplementaires sont-elles obligatoirement majorees ?",
        answer:
          "Oui, sauf si un accord d'entreprise ou de branche prevoit un taux different (minimum 10%). A defaut d'accord, les taux legaux s'appliquent : 25% pour les 8 premieres heures sup (36e a 43e heure) et 50% au-dela. Certaines conventions collectives prevoient des taux plus favorables.",
      },
      {
        question:
          "Quelle est la duree maximale de travail autorisee ?",
        answer:
          "10 heures par jour (derogation possible a 12h par accord ou en cas d'activite accrue), 48 heures par semaine (derogation possible a 60h sur autorisation de l'inspection du travail), et 44 heures en moyenne sur 12 semaines consecutives (derogation possible a 46h par accord).",
      },
      {
        question:
          "Le temps de pause dejeuner est-il compte comme du temps de travail ?",
        answer:
          "Non, en general. La pause dejeuner n'est pas du temps de travail effectif si vous etes libre de vaquer a vos occupations (quitter votre poste, sortir de l'entreprise). En revanche, si vous devez rester a disposition de votre employeur pendant la pause, elle doit etre comptee et remuneree comme du temps de travail.",
      },
    ],
  },

  maths: {
    name: "Maths",
    icon: "\u{1F4CA}",
    intro:
      "Des calculateurs mathematiques pour les calculs du quotidien : pourcentages, surfaces, volumes. Des outils simples qui evitent les erreurs de calcul mental et les approximations hasardeuses.",
    useCases: [
      "Calculer X% de Y, une variation en pourcentage, ou la part d'un total",
      "Calculer l'aire d'un rectangle, cercle, triangle ou trapeze en m2",
      "Convertir des surfaces entre differentes unites (m2, hectares, pieds carres)",
    ],
    guide: `Les mathematiques du quotidien ne sont pas de l'algebre complexe — ce sont des pourcentages, des surfaces, des volumes, des regles de trois. Des calculs simples en theorie, mais ou les erreurs de calcul mental peuvent couter cher : se tromper de 10% sur un pourcentage de remise, mal calculer la surface d'une piece pour commander du carrelage, ou sous-estimer le volume d'un demenagement.

Le calculateur de pourcentage couvre les trois cas d'usage les plus frequents. Premier mode : combien font X% de Y ? (exemple : 20% de 1 500 = 300). Deuxieme mode : quelle est la variation entre deux nombres ? (passer de 1 200 a 1 500 = +25%). Troisieme mode : quelle part represente A dans B ? (300 sur 1 500 = 20%). Ces calculs reviennent constamment dans la vie courante : soldes (-30% sur le prix initial), augmentations de loyer (+3,5%), rendements financiers, statistiques sportives, notes scolaires.

Le calculateur de surface gere les formes geometriques les plus courantes. Le rectangle (longueur x largeur) pour les pieces d'une maison. Le cercle (pi x rayon au carre) pour les piscines rondes, les tables, les pizzas. Le triangle (base x hauteur / 2) pour les combles, les terrains en pente. Le trapeze ((grande base + petite base) x hauteur / 2) pour les parcelles irregulieres. Le resultat s'affiche en metres carres avec conversion automatique en d'autres unites : centimetres carres, hectares, pieds carres, acres. C'est indispensable avant de commander des materiaux de construction, de la peinture, du parquet ou du gazon.

Conseil pratique pour les surfaces : ajoutez toujours 10 a 15% de marge par rapport au calcul theorique. Pour du carrelage, les coupes et les casses representent environ 10% de perte. Pour de la peinture, le deuxieme couche consomme un peu moins que la premiere mais il faut quand meme prevoir. Pour du gazon en rouleau, les decoupes aux bords representent 5 a 10% de perte selon la forme du terrain.

Ces outils sont aussi utiles pour les etudiants qui veulent verifier leurs exercices de maths, les commercants qui calculent des marges et des remises, ou les investisseurs qui evaluent des rendements. La simplicite est deliberee : pas de fonctions avancees qui complexifient l'interface, juste le calcul demande, le resultat, et la formule utilisee pour comprendre la methode.`,
    faqItems: [
      {
        question:
          "Quelle est la formule pour calculer un pourcentage de variation ?",
        answer:
          "La formule est : ((nouvelle valeur - ancienne valeur) / ancienne valeur) x 100. Par exemple, passer de 1 200 a 1 500 : ((1 500 - 1 200) / 1 200) x 100 = 25%. Un resultat positif indique une hausse, negatif une baisse.",
      },
      {
        question:
          "Comment calculer la surface d'une piece en L ?",
        answer:
          "Decomposez la piece en deux rectangles, calculez la surface de chacun, et additionnez les resultats. Par exemple, une piece en L de 5x4m et 3x2m : (5 x 4) + (3 x 2) = 20 + 6 = 26 m2. Notre calculateur gere les formes simples — pour les formes complexes, decomposez-les en formes simples.",
      },
      {
        question:
          "Les arrondis sont-ils pris en compte dans les calculs ?",
        answer:
          "Nos calculateurs affichent les resultats avec 2 decimales par defaut pour les pourcentages et les surfaces. Le calcul interne utilise la precision maximale de JavaScript (15-16 chiffres significatifs). Pour des besoins de precision extreme (ingenierie, arpentage), des outils specialises sont recommandes.",
      },
    ],
  },

  auto: {
    name: "Auto",
    icon: "\u{1F697}",
    intro:
      "Des calculateurs automobiles pour maitriser votre budget voiture : frais kilometriques au bareme fiscal officiel, consommation d'essence et cout par trajet. Indispensables pour les declarations d'impots et la gestion du budget transport.",
    useCases: [
      "Calculer vos frais kilometriques deductibles au bareme fiscal officiel",
      "Estimer votre consommation en L/100km et le cout de vos trajets",
      "Comparer le cout reel d'un trajet en voiture vs transports en commun",
      "Preparer votre declaration d'impots avec la deduction des frais reels",
    ],
    guide: `Le budget automobile est souvent le deuxieme poste de depenses des menages francais apres le logement. Entre le carburant, l'assurance, l'entretien, le financement et les frais de stationnement, le cout reel d'une voiture peut facilement depasser 500 euros par mois. Nos calculateurs vous aident a y voir clair et a optimiser ce budget.

Le calculateur de frais kilometriques utilise le bareme fiscal officiel publie chaque annee par l'administration. Ce bareme est essentiel pour les salaries qui optent pour la deduction des frais reels (au lieu de l'abattement forfaitaire de 10%) dans leur declaration d'impots. Il prend en compte la puissance fiscale du vehicule (en CV) et le nombre de kilometres parcourus dans l'annee. Par exemple, pour un vehicule de 5 CV parcourant 15 000 km par an, le bareme 2025 donne environ 6 000 euros de frais deductibles — bien plus que les 10% forfaitaires dans de nombreux cas. Depuis 2023, les vehicules electriques beneficient d'une majoration de 20% du bareme, un avantage non negligeable.

Le calculateur de consommation d'essence fonctionne dans les deux sens. Premier mode : vous entrez les litres consommes et les kilometres parcourus, et l'outil calcule votre consommation en L/100km. Deuxieme mode : vous entrez votre consommation moyenne, la distance d'un trajet et le prix du carburant, et l'outil calcule le cout du trajet. C'est particulierement utile pour les longs trajets (vacances, deplacements professionnels) : un Paris-Lyon (460 km) en voiture consommant 7L/100km a 1,70 euro/L coute environ 55 euros de carburant aller — a comparer avec un billet de TGV a 30-90 euros.

Quelques conseils pour reduire votre consommation : une conduite souple (sans a-coups) peut reduire la consommation de 15 a 20%. La pression des pneus est cruciale : des pneus sous-gonfles de 0,5 bar augmentent la consommation de 2,5%. La climatisation ajoute 10 a 20% de consommation en ville (moins sur autoroute). Et les galeries de toit vides augmentent la trainee aerodynamique et la consommation de 10 a 15%.

Pour les professionnels qui se deplacent regulierement, le choix entre frais reels et abattement forfaitaire merite un calcul precis chaque annee. Nos outils vous donnent les chiffres pour prendre la bonne decision. N'oubliez pas que les frais reels incluent aussi les peages, le stationnement et les interets d'emprunt du vehicule — pas seulement le kilometrage.`,
    faqItems: [
      {
        question:
          "Le bareme kilometrique est-il mis a jour chaque annee ?",
        answer:
          "Oui. Le bareme est publie chaque annee par arrete ministeriel, generalement en mars pour la declaration des revenus de l'annee precedente. Nous mettons a jour l'outil des la publication officielle. La majoration de 20% pour les vehicules electriques est integree automatiquement.",
      },
      {
        question:
          "Comment choisir entre frais reels et abattement de 10% ?",
        answer:
          "Faites le calcul avec notre outil : si vos frais kilometriques (+ autres frais professionnels : repas, double residence, formation) depassent 10% de votre salaire brut, optez pour les frais reels. C'est generalement avantageux si vous parcourez plus de 12 000-15 000 km/an pour le travail, selon votre salaire et la puissance de votre vehicule.",
      },
      {
        question:
          "Le calculateur prend-il en compte les peages ?",
        answer:
          "Le calculateur de consommation d'essence se concentre sur le cout du carburant. Les peages sont un poste a part. Pour les frais kilometriques fiscaux, le bareme couvre l'ensemble des couts du vehicule (carburant, assurance, entretien, depreciation) mais pas les peages et le stationnement, qui sont deductibles en supplement si vous optez pour les frais reels.",
      },
    ],
  },

  shopping: {
    name: "Shopping",
    icon: "\u{1F6D2}",
    intro:
      "Calculez vos economies en un clin d'oeil. Notre calculateur de remise vous montre le prix final apres reduction, le montant economise, et gere les remises en cascade — indispensable pendant les soldes et le Black Friday.",
    useCases: [
      "Calculer le prix apres une remise de -30% sur un article en solde",
      "Cumuler plusieurs remises (-20% puis -10% supplementaires) pour voir le prix final reel",
      "Comparer le montant economise entre deux offres promotionnelles",
      'Verifier qu\'une promotion "exceptionnelle" est reellement avantageuse',
    ],
    guide: `Les promotions sont partout : soldes d'ete et d'hiver, Black Friday, Cyber Monday, ventes privees, codes promo. Mais entre les "-50% sur le 2e article", les "jusqu'a -70%", et les remises cumulees, il est facile de perdre le fil et de croire qu'on fait une bonne affaire alors que la reduction reelle est bien moindre qu'annoncee.

Notre calculateur de remise coupe court a la confusion. Entrez le prix de depart et le pourcentage de remise, et vous obtenez instantanement le prix final et le montant economise en euros. Simple, mais ca evite les erreurs de calcul mental qui coulent sous la pression du "plus que 2 en stock !". Un article a 79,90 euros avec -30%, c'est 55,93 euros — pas 56 ou 57 comme le calcul mental approximatif pourrait le suggerer.

La fonctionnalite la plus utile est le cumul de remises en cascade. Beaucoup de sites proposent un pourcentage de solde + un code promo supplementaire. Attention : deux remises de 20% ne font pas 40% de reduction. Elles se cumulent en cascade : -20% sur le prix initial, puis -20% sur le prix deja reduit. Sur un article a 100 euros : premiere remise = 80 euros, deuxieme remise = 64 euros. La reduction totale est de 36%, pas 40%. Sur des montants eleves, la difference n'est pas negligeable.

Conseil pour les soldes en France : les soldes sont reglementees. Le prix de reference doit etre le prix le plus bas pratique dans les 30 jours precedant le debut des soldes (regle europeenne Omnibus). Si un commercant gonfle le prix avant les soldes pour afficher une reduction impressionnante, c'est une pratique commerciale trompeuse sanctionnable par la DGCCRF. Verifiez l'historique des prix avec des outils comme CamelCamelCamel (Amazon) ou Idealo avant de ceder a la tentation.

Autre piege classique : les offres du type "-50% sur le 2e article". En realite, si vous achetez deux articles au meme prix, la remise globale n'est que de 25% (vous payez 1,5 fois le prix au lieu de 2 fois). C'est marketing, pas genereux. Notre calculateur vous aide a voir le cout reel de chaque scenario.`,
    faqItems: [
      {
        question:
          "Comment fonctionne le cumul de remises en cascade ?",
        answer:
          "Chaque remise s'applique sur le prix resultant de la remise precedente, pas sur le prix initial. Exemple : un article a 200 euros avec -30% puis -15%. Premiere remise : 200 x 0,70 = 140 euros. Deuxieme remise : 140 x 0,85 = 119 euros. Reduction totale : 81 euros soit 40,5%, pas 45%.",
      },
      {
        question:
          "Un code promo s'applique-t-il avant ou apres les soldes ?",
        answer:
          "Ca depend du site. La plupart appliquent le code promo sur le prix deja solde (remise en cascade). Certains l'appliquent sur le prix initial ou ne cumulent pas les remises. Notre outil vous permet de simuler les deux scenarios pour comparer.",
      },
      {
        question:
          "Comment verifier qu'un prix barre n'est pas gonfle ?",
        answer:
          "Depuis mai 2022, la directive Omnibus impose que le prix barre soit le prix le plus bas pratique dans les 30 jours precedents. En pratique, utilisez des sites de suivi de prix (CamelCamelCamel pour Amazon, Idealo, Google Shopping) pour verifier l'historique. Si le prix a ete gonfle juste avant la promotion, signalez-le a la DGCCRF.",
      },
    ],
  },

  environnement: {
    name: "Environnement",
    icon: "\u{1F331}",
    intro:
      "Estimez votre empreinte carbone pour mieux la reduire. Notre calculateur CO2 couvre les principaux postes d'emission : transport (voiture, avion, train), energie domestique, et alimentation. Avec des equivalences concretes et des conseils de reduction.",
    useCases: [
      "Estimer les emissions CO2 d'un trajet en voiture, avion ou train",
      "Comparer l'empreinte carbone de differents modes de transport",
      "Calculer les emissions liees a votre consommation d'energie domestique",
      "Comprendre l'impact de vos habitudes quotidiennes en tonnes de CO2 equivalent",
    ],
    guide: `L'empreinte carbone moyenne d'un Francais est d'environ 9 tonnes de CO2 equivalent par an. L'objectif de l'Accord de Paris est de descendre a 2 tonnes par personne d'ici 2050 pour limiter le rechauffement a 1,5°C. La premiere etape pour reduire son empreinte est de la mesurer et de comprendre d'ou viennent les emissions.

Notre calculateur CO2 decompose les principaux postes d'emission. Le transport est souvent le premier poste : un aller-retour Paris-New York en avion emet environ 1,7 tonne de CO2 par passager — soit presque un dixieme de l'objectif annuel de 2 tonnes. En comparaison, le meme trajet en train (Paris-Lyon par exemple, 460 km) emet environ 3 kg de CO2, soit 500 fois moins que l'avion pour une distance equivalente. La voiture se situe entre les deux : environ 120 g de CO2 par km pour une voiture thermique moyenne, moins pour un vehicule electrique (mais l'empreinte depend du mix energetique du pays de production de l'electricite).

Pour l'energie domestique, les emissions dependent du mode de chauffage. Le gaz naturel emet environ 230 g de CO2 par kWh thermique. Le fioul, environ 320 g/kWh. L'electricite francaise, grace au nucleaire, n'emet qu'environ 50-60 g de CO2 par kWh — un des mix les plus bas d'Europe. En pratique, un appartement de 70 m2 chauffe au gaz emet environ 2 tonnes de CO2 par an pour le chauffage, contre 500 kg avec une pompe a chaleur electrique.

L'outil affiche les resultats en equivalences concretes pour rendre les chiffres tangibles : un aller-retour Paris-Marseille en avion equivaut a un an de chauffage electrique d'un studio, ou a 500 km en voiture thermique. Ces equivalences aident a prioriser les actions de reduction.

Quelques leviers concrets pour reduire son empreinte : priviligier le train pour les trajets de moins de 4 heures (souvent plus rapide que l'avion en porte-a-porte), isoler son logement (jusqu'a 60% d'economie de chauffage), passer a une pompe a chaleur ou au chauffage electrique, reduire la viande bovine (1 kg de boeuf = 30 kg de CO2, contre 1 kg pour le poulet et 0,4 kg pour les legumineuses), et privilegier les produits locaux et de saison pour l'alimentation.

Notre calculateur est un outil de sensibilisation. Pour un bilan carbone complet et precis, des plateformes comme Nos Gestes Climat (ADEME) proposent un questionnaire detaille couvrant tous les aspects de votre mode de vie.`,
    faqItems: [
      {
        question:
          "D'ou viennent les facteurs d'emission utilises ?",
        answer:
          "Nos facteurs d'emission proviennent de la Base Carbone de l'ADEME, la reference officielle francaise. Elle est maintenue par l'Agence de la Transition Ecologique et mise a jour regulierement. Les facteurs incluent le CO2 et les autres gaz a effet de serre (methane, protoxyde d'azote) convertis en CO2 equivalent.",
      },
      {
        question:
          "Pourquoi l'avion emet-il autant plus que le train ?",
        answer:
          "L'avion consomme beaucoup de kerosene (environ 3 litres par passager pour 100 km), les emissions sont rejetees a haute altitude ce qui amplifie leur effet (trainées de condensation, ozone tropospherique), et il n'y a pas d'alternative bas-carbone pour le carburant a court terme. Le train electrique, lui, beneficie du mix electrique francais largement decarbonne (nucleaire).",
      },
      {
        question:
          "Le calculateur prend-il en compte les emissions indirectes ?",
        answer:
          "Partiellement. Pour le transport, nous incluons les emissions directes (combustion du carburant) et les emissions amont (extraction, raffinage, transport du carburant). Pour l'electricite, nous utilisons le facteur du mix francais en cycle de vie. Les emissions liees a la fabrication des vehicules ou des infrastructures ne sont pas incluses car elles relevent d'un bilan carbone complet.",
      },
    ],
  },

  construction: {
    name: "Construction",
    icon: "\u{1F3D7}\uFE0F",
    intro:
      "Des calculateurs pour vos travaux de construction et de renovation : volume de beton, quantite de peinture, nombre de sacs. Evitez le gaspillage et les allers-retours en magasin de bricolage.",
    useCases: [
      "Calculer le volume de beton necessaire pour une dalle, une fondation ou un poteau",
      "Estimer le nombre de sacs de beton 25 kg ou 35 kg pour votre projet",
      "Calculer la quantite de peinture necessaire pour une piece en tenant compte des ouvertures",
      "Prevoir les litres et le nombre de pots de peinture a acheter",
    ],
    guide: `Les travaux de construction et de renovation representent un investissement important, et les erreurs de calcul se paient cher : trop de materiau achete = gaspillage et stockage encombrant, pas assez = arret du chantier et aller-retour supplementaire au magasin (souvent avec un supplement de prix pour un petit complement). Nos calculateurs vous donnent des estimations precises pour commander la juste quantite.

Le calculateur de beton couvre les trois formes les plus courantes. La dalle (longueur x largeur x epaisseur) pour les terrasses, les garages, les allees. La fondation (semelle filante ou isolee) avec les dimensions standards selon le DTU. Le poteau (section x hauteur) pour les clotures, pergolas et structures ponctuelles. Le resultat s'affiche en metres cubes et en nombre de sacs de beton pret a l'emploi (25 kg ou 35 kg, les deux formats les plus courants en grande surface de bricolage). Pour une dalle de terrasse de 20 m2 sur 10 cm d'epaisseur, il faut 2 m3 de beton — soit environ 115 sacs de 35 kg. Au-dela de 0,5 m3, il est generalement plus economique de commander du beton pret a l'emploi en toupie (environ 150-200 euros/m3 livre).

Le calculateur de peinture estime la quantite necessaire en fonction de la surface des murs, en deduisant les ouvertures (fenetres, portes). Vous renseignez les dimensions de la piece, le nombre et la taille des ouvertures, le nombre de couches souhaitees (2 couches est le standard pour un resultat uniforme), et le rendement de la peinture (generalement 10-12 m2 par litre pour une peinture murale classique, 6-8 m2 pour une peinture epaisse type crepi). L'outil calcule les litres necessaires et le nombre de pots a acheter selon les contenances disponibles (0,5L, 1L, 2,5L, 5L, 10L).

Quelques conseils pratiques pour vos travaux : pour le beton, ajoutez 10% de marge pour les pertes (coulures, fond de malaxeur, ajustements). Pour la peinture, prevoyez 15% de marge car les murs textures ou poreux absorbent davantage que prevu. Une sous-couche sur des murs neufs ou tres absorbants peut reduire la consommation de peinture de finition de 30%. Et n'oubliez pas que les plafonds necessitent une peinture specifique (plus epaisse, anti-eclaboussures) et un rendement different.

Pour les projets importants (plus de 50 m2 de dalle, renovation complete d'une maison), il est recommande de faire etablir plusieurs devis par des professionnels. Nos calculateurs vous servent alors a verifier les quantites annoncees dans les devis et a detecter d'eventuelles surestimations.`,
    faqItems: [
      {
        question:
          "Combien de sacs de beton faut-il pour 1 m3 ?",
        answer:
          "Il faut environ 33 sacs de 35 kg ou 57 sacs de 25 kg pour obtenir 1 m3 de beton pret a l'emploi. Ce chiffre varie legerement selon la marque et le dosage. Au-dela de 0,5 m3 (environ 17 sacs de 35 kg), il est souvent plus economique et moins fatiguant de commander du beton en toupie.",
      },
      {
        question:
          "Quel rendement de peinture dois-je indiquer ?",
        answer:
          "Le rendement est indique sur le pot de peinture. En general : 10-12 m2/L pour une peinture murale acrylique, 8-10 m2/L pour une peinture glycero, 6-8 m2/L pour un enduit ou une peinture epaisse. Sur un support brut ou tres poreux, reduisez le rendement de 20-30%. Sur un support deja peint et en bon etat, le rendement sera proche du maximum indique.",
      },
      {
        question:
          "Faut-il compter les plinthes dans la surface a peindre ?",
        answer:
          "Non pour les murs (la hauteur se mesure du sol au plafond, les plinthes sont peintes separement avec une peinture boiserie). Les plinthes representent generalement une surface negligeable. En revanche, n'oubliez pas les retours de mur dans les embrasures de fenetres et de portes — ils ajoutent 5 a 10% de surface selon le nombre d'ouvertures.",
      },
    ],
  },

  restaurant: {
    name: "Restaurant",
    icon: "\u{1F37D}\uFE0F",
    intro:
      "Calculez le pourboire ideal et partagez l'addition equitablement. Notre outil gere les groupes, compare les taux de pourboire et arrondit intelligemment pour eviter les discussions interminables a table.",
    useCases: [
      "Calculer le pourboire recommande selon le service (10%, 15%, 20%)",
      "Partager l'addition entre plusieurs personnes de maniere equitable",
      "Arrondir le total pour faciliter le paiement",
      "Comparer differents taux de pourboire pour choisir le bon montant",
    ],
    guide: `En France, le service est inclus dans les prix affiches — c'est la fameuse mention "service compris" obligatoire dans la restauration. Contrairement aux Etats-Unis ou le pourboire est quasi-obligatoire (15-20%), en France il est discretionnaire et considere comme un geste de satisfaction envers le service. Pourtant, les habitudes evoluent et de plus en plus de Francais laissent un pourboire, surtout dans les restaurants de qualite.

Notre calculateur de pourboire vous aide a determiner le montant juste selon le contexte. En France, un pourboire de 5 a 10% est considere comme genereux. Arrondir l'addition a l'euro superieur (passer de 47,30 a 48 ou 50 euros) est le geste le plus courant. Dans les restaurants haut de gamme, 10% est la norme. A l'etranger, les usages sont tres differents : 15-20% aux USA et au Canada (obligatoire de fait), 10-15% au Royaume-Uni, rien au Japon (c'est meme considere comme insultant).

Le partage d'addition est l'autre grande utilite de l'outil. Diviser 247,50 euros entre 7 personnes de tete, c'est penible. L'outil fait le calcul et propose un arrondi intelligent : plutot que de demander 35,36 euros a chacun, il arrondit a 35,50 ou 36 euros et indique le surplus total. C'est plus pratique, surtout quand tout le monde paie en especes ou par virement.

L'outil compare aussi visuellement ce que donnent differents taux de pourboire. Sur une addition de 80 euros pour deux : 5% = 4 euros, 10% = 8 euros, 15% = 12 euros. Cela permet de choisir en connaissance de cause selon votre satisfaction et votre budget. Un tableau recapitulatif montre le montant total (addition + pourboire) et le montant par personne pour chaque scenario.

Bon a savoir sur la fiscalite des pourboires en France : depuis janvier 2022 (loi prolongee jusqu'a fin 2025, potentiellement reconduite), les pourboires verses aux salaries dont la remuneration ne depasse pas 1,6 SMIC sont exoneres de cotisations sociales et d'impot sur le revenu. C'est une incitation a laisser des pourboires, surtout par carte bancaire (ce qui permet la tracabilite pour l'exoneration fiscale).`,
    faqItems: [
      {
        question:
          "Quel est le taux de pourboire recommande en France ?",
        answer:
          "Il n'y a pas d'obligation en France puisque le service est inclus dans les prix. Un pourboire de 5 a 10% de l'addition est considere comme genereux. Le geste le plus courant est d'arrondir a l'euro superieur. Dans un restaurant etoile, 10% est la norme implicite. L'essentiel est que le pourboire reste un geste spontane de satisfaction.",
      },
      {
        question:
          "Comment partager equitablement quand les plats n'ont pas le meme prix ?",
        answer:
          "Notre outil propose un partage egal par defaut (total divise par le nombre de convives). Pour un partage proportionnel aux consommations de chacun, la methode la plus simple est que chaque personne indique ce qu'elle a commande. En pratique, entre amis, le partage egal reste la norme en France — c'est plus simple et plus convivial.",
      },
      {
        question:
          "Faut-il laisser un pourboire quand on emporte ou se fait livrer ?",
        answer:
          "C'est une pratique de plus en plus courante, surtout pour les livraisons. Un pourboire de 1 a 3 euros pour un livreur est un geste apprecie (les livreurs sont souvent sous-remuneres). Pour la vente a emporter, c'est moins habituel mais les boites a pourboire numeriques sur les terminaux de paiement facilitent le geste.",
      },
    ],
  },

  seo: {
    name: "SEO",
    icon: "\u{1F50D}",
    intro:
      "Des outils techniques pour le referencement naturel. Generez un fichier robots.txt conforme et optimise pour le crawl de votre site par Google, Bing et les autres moteurs de recherche.",
    useCases: [
      "Generer un fichier robots.txt valide avec les regles de crawl adaptees a votre site",
      "Bloquer l'indexation de certaines sections (admin, staging, pages privees)",
      "Ajouter la reference de votre sitemap dans le robots.txt",
      "Utiliser des presets pour WordPress, Next.js ou d'autres frameworks",
    ],
    guide: `Le SEO (Search Engine Optimization) est l'art de rendre votre site visible dans les resultats de recherche de Google, Bing et consorts. C'est un canal d'acquisition de trafic gratuit, organique et cummulatif — contrairement a la publicite qui s'arrete quand vous arretez de payer. Les outils techniques SEO sont les fondations sur lesquelles repose toute strategie de referencement.

Le fichier robots.txt est le premier fichier que les moteurs de recherche consultent en arrivant sur votre site. Il leur indique quelles pages crawler et lesquelles ignorer. Un robots.txt mal configure peut avoir des consequences catastrophiques : si vous bloquez accidentellement le crawl de tout votre site, Google le desindexe en quelques jours. A l'inverse, ne pas bloquer les pages sensibles (administration, versions de staging, pages de resultats de recherche internes) gaspille votre budget de crawl et peut creer du contenu duplique.

Notre generateur propose des presets adaptes aux frameworks populaires. Pour WordPress : bloquer /wp-admin/, /wp-includes/, les pages de tags et d'auteur (souvent du contenu duplique), et autoriser wp-content pour les images. Pour Next.js : bloquer /_next/static/ (assets servis directement), les pages d'API (/api/), et les pages d'erreur. Pour les sites e-commerce : bloquer les pages de filtres et de tri qui generent des milliers d'URLs dupliquees.

Chaque regle est expliquee dans l'interface : la directive "Disallow" interdit le crawl d'un chemin, "Allow" autorise un sous-chemin d'un repertoire bloque, "Crawl-delay" definit un delai entre les requetes (respecte par Bing, ignore par Google). La directive "Sitemap" indique l'emplacement de votre sitemap XML, un autre fichier essentiel pour le SEO qui liste toutes les pages de votre site avec leurs priorites et frequences de mise a jour.

Conseil important : le robots.txt controle le crawl, pas l'indexation. Si une page est liee depuis d'autres sites mais bloquee dans le robots.txt, Google peut quand meme l'indexer (en affichant "Aucune information n'est disponible pour cette page"). Pour vraiment empecher l'indexation, utilisez la meta tag "noindex" dans le HTML de la page. Le robots.txt et le noindex sont complementaires, pas interchangeables.

Autre bonne pratique : verifiez votre robots.txt avec l'outil "Inspection d'URL" dans la Google Search Console apres chaque modification. Un caractere mal place peut bloquer des sections entieres de votre site.`,
    faqItems: [
      {
        question:
          "Un fichier robots.txt est-il obligatoire pour le SEO ?",
        answer:
          "Non, il n'est pas obligatoire. Si votre site n'a pas de robots.txt, les moteurs de recherche crawlent toutes les pages accessibles. Cependant, il est fortement recommande pour les sites de plus de quelques pages : il permet d'optimiser le budget de crawl, d'eviter l'indexation de contenu duplique, et de proteger les pages sensibles.",
      },
      {
        question:
          "Le robots.txt protege-t-il mes pages privees ?",
        answer:
          "Non. Le robots.txt est une directive, pas une protection. Les moteurs de recherche respectueux l'honorent, mais rien n'empeche un scraper ou un bot malveillant de l'ignorer. Pour proteger des pages sensibles, utilisez une authentification (mot de passe, token). Le robots.txt est un outil SEO, pas un outil de securite.",
      },
      {
        question:
          "Quelle est la difference entre Disallow et noindex ?",
        answer:
          "Disallow (dans robots.txt) empeche le crawl : Google ne visite pas la page. Mais il peut quand meme l'indexer s'il connait l'URL par d'autres moyens (liens externes). Le noindex (balise meta dans le HTML) empeche l'indexation : Google visite la page mais ne l'affiche pas dans les resultats. Pour une exclusion complete, utilisez les deux. Attention : ne bloquez pas une page avec Disallow si elle contient une balise noindex, sinon Google ne pourra pas lire le noindex.",
      },
    ],
  },

  pdf: {
    name: "PDF",
    icon: "\u{1F4C4}",
    intro:
      "Manipulez vos fichiers PDF directement dans le navigateur : fusionnez plusieurs PDF en un seul document, extrayez du texte, consultez les metadonnees. Aucun upload, tout est traite localement.",
    useCases: [
      "Fusionner plusieurs PDF en un seul document pour un dossier complet",
      "Extraire le texte d'un PDF pour le copier dans un autre document",
      "Consulter les metadonnees d'un PDF (auteur, date, nombre de pages)",
      "Extraire des pages individuelles d'un PDF multi-pages",
    ],
    guide: `Le PDF est le format universel du document numerique. Factures, contrats, CV, rapports, formulaires administratifs — tout finit en PDF. Pourtant, manipuler des PDF reste etonnamment complique sans outil dedie : fusionner deux documents, extraire une page, ou simplement copier le texte necessite souvent un logiciel payant (Adobe Acrobat Pro, Foxit) ou un service en ligne qui stocke vos fichiers sur ses serveurs.

Nos outils PDF fonctionnent 100% dans votre navigateur grace a des bibliotheques JavaScript specialisees. Aucun fichier n'est uploade, aucune donnee ne transite par un serveur. C'est un point crucial quand vous travaillez avec des documents sensibles : contrats confidentiels, fiches de paie, documents d'identite.

Le fusionneur PDF permet de combiner plusieurs fichiers en un seul document. Glissez-deposez vos PDF, reordonnez-les par drag & drop, et telechargez le resultat. C'est indispensable pour constituer des dossiers complets : dossier de location (pieces d'identite + bulletins de paie + avis d'imposition + contrat de travail), dossier de pret immobilier, dossier de candidature (CV + lettre de motivation + diplomes), ou rapport avec annexes.

L'outil PDF vers Texte analyse le contenu de vos PDF et en extrait le texte. C'est utile pour recuperer le contenu d'un document non editable, pour alimenter un tableur avec des donnees issues d'un PDF, ou simplement pour copier un passage dans un email. L'outil affiche aussi les metadonnees du document (auteur, date de creation, logiciel generateur, nombre de pages, dimensions) et permet d'extraire des pages individuelles.

Limites a connaitre : l'extraction de texte fonctionne sur les PDF "textuels" (generes par un traitement de texte ou une application). Les PDF "images" (scans de documents papier) ne contiennent pas de texte exploitable — il faudrait un OCR (reconnaissance optique de caracteres) pour les convertir. Si votre PDF est un scan, l'extraction de texte retournera un resultat vide ou partiel.

Conseil pratique : avant de fusionner des PDF, verifiez que tous les documents sont dans le bon sens (orientation portrait/paysage) et a la meme resolution. Un document scanne a 150 dpi aura une qualite moindre qu'un PDF genere numeriquement. Le fusionneur conserve la qualite de chaque document source.`,
    faqItems: [
      {
        question:
          "Mes fichiers PDF sont-ils envoyes a un serveur ?",
        answer:
          "Non. Tous les traitements (fusion, extraction de texte, lecture de metadonnees) sont effectues localement dans votre navigateur par des bibliotheques JavaScript. Vos fichiers ne quittent jamais votre ordinateur. C'est la garantie que vos documents sensibles restent prives.",
      },
      {
        question:
          "Y a-t-il une limite de taille ou de nombre de fichiers ?",
        answer:
          "Il n'y a pas de limite imposee par l'outil. La limite depend de la memoire de votre navigateur. En pratique, vous pouvez fusionner une dizaine de PDF de taille standard (1-5 Mo chacun) sans probleme. Pour des fichiers tres volumineux (>50 Mo) ou de tres gros lots (>20 fichiers), les performances peuvent ralentir sur les machines avec peu de RAM.",
      },
      {
        question:
          "Pourquoi l'extraction de texte ne fonctionne-t-elle pas sur mon PDF ?",
        answer:
          "Votre PDF est probablement un scan (image) et non un PDF textuel. Les PDF generes par un scanner ou une application photo ne contiennent pas de couche de texte — juste une image du document. Pour extraire le texte, il faudrait un outil d'OCR (reconnaissance optique de caracteres). Nos outils ne proposent pas cette fonctionnalite pour le moment.",
      },
    ],
  },

  video: {
    name: "Video",
    icon: "\u{1F3AC}",
    intro:
      "Compressez et editez vos videos directement dans le navigateur. Reduction de taille, decoupage, conversion, redimensionnement, extraction d'images, changement de vitesse — 8 operations sans installer de logiciel.",
    useCases: [
      "Compresser une video pour la partager par email ou messagerie (limite de taille)",
      "Couper un extrait d'une video longue sans logiciel de montage",
      "Convertir une video en GIF anime pour les reseaux sociaux",
      "Redimensionner une video pour un format specifique (story, reel, 16:9)",
    ],
    guide: `La video represente plus de 80% du trafic internet en 2026. Pourtant, manipuler des fichiers video reste complexe pour la plupart des utilisateurs. Les logiciels professionnels (Premiere Pro, DaVinci Resolve, Final Cut) sont surdimensionnes pour des operations simples, et les services en ligne imposent des limites de taille, des filigranes ou des abonnements. Nos outils video traitent tout localement, gratuitement et sans filigrane.

Le compresseur video reduit la taille de vos fichiers en ajustant la qualite d'encodage. Trois niveaux sont proposes : compression legere (bonne qualite, reduction de 30-50%), standard (qualite acceptable, reduction de 50-70%), et aggressive (qualite reduite, reduction de 70-90%). C'est indispensable pour les envois par email (limite de 25 Mo sur Gmail), par messagerie (WhatsApp limite a 16 Mo en envoi direct), ou pour upload sur les plateformes qui imposent des limites de taille.

L'editeur video est un couteau suisse qui regroupe 8 operations. Le decoupage (trim) vous permet d'extraire un segment precis d'une video en definissant le point de debut et de fin. La conversion transforme entre formats (MP4, WebM, MOV). Le redimensionnement ajuste les dimensions pour les differents formats de reseaux sociaux : 9:16 pour les stories et reels (Instagram, TikTok), 1:1 pour les posts carres, 16:9 pour YouTube. La creation de GIF extrait un segment et le convertit en GIF anime.

Les autres operations incluent la capture d'image (screenshot d'une frame precise), le changement de vitesse (ralenti x0,5 ou accelere x2), la rotation (90°, 180°, 270°) et le retournement (miroir horizontal ou vertical). Chaque operation est independante : vous n'avez pas besoin de passer par un workflow complexe de timeline et de pistes.

Point technique important : le traitement video dans le navigateur utilise les APIs MediaRecorder et Canvas, ainsi que des Web Workers pour ne pas bloquer l'interface pendant l'encodage. Les performances dependent de votre processeur : une compression de video de 1 minute prend generalement 30 secondes a 2 minutes selon la puissance de votre machine. Pour des videos de plus de 10 minutes ou en 4K, un logiciel de bureau sera plus performant.

Conseil : avant de compresser une video, verifiez sa resolution. Une video filmee en 4K (3840x2160) mais destinee a Instagram (1080x1920 en story) peut etre redimensionnee avant compression, ce qui reduit enormement la taille finale. Redimensionner puis compresser est plus efficace que compresser directement.`,
    faqItems: [
      {
        question:
          "Quels formats video sont supportes ?",
        answer:
          "Les formats supportes dependent de votre navigateur. En general : MP4 (H.264), WebM (VP8/VP9), et MOV sont supportes par Chrome, Firefox et Edge. Safari a un support plus limite pour WebM. Le MP4 est le format le plus universel et celui que nous recommandons pour la compatibilite maximale.",
      },
      {
        question:
          "Y a-t-il une limite de duree ou de taille pour les videos ?",
        answer:
          "Il n'y a pas de limite imposee par l'outil. La limite depend de la memoire disponible dans votre navigateur. En pratique, les videos de moins de 500 Mo et 10 minutes fonctionnent bien sur la plupart des ordinateurs. Au-dela, vous pourriez rencontrer des ralentissements ou des erreurs de memoire, surtout sur les appareils avec 4 Go de RAM ou moins.",
      },
      {
        question:
          "La qualite est-elle conservee apres compression ?",
        answer:
          "Le niveau de compression legere preserve une qualite quasi identique a l'original — la difference est generalement imperceptible. Le niveau standard montre une legere perte sur les details fins mais reste tout a fait acceptable pour les reseaux sociaux. Le niveau agressif est visible mais adapte aux envois par messagerie ou aux previsualisations.",
      },
    ],
  },

  audio: {
    name: "Audio",
    icon: "\u{1F3B5}",
    intro:
      "Extrayez et convertissez vos fichiers audio dans le navigateur. Recuperez la piste sonore d'une video, ou convertissez entre MP3, WAV, OGG et AAC avec un bitrate configurable. 100% local, aucun upload.",
    useCases: [
      "Extraire la piste audio d'une video pour en faire un podcast ou un fichier audio",
      "Convertir un fichier WAV en MP3 pour reduire sa taille",
      "Changer le bitrate d'un fichier audio pour optimiser le ratio taille/qualite",
      "Convertir un audio en OGG pour l'integrer dans une application web",
    ],
    guide: `Le traitement audio est une necessite pour les createurs de contenu, les podcasteurs, les musiciens et les developpeurs web. Extraire l'audio d'une video d'interview, convertir un fichier WAV volumineux en MP3 compact, ou preparer un fichier OGG pour une application web — ces operations reviennent regulierement et ne necessitent pas un logiciel complet comme Audacity.

L'extracteur audio recupere la piste sonore d'une video et la rend disponible en telechargement. C'est utile dans de nombreux contextes : transformer une video de conference en podcast audio, isoler la musique de fond d'une video, ou recuperer une interview enregistree en video pour la diffuser en audio. L'outil affiche la forme d'onde du fichier extrait pour verifier visuellement le contenu avant telechargement.

Le convertisseur audio gere les formats les plus courants. Le MP3 reste le standard universel : compatible avec tous les appareils et toutes les plateformes, avec un bon ratio taille/qualite. Le WAV est le format non compresse de reference (qualite studio) mais il est tres volumineux (environ 10 Mo par minute en stereo 44,1 kHz). L'OGG (Vorbis) est un format libre de droits avec une qualite superieure au MP3 a bitrate egal — c'est le format prefere pour l'audio web (supporte par la balise HTML5 audio). Le AAC est le successeur du MP3, utilise par Apple (iTunes, Apple Music) et les videos MP4.

Le bitrate (debit binaire) est le parametre cle qui determine le compromis entre qualite et taille. Pour le MP3 : 128 kbps est la qualite standard (suffisante pour la voix et la musique de fond), 192 kbps est bonne qualite, 256-320 kbps est haute qualite (difficile a distinguer de l'original pour la plupart des auditeurs). Pour le WAV, le bitrate est fixe (environ 1 411 kbps en CD audio). Pour l'OGG, les recommandations sont similaires au MP3 mais la qualite percue est meilleure a bitrate egal.

Conseil pour les podcasteurs : un fichier audio en mono (au lieu de stereo) a la moitie du poids pour une qualite de voix identique. Si votre contenu est principalement de la parole (interview, narration), le mono en MP3 a 128 kbps est amplement suffisant et produit des fichiers legers, faciles a telecharger et a streamer.

Conseil pour les developpeurs web : utilisez l'OGG comme format principal et le MP3 en fallback pour les navigateurs anciens. La balise HTML5 audio accepte plusieurs sources : le navigateur choisira le premier format supporte.`,
    faqItems: [
      {
        question:
          "Quel format audio choisir pour un podcast ?",
        answer:
          "Le MP3 a 128 kbps en mono est le standard pour les podcasts : compatible partout, leger, et suffisant pour la voix. Pour un podcast musical ou avec des extraits audio en haute qualite, montez a 192 kbps en stereo. Le AAC est une alternative de meilleure qualite a bitrate egal, mais moins universellement supporte par les anciens lecteurs de podcast.",
      },
      {
        question:
          "La conversion audio est-elle sans perte ?",
        answer:
          "La conversion entre formats compresses (MP3 vers OGG, par exemple) implique toujours une legere perte de qualite supplementaire car le fichier est decompresse puis recompresse. Pour une conversion sans perte, passez par le WAV comme format intermediaire. La conversion WAV vers MP3 ou OGG est une compression avec perte, mais a partir d'une source de qualite maximale.",
      },
      {
        question:
          "Pourquoi ma video n'a-t-elle pas de piste audio ?",
        answer:
          "Certaines videos (screencasts, animations, GIF convertis en video) sont creees sans piste audio. L'extracteur audio detecte l'absence de piste et vous en informe. Si la video a bien du son mais que l'extraction echoue, verifiez que le format est supporte par votre navigateur (les codecs propriétaires comme AC3 ou DTS ne sont pas supportes par les navigateurs web).",
      },
    ],
  },

  emploi: {
    name: "Emploi",
    icon: "\u{1F4BC}",
    intro:
      "Des simulateurs pour estimer vos droits en tant que salarie : allocation chomage (ARE), prime d'activite, indemnite de rupture conventionnelle. Tous les calculs sont bases sur les baremes officiels 2026.",
    useCases: [
      "Estimer votre allocation chomage (ARE) : montant journalier, duree d'indemnisation, total",
      "Calculer votre prime d'activite selon vos revenus et votre situation familiale",
      "Simuler l'indemnite de rupture conventionnelle : brut, fiscalite, net",
      "Comparer les droits selon differents scenarios de depart",
    ],
    guide: `La perte d'emploi ou la transition professionnelle sont des moments cles ou il est essentiel de connaitre ses droits. Les regles d'indemnisation chomage, les aides sociales et les indemnites de depart sont des sujets complexes, regis par des regles specifiques que meme les conseillers Pole Emploi (devenu France Travail) ne maitrisent pas toujours dans le detail. Nos simulateurs vous donnent une estimation fiable pour anticiper et planifier.

Le simulateur d'allocation chomage (ARE) calcule votre indemnisation selon les regles en vigueur. Le montant journalier de l'ARE est le plus favorable entre deux formules : 40,4% du salaire journalier de reference (SJR) + une partie fixe, ou 57% du SJR. Le SJR est calcule en divisant les salaires bruts des 24 derniers mois (ou 36 mois pour les plus de 53 ans) par le nombre de jours calendaires de la periode. La duree d'indemnisation depend de la duree d'affiliation : il faut avoir travaille au moins 6 mois sur les 24 derniers mois, et la duree maximale est de 24 mois (36 mois pour les plus de 53 ans). Depuis la reforme de 2023, ces durees peuvent etre modulees selon la conjoncture du marche du travail.

Le simulateur de prime d'activite est destine aux travailleurs aux revenus modestes. En 2026, le montant forfaitaire de base est d'environ 622 euros pour une personne seule. Il est majore selon la composition du foyer (+50% pour la premiere personne supplementaire, +30% par personne supplementaire, +40% par enfant). Une bonification individuelle s'ajoute si vos revenus depassent 0,5 SMIC. Le forfait logement est deduit si vous etes proprietaire ou si votre loyer est pris en charge. Le calcul est complexe mais notre simulateur le decompose etape par etape.

Le simulateur de rupture conventionnelle calcule l'indemnite minimale legale (1/4 de mois par annee d'anciennete jusqu'a 10 ans, puis 1/3 au-dela), la fiscalite applicable (exoneration d'impot et de cotisations dans certaines limites), et le montant net estime. Attention : l'indemnite minimale legale est souvent inferieure a ce qui est negocie en pratique. Pour les cadres, la convention collective Syntec prevoit des minima superieurs. N'oubliez pas non plus que la rupture conventionnelle ouvre droit a l'ARE, contrairement a la demission (sauf demission pour motif legitime ou en reconversion).

Conseil important : ces simulateurs donnent des estimations basees sur les regles generales. Les situations particulieres (chomage partiel, multi-employeurs, expatriation, rechargement de droits) peuvent modifier les calculs. Pour un montant exact, consultez votre espace personnel sur francetravail.fr.`,
    faqItems: [
      {
        question:
          "Comment est calcule le salaire journalier de reference (SJR) pour l'ARE ?",
        answer:
          "Le SJR est calcule en divisant la totalite des salaires bruts perçus pendant les 24 derniers mois (36 mois pour les 53 ans et plus) par le nombre de jours calendaires de cette periode (environ 730 ou 1 095 jours). Sont inclus : salaires de base, primes, 13e mois, heures supplementaires. Sont exclus : indemnites de licenciement, indemnites de conges payes versees a la rupture.",
      },
      {
        question:
          "La prime d'activite est-elle cumulable avec d'autres aides ?",
        answer:
          "Oui. La prime d'activite est cumulable avec les APL (aide au logement), les allocations familiales, et l'AAH (allocation adulte handicape). En revanche, le forfait logement est deduit de la prime si vous touchez les APL ou si vous n'avez pas de charge de logement. La demande se fait en ligne sur caf.fr, avec une declaration trimestrielle de revenus.",
      },
      {
        question:
          "La rupture conventionnelle ouvre-t-elle droit au chomage ?",
        answer:
          "Oui, c'est l'un de ses principaux avantages par rapport a la demission. La rupture conventionnelle est consideree comme une privation involontaire d'emploi et ouvre droit a l'ARE dans les conditions normales. Il y a cependant un delai de carence : 7 jours + un differe d'indemnisation conges payes + un differe specifique lie a l'indemnite supra-legale (plafonne a 150 jours).",
      },
    ],
  },

  quotidien: {
    name: "Quotidien",
    icon: "\u{1F3E0}",
    intro:
      "Des outils pratiques pour la vie de tous les jours. Notre calculateur de partage de frais simplifie les comptes entre amis apres un restaurant, un voyage ou une colocation — fini les tableurs et les disputes.",
    useCases: [
      "Partager les frais d'un voyage entre amis de maniere equitable",
      "Calculer qui doit combien a qui apres un weekend entre amis",
      "Gerer les depenses d'une colocation au quotidien",
      "Optimiser le nombre de remboursements pour minimiser les virements",
    ],
    guide: `Les depenses partagees sont une source de tension classique entre amis, en colocation ou en voyage. "J'ai paye le restaurant hier soir", "Moi j'ai pris l'Airbnb", "Mais toi tu n'as pas participe au petit-dejeuner"... Sans outil, on finit avec un tableur Excel approximatif et des "on s'arrangera" qui ne se resolvent jamais. Notre calculateur de partage de frais resout le probleme en quelques clics.

Le principe est simple : vous ajoutez chaque depense avec le nom du payeur, le montant, et les participants concernes. L'outil calcule ensuite exactement qui doit combien a qui, en optimisant le nombre de transactions. Si Alice a paye 100 euros pour le restaurant, Bob 60 euros pour les courses, et Charlie 40 euros pour l'essence, et que tout est partage a 3, l'outil ne va pas generer 6 virements croises — il va calculer la solution minimale : Charlie doit 26,67 euros a Alice, et Bob ne doit rien (il a paye sa part et un peu plus, Alice lui doit la difference via une transaction simplifiee).

L'optimisation du nombre de remboursements est la fonctionnalite cle. Dans un groupe de 5 personnes avec 10 depenses differentes, le nombre theorique de virements peut atteindre 20. Notre algorithme le reduit generalement a 3 ou 4 transactions. C'est un probleme d'optimisation classique (algorithme de simplification de dettes) qui tient compte du fait que A peut rembourser B en passant par C si ca reduit le nombre total de virements.

L'outil gere aussi les depenses partielles : si seulement 3 personnes sur 5 ont participe a une activite, seules ces 3 personnes sont concernees par le partage. Chaque depense peut avoir ses propres participants, ce qui reflète la realite d'un voyage ou chacun ne fait pas tout.

Conseil pratique : designez une personne du groupe comme "tresorier" qui cree le partage et ajoute les depenses au fur et a mesure. C'est beaucoup plus simple que de reconstituer les comptes apres coup. En colocation, faites le point chaque mois — au-dela, les montants s'accumulent et la resolution devient plus complexe et source de frustration.

Pour les colocations regulieres, l'outil est aussi utile pour les depenses recurrentes : loyer, electricite, internet, courses. Si le bail est au nom d'une seule personne mais que tout le monde paie, ajoutez le loyer chaque mois comme depense du titulaire du bail et laissez l'outil calculer les remboursements.`,
    faqItems: [
      {
        question:
          "Comment l'outil optimise-t-il le nombre de remboursements ?",
        answer:
          "L'algorithme calcule d'abord le solde net de chaque participant (total paye moins total du). Puis il apparie les debiteurs (qui doivent de l'argent) avec les crediteurs (a qui on doit de l'argent) en minimisant le nombre de transactions. Dans la plupart des cas, N-1 transactions suffisent pour un groupe de N personnes.",
      },
      {
        question:
          "Peut-on partager des depenses de maniere inegale ?",
        answer:
          "Oui. Par defaut, chaque depense est partagee egalement entre les participants. Mais vous pouvez aussi definir des parts inegales (par exemple, un participant paie le double parce qu'il a consomme plus, ou un couple paie pour deux). L'outil tient compte des parts dans le calcul des soldes.",
      },
      {
        question:
          "Les donnees de depenses sont-elles sauvegardees ?",
        answer:
          "Les depenses restent dans votre navigateur pendant votre session. Elles ne sont pas envoyees a un serveur. Si vous fermez la page, les donnees sont perdues. Pour une utilisation longue (colocation sur plusieurs mois), nous recommandons de noter regulierement les soldes. Une fonctionnalite d'export est disponible pour sauvegarder les comptes.",
      },
    ],
  },
};
