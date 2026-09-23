// Logique de calcul pure du simulateur MaPrimeRénov' 2026 (sans dépendance React).
//
// Règles en vigueur au 23 septembre 2026 — dernière vérification : septembre 2026.
// Sources officielles :
//  [GUIDE] Anah, « Les aides financières en 2026 — Édition septembre 2026 »
//          https://www.anah.gouv.fr/sites/default/files/2026-08/202609_guide-aides-financieres_WEB.pdf
//  [SP]    Service-public, fiche F35083 « MaPrimeRénov' » (vérifiée le 01/09/2026)
//          https://www.service-public.gouv.fr/particuliers/vosdroits/F35083
//  [SP-ACTU] Service-public, actualité A18332 du 27/08/2026 : décret n° 2026-822 du 25 août 2026
//          et trois arrêtés du 25 août 2026 (recentrage du parcours par geste au 1er septembre 2026)
//          https://www.service-public.gouv.fr/particuliers/actualites/A18332
//  [ANAH-LF] Réouverture du guichet à la promulgation de la loi de finances 2026 (tous parcours, tous ménages)
//          https://www.anah.gouv.fr/presse/maprimerenov-reouverture-du-guichet-la-promulgation-de-la-loi-de-finances

export type Categorie = "tres-modeste" | "modeste" | "intermediaire" | "superieur";
export type Zone = "idf" | "hors-idf";

export const CATEGORIES: Categorie[] = ["tres-modeste", "modeste", "intermediaire", "superieur"];

export const CATEGORIE_INFO: Record<Categorie, { couleur: string; libelle: string; hex: string }> = {
  "tres-modeste": { couleur: "Bleu", libelle: "Revenus très modestes", hex: "#1d4ed8" },
  modeste: { couleur: "Jaune", libelle: "Revenus modestes", hex: "#ca8a04" },
  intermediaire: { couleur: "Violet", libelle: "Revenus intermédiaires", hex: "#7c3aed" },
  superieur: { couleur: "Rose", libelle: "Revenus supérieurs", hex: "#db2777" },
};

// ---------------------------------------------------------------------------
// Plafonds de ressources au 1er janvier 2026 (RFR N-1, soit 2025 pour une demande en 2026 [SP]).
// [GUIDE] p. 8 — « Le barème des plafonds de ressources ».
// Colonnes : très modestes, modestes, intermédiaires (au-delà : supérieurs).
// ---------------------------------------------------------------------------
const PLAFONDS_BASE: Record<Zone, number[][]> = {
  idf: [
    [24031, 29253, 40851],
    [35270, 42933, 60051],
    [42357, 51564, 71846],
    [49455, 60208, 84562],
    [56580, 68877, 96817],
  ],
  "hors-idf": [
    [17363, 22259, 31185],
    [25393, 32553, 45842],
    [30540, 39148, 55196],
    [35676, 45735, 64550],
    [40835, 52348, 73907],
  ],
};
// Majoration par personne supplémentaire au-delà de 5 [GUIDE] p. 8.
const MAJORATION_PERSONNE: Record<Zone, number[]> = {
  idf: [7116, 8663, 12257],
  "hors-idf": [5151, 6598, 9357],
};

export function plafondsRessources(zone: Zone, nbPersonnes: number): number[] {
  const n = Math.max(1, Math.floor(nbPersonnes || 1));
  if (n <= 5) return PLAFONDS_BASE[zone][n - 1].slice();
  const base = PLAFONDS_BASE[zone][4];
  return base.map((v, i) => v + (n - 5) * MAJORATION_PERSONNE[zone][i]);
}

export function determinerCategorie(zone: Zone, nbPersonnes: number, rfr: number): Categorie {
  const [tm, m, inter] = plafondsRessources(zone, nbPersonnes);
  if (rfr <= tm) return "tres-modeste";
  if (rfr <= m) return "modeste";
  if (rfr <= inter) return "intermediaire";
  return "superieur";
}

// ---------------------------------------------------------------------------
// Parcours par geste — depuis le 1er septembre 2026 (décret n° 2026-822 [SP-ACTU]),
// seuls les systèmes de chauffage décarbonés restent financés.
// Forfaits au 1er janvier 2026 [GUIDE] p. 15 ; plafonds de dépense éligible [GUIDE] p. 16 ; [SP].
// forfaits = [très modestes, modestes, intermédiaires] ; supérieurs : non éligibles.
// ---------------------------------------------------------------------------
export type GesteId = "pac-air-eau" | "pac-geo" | "reseau-chaleur" | "cuve-fioul" | "audit";

