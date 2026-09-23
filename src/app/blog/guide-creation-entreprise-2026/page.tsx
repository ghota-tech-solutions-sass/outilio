import { A, ArticleShell, Box, H2, H3, OL, Table, Toc, UL } from "../_components/Article";

const SOURCES = [
  { label: "Service-public.fr : choisir la forme juridique de son entreprise", url: "https://entreprendre.service-public.gouv.fr/vosdroits/F23844" },
  { label: "Urssaf : taux de cotisations des auto-entrepreneurs en 2026", url: "https://www.urssaf.fr/accueil/actualites/taux-cotisations-autoentrepeneur.html" },
  { label: "Service-public.fr : dépassement des seuils de la micro-entreprise (83 600 € / 203 100 €)", url: "https://entreprendre.service-public.gouv.fr/vosdroits/F32353" },
  { label: "Service-public.fr : franchise en base de TVA (seuils 2026)", url: "https://entreprendre.service-public.gouv.fr/vosdroits/F21746" },
  { label: "Service-public.fr : impôt sur les sociétés (taux, conditions du taux réduit, acomptes)", url: "https://entreprendre.service-public.gouv.fr/vosdroits/F23575" },
  { label: "Service-public.fr : aide à la création ou à la reprise d’entreprise (ACRE)", url: "https://entreprendre.service-public.gouv.fr/vosdroits/F11677" },
  { label: "Légifrance : décret n° 2026-69 du 6 février 2026 (taux d’exonération ACRE)", url: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053449085" },
  { label: "Urssaf : cotisation subsidiaire maladie (taxe PUMa)", url: "https://www.urssaf.fr/accueil/particulier/beneficiaire-puma.html" },
  { label: "Service-public.fr : coût des formalités de création d’entreprise", url: "https://entreprendre.service-public.gouv.fr/vosdroits/F37688" },
  { label: "Service-public.fr : tarifs 2026 des annonces légales", url: "https://entreprendre.service-public.gouv.fr/actualites/A18724" },
  { label: "Service-public.fr : compte bancaire du micro-entrepreneur", url: "https://entreprendre.service-public.gouv.fr/vosdroits/F35991" },
  { label: "Service-public.fr : créer son entreprise en étant au chômage (ARE, ARCE)", url: "https://entreprendre.service-public.gouv.fr/vosdroits/F15252" },
];

const TOC = [
  { id: "resume", label: "Le résumé en 30 secondes" },
  { id: "quatre-statuts", label: "Les 4 statuts en un tableau" },
  { id: "exemples", label: "Combien il vous reste : 3 cas chiffrés" },
  { id: "micro", label: "Micro-entreprise : quand elle gagne, quand elle coince" },
  { id: "is", label: "L’impôt sur les sociétés en 2026" },
  { id: "salaire-dividendes", label: "SASU et EURL : salaire ou dividendes ?" },
  { id: "pieges", label: "Les pièges qui coûtent cher" },
  { id: "couts", label: "Coûts de création et de fonctionnement" },
  { id: "chomage-acre", label: "Chômage, ARCE et ACRE" },
  { id: "decision", label: "Quel statut selon votre profil" },
];

export default function ArticleCreationEntreprise2026() {
  return (
    <ArticleShell
      slug="guide-creation-entreprise-2026"
      breadcrumb="Quel statut choisir en 2026"
      lead="Micro-entreprise, entreprise individuelle au réel, EURL ou SASU : le « meilleur » statut dépend de votre chiffre d’affaires, de vos charges et de la protection sociale que vous visez. Voici les règles 2026, trois simulations complètes et les pièges à connaître avant d’immatriculer quoi que ce soit."
      sources={SOURCES}
      cta={{
        text: "Comparez les 4 statuts avec votre chiffre d’affaires et vos charges",
        label: "Lancer le comparateur de statuts",
        href: "/outils/choisir-statut-juridique",
      }}
    >
      <Toc items={TOC} />

      <H2 id="resume">Le résumé en 30 secondes</H2>
      <UL>
        <li>
          <strong>Moins de 83 600 € de CA en services et peu de charges</strong> : la micro-entreprise reste en
          général la plus rentable et de loin la plus simple.
        </li>
        <li>
          <strong>Charges réelles élevées</strong> (sous-traitance, matériel, local, stock) : l’abattement forfaitaire
          de la micro ne suffit plus, passez au réel (EI ou EURL).
        </li>
        <li>
          <strong>Bénéfice élevé que vous n’avez pas besoin de consommer</strong> : une société à l’impôt sur les
          sociétés (IS à 15 % jusqu’à 42 500 €) permet de capitaliser dans l’entreprise.
        </li>
        <li>
          <strong>Associés, levée de fonds, statut d’assimilé salarié</strong> : SASU (ou SAS).
        </li>
        <li>
          <strong>Dans tous les cas</strong>, chiffrez avec vos propres montants dans le{" "}
          <A href="/outils/choisir-statut-juridique">comparateur de statuts juridiques</A> : les écarts entre statuts
          se jouent souvent à quelques milliers d’euros par an, dans un sens ou dans l’autre.
        </li>
      </UL>

      <H2 id="quatre-statuts">Les 4 statuts en un tableau</H2>
      <p>
        Juridiquement, il n’existe que deux grandes familles : l’<strong>entreprise individuelle</strong> (dont la
        micro-entreprise n’est qu’un régime fiscal et social simplifié) et la <strong>société</strong> (EURL, SASU, et
        leurs versions à plusieurs associés, SARL et SAS). Depuis la loi du 14 février 2022, le patrimoine personnel
        d’un entrepreneur individuel est séparé par défaut de son patrimoine professionnel : la protection du
        patrimoine n’est donc plus un argument décisif en faveur de la société.
      </p>
      <Table
        head={["", "Micro-entreprise", "EI au réel", "EURL", "SASU"]}
        numericFrom={5}
        rows={[
          ["Cotisations sociales", "% du CA : 12,3 % vente, 21,2 % services BIC, 25,6 % BNC", "TNS : env. 45 % du revenu net", "TNS sur la rémunération du gérant", "Assimilé salarié : env. 45 % patronal + 22 % salarial du brut"],
          ["Charges réelles déductibles", "Non (abattement forfaitaire)", "Oui", "Oui", "Oui"],
          ["Imposition du bénéfice", "IR après abattement 71 / 50 / 34 %, ou versement libératoire", "IR (barème)", "IR par défaut, option IS", "IS par défaut (option IR limitée à 5 exercices)"],
          ["Dividendes", "—", "—", "PFU 31,4 %, mais cotisations TNS au-delà de 10 % du capital", "PFU 31,4 % sans cotisations sociales"],
          ["Plafond de CA", "83 600 € services, 203 100 € vente", "Aucun", "Aucun", "Aucun"],
          ["Assurance chômage du dirigeant", "Non", "Non", "Non", "Non"],
          ["Coût de création", "Gratuit", "Gratuit", "≈ 200 € (greffe + annonce)", "≈ 225 € (greffe + annonce)"],
          ["Comptabilité", "Livre des recettes", "Comptabilité complète", "Bilan + liasse", "Bilan + liasse + paie"],
        ]}
        caption="Taux 2026. TNS : travailleur non salarié. PFU : prélèvement forfaitaire unique (12,8 % d’impôt + 18,6 % de prélèvements sociaux)."
      />

      <H2 id="exemples">Combien il vous reste : 3 cas chiffrés</H2>
      <p>
        Les chiffres ci-dessous sortent directement de notre{" "}
        <A href="/outils/choisir-statut-juridique">comparateur de statuts</A>, avec les hypothèses suivantes : activité
        libérale de conseil (BNC), célibataire (1 part fiscale), frais de fonctionnement estimés inclus (0 € en
        micro, environ 1 000 € en EI, 2 100 € en EURL et 2 300 € en SASU pour l’expert-comptable, la banque et le
        juridique), capital de l’EURL de 1 000 €, ni ACRE ni allocation chômage. Pour l’EURL et la SASU, la
        répartition entre rémunération et dividendes est celle qui maximise le net (option « répartition
        optimisée »).
      </p>

      <H3>Cas 1 : 40 000 € de CA, 3 000 € de charges</H3>
      <Table
        head={["Statut", "Cotisations", "IS", "Prélèv. dividendes", "Impôt sur le revenu", "Net / an", "Net / mois"]}
        rows={[
          ["Micro-entreprise", "10 240 €", "—", "—", "1 628 €", "25 132 €", "2 094 €"],
          ["EI au réel", "11 166 €", "—", "—", "1 454 €", "23 360 €", "1 947 €"],
          ["EURL (100 % rémunération)", "10 822 €", "0 €", "0 €", "1 105 €", "22 943 €", "1 912 €"],
          ["SASU (15 % rémunération)", "2 403 €", "4 420 €", "7 907 €", "0 €", "19 940 €", "1 662 €"],
        ]}
        caption="Le net est ce qui reste après charges, frais de fonctionnement, cotisations et impôts."
      />
      <p>
        La micro l’emporte nettement : 3 000 € de charges, c’est bien moins que l’abattement forfaitaire de 34 %
        (13 600 €) sur lequel vous êtes imposé, et vous n’avez ni comptable ni bilan à payer. La SASU optimisée ne
        valide ici qu’<strong>un seul trimestre de retraite</strong> : le salaire du président est trop faible.
      </p>

      <H3>Cas 2 : 70 000 € de CA, 5 000 € de charges</H3>
      <Table
        head={["Statut", "Cotisations", "IS", "Prélèv. dividendes", "Impôt sur le revenu", "Net / an", "Net / mois"]}
        rows={[
          ["Micro-entreprise", "17 920 €", "—", "—", "6 964 €", "40 116 €", "3 343 €"],
          ["EI au réel", "19 856 €", "—", "—", "6 341 €", "37 783 €", "3 149 €"],
          ["EURL (100 % rémunération)", "19 511 €", "0 €", "0 €", "4 811 €", "38 548 €", "3 212 €"],
          ["SASU (30 % rémunération)", "8 687 €", "6 717 €", "11 666 €", "0 €", "35 600 €", "2 967 €"],
        ]}
      />
      <p>
        L’écart se resserre, mais la micro garde environ 1 500 € d’avance sur l’EURL. Détail de la SASU pour
        comprendre la mécanique : sur 62 670 € disponibles après charges et frais, 18 801 € financent la
        rémunération (12 966 € brut, 10 114 € net). Le bénéfice restant, 43 869 €, supporte 6 717 € d’IS
        (15 % sur 42 500 € puis 25 % sur le reste). Les 37 152 € de dividendes subissent le PFU de 31,4 %
        (11 666 €) : il reste 25 486 € de dividendes nets.
      </p>

      <H3>Cas 3 : 120 000 € de CA, 8 000 € de charges</H3>
      <Table
        head={["Statut", "Cotisations", "IS", "Prélèv. dividendes", "Impôt sur le revenu", "Net / an", "Net / mois"]}
        rows={[
          ["Micro-entreprise", "Non éligible", "—", "—", "—", "—", "—"],
          ["EI au réel", "34 442 €", "—", "—", "16 065 €", "60 473 €", "5 039 €"],
          ["EURL (100 % rémunération)", "34 098 €", "0 €", "0 €", "13 563 €", "62 210 €", "5 184 €"],
          ["SASU (20 % rémunération)", "10 135 €", "17 684 €", "21 996 €", "0 €", "59 855 €", "4 988 €"],
        ]}
      />
      <p>
        Au-delà du plafond de 83 600 €, la micro n’est plus possible durablement. Les trois statuts au réel
        finissent dans un mouchoir de poche (moins de 2 500 € d’écart). À ce niveau, le choix se fait surtout sur la
        protection sociale, la possibilité de laisser de l’argent dans la société et vos projets (associés, revente).
      </p>

      <Box title="Pourquoi les résultats diffèrent" tone="tip">
        <UL>
          <li>
            <strong>Micro</strong> : cotisations sur le chiffre d’affaires (25,6 % en BNC), mais impôt calculé sur
            seulement 66 % du CA (abattement de 34 %) et aucun frais de comptabilité.
          </li>
          <li>
            <strong>EI et EURL</strong> : cotisations de travailleur non salarié d’environ 45 % du revenu net, mais
            sur le bénéfice réel, charges déduites.
          </li>
          <li>
            <strong>SASU</strong> : le salaire coûte cher (environ 1 850 € décaissés pour 1 000 € nets), d’où
            l’intérêt de verser surtout des dividendes, qui ne supportent que l’IS puis le PFU de 31,4 %.
          </li>
          <li>
            <strong>Frais de fonctionnement</strong> : 2 000 à 2 500 € par an pour une société, c’est 3 à 6 % d’un
            CA de 40 000 à 70 000 €.
          </li>
        </UL>
        <p>
          Le taux TNS de 45 % est une moyenne : les cotisations réelles des indépendants sont dégressives et
          dépendent du revenu (réforme de l’assiette sociale appliquée depuis 2026). Considérez ces résultats comme des
          ordres de grandeur, puis faites valider par un expert-comptable.
        </p>
      </Box>

      <H2 id="micro">Micro-entreprise : quand elle gagne, quand elle coince</H2>
      <p>
        La micro-entreprise cumule trois avantages : création gratuite en ligne, cotisations proportionnelles à ce
        que vous encaissez (pas de CA, pas de cotisations) et comptabilité réduite à un livre des recettes. Les taux
        2026 sont de <strong>12,3 %</strong> pour la vente, <strong>21,2 %</strong> pour les prestations de services
        BIC et <strong>25,6 %</strong> pour les professions libérales relevant de la Sécurité sociale des
        indépendants. Tous les détails (versement libératoire, CFP, CFE, exemples mensuels) sont dans notre guide{" "}
        <A href="/blog/simulateur-auto-entrepreneur-2026">micro-entreprise 2026</A>, et le calcul se fait en quelques
        secondes avec le <A href="/outils/simulateur-auto-entrepreneur">simulateur auto-entrepreneur</A>.
      </p>
      <H3>Les limites à anticiper</H3>
      <UL>
        <li>
          <strong>Plafonds de CA</strong> : 83 600 € pour les services et 203 100 € pour la vente. Un seul
          dépassement ne fait pas sortir du régime : il faut dépasser <strong>deux années consécutives</strong>, et
          la bascule au réel a lieu le 1er janvier de l’année suivante.
        </li>
        <li>
          <strong>TVA</strong> : la franchise en base s’applique jusqu’à 37 500 € de CA en services (85 000 € en
          vente). Au-delà de 41 250 € (93 500 € en vente) dans l’année, la TVA est due dès le jour du dépassement. Vos
          prix TTC augmentent de 20 % pour vos clients particuliers, ou votre marge baisse d’autant.
        </li>
        <li>
          <strong>Charges non déductibles</strong> : si vos charges réelles dépassent l’abattement (34 % en BNC,
          50 % en services BIC, 71 % en vente), vous êtes imposé sur un bénéfice qui n’existe pas.
        </li>
        <li>
          <strong>Compte bancaire dédié</strong> : il devient obligatoire si le CA dépasse 10 000 € deux années
          consécutives (un compte courant personnel séparé suffit). En pratique, ouvrez-le dès le début.
        </li>
      </UL>

      <H2 id="is">L’impôt sur les sociétés en 2026</H2>
      <p>
        En SASU, et en EURL qui a opté pour l’IS, le bénéfice est d’abord imposé au niveau de la société. Le barème
        2026 comporte deux taux :
      </p>
      <UL>
        <li>
          <strong>15 %</strong> sur les 42 500 premiers euros de bénéfice, à condition que le CA ne dépasse pas
          10 millions d’euros et que le capital soit <strong>entièrement libéré</strong> et détenu à 75 % au moins par
          des personnes physiques ;
        </li>
        <li>
          <strong>25 %</strong> au-delà.
        </li>
      </UL>
      <Box title="Exemple : 80 000 € de bénéfice imposable">
        <Table
          head={["Tranche", "Taux", "IS"]}
          rows={[
            ["Jusqu’à 42 500 €", "15 %", "6 375 €"],
            ["De 42 500 € à 80 000 € (37 500 €)", "25 %", "9 375 €"],
            ["Total", "19,7 % effectif", "15 750 €"],
          ]}
          highlightLast
        />
        <p>
          Il reste 64 250 € dans la société. Distribués en dividendes, ils supportent encore le PFU de 31,4 %
          (20 175 €) : il vous revient 44 075 €. Laissés en réserve, ils financent la trésorerie ou les
          investissements sans imposition personnelle.
        </p>
      </Box>
      <H3>Calendrier de paiement</H3>
      <p>
        L’IS se paie par quatre acomptes, les 15 mars, 15 juin, 15 septembre et 15 décembre, puis un solde le 15 du
        4e mois qui suit la clôture (le 15 mai pour un exercice clos le 31 décembre). Les sociétés dont l’IS est
        inférieur à 3 000 € sont dispensées d’acomptes, de même que les sociétés nouvelles pour leur premier
        exercice : prévoyez donc la totalité de l’impôt au moment du solde.
      </p>
      <H3>IS ou IR ?</H3>
      <p>
        À l’IR, tout le bénéfice est imposé chez vous, même s’il reste sur le compte de l’entreprise, et au taux
        marginal de votre foyer (30 % dès 29 580 € de revenu imposable par part, puis 41 %). L’IS devient
        intéressant dès que vous pouvez laisser une partie du bénéfice dans la société : les sommes non distribuées
        ne sont taxées qu’à 15 %. Si vous consommez tout votre bénéfice chaque année, l’avantage de l’IS fond, comme
        le montrent les cas chiffrés ci-dessus.
      </p>

      <H2 id="salaire-dividendes">SASU et EURL : salaire ou dividendes ?</H2>
      <H3>En SASU : les dividendes sans cotisations</H3>
      <p>
        Les dividendes d’une SASU ne supportent aucune cotisation sociale, seulement le PFU de{" "}
        <strong>31,4 %</strong> (12,8 % d’impôt et 18,6 % de prélèvements sociaux depuis la hausse de CSG de la LFSS
        2026), ou, sur option globale, le barème de l’IR après abattement de 40 %. Pour visualiser la décomposition du
        PFU sur un montant donné, vous pouvez utiliser notre <A href="/outils/simulateur-flat-tax-crypto">simulateur
        de flat tax</A> (même taux que pour les dividendes).
      </p>
      <p>
        Le « tout dividendes » a cependant trois défauts : aucune cotisation retraite, pas d’indemnités journalières
        en cas d’arrêt maladie, et la taxe PUMa (voir plus bas). La stratégie courante consiste à verser un salaire
        modéré, au moins <strong>7 212 € brut par an</strong>, soit quatre fois 1 803 € (150 heures au SMIC horaire
        du 1er janvier 2026, 12,02 €) pour valider quatre trimestres de retraite, puis le reste en dividendes.
      </p>
      <p>
        Sur le cas à 70 000 € de CA, notre simulateur donne pour la SASU : 33 390 € nets en tout dividendes (dont
        1 769 € de taxe PUMa, et zéro trimestre), 35 336 € avec 20 % en rémunération, 34 735 € avec 50 % et
        31 506 € en tout salaire.
      </p>
      <H3>En EURL : le piège des 10 %</H3>
      <p>
        Pour le gérant majoritaire d’EURL, la part des dividendes qui dépasse <strong>10 % du capital social, des
        primes d’émission et des comptes courants d’associé</strong> est soumise aux cotisations sociales des
        indépendants. Avec 1 000 € de capital, tout dividende au-delà de 100 € est donc « recotisé ». C’est pourquoi
        l’EURL optimisée se rémunère presque entièrement en salaire de gérant dans nos exemples : sur le cas à
        70 000 €, verser 100 % en dividendes ne laisserait que 21 718 € nets, contre 38 548 € en rémunération.
      </p>

      <H2 id="pieges">Les pièges qui coûtent cher</H2>
      <OL>
        <li>
          <strong>La taxe PUMa</strong> (cotisation subsidiaire maladie). Si vos revenus d’activité sont inférieurs à
          20 % du plafond annuel de la Sécurité sociale, soit <strong>9 612 € en 2026</strong>, et vos revenus du
          capital supérieurs à 50 % de ce plafond (24 030 €), l’Urssaf prélève 6,5 % de la part des revenus du
          capital qui dépasse 24 030 €, avec une dégressivité jusqu’au seuil de 9 612 €. Le président de SASU payé
          uniquement en dividendes est la cible type. Un salaire au-dessus de 9 612 € supprime la taxe.
        </li>
        <li>
          <strong>Zéro salaire, zéro protection</strong>. Sans rémunération, pas de trimestres de retraite ni
          d’indemnités journalières. Et aucun dirigeant (micro, EURL, SASU) ne cotise à l’assurance chômage.
        </li>
        <li>
          <strong>Les dividendes d’EURL</strong> au-delà de 10 % du capital, vus plus haut.
        </li>
        <li>
          <strong>La sortie non anticipée de la micro</strong>. Deux années au-dessus du plafond, et vous passez au
          réel au 1er janvier suivant, avec comptabilité complète. Anticipez dès la première année de dépassement.
        </li>
        <li>
          <strong>La CFE</strong> (cotisation foncière des entreprises). Tous les statuts la paient, micro comprise,
          à partir de la deuxième année : l’année de création est exonérée, ainsi que les CA inférieurs à 5 000 €.
          Comptez de quelques centaines à plus de 1 000 € selon la commune.
        </li>
        <li>
          <strong>Un TJM calculé sur son ancien salaire</strong>. Avant de comparer les statuts, fixez un tarif qui
          couvre cotisations, jours non facturés et frais, avec le{" "}
          <A href="/outils/calculateur-tjm-freelance">calculateur de TJM</A> et notre guide{" "}
          <A href="/blog/guide-freelance-2026">TJM et facturation du freelance</A>.
        </li>
      </OL>

      <H2 id="couts">Coûts de création et de fonctionnement</H2>
      <Table
        head={["Poste", "Micro / EI", "EURL", "SASU"]}
        rows={[
          ["Immatriculation (guichet unique)", "Gratuit", "33,83 €", "33,83 €"],
          ["Déclaration des bénéficiaires effectifs", "—", "19,33 €", "19,33 €"],
          ["Annonce légale de constitution (forfait 2026, TTC)", "—", "148,80 €", "170,40 €"],
          ["Expert-comptable (estimation annuelle)", "0 € (micro), ≈ 900 € (EI)", "≈ 1 800 €", "≈ 2 000 €"],
          ["Banque, juridique (estimation annuelle)", "0 à 120 €", "≈ 330 €", "≈ 330 €"],
        ]}
        caption="Frais réglementés 2026 (greffe, annonce légale) et estimations moyennes pour les frais annuels, non réglementés."
      />
      <p>
        En société, un compte bancaire au nom de la société est indispensable : il reçoit le dépôt du capital et
        sépare les flux de l’entreprise des vôtres. Côté documents, pensez dès le départ à des factures conformes
        (notre <A href="/outils/generateur-facture">générateur de factures</A>) et, si vous avez un site, aux
        mentions légales obligatoires (<A href="/outils/generateur-mentions-legales">générateur de mentions
        légales</A>).
      </p>

      <H2 id="chomage-acre">Chômage, ARCE et ACRE</H2>
      <p>
        Si vous créez en étant indemnisé par France Travail, deux options s’offrent à vous : conserver l’ARE
        mensuelle, réduite de 70 % de votre rémunération (en micro, le CA après abattement), ou demander l’ARCE, un
        versement en capital de 60 % des droits restants. Un président de SASU qui ne se verse pas de salaire conserve
        son ARE entière, ce qui explique la popularité de ce montage pendant la période d’indemnisation. Le
        comparateur intègre ce paramètre.
      </p>
      <p>
        L’<strong>ACRE</strong> allège les cotisations de la première année pour les créateurs éligibles
        (demandeurs d’emploi indemnisés, bénéficiaires du RSA ou de l’ASS, moins de 26 ans, etc.). Deux changements
        en 2026 : la demande doit désormais être déposée auprès de l’Urssaf dans les <strong>60 jours</strong> qui
        suivent le début d’activité, pour tous les statuts, et pour les micro-entreprises créées depuis le{" "}
        <strong>1er juillet 2026</strong>, l’exonération n’est plus que de <strong>25 %</strong> (les cotisations
        passent à 75 % du taux normal, contre 50 % auparavant). En BNC, le taux passe ainsi de 25,6 % à 19,2 %.
      </p>

      <H2 id="decision">Quel statut selon votre profil</H2>
      <Table
        head={["Votre situation", "Statut à étudier en priorité", "Pourquoi"]}
        numericFrom={9}
        rows={[
          ["Activité à tester, side project, CA incertain", "Micro-entreprise", "Gratuite, sans CA pas de cotisations, fermeture simple"],
          ["Freelance en services, CA < 83 600 €, peu de frais", "Micro-entreprise", "Abattement de 34 à 50 % souvent supérieur aux frais réels"],
          ["Charges réelles > 40 % du CA (achats, sous-traitance)", "EI au réel ou EURL", "Déduction des charges réelles"],
          ["Bénéfice élevé, besoin de revenus limité", "EURL ou SASU à l’IS", "Bénéfice mis en réserve imposé à 15 %"],
          ["Indemnisé par France Travail", "SASU (sans salaire) ou micro", "ARE conservée ou peu réduite"],
          ["Associés à venir, levée de fonds", "SAS / SASU", "Entrée d’associés souple, actions, BSPCE"],
          ["Priorité à la protection sociale", "SASU avec salaire", "Régime général (hors chômage), prévoyance"],
        ]}
      />
      <p>
        Avant de trancher, comparez aussi votre situation avec un CDI équivalent grâce à l’outil{" "}
        <A href="/outils/freelance-vs-cdi">freelance vs CDI</A>, puis lancez le{" "}
        <A href="/outils/choisir-statut-juridique">comparateur de statuts</A> avec vos propres chiffres. Rien
        n’est définitif : on peut démarrer en micro pour valider son marché, puis créer une société quand le CA
        approche des plafonds ou que les charges augmentent.
      </p>
    </ArticleShell>
  );
}
