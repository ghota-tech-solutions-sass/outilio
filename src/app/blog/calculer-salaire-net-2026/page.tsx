import { A, ArticleShell, Box, H2, H3, OL, Table, Toc, UL } from "../_components/Article";

const SOURCES = [
  {
    label: "Service-public.fr : montant du SMIC (12,31 € brut de l’heure depuis le 1er juin 2026) (F2300)",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2300",
  },
  {
    label: "Urssaf : taux de cotisations du secteur privé",
    url: "https://www.urssaf.fr/accueil/outils-documentation/taux-baremes/taux-cotisations-secteur-prive.html",
  },
  {
    label: "Service-public.fr : bulletin de paie, mentions obligatoires et montant net social (F559)",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F559",
  },
  {
    label: "Service-public.fr : heures supplémentaires, exonération d’impôt dans la limite de 7 500 € (F2391)",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2391",
  },
  {
    label: "Service-public.fr : prélèvement à la source (F34009)",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F34009",
  },
  {
    label: "Service-public.fr : obligations de l’employeur et grille du taux neutre (F34732)",
    url: "https://entreprendre.service-public.gouv.fr/vosdroits/F34732",
  },
  {
    label: "Service-public.fr : barème de l’impôt sur le revenu 2026 (F1419)",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F1419",
  },
  {
    label: "Service-public.fr : abattement de 10 % pour frais professionnels, 509 € à 14 555 € (F1989)",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F1989",
  },
];

const TOC = [
  { id: "trois-nets", label: "Net à payer, net imposable, net social" },
  { id: "cotisations", label: "Les cotisations salariales 2026, ligne par ligne" },
  { id: "exemple-3000", label: "Exemple complet : 3 000 € brut" },
  { id: "smic", label: "Le SMIC 2026 en net" },
  { id: "cadre", label: "Cadre, fonction publique : ce qui change" },
  { id: "impot", label: "Du net au net après impôt" },
  { id: "heures-sup", label: "Heures supplémentaires et primes" },
  { id: "pieges", label: "Les pièges de la conversion brut/net" },
];