export type Geste = {
  id: GesteId;
  libelle: string;
  forfaits: [number, number, number];
  plafondDepense: number;
  chauffage: boolean; // équipement de chauffage (admis en logement de moins de 15 ans s'il remplace une chaudière fioul)
  travaux: boolean; // l'audit n'est pas un geste de travaux
  coutIndicatif: number; // valeur pré-remplie dans le formulaire (ordre de grandeur, modifiable)
};

export const GESTES: Geste[] = [
  { id: "pac-air-eau", libelle: "Pompe à chaleur air/eau", forfaits: [5000, 4000, 3000], plafondDepense: 12000, chauffage: true, travaux: true, coutIndicatif: 13000 },
  { id: "pac-geo", libelle: "Pompe à chaleur géothermique ou solarothermique", forfaits: [11000, 9000, 6000], plafondDepense: 18000, chauffage: true, travaux: true, coutIndicatif: 22000 },
  { id: "reseau-chaleur", libelle: "Raccordement à un réseau de chaleur et/ou de froid", forfaits: [1200, 800, 400], plafondDepense: 1800, chauffage: true, travaux: true, coutIndicatif: 2500 },
  { id: "cuve-fioul", libelle: "Dépose ou comblement de cuve à fioul", forfaits: [1200, 800, 400], plafondDepense: 4000, chauffage: false, travaux: true, coutIndicatif: 1500 },
  { id: "audit", libelle: "Audit énergétique (hors obligation réglementaire)", forfaits: [500, 400, 300], plafondDepense: 800, chauffage: false, travaux: false, coutIndicatif: 800 },
];

// Travaux qui ne sont plus finançables par geste depuis le 1er septembre 2026 [SP-ACTU] ; [GUIDE] p. 7 et 14.
// Certains restent aidés par les CEE (bonifications « coup de pouce » pour CET et solaire thermique) [GUIDE] p. 32.
export const GESTES_EXCLUS: string[] = [
  "Chaudière biomasse, poêle à granulés ou à bûches, insert (bois et autres biomasses)",
  "Chauffe-eau thermodynamique (PAC dédiée à l’eau chaude sanitaire)",
  "Chauffe-eau solaire individuel, système solaire combiné, capteurs hybrides",
  "Isolation des murs par l’extérieur ou par l’intérieur",
  "Isolation des rampants de toiture, plafonds de combles, toitures-terrasses, planchers bas",
  "Remplacement des fenêtres et portes-fenêtres (menuiseries)",
  "VMC double flux et autres systèmes de ventilation",
  "Pompe à chaleur air/air (jamais éligible à MaPrimeRénov’ ; TVA à 5,5 % depuis septembre 2026)",
];

// Taux d'écrêtement du cumul MaPrimeRénov' + CEE, en % de la dépense éligible TTC [GUIDE] p. 16 et 27.
// Cumul de toutes les aides : 100 % de la dépense éligible.
export const ECRETEMENT_GESTE: Record<Categorie, number> = {
  "tres-modeste": 0.9,
  modeste: 0.75,
  intermediaire: 0.6,
  superieur: 0,
};

const IDX: Record<Categorie, number> = { "tres-modeste": 0, modeste: 1, intermediaire: 2, superieur: 3 };

export type LigneGesteInput = { id: GesteId; coutTTC: number; cee: number };

export type LigneGesteResultat = {
  id: GesteId;
  libelle: string;
  coutTTC: number;
  depenseEligible: number;
  forfait: number;
  plafondCumul: number;
  cee: number;
  prime: number;
  ecretee: boolean;
  resteACharge: number;
};

export type ResultatGeste = {
  eligible: boolean;
  motifs: string[];
  avertissements: string[];
  lignes: LigneGesteResultat[];
  totalCout: number;
  totalPrime: number;
  totalCee: number;
  resteACharge: number;
};

