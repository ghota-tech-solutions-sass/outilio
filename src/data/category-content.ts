export interface CategoryContent {
  name: string;
  icon: string;
  intro: string;
  useCases: string[];
  guide: string;
  faqItems: { question: string; answer: string }[];
}

// Contenu éditorial des pages /categories/<slug>.
// Les chiffres cités doivent rester alignés sur les valeurs 2026 utilisées par les outils.
export const categoryContent: Record<string, CategoryContent> = {
  finance: {
    name: "Argent & impôts",
    icon: "\u{1F4B0}",
    intro:
      "Impôt sur le revenu, âge de départ à la retraite, flat tax crypto, succession, frais kilométriques, épargne : des simulateurs qui appliquent les barèmes français 2026 pour vos décisions d'argent.",
    useCases: [
      "Vérifier votre taux marginal d'imposition avec le barème 2026 (0 / 11 / 30 / 41 / 45 %) et le quotient familial",
      "Connaître votre âge légal de départ selon votre année de naissance après la suspension de la réforme par la LFSS 2026",
      "Chiffrer l'impôt sur vos plus-values crypto à 31,4 % et vérifier si vous passez sous le seuil de 305 € de cessions",
      "Estimer les droits de succession d'un enfant, d'un frère ou d'un neveu avec les abattements par lien de parenté",
      "Calculer vos frais kilométriques au barème fiscal pour choisir entre abattement de 10 % et frais réels",
    ],
    guide: `Cette catégorie regroupe les calculs qui touchent directement votre patrimoine et votre fiscalité personnelle. Le point commun des outils : ils appliquent des barèmes officiels qui changent chaque année, et une erreur de quelques points se chiffre vite en centaines d'euros.

Le simulateur d'impôt sur le revenu applique le barème 2026 par tranches : 0 % jusqu'à 11 600 € par part, 11 % jusqu'à 29 579 €, 30 % jusqu'à 84 577 €, 41 % jusqu'à 181 917 € et 45 % au-delà. Il détaille l'impôt tranche par tranche et affiche votre taux marginal, celui qui s'applique au prochain euro gagné. C'est ce taux qu'il faut regarder avant d'accepter une prime, de faire des heures supplémentaires ou de choisir entre le barème et le prélèvement forfaitaire unique pour vos revenus de placement. Une vérification utile en début d'année : comparer l'impôt simulé avec ce que votre taux de prélèvement à la source aura retenu, pour anticiper une régularisation.

Le PFU, ou flat tax, passe à 31,4 % en 2026 : 12,8 % d'impôt et 18,6 % de prélèvements sociaux, après la hausse de la CSG votée dans la LFSS 2026. Le simulateur flat tax crypto l'applique aux plus-values de cession d'actifs numériques, avec l'exonération lorsque le total annuel des cessions ne dépasse pas 305 €. Les échanges crypto contre crypto ne sont pas imposables : seule la conversion en euros ou l'achat d'un bien déclenche l'impôt.

Le calculateur d'âge de départ à la retraite tient compte de la suspension de la réforme de 2023 prévue par la LFSS 2026 : l'âge légal est de 62 ans et 9 mois pour la génération 1964, augmente de 3 mois par génération jusqu'à 63 ans et 9 mois pour 1968, puis atteint 64 ans à partir de la génération 1969. Il indique aussi le nombre de trimestres requis pour le taux plein, qui reste acquis automatiquement à 67 ans quelle que soit la durée cotisée.

Côté transmission, le simulateur de droits de succession applique l'abattement correspondant au lien de parenté (100 000 € par enfant, 15 932 € entre frères et sœurs, 7 967 € pour un neveu ou une nièce, exonération totale pour le conjoint ou le partenaire de Pacs), puis le barème progressif. Il donne le montant net réellement hérité.

Pour la vie courante, le calculateur de frais kilométriques reprend le barème fiscal par puissance administrative, avec la majoration de 20 % pour les véhicules électriques. Le calculateur de prêt auto affiche mensualités, coût total et tableau d'amortissement. Le calculateur d'épargne montre l'effet des intérêts composés : à titre de repère, le Livret A rapporte 1,7 % depuis le 1er août 2026 et le LEP 2,5 %. Le calculateur d'inflation mesure l'érosion du pouvoir d'achat avec l'indice des prix de l'Insee depuis 1970, et le convertisseur de devises récupère les taux de référence de la BCE (le dirham marocain est indicatif, le franc CFA a une parité fixe de 655,957 pour un euro).`,
    faqItems: [
      {
        question: "Quelle différence entre taux marginal et taux moyen d'imposition ?",
        answer:
          "Le taux marginal est celui de la tranche la plus haute atteinte par votre revenu par part : il ne s'applique qu'à la fraction qui dépasse le seuil de cette tranche. Le taux moyen rapporte l'impôt total à votre revenu imposable et il est toujours plus bas. Passer dans la tranche à 30 % ne fait pas payer 30 % sur tout votre revenu. Le simulateur d'impôt affiche les deux.",
      },
      {
        question: "Pourquoi la flat tax est-elle à 31,4 % et non plus à 30 % ?",
        answer:
          "La loi de financement de la sécurité sociale pour 2026 a relevé la CSG sur les revenus du capital, ce qui porte les prélèvements sociaux de 17,2 % à 18,6 %. Avec les 12,8 % d'impôt sur le revenu, le prélèvement forfaitaire unique atteint 31,4 % sur les dividendes, intérêts et plus-values concernés, dont les plus-values crypto.",
      },
      {
        question: "Mes chiffres sont-ils envoyés quelque part ?",
        answer:
          "Non. Les montants que vous saisissez sont traités dans votre navigateur et ne sont ni transmis ni enregistrés par Outilis.fr. Seul le convertisseur de devises interroge un service de taux de change (données de la BCE) pour obtenir les cours du jour, sans vos montants. Le site utilise Google Analytics et Google AdSense, qui peuvent déposer des cookies.",
      },
      {
        question: "Ces simulations remplacent-elles un conseiller ou l'administration ?",
        answer:
          "Elles donnent une estimation fiable dans les cas courants, utile pour comparer des scénarios. Les situations particulières (revenus exceptionnels, démembrement de propriété, carrières longues, donations antérieures) demandent de vérifier sur impots.gouv.fr, info-retraite.fr ou auprès d'un notaire ou d'un expert-comptable.",
      },
    ],
  },

  immobilier: {
    name: "Immobilier & travaux",
    icon: "\u{1F3E0}",
    intro:
      "Du financement aux travaux : prêt immobilier, frais de notaire, PTZ 2026, rachat de crédit, APL, DPE, plus-value, puis béton, peinture et surfaces pour chiffrer le chantier.",
    useCases: [
      "Simuler la mensualité et le coût total d'un prêt, puis vérifier qu'elle respecte le plafond d'endettement de 35 % fixé par le HCSF",
      "Estimer les frais de notaire dans l'ancien ou le neuf selon le département du bien",
      "Calculer le montant de votre PTZ 2026 selon la zone, le type de logement et votre tranche de revenus",
      "Estimer la classe DPE d'un logement avec le coefficient électricité de 1,9 en vigueur depuis janvier 2026",
      "Calculer le nombre de sacs de béton pour une dalle ou le nombre de pots de peinture pour une pièce",
    ],
    guide: `Un projet immobilier se joue en trois temps : savoir combien on peut financer, connaître le coût réel de l'achat, puis chiffrer les travaux. Les outils de cette catégorie suivent cet ordre.

Pour le financement, le simulateur de prêt immobilier calcule la mensualité, le coût des intérêts et de l'assurance, et le tableau d'amortissement. Les banques appliquent la norme du HCSF : un taux d'endettement de 35 % maximum, assurance comprise, sur 25 ans au plus (27 ans dans le neuf avec différé). Les outils capacité d'emprunt et assurance emprunteur permettent de partir de vos revenus pour trouver le budget finançable et de mesurer ce que rapporte une délégation d'assurance, possible à tout moment depuis la loi Lemoine. Si vous avez déjà plusieurs crédits, le calculateur de rachat de crédit compare vos mensualités actuelles à un prêt unique et montre le coût total : une mensualité plus basse sur une durée plus longue coûte souvent plus cher au final.

Le simulateur PTZ 2026 applique les quotités par tranche de revenus : 50, 40, 40 ou 20 % du coût de l'opération pour un logement neuf en collectif, 30, 20, 20 ou 10 % pour une maison individuelle neuve. Le prêt dure jusqu'à 25 ans, avec un différé de remboursement pouvant aller jusqu'à 10 ans pour les ménages les plus modestes. Dans l'ancien, il est réservé aux zones B2 et C avec un volume de travaux minimum.

Le calculateur de frais de notaire détaille les droits de mutation, les émoluments et les frais annexes, département par département. Comptez environ 7 à 8 % du prix dans l'ancien et 2 à 3 % dans le neuf. Pour les locataires, le simulateur APL estime l'aide au logement selon la zone (1, 2 ou 3), le loyer, les ressources et la composition du foyer. Pour les investisseurs, le calculateur de rentabilité locative passe du rendement brut au rendement net et au cashflow, et le simulateur de plus-value immobilière applique les abattements pour durée de détention : exonération d'impôt sur le revenu après 22 ans et de prélèvements sociaux après 30 ans.

Le calculateur DPE estime la classe énergétique de A à G à partir de la consommation et des émissions. Depuis le 1er janvier 2026, le coefficient de conversion de l'électricité en énergie primaire est passé de 2,3 à 1,9, ce qui améliore mécaniquement l'étiquette de nombreux logements chauffés à l'électricité. L'enjeu est concret : les logements classés G ne peuvent plus faire l'objet d'un nouveau bail depuis 2025, et les F suivront en 2028. Le simulateur MaPrimeRénov' aide à estimer les aides aux travaux de rénovation énergétique selon vos revenus.

Pour les travaux, trois calculateurs évitent d'acheter trop ou pas assez. Le calculateur de surface donne l'aire d'une pièce ou d'un terrain (rectangle, cercle, triangle, trapèze). Le calculateur de béton convertit les dimensions d'une dalle, d'une fondation ou d'un poteau en mètres cubes et en sacs de 25 ou 35 kg. Le calculateur de peinture déduit portes et fenêtres de la surface des murs et tient compte du nombre de couches et du rendement du produit pour donner les litres et le nombre de pots.`,
    faqItems: [
      {
        question: "Comment les banques calculent-elles le taux d'endettement ?",
        answer:
          "Elles divisent l'ensemble des mensualités de crédit, assurance comprise, par les revenus nets mensuels avant impôt. Le HCSF fixe le plafond à 35 %, avec une marge de dérogation limitée pour les banques. Au-delà du taux, elles regardent aussi le reste à vivre, c'est-à-dire ce qu'il reste au foyer après paiement des crédits.",
      },
      {
        question: "Quelle part du prix le PTZ 2026 peut-il financer ?",
        answer:
          "Cela dépend du logement et de vos revenus. Pour un appartement neuf, la quotité est de 50 % pour la tranche de revenus la plus modeste, puis 40 %, 40 % et 20 %. Pour une maison individuelle neuve, elle est de 30 %, 20 %, 20 % et 10 %. Le coût de l'opération retenu est plafonné selon la zone et la taille du foyer.",
      },
      {
        question: "Pourquoi mon DPE a-t-il changé sans travaux ?",
        answer:
          "Depuis le 1er janvier 2026, l'électricité est comptée avec un coefficient d'énergie primaire de 1,9 au lieu de 2,3. Un logement chauffé à l'électricité affiche donc une consommation en énergie primaire plus faible et peut gagner une classe. Un nouveau diagnostic ou une mise à jour de l'attestation est nécessaire pour en profiter officiellement.",
      },
      {
        question: "Combien de peinture prévoir pour une pièce ?",
        answer:
          "Calculez la surface des murs (périmètre multiplié par la hauteur), retirez portes et fenêtres, multipliez par le nombre de couches, puis divisez par le rendement indiqué sur le pot, souvent autour de 10 m² par litre. Le calculateur de peinture fait ce calcul et arrondit au nombre de pots.",
      },
    ],
  },

  business: {
    name: "Entreprise & freelance",
    icon: "\u{1F4BC}",
    intro:
      "Pour créer et faire tourner une petite entreprise : choix du statut, simulateur micro-entrepreneur 2026, TJM, freelance ou CDI, TVA, marge, factures et documents légaux du site.",
    useCases: [
      "Comparer ce qu'il vous reste en micro-entreprise, EURL ou SASU face à un CDI pour le même chiffre d'affaires",
      "Simuler vos cotisations micro-entrepreneur aux taux 2026 (12,3 %, 21,2 % ou 25,6 %) avec ou sans ACRE",
      "Fixer un TJM qui couvre charges, congés, jours non facturés et frais professionnels",
      "Passer du HT au TTC aux taux de 20, 10, 5,5 ou 2,1 % et calculer votre taux de marge",
      "Générer mentions légales, politique de confidentialité et signature email pour votre activité",
    ],
    guide: `Cette catégorie suit le parcours d'un indépendant : choisir sa structure, fixer ses prix, facturer, puis mettre en conformité son site.

Le premier choix est celui du statut. L'outil choisir son statut juridique oriente entre micro-entreprise, entreprise individuelle, EURL et SASU selon votre activité et vos besoins. Le comparateur freelance vs CDI met ensuite des chiffres en face : à partir d'un TJM et d'un nombre de jours facturés, il calcule le revenu net en micro, en EURL et en SASU, et le compare au net d'un salarié. En SASU, les dividendes subissent le PFU de 31,4 % depuis 2026, ce qui change l'arbitrage entre rémunération et dividendes.

Le simulateur auto-entrepreneur applique les taux de cotisations 2026 : 12,3 % pour la vente de marchandises, 21,2 % pour les prestations de services commerciales ou artisanales (BIC) et 25,6 % pour les professions libérales (BNC), ou 23,2 % pour celles qui relèvent de la CIPAV. Les plafonds de chiffre d'affaires sont de 83 600 € pour les services et 203 100 € pour la vente. Pour les entreprises créées à partir du 1er juillet 2026, l'ACRE réduit les cotisations de 25 % pendant la première année, contre 50 % auparavant. L'outil intègre aussi l'option pour le versement libératoire de l'impôt.

La TVA est un autre seuil à surveiller : la franchise en base s'applique jusqu'à 37 500 € de chiffre d'affaires pour les services et 85 000 € pour la vente. Au-delà, vous facturez la TVA, et le calculateur de TVA convertit HT et TTC aux taux français (20 %, 10 %, 5,5 % et 2,1 %). Le calculateur de marge distingue taux de marge et taux de marque, deux notions souvent confondues : acheter 60 € et vendre 100 € donne une marge de 40 €, soit 66,7 % de taux de marge mais 40 % de taux de marque.

Le calculateur de TJM freelance part du revenu net visé et remonte au tarif journalier en tenant compte des cotisations, des congés, des jours non facturables (prospection, administratif, formation) et des frais. Le générateur de factures produit ensuite une facture avec les mentions obligatoires, plusieurs lignes et la TVA. Depuis le 1er septembre 2026, toutes les entreprises assujetties doivent pouvoir recevoir des factures électroniques ; l'obligation d'émettre au format électronique concerne les PME et micro-entreprises à partir du 1er septembre 2027.

Enfin, trois générateurs couvrent la présence en ligne : les mentions légales exigées par la loi pour la confiance dans l'économie numérique, une politique de confidentialité qui décrit vos traitements de données au sens du RGPD, et une signature email HTML à coller dans Gmail, Outlook ou Apple Mail.`,
    faqItems: [
      {
        question: "Que se passe-t-il si je dépasse les plafonds de la micro-entreprise ?",
        answer:
          "Les plafonds sont de 83 600 € de chiffre d'affaires pour les prestations de services et 203 100 € pour la vente. Si vous les dépassez deux années civiles consécutives, vous basculez au régime réel à partir du 1er janvier suivant. Le seuil de franchise de TVA (37 500 € en services, 85 000 € en vente) est distinct et bien plus bas : vous pouvez devoir facturer la TVA tout en restant micro-entrepreneur.",
      },
      {
        question: "L'ACRE est-elle toujours de 50 % en 2026 ?",
        answer:
          "Non pour les nouvelles créations. Pour une entreprise créée à partir du 1er juillet 2026, l'ACRE réduit les cotisations de 25 % pendant la première année d'activité. Les créations antérieures conservent la réduction de 50 %. Le simulateur auto-entrepreneur applique le taux correspondant à votre date de création.",
      },
      {
        question: "Les mentions légales générées suffisent-elles ?",
        answer:
          "Elles couvrent les informations exigées dans les cas courants : identité de l'éditeur, numéro SIREN ou RCS, directeur de la publication, hébergeur. Relisez-les et complétez-les si votre activité est réglementée ou si vous vendez en ligne, auquel cas des conditions générales de vente sont aussi nécessaires.",
      },
      {
        question: "Les informations de mes factures sont-elles stockées ?",
        answer:
          "Les données saisies dans le générateur de factures et les autres générateurs restent dans votre navigateur et ne sont pas envoyées à Outilis.fr. Pensez à enregistrer votre PDF, car rien n'est conservé côté serveur.",
      },
    ],
  },

  dev: {
    name: "Développeur & web",
    icon: "\u{1F4BB}",
    intro:
      "La boîte à outils du développeur web et de l'intégrateur : JSON, CSV, Base64, regex, Markdown, couleurs, dégradés CSS, px en rem, slugs et robots.txt. Tout tourne dans le navigateur.",
    useCases: [
      "Formater, valider et minifier un JSON d'API, ou le convertir en CSV pour un tableur",
      "Tester une expression régulière sur un texte réel et voir les groupes capturés",
      "Convertir une couleur HEX en RGB ou HSL et générer un dégradé CSS prêt à coller",
      "Passer une maquette en pixels à des unités rem pour une typographie accessible",
      "Créer un slug propre et un robots.txt avec l'URL de votre sitemap",
    ],
    guide: `Ces onze outils répondent aux petites tâches qui interrompent le développement : un JSON illisible, une regex à mettre au point, une couleur à convertir. Ils s'utilisent sans installation ni compte, et vos données, y compris un JSON de production ou un jeton encodé, ne quittent pas votre navigateur.

Pour les données, l'optimiseur JSON formate, valide, minifie et trie les clés, avec coloration syntaxique et statistiques. Il signale la position d'une erreur de syntaxe, pratique pour trouver la virgule finale ou le guillemet manquant. Le convertisseur JSON / CSV transforme un tableau d'objets en fichier CSV ouvrable dans Excel ou LibreOffice, et inversement. L'encodeur Base64 encode et décode du texte ; rappelons que Base64 est un encodage, pas un chiffrement : n'importe qui peut relire la valeur. Le convertisseur de numération passe entre décimal, binaire, octal et hexadécimal, utile pour les masques de bits ou les permissions Unix.

Le testeur de regex évalue votre expression en temps réel sur un texte d'exemple, affiche les correspondances et les groupes, et gère les drapeaux (g, i, m, s). Une bibliothèque de motifs courants (email, date, code postal) sert de point de départ. L'éditeur Markdown offre un aperçu en direct et exporte en HTML ou en fichier .md, par exemple pour rédiger un README.

Côté interface, le convertisseur de couleurs passe entre HEX, RGB et HSL. HSL est le format le plus simple pour décliner une palette : on garde la teinte et on fait varier la luminosité. Le générateur de gradient produit le code CSS de dégradés linéaires et radiaux, avec angle et points de couleur. Le convertisseur px / rem calcule les équivalences à partir de la taille de police racine (16 px par défaut dans les navigateurs) : exprimer les tailles en rem permet à la mise en page de suivre la taille de texte choisie par l'utilisateur.

Enfin, deux outils touchent au référencement technique. Le générateur de slug transforme un titre en URL propre : minuscules, accents retirés, espaces remplacés par des tirets. Le générateur de robots.txt produit un fichier valide avec des préréglages, les chemins à bloquer, un éventuel Crawl-delay et la ligne Sitemap. Attention à une confusion fréquente : bloquer une page dans robots.txt empêche son exploration mais pas forcément son indexation. Pour retirer une page de Google, laissez-la explorable et ajoutez une balise meta robots noindex.`,
    faqItems: [
      {
        question: "Puis-je coller des données sensibles dans ces outils ?",
        answer:
          "Les traitements (formatage JSON, conversion CSV, Base64, regex) se font en JavaScript dans votre navigateur et rien n'est envoyé à Outilis.fr. Par prudence, évitez tout de même de coller des secrets de production sur un poste partagé et videz le presse-papiers après usage.",
      },
      {
        question: "Quelle est la différence entre px et rem ?",
        answer:
          "Le pixel est une taille fixe. Le rem est relatif à la taille de police de l'élément racine (html), 16 px par défaut. Si l'utilisateur augmente la taille du texte dans son navigateur, les tailles en rem suivent, pas celles en pixels. Avec une racine à 16 px, 24 px valent 1,5 rem.",
      },
      {
        question: "Le robots.txt suffit-il à désindexer une page ?",
        answer:
          "Non. Il indique aux robots ce qu'ils peuvent explorer, mais une URL bloquée peut rester dans l'index si d'autres sites pointent vers elle. Pour une désindexation, utilisez la balise meta robots noindex ou l'en-tête HTTP X-Robots-Tag, sur une page que Google peut explorer.",
      },
    ],
  },

  image: {
    name: "Image, vidéo & PDF",
    icon: "\u{1F5BC}️",
    intro:
      "Compressez, convertissez et retouchez images, vidéos, fichiers audio et PDF directement dans le navigateur : vos fichiers ne sont pas téléversés sur un serveur.",
    useCases: [
      "Réduire le poids d'une photo en JPEG ou WebP avant de l'envoyer par email ou de la publier",
      "Fusionner plusieurs PDF en un seul dossier (justificatifs, dossier de location) dans l'ordre voulu",
      "Extraire le texte d'un PDF numérique pour le copier ou le retravailler",
      "Couper une vidéo, en faire un GIF ou la compresser avant de la partager",
      "Extraire la bande son d'une vidéo ou convertir un fichier audio en MP3, WAV, OGG ou AAC",
    ],
    guide: `La plupart des services en ligne de conversion demandent de téléverser vos fichiers sur leurs serveurs. Ici, le traitement se fait sur votre appareil, grâce aux API du navigateur et à des bibliothèques WebAssembly. C'est un vrai avantage pour des documents personnels (pièce d'identité, avis d'imposition, bulletins de salaire) que l'on préfère ne pas confier à un tiers. La contrepartie : la vitesse dépend de votre ordinateur ou téléphone, et les fichiers très lourds peuvent saturer la mémoire.

Pour les images, le compresseur réduit le poids des JPEG et WebP avec un curseur de qualité et une comparaison avant/après ; une qualité autour de 75 à 80 % est souvent invisible à l'œil pour une photo. Le redimensionneur change les dimensions en pixels ou en pourcentage avec ratio verrouillé, et le convertisseur de format passe entre PNG, JPEG, WebP et BMP. Règle simple : JPEG ou WebP pour les photos, PNG pour les captures d'écran, logos et images avec transparence. L'éditeur photo propose courbes, calques, filtres et histogramme, ainsi que des fonctions d'IA (suppression du fond, effet bokeh, super-résolution) dont les modèles sont téléchargés puis exécutés localement. Le générateur d'avatar crée une image à partir de vos initiales, exportée en PNG.

Pour les PDF, le fusionneur assemble plusieurs fichiers en un seul et permet de réordonner les documents par glisser-déposer. L'outil PDF vers texte affiche les métadonnées et les dimensions des pages, extrait le texte et permet de télécharger des pages séparément. L'extraction ne fonctionne que sur les PDF contenant du texte numérique : un document scanné est une image et nécessiterait une reconnaissance de caractères.

Pour la vidéo, l'éditeur vidéo regroupe huit opérations (couper, convertir, redimensionner, créer un GIF, capturer une image, changer la vitesse, pivoter) en s'appuyant sur FFmpeg compilé en WebAssembly. Le compresseur vidéo propose trois niveaux de qualité et produit un fichier WebM. Pour l'audio, l'extracteur récupère la piste son d'une vidéo avec sa forme d'onde, et le convertisseur audio passe entre MP3, WAV, OGG et AAC avec un débit configurable. Comptez plus de temps sur mobile : l'encodage vidéo est gourmand.`,
    faqItems: [
      {
        question: "Mes fichiers sont-ils envoyés sur un serveur ?",
        answer:
          "Non. Images, PDF, vidéos et sons sont lus et traités dans votre navigateur. Certains outils téléchargent au premier usage une bibliothèque (FFmpeg pour la vidéo et l'audio, un moteur PDF, les modèles d'IA de l'éditeur photo), mais c'est le code qui vient vers vous, pas vos fichiers qui partent.",
      },
      {
        question: "Pourquoi le traitement d'une vidéo est-il lent ?",
        answer:
          "Le réencodage vidéo se fait avec le processeur de votre appareil, sans serveur dédié. Une vidéo longue ou en haute définition peut prendre plusieurs minutes, surtout sur téléphone. Pour aller plus vite, coupez d'abord le passage utile ou réduisez la résolution.",
      },
      {
        question: "Pourquoi l'extraction de texte ne marche-t-elle pas sur mon PDF ?",
        answer:
          "Votre PDF est probablement un scan : chaque page est une image, sans couche de texte. L'outil PDF vers texte lit uniquement le texte numérique intégré au fichier. Un logiciel de reconnaissance optique de caractères (OCR) est nécessaire pour les documents scannés.",
      },
      {
        question: "Quel format choisir pour une image sur le web ?",
        answer:
          "WebP donne en général des fichiers plus légers que JPEG à qualité égale et gère la transparence. JPEG reste le plus compatible pour les photos, PNG est adapté aux captures d'écran, logos et graphiques avec aplats de couleur.",
      },
    ],
  },

  outils: {
    name: "Quotidien",
    icon: "\u{1F527}",
    intro:
      "Les petits calculs et outils de tous les jours : remise, pourboire, partage des dépenses entre amis, consommation d'essence, empreinte CO2, QR code, minuteur, Pomodoro et test de frappe.",
    useCases: [
      "Calculer le prix final après des remises cumulées, par exemple -30 % puis -20 % en soldes",
      "Répartir les dépenses d'un week-end ou d'une colocation et savoir qui doit rembourser qui",
      "Mesurer la consommation réelle de votre voiture en L/100 km et le budget carburant d'un trajet",
      "Créer un QR code pour le Wi-Fi de la maison ou un lien, et scanner un QR code avec la caméra",
      "Organiser une séance de travail en cycles Pomodoro ou lancer un compte à rebours",
    ],
    guide: `Cette catégorie rassemble des outils sans lien avec la fiscalité ou le travail, mais qui servent souvent : au magasin, en voyage, entre amis ou devant l'ordinateur.

Le calculateur de remise évite un piège classique : deux réductions successives ne s'additionnent pas. Une remise de 30 % suivie d'une seconde de 20 % donne 44 % de réduction au total, pas 50 %, car la seconde s'applique sur un prix déjà réduit. L'outil calcule le prix final et l'économie réalisée, même avec plusieurs remises en cascade. Le calculateur de pourboire compare plusieurs taux et répartit l'addition entre convives ; en France, le service est compris dans les prix affichés et le pourboire reste facultatif, alors qu'il est attendu dans d'autres pays comme les États-Unis.

Le calculateur de partage de frais sert après un voyage, une colocation ou un cadeau commun. Chacun saisit ce qu'il a payé, et l'outil calcule le nombre minimal de remboursements pour équilibrer les comptes, au lieu d'une série de virements croisés.

Sur la route, le calculateur de consommation d'essence donne la consommation réelle en L/100 km à partir d'un plein, le coût au kilomètre et le budget carburant d'un trajet. Le calculateur d'empreinte carbone estime les émissions de CO2 d'un déplacement en voiture, en avion ou en train, ou de votre consommation d'énergie, avec des équivalences parlantes. La comparaison entre modes de transport est souvent le résultat le plus instructif.

Le générateur de QR code crée des codes pour un lien, un texte, un email ou un réseau Wi-Fi, avec couleurs et taille personnalisables ; vos invités scannent le code et se connectent sans taper la clé. Le scanner de QR code lit un code via la caméra ou depuis une image, pratique pour vérifier l'adresse vers laquelle il pointe avant de l'ouvrir.

Pour le temps, le minuteur combine compte à rebours avec alarme et chronomètre avec tours. Le timer Pomodoro alterne 25 minutes de travail et 5 minutes de pause, avec notifications et statistiques. Le test de vitesse de frappe mesure vos mots par minute et votre précision sur des textes français, en 30, 60 ou 120 secondes.`,
    faqItems: [
      {
        question: "Comment calculer deux remises successives ?",
        answer:
          "Multipliez les coefficients : une remise de 30 % correspond à un coefficient de 0,7 et une remise de 20 % à 0,8. 0,7 × 0,8 = 0,56, soit un prix final égal à 56 % du prix initial et une réduction totale de 44 %. Le calculateur de remise fait ce calcul pour autant de remises que nécessaire.",
      },
      {
        question: "Un QR code généré ici expire-t-il ?",
        answer:
          "Non. Le QR code contient directement votre lien, votre texte ou vos identifiants Wi-Fi ; il ne passe par aucun service de redirection. Il fonctionnera tant que le contenu encodé reste valable, par exemple tant que le mot de passe Wi-Fi ne change pas.",
      },
      {
        question: "Le scanner de QR code enregistre-t-il les images de la caméra ?",
        answer:
          "Non. Le flux de la caméra est analysé dans votre navigateur et n'est pas envoyé à Outilis.fr. L'historique des scans est conservé dans votre navigateur le temps de la session.",
      },
    ],
  },

  sante: {
    name: "Santé",
    icon: "\u{2695}️",
    intro:
      "Des calculateurs santé fondés sur des formules reconnues (OMS, Mifflin-St Jeor, Widmark) : IMC, besoins caloriques, calories brûlées, grossesse et alcoolémie. Des repères informatifs, pas un avis médical.",
    useCases: [
      "Calculer votre IMC et situer le résultat dans les catégories de l'OMS",
      "Estimer votre dépense énergétique quotidienne (TDEE) et une répartition des macronutriments",
      "Estimer les calories dépensées pendant une séance de course, de vélo ou de natation",
      "Connaître la date prévue d'accouchement et la semaine de grossesse en cours",
      "Estimer un taux d'alcoolémie et le temps nécessaire pour revenir à zéro",
    ],
    guide: `Les outils santé donnent des repères chiffrés à partir de formules scientifiques publiées. Ils ne remplacent pas un avis médical, mais aident à comprendre un résultat ou à préparer une question pour un professionnel de santé.

Le calculateur d'IMC applique la formule de l'OMS : le poids en kilogrammes divisé par le carré de la taille en mètres. Le résultat est classé en insuffisance pondérale (moins de 18,5), corpulence normale (18,5 à 24,9), surpoids (25 à 29,9) et obésité (30 et plus). L'outil indique aussi la fourchette de poids correspondant à un IMC normal pour votre taille. L'IMC a une limite connue : il ne distingue pas le muscle de la graisse, et un sportif très musclé peut être classé en surpoids.

Le calculateur TDEE utilise l'équation de Mifflin-St Jeor pour estimer le métabolisme de base, les calories dépensées au repos, puis applique un coefficient selon votre niveau d'activité. Il propose des objectifs de maintien, de perte ou de prise de poids et une répartition entre protéines, glucides et lipides. Un déficit d'environ 500 kcal par jour correspond à une perte de l'ordre de 0,5 kg par semaine.

Le calculateur de calories brûlées couvre 19 activités (course, vélo, natation, marche, musculation, yoga…). Il multiplie l'équivalent métabolique (MET) de l'activité par votre poids et la durée. Ces valeurs sont des moyennes : l'intensité réelle et la condition physique font varier la dépense.

Le calculateur de grossesse part de la date des dernières règles pour estimer la date prévue d'accouchement, la semaine d'aménorrhée, le trimestre et les étapes clés comme les échographies du premier, deuxième et troisième trimestre. La date retenue par le suivi médical, souvent recalée lors de la première échographie, fait foi.

Le calculateur d'alcoolémie applique la formule de Widmark, qui tient compte du nombre de verres, du poids, du sexe et du temps écoulé. C'est un outil éducatif : la limite légale en France est de 0,5 g d'alcool par litre de sang, et de 0,2 g/l pour les conducteurs en permis probatoire. L'élimination moyenne est d'environ 0,10 à 0,15 g/l par heure, et rien ne l'accélère. Ne vous fiez jamais à cette estimation pour décider de prendre le volant.`,
    faqItems: [
      {
        question: "Ces outils ont-ils une valeur médicale ?",
        answer:
          "Non. Ils reposent sur des formules générales (OMS, Mifflin-St Jeor, Widmark) qui ne tiennent pas compte de vos antécédents, de vos traitements ou d'une situation particulière. Pour toute question de santé, adressez-vous à un médecin, une sage-femme ou un diététicien.",
      },
      {
        question: "Quelle formule sert au calcul du métabolisme de base ?",
        answer:
          "L'équation de Mifflin-St Jeor (1990), considérée comme l'une des plus fiables pour la population générale. Pour un homme : 10 × poids (kg) + 6,25 × taille (cm) − 5 × âge + 5. Pour une femme, la même formule avec −161 à la place de +5.",
      },
      {
        question: "Le calculateur d'alcoolémie est-il fiable ?",
        answer:
          "Il donne un ordre de grandeur. L'alcoolémie réelle dépend de l'alimentation, de la fatigue, des médicaments et du métabolisme de chacun. Seul un éthylotest ou une prise de sang mesure le taux réel. En cas de doute, ne conduisez pas.",
      },
      {
        question: "Mes données de santé sont-elles enregistrées ?",
        answer:
          "Non. Poids, taille, date des dernières règles ou consommation d'alcool sont traités dans votre navigateur et ne sont pas transmis à Outilis.fr.",
      },
    ],
  },

  securite: {
    name: "Sécurité",
    icon: "\u{1F512}",
    intro:
      "Générez des mots de passe robustes : aléatoires, prononçables ou pour votre box Wi-Fi avec QR code. Ils sont créés dans votre navigateur par un générateur cryptographique et ne sont jamais transmis.",
    useCases: [
      "Générer un mot de passe aléatoire de 16 caractères ou plus avec chiffres et symboles",
      "Créer un mot de passe prononçable, plus facile à retenir et à dicter",
      "Générer une clé Wi-Fi solide et un QR code pour que vos invités se connectent sans la taper",
    ],
    guide: `Un mot de passe court se casse en quelques secondes par force brute, et un mot de passe réutilisé tombe dès qu'un site où vous l'avez employé subit une fuite. Les trois générateurs de cette catégorie produisent des mots de passe longs et imprévisibles, à ranger ensuite dans un gestionnaire.

Le générateur de mot de passe crée des séquences de 4 à 64 caractères, en choisissant d'inclure majuscules, minuscules, chiffres et symboles. L'indicateur de force se base sur l'entropie, qui mesure l'imprévisibilité en bits. Chaque caractère ajouté multiplie le nombre de combinaisons : la longueur compte davantage que la complexité. Visez au moins 16 caractères pour un compte important (messagerie principale, banque, gestionnaire de mots de passe).

Le générateur de mot de passe prononçable assemble des syllabes pour former des pseudo-mots plus faciles à mémoriser ou à dicter au téléphone, tout en restant aléatoires. Il est utile pour les rares mots de passe que l'on doit taper de mémoire, comme celui qui déverrouille votre gestionnaire.

Le générateur de mot de passe Wi-Fi produit une clé longue et solide, et un QR code au format standard : un smartphone qui le scanne se connecte directement. Utilisez de préférence le chiffrement WPA3 si votre box et vos appareils le prennent en charge, ou WPA2 avec AES à défaut.

Les bonnes pratiques restent simples : un mot de passe différent par service, la double authentification activée partout où elle existe, et un gestionnaire de mots de passe (Bitwarden, KeePass, 1Password ou celui de votre navigateur) pour ne rien avoir à retenir.

Tous les générateurs utilisent l'API Web Crypto du navigateur (crypto.getRandomValues), une source d'aléa conçue pour la cryptographie, contrairement à Math.random(). Les mots de passe sont créés sur votre appareil et ne sont ni envoyés ni enregistrés par Outilis.fr.`,
    faqItems: [
      {
        question: "Comment savoir si mon mot de passe est assez fort ?",
        answer:
          "L'indicateur mesure l'entropie en bits. En dessous de 40 bits, le mot de passe est faible. Au-delà de 80 bits, il est considéré comme fort. Un mot de passe de 16 caractères mélangeant les quatre types de caractères dépasse 100 bits, largement hors de portée d'une attaque par force brute.",
      },
      {
        question: "Les mots de passe générés sont-ils vraiment aléatoires ?",
        answer:
          "Oui. Ils proviennent de crypto.getRandomValues, le générateur cryptographique intégré au navigateur, et non de Math.random(), dont la sortie est prévisible. La génération se fait sur votre appareil.",
      },
      {
        question: "Faut-il changer ses mots de passe régulièrement ?",
        answer:
          "Les recommandations ont évolué : l'ANSSI en France et le NIST aux États-Unis ne préconisent plus de changement périodique systématique. Changez un mot de passe s'il a pu être compromis (fuite de données, hameçonnage). L'essentiel est d'avoir des mots de passe uniques et longs, stockés dans un gestionnaire.",
      },
    ],
  },

  conversion: {
    name: "Conversions & calculs",
    icon: "\u{1F504}",
    intro:
      "Pourcentages, écarts entre deux dates, âge exact, vitesse, durées, unités, température et tailles de vêtements : les conversions et calculs rapides, avec la formule affichée.",
    useCases: [
      "Calculer une variation en pourcentage, par exemple l'augmentation d'un loyer ou d'un prix",
      "Compter les jours entre deux dates ou trouver la date d'une échéance à 30, 60 ou 90 jours",
      "Obtenir un âge exact en années, mois et jours et le décompte avant le prochain anniversaire",
      "Retrouver la vitesse moyenne, la distance ou le temps d'un trajet à partir des deux autres valeurs",
      "Trouver la correspondance d'une pointure ou d'une taille entre tailles européennes, américaines et britanniques",
    ],
    guide: `Ces calculs paraissent simples, mais ce sont ceux où l'on se trompe le plus souvent de tête. Chaque outil de la catégorie donne le résultat et la méthode, pour que vous puissiez le vérifier.

Le calculateur de pourcentage propose trois modes : X % d'une valeur, la variation en pourcentage entre deux valeurs, et la part d'un total. Le piège le plus courant concerne les hausses et baisses successives : un prix qui augmente de 20 % puis baisse de 20 % ne revient pas à son niveau de départ. 100 devient 120, puis 96. De même, une variation se calcule toujours par rapport à la valeur de départ : passer de 50 à 75 est une hausse de 50 %, mais revenir de 75 à 50 est une baisse de 33,3 %.

Le calculateur de dates compte les jours entre deux dates et ajoute ou retranche un nombre de jours, en tenant compte des années bissextiles. Il sert pour un délai de rétractation, un préavis, une échéance de paiement ou le nombre de jours avant un événement. Vérifiez toujours si le délai qui vous concerne se compte en jours calendaires, ouvrables ou ouvrés : la règle change selon les textes. Le calculateur d'âge donne l'âge exact en années, mois et jours et le nombre de jours avant le prochain anniversaire.

Le calculateur de vitesse relie vitesse, distance et temps : entrez deux valeurs, il donne la troisième, avec conversion entre km/h, m/s et mph. Pour passer de m/s à km/h, on multiplie par 3,6. Le convertisseur de temps passe des secondes aux minutes, heures, jours, semaines, mois et années, pratique pour transformer une durée en minutes décimales ou l'inverse (1,5 heure = 1 h 30, pas 1 h 50).

Le convertisseur d'unités couvre longueur, masse, température, surface et volume. Le convertisseur de température traite Celsius, Fahrenheit et Kelvin avec les formules affichées (°F = °C × 1,8 + 32). Enfin, le convertisseur de tailles donne les correspondances EU, US et UK pour les vêtements et chaussures, homme et femme, utile pour commander sur un site étranger. Les tailles varient d'une marque à l'autre : consultez aussi le guide du vendeur.`,
    faqItems: [
      {
        question: "Pourquoi +20 % puis -20 % ne donne-t-il pas le prix de départ ?",
        answer:
          "Parce que la baisse s'applique sur le prix déjà augmenté. 100 × 1,2 = 120, puis 120 × 0,8 = 96. Le résultat est inférieur de 4 % au prix initial. Pour revenir à 100 depuis 120, il faut une baisse de 16,7 %.",
      },
      {
        question: "Le calculateur de dates compte-t-il le premier et le dernier jour ?",
        answer:
          "Il calcule l'écart entre les deux dates, sans compter le jour de départ : du 1er au 3 du mois, il y a 2 jours d'écart. Si votre délai doit inclure les deux bornes, ajoutez un jour. Pour un délai légal, vérifiez la règle de computation applicable (jours calendaires, ouvrables ou ouvrés).",
      },
      {
        question: "Comment convertir des minutes en heures décimales ?",
        answer:
          "Divisez les minutes par 60. 45 minutes font 0,75 heure, 1 h 30 fait 1,5 heure. C'est le format utilisé dans les tableurs et sur de nombreuses feuilles de temps. Le convertisseur de temps fait la conversion dans les deux sens.",
      },
    ],
  },

  texte: {
    name: "Texte",
    icon: "\u{1F4DD}",
    intro:
      "Compter les mots et caractères, comparer deux versions d'un texte, générer du faux texte pour une maquette ou styliser un pseudo en Unicode : les outils pour écrire et relire.",
    useCases: [
      "Vérifier qu'un texte respecte une limite de caractères ou de mots (dossier, candidature, publication)",
      "Estimer le temps de lecture d'un article ou la durée d'un discours",
      "Repérer ce qui a changé entre deux versions d'un contrat, d'un CV ou d'un article",
      "Remplir une maquette avec du lorem ipsum avant d'avoir le contenu définitif",
      "Écrire en gras ou en italique Unicode dans une bio de réseau social qui n'accepte pas la mise en forme",
    ],
    guide: `Les quatre outils de cette catégorie s'adressent à ceux qui écrivent : étudiants, rédacteurs, candidats, community managers ou développeurs qui préparent une maquette.

Le compteur de mots affiche en direct le nombre de mots, de caractères avec et sans espaces, de phrases et de paragraphes, ainsi que le temps de lecture et de parole estimés. La distinction entre caractères avec et sans espaces compte : un dossier de candidature ou un formulaire administratif précise généralement laquelle s'applique, et l'écart dépasse facilement 15 %. Le temps de parole est utile pour caler un discours ou une présentation orale sur une durée imposée.

Le comparateur de texte met deux versions côte à côte et surligne les différences ligne par ligne : ajouts en vert, suppressions en rouge. Il sert à vérifier les modifications apportées à un contrat ou à un bail avant signature, à relire les corrections d'un collègue, ou à comparer deux versions d'un fichier de configuration sans outil de gestion de versions.

Le générateur de lorem ipsum produit du texte factice en paragraphes, phrases ou mots. Il permet de juger une mise en page sur un volume de texte réaliste, sans que le lecteur soit distrait par le sens. Pensez à le remplacer avant la mise en ligne : du lorem ipsum publié par erreur nuit à la crédibilité d'un site et à son référencement.

Le générateur de texte stylisé convertit votre texte en caractères Unicode spéciaux (gras, italique, barré, monospace, lettres encerclées) que l'on peut coller dans une bio Instagram, un profil ou un message là où la mise en forme n'existe pas. Ce ne sont pas des lettres ordinaires mais des symboles mathématiques : les lecteurs d'écran les lisent mal ou pas du tout, et les moteurs de recherche ne les reconnaissent pas comme des mots. Réservez-les à quelques mots d'accroche, jamais à une information importante.

Le texte que vous saisissez dans ces outils reste dans votre navigateur ; vous pouvez y coller un document confidentiel.`,
    faqItems: [
      {
        question: "Faut-il compter les caractères avec ou sans espaces ?",
        answer:
          "Cela dépend de la consigne. Les limites des réseaux sociaux et des formulaires en ligne comptent généralement les espaces ; certains concours, revues ou dossiers précisent « espaces non compris ». Le compteur de mots affiche les deux valeurs pour que vous puissiez appliquer la bonne.",
      },
      {
        question: "Le texte stylisé Unicode fonctionne-t-il partout ?",
        answer:
          "Il s'affiche sur la plupart des appareils récents, mais certaines polices n'ont pas tous les symboles et affichent des carrés vides. Il pose surtout un problème d'accessibilité : les lecteurs d'écran épellent ou ignorent ces caractères. Utilisez-le avec parcimonie.",
      },
      {
        question: "Le comparateur de texte envoie-t-il mes documents quelque part ?",
        answer:
          "Non. La comparaison est calculée dans votre navigateur ; les deux textes ne sont pas transmis à Outilis.fr.",
      },
    ],
  },

  emploi: {
    name: "Emploi & salaire",
    icon: "\u{1F454}",
    intro:
      "Salaire brut en net, heures de travail et heures supplémentaires, prime d'activité, chômage, rupture conventionnelle, CV et emails pros : les outils du salarié et du candidat, à jour 2026.",
    useCases: [
      "Convertir un salaire brut en net (cadre, non-cadre, fonction publique) avant de négocier une offre",
      "Totaliser vos heures de la semaine, pauses déduites, et repérer les heures supplémentaires majorées",
      "Estimer votre prime d'activité 2026 à partir de vos revenus et de la composition du foyer",
      "Calculer l'indemnité minimale de rupture conventionnelle et l'allocation chômage qui suivra",
      "Rédiger un CV au format PDF et un email de relance ou de démission",
    ],
    guide: `Cette catégorie accompagne chaque étape de la vie professionnelle : comprendre sa fiche de paie, faire valoir ses heures, préparer un départ et chercher un nouveau poste.

Le calculateur de salaire net / brut convertit dans les deux sens selon le statut. Les cotisations salariales représentent environ 22 % du brut pour un non-cadre et 25 % pour un cadre, qui cotise davantage pour la retraite complémentaire. Les tranches de cotisations dépendent du plafond annuel de la sécurité sociale, fixé à 48 060 € en 2026. Repère utile : le SMIC horaire brut est de 12,31 € depuis le 1er juin 2026, soit 1 867,02 € brut par mois pour 35 heures hebdomadaires. L'outil estime aussi le net après prélèvement à la source.

Le calculateur d'heures de travail additionne les plages de chaque jour, déduit les pauses et compare le total à votre durée contractuelle. Sauf accord d'entreprise ou de branche différent, les heures au-delà de 35 heures sont majorées de 25 % de la 36e à la 43e heure, puis de 50 % au-delà. Tenir ce décompte soi-même est la meilleure preuve en cas de désaccord sur la paie.

Le simulateur de prime d'activité part du montant forfaitaire de 638,28 € pour une personne seule, puis applique les majorations liées au foyer, la bonification individuelle et le forfait logement. Le résultat reste une estimation : la CAF ou la MSA calcule le droit réel sur vos revenus trimestriels déclarés.

Pour un départ, le simulateur de rupture conventionnelle calcule l'indemnité minimale, égale à l'indemnité légale de licenciement : un quart de mois de salaire par année d'ancienneté jusqu'à 10 ans, puis un tiers de mois par année au-delà. Le salaire de référence retenu est le plus favorable entre la moyenne des 12 et des 3 derniers mois. Le simulateur d'allocation chômage estime ensuite l'ARE à partir du salaire journalier de référence, la durée d'indemnisation selon l'âge et le montant mensuel. Pensez au différé d'indemnisation : une indemnité supérieure au minimum légal retarde le premier versement.

Pour la recherche d'emploi, le générateur de CV propose deux modèles, classique et moderne, avec aperçu en direct et export PDF. Le générateur d'email professionnel fournit des trames pour une prise de contact, une relance après candidature, un remerciement après entretien, une demande de réunion ou une lettre de démission, à adapter à votre situation.`,
    faqItems: [
      {
        question: "Quel est le SMIC en 2026 ?",
        answer:
          "Depuis le 1er juin 2026, le SMIC horaire brut est de 12,31 €, soit 1 867,02 € brut par mois pour un temps plein de 35 heures (151,67 heures mensuelles). Le montant net dépend des cotisations applicables ; le calculateur de salaire net / brut donne l'estimation.",
      },
      {
        question: "Comment sont payées les heures supplémentaires ?",
        answer:
          "À défaut d'accord collectif fixant un autre taux (au minimum 10 %), les huit premières heures supplémentaires de la semaine, de la 36e à la 43e, sont majorées de 25 %, les suivantes de 50 %. Le calculateur d'heures de travail isole ces heures pour que vous puissiez les vérifier sur votre bulletin.",
      },
      {
        question: "L'indemnité de rupture conventionnelle peut-elle être inférieure à l'indemnité de licenciement ?",
        answer:
          "Non. Elle ne peut pas être inférieure à l'indemnité légale de licenciement, ou à l'indemnité conventionnelle si votre convention collective prévoit plus. Tout ce qui est au-dessus se négocie avec l'employeur.",
      },
      {
        question: "Mes informations de CV et de salaire sont-elles conservées ?",
        answer:
          "Non. Les données saisies dans le générateur de CV et les simulateurs sont traitées dans votre navigateur et ne sont pas envoyées à Outilis.fr. Téléchargez votre CV en PDF pour le garder.",
      },
    ],
  },
};