export default function ArticleSalaireNet2026() {
  return (
    <ArticleShell
      slug="calculer-salaire-net-2026"
      breadcrumb="Salaire brut en net 2026"
      lead="Entre le brut du contrat et ce qui arrive sur votre compte, il y a une quinzaine de lignes de cotisations puis l’impôt à la source. Voici le calcul exact, refait ligne par ligne avec les taux 2026, au SMIC, à 3 000 € et à 4 500 € brut."
      sources={SOURCES}
      cta={{
        text: "Convertissez votre brut en net, avant et après impôt",
        label: "Ouvrir le calculateur de salaire",
        href: "/outils/calculateur-salaire",
      }}
    >
      <p>
        La règle de poche « net = brut × 0,78 » est une moyenne pour un non-cadre du privé. Elle suffit pour
        comparer deux offres d’emploi, mais pas pour vérifier une fiche de paie, préparer un dossier de prêt ou
        comprendre pourquoi votre net a bougé. Le vrai calcul tient en trois étages : les cotisations sociales
        salariales, la CSG et la CRDS, puis le prélèvement à la source de l’impôt sur le revenu.
      </p>

      <Toc items={TOC} />

      <H2 id="trois-nets">Net à payer, net imposable, net social : trois « nets » différents</H2>
      <p>Votre bulletin de paie affiche plusieurs montants nets qui n’ont pas le même usage :</p>
      <Table
        head={["Montant", "Ce qu’il représente", "À quoi il sert"]}
        numericFrom={3}
        rows={[
          ["Net à payer avant impôt", "brut − toutes les cotisations salariales (CSG et CRDS comprises)", "comparer des salaires, budget"],
          ["Net imposable", "net avant impôt + CSG non déductible + CRDS (+ part patronale de la mutuelle)", "déclaration de revenus, base du prélèvement à la source"],
          ["Montant net social", "brut − cotisations sociales hors CSG/CRDS", "à déclarer tel quel pour la prime d’activité et le RSA"],
          ["Net payé", "net à payer − impôt prélevé à la source", "ce qui arrive sur votre compte"],
        ]}
      />
      <p>
        Le <strong>montant net social</strong> figure obligatoirement sur les bulletins depuis 2024. Il a été
        créé pour simplifier les déclarations trimestrielles à la CAF : c’est lui qu’il faut reporter, pas le net à
        payer. Le net imposable, lui, est un peu plus élevé que le net à payer, parce qu’une partie de la CSG et la
        CRDS ne sont pas déductibles : vous êtes imposé sur de l’argent que vous ne touchez pas.
      </p>

      <H2 id="cotisations">Les cotisations salariales 2026, ligne par ligne</H2>
      <p>
        Pour un salarié non-cadre du privé, voici les taux légaux à la charge du salarié en 2026. Les cotisations
        « plafonnées » ne s’appliquent que jusqu’au plafond mensuel de la Sécurité sociale (PMSS), soit{" "}
        <strong>4 005 €</strong> en 2026 (48 060 € par an).
      </p>
      <Table
        head={["Cotisation", "Assiette", "Taux salarial"]}
        numericFrom={2}
        rows={[
          ["Assurance vieillesse plafonnée", "brut jusqu’à 4 005 €", "6,90 %"],
          ["Assurance vieillesse déplafonnée", "totalité du brut", "0,40 %"],
          ["Retraite complémentaire Agirc-Arrco, tranche 1", "brut jusqu’à 4 005 €", "3,15 %"],
          ["Contribution d’équilibre général (CEG), tranche 1", "brut jusqu’à 4 005 €", "0,86 %"],
          ["CSG déductible", "98,25 % du brut", "6,80 %"],
          ["CSG non déductible", "98,25 % du brut", "2,40 %"],
          ["CRDS", "98,25 % du brut", "0,50 %"],
          ["Assurance maladie, chômage", "—", "0 % (hors Alsace-Moselle : 1,30 % maladie)"],
        ]}
        caption="Taux salariaux légaux 2026. S’y ajoutent la part salariale de la mutuelle et de la prévoyance, variables selon l’entreprise."
      />
      <p>
        L’abattement de 1,75 % sur l’assiette de la CSG et de la CRDS représente forfaitairement les frais
        professionnels ; il ne s’applique que jusqu’à 4 PMSS. Attention : la part patronale de la mutuelle et de la
        prévoyance est ajoutée à l’assiette de la CSG, ce qui augmente légèrement ces deux lignes sur une vraie fiche
        de paie.
      </p>

      <H2 id="exemple-3000">Exemple complet : 3 000 € brut, non-cadre</H2>
      <Table
        head={["Ligne", "Calcul", "Montant"]}
        numericFrom={2}
        highlightLast
        rows={[
          ["Salaire brut", "", "3 000,00 €"],
          ["Vieillesse plafonnée", "3 000 × 6,90 %", "− 207,00 €"],
          ["Vieillesse déplafonnée", "3 000 × 0,40 %", "− 12,00 €"],
          ["Agirc-Arrco T1", "3 000 × 3,15 %", "− 94,50 €"],
          ["CEG T1", "3 000 × 0,86 %", "− 25,80 €"],
          ["CSG déductible", "2 947,50 × 6,80 %", "− 200,43 €"],
          ["CSG non déductible", "2 947,50 × 2,40 %", "− 70,74 €"],
          ["CRDS", "2 947,50 × 0,50 %", "− 14,74 €"],
          ["Net à payer avant impôt (hors mutuelle)", "3 000 − 625,21", "2 374,79 €"],
        ]}
        caption="Calcul Outilis.fr avec les taux légaux 2026. Cotisations totales : 625,21 €, soit 20,8 % du brut."
      />
      <p>À partir de là :</p>
      <UL>
        <li>
          <strong>Net imposable</strong> : 2 374,79 + 70,74 + 14,74 = <strong>2 460,27 €</strong> par mois.
        </li>
        <li>
          <strong>Montant net social</strong> : 3 000 − (207 + 12 + 94,50 + 25,80) = environ{" "}
          <strong>2 660,70 €</strong>.
        </li>
        <li>
          <strong>Avec une mutuelle obligatoire</strong> à 30 à 50 € de part salariale et une prévoyance, le net
          tombe autour de 2 320 à 2 340 €. C’est pourquoi le{" "}
          <A href="/outils/calculateur-salaire">calculateur de salaire</A> retient un taux moyen prudent de 22 % pour
          un non-cadre (2 340 € net pour 3 000 € brut) : il couvre les cotisations légales et une complémentaire
          santé type.
        </li>
      </UL>

      <H2 id="smic">Le SMIC 2026 en net</H2>
      <p>
        Le SMIC a été relevé à <strong>12,31 € brut de l’heure au 1er juin 2026</strong> (il était de 12,02 € au
        1er janvier), par l’effet de la revalorisation automatique déclenchée quand l’inflation dépasse 2 %. Pour
        35 heures par semaine (151,67 heures par mois) :
      </p>
      <Table
        head={["SMIC mensuel 35 h", "Montant"]}
        rows={[
          ["Brut", "1 867,02 €"],
          ["Cotisations salariales (20,84 %)", "− 389,09 €"],
          ["Net avant impôt", "1 477,93 €"],
          ["Net imposable", "environ 1 531 €"],
          ["Taux neutre de prélèvement à la source", "0 %"],
        ]}
        caption="Montants officiels service-public.fr ; net imposable recalculé par Outilis.fr (hors mutuelle)."
      />
      <p>
        Notre calcul ligne par ligne retombe exactement sur le net officiel de 1 477,93 €, ce qui confirme les taux
        du tableau précédent. Au SMIC, le prélèvement à la source est généralement nul, et la prime d’activité peut
        compléter le revenu : estimez-la avec le{" "}
        <A href="/outils/simulateur-prime-activite">simulateur de prime d’activité</A> (en déclarant le montant net
        social), et vérifiez vos droits au logement avec notre guide <A href="/blog/simulateur-apl-2026">APL 2026</A>.
      </p>

      <H2 id="cadre">Cadre, fonction publique : ce qui change</H2>
      <H3>Cadre : les cotisations au-dessus du plafond</H3>
      <p>
        Le statut cadre ajoute la cotisation APEC (0,024 %) et, surtout, au-delà de 4 005 € brut, la tranche 2 de
        l’Agirc-Arrco (8,64 % + CEG 1,08 %) et la contribution d’équilibre technique (0,14 % sur tout le salaire).
        Pour <strong>4 500 € brut</strong>, les cotisations légales atteignent 939,32 €, soit un net de{" "}
        <strong>3 560,68 €</strong> hors mutuelle (20,9 %) et un net imposable de 3 688,90 €. La prévoyance cadre et
        la mutuelle, souvent plus généreuses et donc plus chères, font monter le taux réel autour de 22 à 25 % :
        le calculateur retient 25 % par prudence. Consultez votre bulletin pour affiner.
      </p>
      <H3>Fonction publique : environ 17 %</H3>
      <p>
        Les fonctionnaires ne cotisent pas au chômage et leur retraite de base (pension civile, 11,10 % du
        traitement indiciaire) ne porte pas sur les primes, soumises à la retraite additionnelle (RAFP) dans une
        limite de 20 % du traitement. Résultat : un taux global d’environ 17 %, très dépendant de la part des primes.
      </p>

      <H2 id="impot">Du net au net après impôt</H2>
      <p>
        Le prélèvement à la source s’applique au net imposable. Reprenons 3 000 € brut pour une personne seule sans
        autre revenu :
      </p>
      <OL>
        <li>Net imposable annuel : 2 460,27 × 12 = 29 523 €.</li>
        <li>Abattement de 10 % : 2 952 € (il est compris entre 509 € et 14 555 € pour les revenus 2025).</li>
        <li>Revenu imposable : 26 571 €, soit un impôt brut de 1 646,81 € au barème 2026.</li>
        <li>Décote : 897 − 45,25 % × 1 646,81 = 151,82 €, d’où un impôt de 1 494,99 € par an.</li>
        <li>
          Taux personnalisé : 1 494,99 / 29 523 ≈ <strong>5,1 %</strong>, soit environ 125 € par mois. Net payé :
          environ <strong>2 250 €</strong> (hors mutuelle).
        </li>
      </OL>
      <Box title="Taux neutre ou taux personnalisé ?" tone="tip">
        <p>
          Si vous choisissez le taux neutre pour ne pas révéler votre situation à votre employeur, la grille 2026
          applique 5,3 % à un net imposable mensuel entre 2 315 € et 2 738 €, soit 130,39 € ici : c’est proche. Mais
          pour un couple dont un conjoint gagne peu, ou un salarié avec des revenus fonciers, l’écart peut être
          important et donner lieu à un versement complémentaire. Le détail des grilles et du calcul figure dans
          notre <A href="/blog/guide-impots-revenus-2026">guide de l’impôt sur le revenu 2026</A>.
        </p>
      </Box>
      <p>
        Avec des enfants ou un conjoint, le nombre de parts change tout : testez votre cas dans le{" "}
        <A href="/outils/simulateur-impot">simulateur d’impôt</A>, puis reportez votre taux dans le calculateur de
        salaire.
      </p>

      <H2 id="heures-sup">Heures supplémentaires, primes et 13e mois</H2>
      <UL>
        <li>
          <strong>Heures supplémentaires</strong> : elles sont majorées (25 % pour les 8 premières heures de la
          semaine au-delà de 35 h, 50 % ensuite, sauf accord collectif) et bénéficient d’une réduction de
          cotisations salariales retraite (jusqu’à 11,31 %) et d’une exonération d’impôt sur le revenu dans la limite
          de <strong>7 500 € nets par an</strong>. Seules la CSG et la CRDS restent dues. Exemple : 10 heures
          majorées à 25 % sur un salaire de 3 000 € rapportent 247 € brut et environ 224 € net, non imposables.
        </li>
        <li>
          <strong>Primes et 13e mois</strong> : ils supportent les mêmes cotisations que le salaire et peuvent vous
          faire franchir le plafond de la Sécurité sociale le mois du versement ; le taux de prélèvement à la source
          s’applique aussi.
        </li>
        <li>
          <strong>Indemnité de rupture conventionnelle</strong> : régime spécifique, partiellement exonéré ; ne la
          convertissez pas avec un simple pourcentage.
        </li>
      </UL>

      <H2 id="pieges">Les pièges de la conversion brut/net</H2>
      <UL>
        <li>
          <strong>Brut annuel et brut mensuel</strong> : une offre à « 42 000 € brut sur 13 mois » ne fait pas
          3 500 € brut mensuels mais 3 230,77 €, plus un 13e mois en fin d’année.
        </li>
        <li>
          <strong>Confondre net imposable et net à payer</strong> dans un dossier de crédit ou de location : les
          banques raisonnent sur le net avant impôt, l’administration fiscale sur le net imposable.
        </li>
        <li>
          <strong>Oublier le temps partiel</strong> : les cotisations plafonnées sont proratisées ; un mi-temps à
          1 500 € brut garde le même taux de cotisation qu’un temps plein.
        </li>
        <li>
          <strong>Déclarer le net à payer à la CAF</strong> au lieu du montant net social : l’écart peut modifier le
          montant de la prime d’activité et entraîner un indu.
        </li>
        <li>
          <strong>Comparer un CDI et une mission freelance</strong> sur le seul brut : un freelance paie ses propres
          cotisations et ses congés. Pour une comparaison juste, utilisez l’outil{" "}
          <A href="/outils/freelance-vs-cdi">freelance vs CDI</A>.
        </li>
      </UL>
      <p>
        Pour une estimation instantanée à partir d’un brut ou d’un net cible, avec votre statut et votre nombre de
        parts, le <A href="/outils/calculateur-salaire">calculateur de salaire 2026</A> fait tout le calcul et
        affiche l’écart avec le SMIC.
      </p>
    </ArticleShell>
  );
}