export function calculerGeste(params: {
  categorie: Categorie;
  logementPlus15Ans: boolean;
  remplacementFioul: boolean;
  lignes: LigneGesteInput[];
}): ResultatGeste {
  const { categorie, logementPlus15Ans, remplacementFioul } = params;
  const motifs: string[] = [];
  const avertissements: string[] = [];
  let lignes = params.lignes.filter((l) => GESTES.some((g) => g.id === l.id));

  if (categorie === "superieur") {
    // [GUIDE] p. 12 et 15 : parcours par geste réservé aux revenus très modestes, modestes et intermédiaires.
    motifs.push("Les ménages aux revenus supérieurs (catégorie rose) ne sont pas éligibles au parcours par geste.");
  }

  if (!logementPlus15Ans) {
    // [GUIDE] p. 13 : exception pour un logement de moins de 15 ans en cas de remplacement d'une chaudière fioul,
    // avec demande simultanée de la prime « dépose de cuve à fioul ».
    if (!remplacementFioul) {
      motifs.push("Le logement doit être construit depuis au moins 15 ans (sauf remplacement d’une chaudière au fioul).");
    } else {
      const exclues = lignes.filter((l) => {
        const g = GESTES.find((x) => x.id === l.id)!;
        return !g.chauffage && g.id !== "cuve-fioul";
      });
      if (exclues.length > 0) {
        avertissements.push("Logement de moins de 15 ans : seuls le nouvel équipement de chauffage et la dépose de la cuve à fioul sont retenus.");
      }
      lignes = lignes.filter((l) => {
        const g = GESTES.find((x) => x.id === l.id)!;
        return g.chauffage || g.id === "cuve-fioul";
      });
      if (!lignes.some((l) => l.id === "cuve-fioul")) {
        avertissements.push("La prime « dépose de cuve à fioul » doit être demandée en même temps que le remplacement de la chaudière fioul.");
      }
    }
  }

  // L'audit n'est financé que s'il est réalisé avec au moins un geste de travaux [GUIDE] p. 14.
  const aTravaux = lignes.some((l) => GESTES.find((g) => g.id === l.id)!.travaux);
  if (!aTravaux && lignes.some((l) => l.id === "audit")) {
    avertissements.push("L’audit énergétique n’est financé que s’il est réalisé avec au moins un geste de travaux : il n’est pas retenu ici.");
    lignes = lignes.filter((l) => l.id !== "audit");
  }

  if (lignes.length === 0 && motifs.length === 0) {
    motifs.push("Sélectionnez au moins un geste de travaux éligible.");
  }

  const eligible = motifs.length === 0;
  const res: LigneGesteResultat[] = lignes.map((l) => {
    const g = GESTES.find((x) => x.id === l.id)!;
    const cout = Math.max(0, l.coutTTC || 0);
    const cee = Math.max(0, l.cee || 0);
    const depenseEligible = Math.min(cout, g.plafondDepense);
    const forfait = eligible ? g.forfaits[IDX[categorie]] ?? 0 : 0;
    const plafondCumul = ECRETEMENT_GESTE[categorie] * depenseEligible;
    // Écrêtement : MPR + CEE <= taux x dépense éligible TTC ; toutes aides <= 100 % [GUIDE] p. 27.
    const disponible = Math.max(0, Math.min(plafondCumul, depenseEligible) - cee);
    const prime = eligible ? Math.round(Math.min(forfait, disponible)) : 0;
    return {
      id: g.id,
      libelle: g.libelle,
      coutTTC: cout,
      depenseEligible,
      forfait,
      plafondCumul,
      cee,
      prime,
      ecretee: eligible && prime < forfait,
      resteACharge: Math.max(0, cout - prime - cee),
    };
  });

  const totalCout = res.reduce((s, l) => s + l.coutTTC, 0);
  const totalPrime = res.reduce((s, l) => s + l.prime, 0);
  const totalCee = res.reduce((s, l) => s + l.cee, 0);
  return {
    eligible,
    motifs,
    avertissements,
    lignes: res,
    totalCout,
    totalPrime,
    totalCee,
    resteACharge: Math.max(0, totalCout - totalPrime - totalCee),
  };
}

// ---------------------------------------------------------------------------
// Rénovation d'ampleur (parcours accompagné) — [GUIDE] p. 17 à 23 ; [SP].
// ---------------------------------------------------------------------------
export const CLASSES = ["A", "B", "C", "D", "E", "F", "G"] as const;
export type ClasseDpe = (typeof CLASSES)[number];

// Plafonds de dépenses éligibles HT : 30 000 € (gain de 2 classes), 40 000 € (gain de 3 classes ou plus) [GUIDE] p. 22.
// Le barème de septembre 2026 ne prévoit pas de palier spécifique « 4 classes » ni de bonus « sortie de passoire ».
export const PLAFOND_AMPLEUR = { deuxClasses: 30000, troisClassesEtPlus: 40000 };

// Taux de prise en charge du montant HT [GUIDE] p. 22 ; [SP].
export const TAUX_AMPLEUR: Record<Categorie, number> = {
  "tres-modeste": 0.8,
  modeste: 0.6,
  intermediaire: 0.45,
  superieur: 0.1,
};

// Écrêtement : total des aides <= x % du montant TTC des travaux [GUIDE] p. 22 et 27 ; [SP].
export const ECRETEMENT_AMPLEUR: Record<Categorie, number> = {
  "tres-modeste": 1,
  modeste: 0.9,
  intermediaire: 0.8,
  superieur: 0.5,
};

// Prise en charge de la prestation Mon Accompagnateur Rénov' : plafond 2 000 € TTC [GUIDE] p. 21.
export const MAR_PLAFOND = 2000;
export const MAR_TAUX: Record<Categorie, number> = {
  "tres-modeste": 1,
  modeste: 0.8,
  intermediaire: 0.4,
  superieur: 0.2,
};

