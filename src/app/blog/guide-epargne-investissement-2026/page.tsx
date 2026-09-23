import { A, ArticleShell, Box, H2, H3, OL, Table, Toc, UL } from "../_components/Article";

const SOURCES = [
  {
    label: "Service-public.fr : Livret A (taux 1,7 % depuis le 1er août 2026, plafond 22 950 €)",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2365",
  },
  {
    label: "Service-public.fr : Livret d’épargne populaire (LEP), taux, plafond et conditions de ressources 2026",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2367",
  },
  {
    label: "Ministère de l’Économie : le Livret A passe à 1,7 % et le LEP reste à 2,5 % au 1er août 2026",
    url: "https://presse.economie.gouv.fr/?p=181486",
  },
  {
    label: "Service-public.fr : prélèvements sociaux sur les revenus du patrimoine et de placement (17,2 % / 18,6 %)",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2329",
  },
  {
    label: "Impots.gouv.fr : l’assurance-vie et le PEA (fiscalité des rachats, abattement 4 600 / 9 200 €)",
    url: "https://www.impots.gouv.fr/particulier/lassurance-vie-et-le-pea-0",
  },
  {
    label: "Service-public.fr : plan d’épargne retraite (PER), plafond de déduction 2026",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F34982",
  },
  {
    label: "Service-public.fr : plan d’épargne logement (PEL)",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F16140",
  },
  {
    label: "Impots.gouv.fr : imposition des capitaux d’assurance-vie au décès (152 500 € par bénéficiaire)",
    url: "https://www.impots.gouv.fr/international-particulier/questions/comment-sont-imposees-les-assurances-vie-en-cas-de-deces-du",
  },
];

