import { A, ArticleShell, Box, H2, H3, OL, Table, Toc, UL } from "../_components/Article";

const SOURCES = [
  {
    label: "Service-public.fr : barème de l’impôt sur le revenu et plafonnement du quotient familial (F1419)",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F1419",
  },
  {
    label: "Economie.gouv.fr : la décote de l’impôt sur le revenu (897 € / 1 483 €, coefficient 45,25 %)",
    url: "https://www.economie.gouv.fr/particuliers/impots-et-fiscalite/gerer-mon-impot-sur-le-revenu/pouvez-vous-beneficier-de-la-decote-de-limpot-sur-le-revenu",
  },
  {
    label: "Service-public.fr : frais professionnels, abattement de 10 % ou frais réels (F1989)",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F1989",
  },
  {
    label: "Impots.gouv.fr : les modalités de la déclaration de revenus en 2026 (dates, correction, solde)",
    url: "https://www.impots.gouv.fr/les-modalites-de-la-declaration-de-revenus-en-2026",
  },
  {
    label: "Service-public.fr : prélèvement à la source (F34009)",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F34009",
  },
  {
    label: "Service-public.fr : taux individualisé par défaut pour les couples depuis septembre 2025 (A18226)",
    url: "https://www.service-public.gouv.fr/particuliers/actualites/A18226",
  },
  {
    label: "Service-public.fr : obligations de l’employeur et grille du taux neutre (F34732)",
    url: "https://entreprendre.service-public.gouv.fr/vosdroits/F34732",
  },
  {
    label: "Service-public.fr : comment changer votre taux de prélèvement à la source (F35894)",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F35894",
  },
  {
    label: "Impots.gouv.fr : les différents taux de prélèvement à la source",
    url: "https://www.impots.gouv.fr/particulier/questions/comment-gerer-mon-prelevement-la-source",
  },
];

const TOC = [
  { id: "calendrier", label: "Où en est l’impôt 2026 en septembre" },
  { id: "bareme", label: "Le barème 2026 (revenus 2025)" },
  { id: "methode", label: "Le calcul en 5 étapes" },
  { id: "exemples", label: "Quatre foyers chiffrés" },
  { id: "tmi", label: "Taux marginal et taux moyen" },
  { id: "pas", label: "Prélèvement à la source : quel taux ?" },
  { id: "capital", label: "Revenus du capital : PFU 31,4 % ou barème" },
  { id: "leviers", label: "Les leviers légaux pour payer moins" },
  { id: "pieges", label: "Les erreurs qui coûtent cher" },
];