export type ResultatAmpleur = {
  eligible: boolean;
  motifs: string[];
  classeApres: ClasseDpe | null;
  plafondDepense: number;
  depenseEligibleHT: number;
  taux: number;
  primeAvantEcretement: number;
  montantTTC: number;
  plafondEcretement: number;
  prime: number;
  ecretee: boolean;
  aideMar: number;
  coutTotal: number;
  resteACharge: number;
  avanceMax: number;
};

export function calculerAmpleur(params: {
  categorie: Categorie;
  logementPlus15Ans: boolean;
  proprietaireOccupant: boolean;
  maisonIndividuelle: boolean;
  conserveGazFioul: boolean;
  deuxGestesIsolation: boolean;
  classeAvant: ClasseDpe;
  gain: number; // 2, 3 ou 4 (4 = 4 classes ou plus)
  montantHT: number;
  tauxTva: number; // ex. 0.055
  aidesLocales: number; // hors CEE : non cumulables avec la rénovation d'ampleur [GUIDE] p. 27
  coutMar: number;
}): ResultatAmpleur {
  const p = params;
  const motifs: string[] = [];
  const idxAvant = CLASSES.indexOf(p.classeAvant);
  const gain = Math.max(2, Math.floor(p.gain || 2));

  if (!p.logementPlus15Ans) motifs.push("Le logement doit être construit depuis au moins 15 ans.");
  if (idxAvant < CLASSES.indexOf("E")) {
    motifs.push("La rénovation d’ampleur est réservée aux logements classés E, F ou G avant travaux.");
  }
  const idxApres = idxAvant - gain;
  if (idxApres < 0) motifs.push(`Un gain de ${gain} classes est impossible depuis la classe ${p.classeAvant}.`);
  if (p.maisonIndividuelle && p.conserveGazFioul) {
    // Depuis le 1er septembre 2026 [SP-ACTU] ; [GUIDE] p. 17 et 19.
    motifs.push("En maison individuelle, l’aide n’est plus accordée si un chauffage ou une production d’eau chaude au gaz ou au fioul est conservé ou installé (depuis le 1er septembre 2026).");
  }
  if (!p.deuxGestesIsolation) {
    motifs.push("Le programme de travaux doit comporter au moins deux gestes d’isolation thermique (toiture, menuiseries, sols ou murs).");
  }

  const eligible = motifs.length === 0;
  const plafondDepense = gain >= 3 ? PLAFOND_AMPLEUR.troisClassesEtPlus : PLAFOND_AMPLEUR.deuxClasses;
  const ht = Math.max(0, p.montantHT || 0);
  const tva = Math.max(0, p.tauxTva || 0);
  const montantTTC = ht * (1 + tva);
  const aidesLocales = Math.max(0, p.aidesLocales || 0);
  const depenseEligibleHT = Math.min(ht, plafondDepense);
  const taux = TAUX_AMPLEUR[p.categorie];
  const primeAvantEcretement = depenseEligibleHT * taux;
  // Base d'écrêtement : montant total TTC des travaux, formulation de la fiche F35083 [SP].
  // Le guide Anah (p. 22) précise « dans le respect du plafond des dépenses éligibles » : à vérifier.
  const plafondEcretement = ECRETEMENT_AMPLEUR[p.categorie] * montantTTC;
  const prime = eligible ? Math.round(Math.max(0, Math.min(primeAvantEcretement, plafondEcretement - aidesLocales))) : 0;
  const coutMar = Math.max(0, p.coutMar || 0);
  const aideMar = eligible ? Math.round(MAR_TAUX[p.categorie] * Math.min(coutMar, MAR_PLAFOND)) : 0;
  const coutTotal = montantTTC + coutMar;
  // Avance jusqu'à 30 % de l'aide pour les propriétaires occupants modestes et très modestes [GUIDE] p. 22.
  const avanceMax =
    eligible && p.proprietaireOccupant && (p.categorie === "tres-modeste" || p.categorie === "modeste")
      ? Math.round(prime * 0.3)
      : 0;

  return {
    eligible,
    motifs,
    classeApres: idxApres >= 0 && idxAvant >= 0 ? CLASSES[idxApres] : null,
    plafondDepense,
    depenseEligibleHT,
    taux,
    primeAvantEcretement,
    montantTTC,
    plafondEcretement,
    prime,
    ecretee: eligible && prime < Math.round(primeAvantEcretement),
    aideMar,
    coutTotal,
    resteACharge: Math.max(0, coutTotal - prime - aidesLocales - aideMar),
    avanceMax,
  };
}