export default function ArticleEpargne2026() {
  return (
    <ArticleShell
      slug="guide-epargne-investissement-2026"
      breadcrumb="Où placer son épargne en 2026"
      lead="Livret A remonté à 1,7 %, LEP maintenu à 2,5 %, prélèvements sociaux portés à 18,6 % sur la plupart des placements mais pas sur l’assurance-vie : 2026 a rebattu les cartes. Voici dans quel ordre remplir vos enveloppes, avec les chiffres officiels et des exemples calculés."
      sources={SOURCES}
      cta={{
        text: "Simulez la croissance de votre épargne mois par mois, avec vos versements et votre taux",
        label: "Ouvrir le calculateur d’épargne",
        href: "/outils/calculateur-epargne",
      }}
    >
      <Toc
        items={[
          { id: "capacite", label: "D’abord : combien pouvez-vous épargner ?" },
          { id: "ordre", label: "L’ordre de priorité des placements en 2026" },
          { id: "comparatif", label: "Tableau comparatif des placements" },
          { id: "fiscalite", label: "Fiscalité 2026 : 31,4 % ou 17,2 % ?" },
          { id: "livrets", label: "Livrets réglementés : Livret A, LDDS, LEP" },
          { id: "assurance-vie", label: "Assurance-vie : l’enveloppe à tout faire" },
          { id: "pea-per", label: "PEA et PER : le long terme" },
          { id: "interets-composes", label: "Intérêts composés et inflation : exemples chiffrés" },
          { id: "crypto-succession", label: "Crypto et transmission : ce qu’il faut savoir" },
          { id: "erreurs", label: "Les erreurs qui coûtent le plus cher" },
        ]}
      />

      <H2 id="capacite">D’abord : combien pouvez-vous épargner ?</H2>
      <p>
        Avant de choisir un placement, il faut connaître le montant que vous pouvez y mettre chaque mois sans vous mettre
        en difficulté. Le point de départ est votre revenu réellement disponible : le salaire net après prélèvement à la
        source, pas le brut. Notre <A href="/outils/calculateur-salaire">calculateur de salaire brut/net</A> vous le donne
        en quelques secondes, et l’article <A href="/blog/calculer-salaire-net-2026">salaire brut en net 2026</A> détaille
        chaque ligne de la fiche de paie.
      </p>
      <p>
        Une méthode simple pour structurer ce revenu est la règle du <strong>50/30/20</strong> :
      </p>
      <UL>
        <li>
          <strong>50 % pour les dépenses essentielles</strong> : loyer ou mensualité de crédit, énergie, alimentation,
          transport, assurances ;
        </li>
        <li>
          <strong>30 % pour les envies</strong> : loisirs, restaurants, vacances, abonnements ;
        </li>
        <li>
          <strong>20 % pour l’épargne</strong> et le remboursement anticipé des dettes coûteuses (crédit renouvelable).
        </li>
      </UL>
      <Box title="Exemple : 2 400 € nets par mois">
        <p>
          Essentiel : 1 200 €. Envies : 720 €. Épargne : <strong>480 € par mois</strong>, soit 5 760 € par an. Si vos
          dépenses essentielles dépassent 50 % (fréquent en zone tendue), commencez par 10 % d’épargne et augmentez
          progressivement.
        </p>
        <p>
          Le réflexe le plus efficace : programmer un <strong>virement permanent le jour de la paie</strong> vers un livret.
          L’épargne « de fin de mois » n’existe presque jamais.
        </p>
      </Box>

      <H2 id="ordre">L’ordre de priorité des placements en 2026</H2>
      <p>
        Il n’existe pas de meilleur placement dans l’absolu, mais il existe un ordre logique. Chaque étape ne se justifie
        que si la précédente est remplie.
      </p>
      <OL>
        <li>
          <strong>Épargne de précaution</strong> : 3 à 6 mois de dépenses sur des livrets disponibles à tout moment (plus
          pour un indépendant aux revenus irréguliers). C’est elle qui vous évite un crédit à la consommation en cas de
          panne de voiture ou de perte d’emploi.
        </li>
        <li>
          <strong>LEP si vous y avez droit</strong> : 2,5 % net, sans risque, c’est le meilleur rendement garanti du
          moment. Il est réservé aux foyers dont le revenu fiscal de référence ne dépasse pas 23 028 € pour une part en
          2026 (+ 3 075 € par demi-part supplémentaire).
        </li>
        <li>
          <strong>Livret A puis LDDS</strong> : 1,7 % net depuis le 1er août 2026, pour compléter la réserve de sécurité.
        </li>
        <li>
          <strong>Projets à 2-8 ans</strong> (apport immobilier, voiture, études) : fonds en euros d’assurance-vie,
          éventuellement PEL si vous visez un prêt épargne logement.
        </li>
        <li>
          <strong>Long terme (8 ans et plus)</strong> : actions diversifiées via PEA ou assurance-vie en unités de compte,
          PER si votre tranche marginale d’imposition est d’au moins 30 %.
        </li>
        <li>
          <strong>Immobilier locatif</strong> : levier du crédit, mais rendement net souvent modeste une fois les charges
          et la fiscalité déduites (voir plus bas).
        </li>
      </OL>

      <H2 id="comparatif">Tableau comparatif des placements</H2>
      <Table
        head={["Placement", "Rendement 2026", "Plafond", "Fiscalité des gains", "Disponibilité"]}
        numericFrom={9}
        rows={[
          ["Livret A", "1,7 % net", "22 950 €", "Exonéré (IR et prélèvements sociaux)", "Immédiate"],
          ["LDDS", "1,7 % net", "12 000 €", "Exonéré", "Immédiate"],
          ["LEP (sous conditions)", "2,5 % net", "10 000 €", "Exonéré", "Immédiate"],
          ["PEL ouvert en 2026", "2 % brut (fixé à l’ouverture)", "61 200 €", "PFU ; prélèvements sociaux 17,2 %", "Bloqué (retrait = clôture)"],
          ["Assurance-vie fonds euros", "Variable selon l’assureur", "Aucun", "12,8 % puis 7,5 % après 8 ans ; PS 17,2 %", "Rachat possible à tout moment"],
          ["Assurance-vie unités de compte", "Variable, capital non garanti", "Aucun", "Idem fonds euros", "Rachat possible, valeur fluctuante"],
          ["PEA", "Variable, capital non garanti", "150 000 €", "Exonéré d’IR après 5 ans ; PS 18,6 %", "Retrait avant 5 ans : clôture en principe"],
          ["PER individuel", "Variable", "Aucun (déduction plafonnée)", "Versements déductibles ; sortie imposée", "Bloqué jusqu’à la retraite (sauf cas de déblocage)"],
          ["Compte-titres", "Variable", "Aucun", "PFU 31,4 %", "Immédiate"],
        ]}
        caption="Taux au 23 septembre 2026. Le rendement des fonds euros et des unités de compte n’est pas réglementé et varie selon les contrats."
      />

      <H2 id="fiscalite">Fiscalité 2026 : 31,4 % ou 17,2 % ?</H2>
      <p>
        La loi de financement de la Sécurité sociale pour 2026 a relevé la CSG sur les revenus du capital de 9,2 % à
        10,6 %. Résultat : les prélèvements sociaux passent de <strong>17,2 % à 18,6 %</strong> et le prélèvement
        forfaitaire unique (PFU, ou « flat tax ») de 30 % à <strong>31,4 %</strong> (12,8 % d’impôt sur le revenu +
        18,6 % de prélèvements sociaux). La hausse vise les revenus 2026.
      </p>
      <p>Mais la hausse ne touche pas tous les placements. Selon service-public.fr :</p>
      <Table
        head={["Prélèvements sociaux à 18,6 %", "Prélèvements sociaux maintenus à 17,2 %"]}
        numericFrom={9}
        rows={[
          ["Intérêts de comptes à terme, obligations, comptes-titres", "Assurance-vie et contrats de capitalisation"],
          ["Dividendes et plus-values de valeurs mobilières", "PEL et CEL"],
          ["Gains du PEA lors d’un retrait", "Revenus fonciers (location nue)"],
          ["Épargne salariale (PEE, PEI)", "Plus-values immobilières"],
          ["Plus-values sur crypto-actifs (via le PFU)", "Plan d’épargne populaire"],
        ]}
      />
      <Box tone="tip" title="Ce que cela change concrètement">
        <p>
          Sur 10 000 € de plus-value réalisée en 2026 : <strong>3 140 €</strong> de prélèvements sur un compte-titres (PFU
          31,4 %), <strong>1 860 €</strong> dans un PEA de plus de 5 ans (18,6 % de prélèvements sociaux seulement). Dans
          une assurance-vie de plus de 8 ans, les prélèvements sociaux restent à 17,2 % et l’impôt peut être nul grâce à
          l’abattement annuel (voir plus bas). L’assurance-vie sort renforcée de la réforme.
        </p>
      </Box>
      <p>
        Le PFU n’est pas une obligation : vous pouvez opter pour le barème progressif sur l’ensemble de vos revenus du
        capital de l’année. C’est intéressant si votre taux marginal d’imposition est de 0 % ou 11 %. Notre{" "}
        <A href="/outils/simulateur-impot">simulateur d’impôt sur le revenu</A> vous donne votre tranche, et le{" "}
        <A href="/blog/guide-impots-revenus-2026">guide de l’impôt sur le revenu 2026</A> explique le calcul.
      </p>

      <H2 id="livrets">Livrets réglementés : Livret A, LDDS, LEP</H2>
      <p>
        Au 1er août 2026, le Livret A et le LDDS sont passés de 1,5 % à <strong>1,7 %</strong>. Le LEP aurait dû
        descendre à 2,2 % selon la formule réglementaire, mais le gouvernement l’a maintenu à <strong>2,5 %</strong> sur
        recommandation du gouverneur de la Banque de France. Les intérêts sont exonérés d’impôt et de prélèvements sociaux
        et le capital est disponible à tout moment.
      </p>
      <UL>
        <li>
          <strong>Livret A</strong> : plafond de 22 950 € (les intérêts capitalisés peuvent le dépasser).
        </li>
        <li>
          <strong>LDDS</strong> : plafond de 12 000 €, même taux.
        </li>
        <li>
          <strong>LEP</strong> : plafond de 10 000 €, réservé aux revenus modestes. La banque vérifie votre revenu fiscal
          de référence de N-1 ou N-2 selon la date de la demande. Un couple avec deux enfants (3 parts) reste éligible
          jusqu’à 23 028 + 4 × 3 075 = 35 328 € de RFR.
        </li>
      </UL>
      <Box tone="warning" title="Livret A et inflation">
        <p>
          Un livret n’enrichit pas : il protège. Si l’inflation est de 2 %, 10 000 € placés à 1,7 % pendant 10 ans perdent
          environ 3 % de pouvoir d’achat (9 710 € en euros constants). Laissés sur un compte courant, ils n’en valent plus
          que 8 203 €. Mesurez l’effet sur vos propres montants avec le{" "}
          <A href="/outils/calculateur-inflation">calculateur d’inflation</A>.
        </p>
      </Box>

      <H2 id="assurance-vie">Assurance-vie : l’enveloppe à tout faire</H2>
      <p>
        L’assurance-vie n’est pas un placement mais une enveloppe : on y loge un fonds en euros (capital garanti par
        l’assureur) et/ou des unités de compte (fonds actions, obligations, immobilier, sans garantie). Son intérêt tient
        à sa fiscalité, qui s’améliore avec l’âge du contrat.
      </p>
      <H3>Fiscalité des rachats</H3>
      <UL>
        <li>
          Seuls les <strong>gains</strong> contenus dans le rachat sont imposés, au prorata. Un rachat de 20 000 € sur un
          contrat valant 100 000 € dont 30 000 € de gains contient 6 000 € de gains.
        </li>
        <li>
          <strong>Avant 8 ans</strong> : PFU (12,8 % d’impôt) pour les versements effectués depuis le 27 septembre 2017.
        </li>
        <li>
          <strong>Après 8 ans</strong> : abattement annuel de <strong>4 600 €</strong> de gains (9 200 € pour un couple
          marié ou pacsé), puis 7,5 % d’impôt sur la part des gains correspondant à 150 000 € de versements, 12,8 %
          au-delà.
        </li>
        <li>
          Prélèvements sociaux : <strong>17,2 %</strong> (taux maintenu en 2026), prélevés chaque année sur le fonds en
          euros et lors du rachat sur les unités de compte.
        </li>
      </UL>
      <Box title="Exemple : rachat de 20 000 € sur un contrat de 10 ans (célibataire)">
        <p>
          Gains contenus dans le rachat : 6 000 €. Après l’abattement de 4 600 €, 1 400 € sont imposables à 7,5 %, soit{" "}
          <strong>105 € d’impôt</strong>. Les prélèvements sociaux de 17,2 % sur 6 000 € (1 032 €) ont en grande partie
          déjà été prélevés au fil des ans si l’argent était sur le fonds en euros.
        </p>
        <p>
          Astuce : en fractionnant les rachats pour rester sous 4 600 € de gains par an, l’impôt sur le revenu peut être
          nul chaque année.
        </p>
      </Box>

      <H2 id="pea-per">PEA et PER : le long terme</H2>
      <H3>Le PEA pour les actions</H3>
      <p>
        Le plan d’épargne en actions accueille jusqu’à 150 000 € de versements, investis en actions européennes ou en
        fonds (ETF) éligibles, y compris des ETF qui répliquent un indice mondial. Après 5 ans, les gains sont exonérés
        d’impôt sur le revenu : seuls restent les prélèvements sociaux, désormais à 18,6 %. Un retrait avant 5 ans
        entraîne en principe la clôture du plan et l’imposition des gains au PFU. Ouvrir un PEA tôt, même avec quelques
        euros, sert surtout à « prendre date ».
      </p>
      <H3>Le PER pour réduire l’impôt aujourd’hui</H3>
      <p>
        Les versements sur un plan d’épargne retraite individuel sont déductibles du revenu imposable. Pour les
        versements effectués en 2026, le plafond est de <strong>10 % des revenus professionnels 2025</strong>, dans la
        limite de 37 680 €, avec un minimum de 4 710 €. Les plafonds non utilisés de 2024 et 2025 sont reportables 3 ans ;
        ceux de 2026 et des années suivantes, 5 ans. Le plafond disponible figure sur votre avis d’impôt.
      </p>
      <Table
        head={["Taux marginal d’imposition", "Économie d’impôt pour 4 000 € versés"]}
        rows={[
          ["11 %", "440 €"],
          ["30 %", "1 200 €"],
          ["41 %", "1 640 €"],
        ]}
        caption="La déduction est un report d’imposition : à la sortie en capital, la part correspondant aux versements déduits est imposée au barème et les gains au PFU de 31,4 %."
      />
      <p>
        Le PER est donc pertinent si votre taux marginal est au moins aussi élevé aujourd’hui qu’il le sera à la retraite.
        Avec une tranche à 11 %, un PEA ou une assurance-vie sont généralement plus souples. Pour estimer l’âge auquel vous
        pourrez débloquer votre épargne, voyez le <A href="/outils/calculateur-retraite">calculateur de retraite</A>.
      </p>

      <H2 id="interets-composes">Intérêts composés et inflation : exemples chiffrés</H2>
      <p>
        Les intérêts composés font que les gains produisent eux-mêmes des gains. La formule utilisée par notre{" "}
        <A href="/outils/calculateur-epargne">calculateur d’épargne</A> est : capital final = versement mensuel × ((1 + r)
        <sup>n</sup> − 1) / r, avec r le taux mensuel (taux annuel ÷ 12) et n le nombre de mois.
      </p>
      <Table
        head={["200 € par mois pendant…", "À 1,7 % (Livret A)", "À 4 %", "À 7 %", "Total versé"]}
        rows={[
          ["10 ans", "26 141 €", "29 450 €", "34 617 €", "24 000 €"],
          ["20 ans", "57 121 €", "73 355 €", "104 185 €", "48 000 €"],
          ["30 ans", "93 839 €", "138 810 €", "243 994 €", "72 000 €"],
        ]}
        caption="Taux constants, avant fiscalité et frais. 7 % correspond à un rendement historique moyen des actions mondiales sur longue période, sans aucune garantie pour l’avenir."
      />
      <p>
        Deux enseignements. D’abord, la durée pèse plus que le montant : 200 € par mois pendant 25 ans à 7 % donnent
        environ 162 000 €, davantage que 300 € par mois pendant 20 ans (environ 156 000 €). Ensuite, l’écart entre un
        livret et un placement en actions devient énorme au-delà de 15 ans, mais il se paie par des baisses temporaires
        parfois fortes (−30 % une année n’a rien d’exceptionnel). D’où la règle : pas d’actions pour l’argent dont vous
        aurez besoin dans moins de 8 ans.
      </p>

      <H3>Et l’immobilier locatif ?</H3>
      <p>
        Le rendement brut affiché (loyer annuel ÷ prix) de 5 à 7 % tombe souvent à 2 à 4 % une fois déduits taxe
        foncière, charges non récupérables, assurance, vacance, travaux et fiscalité (revenus fonciers : barème + 17,2 %
        de prélèvements sociaux). L’intérêt vient surtout de l’effet de levier du crédit. Faites le calcul complet avec le{" "}
        <A href="/outils/calculateur-rentabilite-locative">calculateur de rentabilité locative</A> et vérifiez votre{" "}
        <A href="/outils/capacite-emprunt">capacité d’emprunt</A> avant de vous lancer.
      </p>

      <H2 id="crypto-succession">Crypto et transmission : ce qu’il faut savoir</H2>
      <H3>Crypto-actifs</H3>
      <p>
        Les plus-values de cession de crypto-actifs contre des euros (ou contre un bien) sont imposées au PFU de 31,4 %
        en 2026, sauf si le total de vos cessions de l’année ne dépasse pas 305 €. Les échanges entre cryptos ne sont pas
        imposables. Compte tenu de la volatilité, limitez cette poche à une petite part de votre patrimoine. Calculez
        l’impôt avec le <A href="/outils/simulateur-flat-tax-crypto">simulateur flat tax crypto</A>.
      </p>
      <H3>Transmettre avec l’assurance-vie</H3>
      <p>
        Au décès, les capitaux issus de primes versées avant les 70 ans de l’assuré sont exonérés jusqu’à{" "}
        <strong>152 500 € par bénéficiaire</strong> ; au-delà, un prélèvement de 20 % s’applique jusqu’à 700 000 €, puis
        31,25 %. Pour les primes versées après 70 ans, seul un abattement global de 30 500 € s’applique (tous
        bénéficiaires confondus), le reste entrant dans les droits de succession. Pour chiffrer une succession classique,
        utilisez le <A href="/outils/simulateur-droits-succession">simulateur de droits de succession</A>.
      </p>

      <H2 id="erreurs">Les erreurs qui coûtent le plus cher</H2>
      <UL>
        <li>
          <strong>Investir en actions sans épargne de précaution</strong> : au premier imprévu, vous vendez au pire moment.
        </li>
        <li>
          <strong>Oublier le LEP</strong> : beaucoup de foyers éligibles ne l’ont pas ouvert et se contentent de 1,7 %.
        </li>
        <li>
          <strong>Payer des frais élevés</strong> : 2 % de frais annuels sur un contrat d’assurance-vie en unités de
          compte peuvent absorber le tiers du rendement. Comparez les frais sur versements et de gestion.
        </li>
        <li>
          <strong>Ouvrir un PER avec une tranche à 0 ou 11 %</strong> : l’économie d’impôt est faible, l’argent est
          bloqué et la sortie sera imposée.
        </li>
        <li>
          <strong>Attendre le « bon moment »</strong> : des versements réguliers lissent le prix d’achat et exploitent la
          durée, votre meilleur atout.
        </li>
      </UL>
    </ArticleShell>
  );
}