export default function ArticleGuideImpotsRevenus2026() {
  return (
    <ArticleShell
      slug="guide-impots-revenus-2026"
      breadcrumb="Impôt sur le revenu 2026"
      lead="Barème, quotient familial, décote, taux de prélèvement : ce guide refait le calcul officiel étape par étape sur quatre foyers types, pour que vous puissiez vérifier votre avis d’imposition et anticiper l’impôt de l’an prochain."
      sources={SOURCES}
      cta={{
        text: "Refaites le calcul avec votre revenu et votre nombre de parts",
        label: "Lancer le simulateur d’impôt",
        href: "/outils/simulateur-impot",
      }}
    >
      <p>
        L’impôt sur le revenu payé en 2026 porte sur les revenus perçus en 2025. La loi de finances pour 2026,
        promulguée tardivement le 19 février 2026, a revalorisé les tranches du barème de 0,9 %, soit à peu près
        l’inflation : à revenu égal, l’impôt bouge peu. Ce qui fait vraiment varier la note, ce sont les mécanismes
        qui se superposent au barème (quotient familial et son plafonnement, décote, réductions et crédits d’impôt)
        et que la plupart des contribuables ne savent pas recalculer. C’est l’objet de cet article.
      </p>

      <Toc items={TOC} />

      <H2 id="calendrier">Où en est l’impôt 2026 en septembre</H2>
      <p>
        La campagne déclarative est terminée, mais plusieurs échéances tombent entre septembre et décembre. Voici
        le calendrier 2026 publié par la DGFiP :
      </p>
      <Table
        head={["Étape", "Date 2026"]}
        numericFrom={2}
        rows={[
          ["Ouverture de la déclaration en ligne", "9 avril"],
          ["Date limite déclaration papier", "19 mai"],
          ["Date limite en ligne, départements 01 à 19 et non-résidents", "21 mai"],
          ["Date limite en ligne, départements 20 à 54", "28 mai"],
          ["Date limite en ligne, départements 55 à 976", "4 juin"],
          ["Avis d’imposition disponible dans l’espace particulier", "à partir de fin juillet"],
          ["Service de correction en ligne après l’avis", "mi-août à mi-décembre"],
          ["Nouveau taux de prélèvement à la source appliqué", "septembre"],
          ["Solde à payer inférieur ou égal à 300 €", "prélevé en une fois en septembre"],
          ["Solde supérieur à 300 €", "4 prélèvements, septembre à décembre"],
        ]}
      />
      <p>
        Nouveauté 2026 : l’avis d’imposition est dématérialisé par défaut pour tous les déclarants en ligne. Il
        n’arrive plus dans la boîte aux lettres, il faut le télécharger dans l’espace Finances publiques (il sert
        de justificatif pour un prêt, un logement social ou une aide). Si vous avez oublié une case (frais réels,
        dons, emploi à domicile, pension versée…), le service de correction en ligne reste ouvert jusqu’à
        mi-décembre 2026 : c’est le moment de le faire, sans pénalité si l’erreur est en votre défaveur.
      </p>

      <H2 id="bareme">Le barème 2026 (revenus 2025)</H2>
      <p>Le barème s’applique à une part de quotient familial :</p>
      <Table
        head={["Fraction du revenu imposable (par part)", "Taux"]}
        rows={[
          ["Jusqu’à 11 600 €", "0 %"],
          ["De 11 601 € à 29 579 €", "11 %"],
          ["De 29 580 € à 84 577 €", "30 %"],
          ["De 84 578 € à 181 917 €", "41 %"],
          ["Au-delà de 181 917 €", "45 %"],
        ]}
        caption="Barème applicable aux revenus 2025 (loi de finances pour 2026, tranches revalorisées de 0,9 %). Source : service-public.fr, F1419."
      />
      <p>
        Chaque taux ne frappe que la fraction de revenu comprise dans sa tranche. Une personne seule dont le
        revenu imposable est de 30 000 € ne paie pas 30 % sur 30 000 € : elle paie 0 % jusqu’à 11 600 €, 11 % entre
        11 600 € et 29 579 € (1 977,69 €), puis 30 % sur les 421 € restants (126,30 €), soit{" "}
        <strong>2 103,99 €</strong>. C’est l’exemple officiel repris par service-public.fr.
      </p>

      <H2 id="methode">Le calcul en 5 étapes</H2>
      <OL>
        <li>
          <strong>Revenu net imposable.</strong> Pour un salaire, on part du net imposable annuel (case 1AJ
          préremplie) et on retire l’abattement forfaitaire de 10 % pour frais professionnels, compris entre{" "}
          <strong>509 € et 14 555 €</strong> par personne pour les revenus 2025. Vous pouvez à la place déduire vos
          frais réels si vous en avez davantage, par exemple de longs trajets domicile-travail : chiffrez-les avec
          le <A href="/outils/calculateur-frais-kilometriques">calculateur de frais kilométriques</A>. On retire
          ensuite les charges déductibles (versements PER, pensions alimentaires).
        </li>
        <li>
          <strong>Quotient familial.</strong> On divise ce revenu par le nombre de parts : 1 pour une personne
          seule, 2 pour un couple marié ou pacsé, +0,5 pour chacun des deux premiers enfants, +1 à partir du
          troisième, +0,5 supplémentaire pour un parent isolé (case T).
        </li>
        <li>
          <strong>Barème.</strong> On applique le barème au quotient, puis on multiplie le résultat par le nombre de
          parts.
        </li>
        <li>
          <strong>Plafonnement.</strong> L’avantage procuré par chaque demi-part au-delà de 1 part (célibataire) ou
          2 parts (couple) est limité à <strong>1 807 €</strong> pour les revenus 2025 (4 262 € pour la part entière
          du premier enfant d’un parent isolé). On recalcule l’impôt sans les parts d’enfants, on retranche 1 807 €
          par demi-part, et on retient le plus élevé des deux montants.
        </li>
        <li>
          <strong>Décote, réductions et crédits.</strong> Si l’impôt brut est inférieur à 1 982 € (personne seule)
          ou 3 277 € (couple), une décote s’applique : <strong>897 € − 45,25 % de l’impôt brut</strong> pour une
          personne seule, <strong>1 483 € − 45,25 %</strong> pour un couple. On retire ensuite les réductions (dons,
          investissements) puis les crédits d’impôt (emploi à domicile, garde d’enfants), ces derniers étant
          remboursés s’ils dépassent l’impôt.
        </li>
      </OL>

      <H2 id="exemples">Quatre foyers chiffrés</H2>
      <p>
        Ces calculs reprennent exactement la méthode du{" "}
        <A href="/outils/simulateur-impot">simulateur d’impôt 2026</A> : vous pouvez saisir les mêmes chiffres pour
        les retrouver. « Revenu imposable » s’entend après l’abattement de 10 %.
      </p>
      <Table
        head={["Foyer", "Revenu imposable", "Parts", "Impôt brut", "Décote", "Impôt net", "Taux moyen"]}
        numericFrom={1}
        rows={[
          ["Personne seule", "20 000 €", "1", "924,00 €", "478,89 €", "445,11 €", "2,2 %"],
          ["Personne seule", "30 000 €", "1", "2 103,99 €", "0 €", "2 103,99 €", "7,0 %"],
          ["Couple, 2 enfants", "60 000 €", "3", "2 772,00 €", "228,67 €", "2 543,33 €", "4,2 %"],
          ["Couple, 2 enfants", "150 000 €", "3", "27 593,98 €", "0 €", "27 593,98 €", "18,4 %"],
        ]}
        caption="Calculs Outilis.fr avec le barème des revenus 2025, avant réductions et crédits d’impôt."
      />

      <H3>Le détail du couple à 60 000 €</H3>
      <p>
        Quotient : 60 000 / 3 = 20 000 €. Impôt par part : (20 000 − 11 600) × 11 % = 924 €. Impôt pour 3 parts :
        2 772 €. Vérification du plafonnement : sans enfants (2 parts), l’impôt serait de 4 207,98 € ; l’avantage
        des enfants (1 435,98 €) reste sous le plafond de 2 × 1 807 € = 3 614 €, il n’est donc pas réduit. L’impôt
        brut de 2 772 € étant inférieur à 3 277 €, la décote vaut 1 483 − 45,25 % × 2 772 = 228,67 €. Impôt final :{" "}
        <strong>2 543,33 €</strong>.
      </p>

      <H3>Le couple à 150 000 € : le plafonnement joue à plein</H3>
      <p>
        Avec 3 parts, le barème donnerait 24 311,97 €. Mais sans les enfants, l’impôt serait de 31 207,98 € ; les
        deux demi-parts ne peuvent le réduire que de 3 614 €, soit 27 593,98 €. C’est ce montant, plus élevé, qui
        s’applique : les enfants « rapportent » 3 614 € et non 6 896 €. Pour un couple avec deux enfants, le
        plafonnement commence à jouer vers 71 500 € de revenu imposable : au-delà, chaque euro supplémentaire est
        imposé comme si les enfants n’existaient pas, à 30 % puis 41 %.
      </p>

      <Box title="Le piège de la décote" tone="warning">
        <p>
          Dans la zone de décote, chaque euro d’impôt brut en plus n’en coûte que 0,55 € (1 − 0,4525), mais la
          décote fond en parallèle. Résultat : pour une personne seule autour de 20 000 € de revenu imposable, 100 €
          de revenu en plus génèrent environ 16 € d’impôt (11 % × 1,4525), et non 11 €. Ce « taux marginal caché »
          explique pourquoi une petite augmentation fait parfois grimper l’impôt plus que prévu.
        </p>
      </Box>

      <H2 id="tmi">Taux marginal et taux moyen : ne pas confondre</H2>
      <p>
        Le <strong>taux marginal d’imposition (TMI)</strong> est le taux de la dernière tranche atteinte par votre
        quotient : c’est lui qui dit combien vous coûtera un euro de revenu supplémentaire, ou combien vous fera
        économiser un euro déduit (versement PER, frais réels). Le <strong>taux moyen</strong> rapporte l’impôt
        payé à votre revenu : dans nos exemples, il reste entre 2 % et 18 % alors que les TMI vont de 11 % à 30 %.
      </p>
      <UL>
        <li>
          Le TMI sert à arbitrer : option pour le barème ou le PFU sur les revenus du capital, intérêt d’un PER,
          choix entre frais réels et abattement.
        </li>
        <li>
          Le taux moyen est proche de votre taux de prélèvement à la source, qui se calcule sur les revenus
          imposables avant abattement : c’est ce qu’il faut regarder pour votre budget. Pour passer du brut au
          net après impôt, voyez notre guide <A href="/blog/calculer-salaire-net-2026">salaire brut en net 2026</A>.
        </li>
      </UL>

      <H2 id="pas">Prélèvement à la source : quel taux choisir ?</H2>
      <p>
        Depuis 2019, l’impôt est retenu chaque mois par l’employeur ou la caisse de retraite, et prélevé sous forme
        d’acomptes pour les revenus sans collecteur (revenus fonciers, bénéfices d’indépendant). Le taux calculé
        sur votre déclaration de 2026 s’applique depuis septembre 2026 et jusqu’en août 2027. Trois options
        existent :
      </p>
      <UL>
        <li>
          <strong>Taux du foyer (personnalisé)</strong> : le même taux pour tous les revenus du foyer.
        </li>
        <li>
          <strong>Taux individualisé</strong> : chaque membre du couple a un taux reflétant ses propres revenus.
          Depuis septembre 2025, c’est l’option par défaut pour les couples mariés ou pacsés ; on peut revenir au
          taux commun dans l’espace particulier. L’impôt total du foyer ne change pas, seule sa répartition change.
        </li>
        <li>
          <strong>Taux neutre (non personnalisé)</strong> : l’employeur applique une grille officielle qui ne
          dépend que du salaire qu’il verse, sans connaître votre situation. Si ce taux est inférieur à votre taux
          réel, vous devez verser chaque mois la différence à l’administration.
        </li>
      </UL>
      <Table
        head={["Net imposable mensuel versé par l’employeur", "Taux neutre"]}
        rows={[
          ["Moins de 1 635 €", "0 %"],
          ["De 1 635 € à 1 698 €", "0,5 %"],
          ["De 1 698 € à 1 807 €", "1,3 %"],
          ["De 1 928 € à 2 060 €", "2,9 %"],
          ["De 2 315 € à 2 738 €", "5,3 %"],
          ["De 2 738 € à 3 135 €", "7,5 %"],
          ["De 3 571 € à 4 019 €", "11,9 %"],
          ["De 5 624 € à 7 037 €", "17,9 %"],
        ]}
        caption="Extrait de la grille métropole applicable depuis le 1er mai 2026 (art. 204 H du CGI, tranches revalorisées de 0,9 %). La grille complète compte 20 lignes, jusqu’à 43 %."
      />
      <p>
        Vos revenus baissent (perte d’emploi, temps partiel, départ en retraite) ? Vous pouvez demander une
        modulation à la baisse dans « Gérer mon prélèvement à la source » ; le nouveau taux s’applique au plus
        tard le troisième mois suivant. À l’inverse, signaler une hausse (augmentation, revenus locatifs) évite un
        solde important à payer en septembre de l’année suivante.
      </p>

      <H2 id="capital">Revenus du capital : PFU 31,4 % ou barème</H2>
      <p>
        Dividendes, intérêts, plus-values de valeurs mobilières et gains en cryptomonnaies sont taxés par défaut au
        prélèvement forfaitaire unique de <strong>31,4 %</strong> : 12,8 % d’impôt sur le revenu et 18,6 % de
        prélèvements sociaux, en hausse depuis la LFSS 2026 qui a relevé la CSG sur les revenus du capital. Les
        revenus fonciers et les plus-values immobilières, eux, restent à 17,2 % de prélèvements sociaux.
      </p>
      <UL>
        <li>
          Vous pouvez cocher la case 2OP pour imposer ces revenus au barème. C’est souvent gagnant si votre TMI est
          de 0 % ou 11 %, surtout pour des dividendes qui bénéficient alors d’un abattement de 40 %.
        </li>
        <li>
          L’option est globale et annuelle : elle vaut pour tous vos revenus du capital de l’année, y compris les
          intérêts pour lesquels le barème est moins favorable.
        </li>
        <li>
          Pour vos plus-values en cryptoactifs, le{" "}
          <A href="/outils/simulateur-flat-tax-crypto">simulateur de flat tax crypto</A> calcule l’impôt au PFU. Et
          pour choisir les placements les moins taxés, lisez notre{" "}
          <A href="/blog/guide-epargne-investissement-2026">comparatif des placements 2026</A>.
        </li>
      </UL>

      <H2 id="leviers">Les leviers légaux pour payer moins</H2>
      <Table
        head={["Levier", "Mécanisme", "Gain pour 1 000 € dépensés ou versés"]}
        numericFrom={2}
        rows={[
          ["Versement sur un PER", "déduction du revenu imposable, dans un plafond", "égal au TMI : 110 €, 300 € ou 410 €"],
          ["Don à une association d’intérêt général", "réduction de 66 % (dans la limite de 20 % du revenu imposable)", "660 €"],
          ["Don à un organisme d’aide aux personnes en difficulté", "réduction de 75 % jusqu’à 1 000 € de dons", "750 €"],
          ["Emploi à domicile (ménage, soutien scolaire…)", "crédit de 50 %, plafond de dépenses 12 000 € majoré", "500 €"],
          ["Garde d’un enfant de moins de 6 ans hors domicile", "crédit de 50 % des frais, dans un plafond par enfant", "500 €"],
          ["Frais réels au lieu des 10 %", "déduction des frais professionnels justifiés", "TMI × (frais réels − abattement)"],
        ]}
      />
      <p>
        Le PER est le levier le plus puissant pour les TMI de 30 % et plus, mais l’argent est bloqué jusqu’à la
        retraite (sauf achat de la résidence principale) et la sortie est imposée. Les crédits d’impôt, eux, sont
        remboursés même si vous n’êtes pas imposable : un foyer non imposable qui emploie une aide à domicile
        récupère bien 50 %. Si vos revenus sont modestes, vérifiez aussi votre droit à la prime d’activité, versée
        par la CAF et non imposable, avec le{" "}
        <A href="/outils/simulateur-prime-activite">simulateur de prime d’activité</A>.
      </p>

      <H2 id="pieges">Les erreurs qui coûtent cher</H2>
      <UL>
        <li>
          <strong>Ne pas vérifier les montants préremplis</strong> : primes, indemnités de rupture partiellement
          exonérées, heures supplémentaires défiscalisées (dans la limite de 7 500 € par an) sont parfois mal
          reportés. Vous êtes responsable de la déclaration, même préremplie.
        </li>
        <li>
          <strong>Oublier un enfant majeur rattachable</strong> : un étudiant de moins de 25 ans peut être rattaché
          (demi-part) ou aidé par une pension déductible ; comparez les deux, le rattachement peut aussi faire
          perdre des APL au jeune (voir notre guide <A href="/blog/simulateur-apl-2026">APL 2026</A>).
        </li>
        <li>
          <strong>Confondre TMI et taux moyen</strong> et refuser une augmentation « qui ferait changer de tranche » :
          seul l’euro au-dessus du seuil est taxé au taux supérieur.
        </li>
        <li>
          <strong>Laisser un taux de prélèvement obsolète</strong> après un changement de situation : mariage,
          naissance, divorce et baisse de revenus se signalent dans les 60 jours pour ajuster le taux.
        </li>
        <li>
          <strong>Oublier la retraite dans l’équation</strong> : à la liquidation, l’abattement de 10 % sur les
          pensions a son propre plafond par foyer ; estimez votre date de départ avec le{" "}
          <A href="/outils/calculateur-retraite">calculateur de retraite</A>.
        </li>
      </UL>
      <p>
        Pour estimer rapidement votre impôt 2027 (revenus 2026), reprenez votre revenu imposable prévisionnel dans
        le <A href="/outils/simulateur-impot">simulateur d’impôt</A> : le barème des revenus 2026 ne sera connu
        qu’avec la loi de finances pour 2027, mais une revalorisation proche de l’inflation reste l’hypothèse la
        plus probable.
      </p>
    </ArticleShell>
  );
}
