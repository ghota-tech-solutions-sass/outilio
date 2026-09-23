import { A, ArticleShell, Box, H2, H3, OL, Table, Toc, UL } from "../_components/Article";

const SOURCES = [
  {
    label: "Service-public.fr : aide personnalisée au logement (APL), conditions (fiche vérifiée le 1er juillet 2026)",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F12006",
  },
  {
    label: "Service-public.fr : un étudiant peut-il bénéficier d’une aide au logement ?",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F1563",
  },
  {
    label: "Service-public.fr : les APL revalorisées au 1er octobre (actualité du 11 septembre 2026)",
    url: "https://www.service-public.gouv.fr/particuliers/actualites/A16807",
  },
  {
    label: "Légifrance : arrêté du 27 septembre 2019 relatif au calcul des aides personnelles au logement",
    url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000039160329",
  },
  {
    label: "Légifrance : décret n° 2025-1401 du 28 décembre 2025 (forfait étudiant et R0 non révisés en 2026)",
    url: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053202812",
  },
  {
    label: "Légifrance : arrêté du 30 décembre 2024 (forfait de ressources étudiant : 8 600 € / 6 900 €)",
    url: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000050873291",
  },
  {
    label: "Légifrance : Code de la construction et de l’habitation, forfait de ressources des étudiants (art. R822-20 et D822-21)",
    url: "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006074096/LEGISCTA000038850200/",
  },
  {
    label: "Caf.fr : étudiants, tout savoir sur l’aide au logement",
    url: "https://www.caf.fr/allocataires/actualites/actualites-nationales/etudiants-tout-savoir-sur-l-aide-au-logement",
  },
];

export default function ArticleApl2026() {
  return (
    <ArticleShell
      slug="simulateur-apl-2026"
      breadcrumb="APL 2026 : conditions et calcul"
      lead="L’APL dépend de quatre choses : votre loyer (plafonné), la zone du logement, la composition du foyer et vos ressources des 12 derniers mois. Voici la formule de la CAF expliquée simplement, les barèmes en vigueur jusqu’au 30 septembre 2026, la revalorisation d’octobre et des exemples calculés au centime près."
      sources={SOURCES}
      cta={{
        text: "Estimez votre APL avec la formule officielle, selon votre loyer, votre zone et vos ressources",
        label: "Lancer le simulateur APL",
        href: "/outils/simulateur-apl",
      }}
    >
      <Toc
        items={[
          { id: "conditions", label: "Qui peut toucher l’APL en 2026 ?" },
          { id: "apl-als-alf", label: "APL, ALS ou ALF : quelle différence ?" },
          { id: "baremes", label: "Les barèmes en vigueur : plafonds de loyer et forfait charges" },
          { id: "formule", label: "La formule de calcul, étape par étape" },
          { id: "exemples", label: "Exemples chiffrés" },
          { id: "etudiants", label: "Étudiants : le forfait de ressources" },
          { id: "octobre", label: "Revalorisation du 1er octobre 2026" },
          { id: "pieges", label: "Pièges et erreurs fréquentes" },
        ]}
      />

      <H2 id="conditions">Qui peut toucher l’APL en 2026 ?</H2>
      <p>
        L’aide personnalisée au logement est versée par la CAF (ou la MSA pour le régime agricole) aux locataires, aux
        colocataires, aux résidents de foyers et, dans des cas désormais limités, à certains accédants à la propriété.
        Les conditions principales :
      </p>
      <UL>
        <li>
          le logement est votre <strong>résidence principale</strong>, occupée au moins 8 mois par an, en France ;
        </li>
        <li>il est <strong>décent</strong> (surface minimale, pas de risque pour la santé ou la sécurité) ;</li>
        <li>
          il fait l’objet d’une <strong>convention</strong> avec l’État (sinon, c’est l’ALS ou l’ALF qui s’applique, avec
          le même mode de calcul) ;
        </li>
        <li>
          vous n’êtes pas locataire d’un ascendant ou descendant (parent, grand-parent, enfant) ;
        </li>
        <li>
          vos ressources, et votre patrimoine s’il dépasse 30 000 €, restent en dessous du niveau où l’aide s’annule.
        </li>
      </UL>
      <p>
        Il n’y a pas de plafond de ressources fixe : l’aide diminue à mesure que les revenus augmentent, jusqu’à tomber
        sous le seuil de versement. C’est pourquoi un calcul est indispensable.
      </p>

      <H2 id="apl-als-alf">APL, ALS ou ALF : quelle différence ?</H2>
      <Table
        head={["Aide", "Pour qui", "Calcul"]}
        numericFrom={9}
        rows={[
          ["APL (aide personnalisée au logement)", "Logement conventionné (HLM, nombreux logements privés conventionnés, résidences Crous)", "Formule ci-dessous"],
          ["ALF (allocation de logement familiale)", "Logement non conventionné, foyer avec enfant ou personne à charge, jeune couple marié", "Même formule"],
          ["ALS (allocation de logement sociale)", "Logement non conventionné, autres situations (étudiants, personnes seules, couples sans enfant)", "Même formule"],
        ]}
        caption="Les trois aides ne se cumulent pas : la CAF attribue automatiquement celle qui correspond à votre situation."
      />

      <H2 id="baremes">Les barèmes en vigueur : plafonds de loyer et forfait charges</H2>
      <p>
        Le loyer pris en compte est plafonné selon la zone : zone 1 (Paris et petite couronne, agglomérations les plus
        chères), zone 2 (grandes agglomérations, dont Lyon, Lille, Marseille, Bordeaux…), zone 3 (reste du territoire).
        Au-delà du plafond, le loyer supplémentaire n’augmente pas l’aide. Voici les montants appliqués d’octobre 2025 à
        septembre 2026 pour une location classique :
      </p>
      <Table
        head={["Composition du foyer", "Zone 1", "Zone 2", "Zone 3"]}
        rows={[
          ["Personne seule", "333,14 €", "290,34 €", "272,12 €"],
          ["Couple sans personne à charge", "401,78 €", "355,38 €", "329,88 €"],
          ["Seul ou couple avec 1 personne à charge", "454,10 €", "399,89 €", "369,88 €"],
          ["Par personne à charge supplémentaire", "+ 65,89 €", "+ 58,21 €", "+ 53,01 €"],
        ]}
        caption="Plafonds mensuels de loyer (arrêté du 27 septembre 2019 revalorisé au 1er octobre 2025). En colocation, chaque colocataire se voit appliquer 75 % du plafond."
      />
      <p>
        S’y ajoute un <strong>forfait charges</strong> : 60,59 € par mois pour une personne seule ou un couple, majoré de
        13,74 € par personne à charge. En colocation, il est de 30,29 € pour une personne seule. Ce forfait remplace vos
        charges réelles : peu importe que vous payiez 30 € ou 150 € de charges.
      </p>
      <Box tone="warning" title="Ce que cela signifie pour votre recherche de logement">
        <p>
          Une personne seule à Lyon qui loue 550 € ou 800 € touche <strong>la même APL</strong> : dans les deux cas, le
          loyer retenu est plafonné à 290,34 €. L’APL couvre donc une part de plus en plus faible du loyer à mesure que
          celui-ci augmente.
        </p>
      </Box>

      <H2 id="formule">La formule de calcul, étape par étape</H2>
      <p>La formule officielle tient en une ligne :</p>
      <Box>
        <p className="text-center text-base font-semibold">APL = L + C − Pp − 5 €</p>
        <p>
          <strong>L</strong> = loyer retenu (plafonné), <strong>C</strong> = forfait charges, <strong>Pp</strong> =
          participation personnelle, 5 € = minoration forfaitaire. Si le résultat est inférieur à 10 €, l’aide n’est pas
          versée.
        </p>
      </Box>
      <p>Toute la difficulté est dans la participation personnelle, qui augmente avec vos revenus :</p>
      <OL>
        <li>
          <strong>P0, participation minimale</strong> : le plus élevé entre 8,5 % de (L + C) et 39,56 €. Même sans aucun
          revenu, vous gardez ce montant à votre charge.
        </li>
        <li>
          <strong>R0, abattement sur les ressources</strong> : 5 235 € par an pour une personne seule, 7 501 € pour un
          couple, 8 947 € avec une personne à charge, 9 148 € avec deux. R0 est gelé en 2026.
        </li>
        <li>
          <strong>Tp, taux de participation</strong> = taux famille (2,83 % pour une personne seule, 3,15 % pour un
          couple, 2,70 % avec une personne à charge…) + taux loyer (de 0 % à environ 0,4 %, plus élevé quand le loyer
          retenu se rapproche du loyer de référence ou le dépasse).
        </li>
        <li>
          <strong>Pp = P0 + Tp × (R − R0)</strong>, où R correspond à vos ressources annuelles arrondies à la centaine
          d’euros supérieure.
        </li>
      </OL>
      <p>
        Concrètement, chaque tranche de 1 000 € de revenus annuels au-dessus de R0 réduit l’APL d’environ 30 € par mois
        pour une personne seule.
      </p>

      <H3>Quelles ressources sont prises en compte ?</H3>
      <p>
        Depuis 2021, la CAF retient les ressources des <strong>12 derniers mois glissants</strong> (salaires nets
        imposables, allocations chômage, indemnités journalières, pensions…), récupérées automatiquement auprès des
        employeurs et organismes. Le droit est recalculé <strong>tous les trois mois</strong> : une hausse de salaire fait
        baisser l’APL dans le trimestre qui suit, une perte d’emploi la fait remonter. Pour estimer votre salaire net à
        partir du brut, utilisez le <A href="/outils/calculateur-salaire">calculateur de salaire</A> et notre guide{" "}
        <A href="/blog/calculer-salaire-net-2026">salaire brut en net 2026</A>.
      </p>

      <H2 id="exemples">Exemples chiffrés</H2>
      <p>
        Les montants ci-dessous ont été obtenus avec la formule et les paramètres de notre{" "}
        <A href="/outils/simulateur-apl">simulateur APL</A> (barème d’octobre 2025 à septembre 2026). Vous retrouverez
        les mêmes résultats en y saisissant les mêmes données.
      </p>

      <H3>1. Salariée seule à Lyon (zone 2), loyer 550 €</H3>
      <Table
        head={["Ressources annuelles", "Participation personnelle", "APL mensuelle", "Reste à charge"]}
        rows={[
          ["7 800 €", "119,97 €", "225,96 €", "324,04 €"],
          ["12 000 €", "251,64 €", "94,29 €", "455,71 €"],
          ["14 000 €", "314,34 €", "31,59 €", "518,41 €"],
          ["17 700 € (environ un SMIC net annuel)", "430,34 €", "0 €", "550,00 €"],
        ]}
        caption="Loyer retenu 290,34 € (plafond zone 2), forfait charges 60,59 €, R0 = 5 235 €, Tp = 3,135 %."
      />
      <p>
        Détail pour 12 000 € : P0 = 39,56 € ; Pp = 39,56 + 3,135 % × (12 000 − 5 235) = 251,64 € ; APL = 290,34 + 60,59
        − 251,64 − 5 = <strong>94,29 €</strong>. On voit qu’une personne seule en zone 2 perd l’APL un peu au-dessus de
        14 000 € de revenus annuels.
      </p>

      <H3>2. Couple avec un enfant en zone 3, loyer 650 €</H3>
      <Table
        head={["Ressources annuelles du foyer", "Participation personnelle", "APL mensuelle"]}
        rows={[
          ["12 000 €", "129,74 €", "309,47 €"],
          ["15 000 €", "218,36 €", "220,85 €"],
          ["18 000 €", "306,98 €", "132,23 €"],
          ["24 000 €", "484,22 €", "0 €"],
        ]}
        caption="Loyer retenu 369,88 € (plafond zone 3 avec une personne à charge), forfait charges 60,59 + 13,74 = 74,33 €, R0 = 8 947 €, Tp = 2,954 %."
      />

      <H3>3. Colocation en zone 2, part de loyer 420 €, 6 000 € de revenus</H3>
      <p>
        Le plafond est ramené à 75 % : 217,75 €. Forfait charges colocation : 30,29 €. Pp = 39,56 + 2,965 % × (6 000 −
        5 235) = 62,24 €. APL = 217,75 + 30,29 − 62,24 − 5 = <strong>180,80 €</strong> par mois. Chaque colocataire fait sa
        propre demande, sur sa part de loyer.
      </p>

      <H2 id="etudiants">Étudiants : le forfait de ressources</H2>
      <p>
        Pour un étudiant locataire qui remplit les conditions d’âge des bourses sur critères sociaux, la loi prévoit que
        ses ressources sont <strong>réputées égales à un forfait</strong> (article R822-20 du Code de la construction et
        de l’habitation). Ce forfait, gelé pour 2026 par le décret du 28 décembre 2025, est de :
      </p>
      <Table
        head={["Situation", "Location", "Foyer / résidence"]}
        rows={[
          ["Étudiant non boursier", "8 600 €", "6 600 €"],
          ["Étudiant boursier (bourse non imposable)", "6 900 €", "5 400 €"],
        ]}
      />
      <Box title="Exemple : étudiant seul à Lyon, studio à 550 €">
        <p>
          Non boursier : ressources retenues 8 600 €. Pp = 39,56 + 3,135 % × (8 600 − 5 235) = 145,05 €. APL = 290,34 +
          60,59 − 145,05 − 5 = <strong>200,88 € par mois</strong>.
        </p>
        <p>
          Boursier : ressources retenues 6 900 €, APL = <strong>254,17 € par mois</strong>. Dans les deux cas, il reste
          environ 300 à 350 € de loyer à payer. En colocation à 420 € la part, l’étudiant non boursier touche 103,71 €.
        </p>
      </Box>
      <p>
        Depuis le 1er juillet 2026, les étudiants étrangers hors Union européenne, EEE et Suisse titulaires d’un visa
        étudiant n’ont droit à l’APL que s’ils sont boursiers sur critères sociaux, s’ils exercent une activité
        professionnelle ou s’ils sont en apprentissage ou en contrat de professionnalisation.
      </p>
      <Box tone="warning" title="APL ou enfant à charge : il faut choisir">
        <p>
          Si vos parents perçoivent des prestations familiales et que vous demandez une aide au logement, vous n’êtes plus
          considéré comme à leur charge pour la CAF. Leurs allocations peuvent baisser, voire disparaître. Comparez les deux
          situations avant de déposer la demande. La question du rattachement au foyer fiscal des parents relève, elle, des
          impôts et se traite séparément.
        </p>
      </Box>

      <H2 id="octobre">Revalorisation du 1er octobre 2026</H2>
      <p>
        Les paramètres des aides au logement sont revalorisés chaque 1er octobre selon l’indice de référence des loyers
        (IRL) du deuxième trimestre. Celui-ci a progressé de <strong>1,15 %</strong> sur un an : l’APL « devrait »
        augmenter d’autant au 1er octobre 2026, sauf décision contraire du gouvernement, indique service-public.fr. Le
        paiement d’octobre, versé début novembre, sera le premier concerné.
      </p>
      <p>
        Attention, la hausse porte sur les plafonds de loyer et le forfait charges, pas sur votre aide elle-même : pour une
        personne seule en zone 2 dont le loyer dépasse le plafond, un relèvement de 1,15 % du plafond (290,34 €) et du
        forfait représente environ 4 € de plus par mois. R0 et le forfait étudiant restent gelés pour 2026. Notre
        simulateur applique le barème d’octobre 2025 : il sera mis à jour dès la publication de l’arrêté.
      </p>

      <H2 id="pieges">Pièges et erreurs fréquentes</H2>
      <UL>
        <li>
          <strong>Demander trop tard</strong> : l’aide est due à partir du mois qui suit l’entrée dans le logement et
          n’est pas rétroactive au-delà. Faites la demande sur caf.fr dès la signature du bail.
        </li>
        <li>
          <strong>Oublier de déclarer un changement</strong> : mise en couple, naissance, déménagement, changement de
          loyer. Un trop-perçu est récupéré sur les aides futures.
        </li>
        <li>
          <strong>Surestimer l’aide dans son budget</strong> : au-delà du plafond, chaque euro de loyer est à votre charge.
          Un logement plus cher ne donne pas plus d’APL.
        </li>
        <li>
          <strong>Ignorer l’effet d’une hausse de revenus</strong> : un nouveau CDI peut faire tomber l’APL à zéro en un
          ou deux trimestres. Anticipez-le, surtout si vous cumulez avec la{" "}
          <A href="/outils/simulateur-prime-activite">prime d’activité</A>.
        </li>
        <li>
          <strong>Louer à un membre de sa famille</strong> : un logement loué par vos parents ou grands-parents n’ouvre
          pas droit à l’aide.
        </li>
        <li>
          <strong>Négliger le patrimoine</strong> : au-delà de 30 000 € d’épargne ou de biens, une partie est intégrée aux
          ressources et réduit l’aide.
        </li>
      </UL>
      <p>
        Vous envisagez d’acheter plutôt que de louer ? Comparez votre loyer actuel à la mensualité d’un crédit avec le{" "}
        <A href="/outils/capacite-emprunt">simulateur de capacité d’emprunt</A>.
      </p>
    </ArticleShell>
  );
}
