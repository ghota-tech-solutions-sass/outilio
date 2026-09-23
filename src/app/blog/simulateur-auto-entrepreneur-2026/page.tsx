import { A, ArticleShell, Box, H2, H3, OL, Table, Toc, UL } from "../_components/Article";

const SOURCES = [
  {
    label: "Urssaf – Taux de cotisations des auto-entrepreneurs (2026)",
    url: "https://www.urssaf.fr/accueil/actualites/taux-cotisations-autoentrepeneur.html",
  },
  {
    label: "Service-Public Entreprendre – Seuils de chiffre d’affaires de la micro-entreprise (F32353)",
    url: "https://entreprendre.service-public.gouv.fr/vosdroits/F32353",
  },
  {
    label: "Service-Public Entreprendre – Franchise en base de TVA (F21746)",
    url: "https://entreprendre.service-public.gouv.fr/vosdroits/F21746",
  },
  {
    label: "Service-Public Entreprendre – Régime fiscal de la micro-entreprise et versement libératoire (F23267)",
    url: "https://entreprendre.service-public.gouv.fr/vosdroits/F23267",
  },
  {
    label: "Service-Public Entreprendre – Acre : aide à la création ou à la reprise d’entreprise (F11677)",
    url: "https://entreprendre.service-public.gouv.fr/vosdroits/F11677",
  },
  {
    label: "Service-Public Entreprendre – Acre : du changement au 1er juillet 2026 (décret n° 2026-69 du 6 février 2026)",
    url: "https://entreprendre.service-public.gouv.fr/actualites/A18795",
  },
  {
    label: "Service-Public Entreprendre – Cotisation foncière des entreprises (F23547)",
    url: "https://entreprendre.service-public.gouv.fr/vosdroits/F23547",
  },
  {
    label: "Service-Public Entreprendre – Compte bancaire du micro-entrepreneur (F35991)",
    url: "https://entreprendre.service-public.gouv.fr/vosdroits/F35991",
  },
  {
    label: "Autoentrepreneur.urssaf.fr – L’essentiel du statut",
    url: "https://www.autoentrepreneur.urssaf.fr/portail/accueil/sinformer-sur-le-statut/lessentiel-du-statut.html",
  },
];

const TOC = [
  { id: "cotisations", label: "Les taux de cotisations 2026" },
  { id: "exemples", label: "Trois exemples de revenu net" },
  { id: "plafonds", label: "Plafonds de chiffre d’affaires et sortie du régime" },
  { id: "tva", label: "Franchise en base de TVA : 37 500 € et 85 000 €" },
  { id: "impot", label: "Impôt : abattement ou versement libératoire ?" },
  { id: "acre", label: "ACRE : 25 % depuis le 1er juillet 2026" },
  { id: "cfe", label: "CFE, compte bancaire et autres obligations" },
  { id: "pieges", label: "Les 7 erreurs qui coûtent cher" },
];

export default function ArticleAutoEntrepreneur2026() {
  return (
    <ArticleShell
      slug="simulateur-auto-entrepreneur-2026"
      breadcrumb="Micro-entreprise 2026"
      lead="La micro-entreprise reste le moyen le plus simple de se lancer : pas de comptable obligatoire, des cotisations proportionnelles au chiffre d’affaires. Mais entre la hausse du taux BNC à 25,6 %, l’ACRE réduite à 25 % et les seuils de TVA, le « net » réel est souvent plus bas qu’on ne l’imagine. Voici les règles 2026 et des calculs complets."
      sources={SOURCES}
      cta={{
        text: "Calculez votre revenu net de micro-entrepreneur selon votre activité, avec ou sans ACRE",
        label: "Lancer le simulateur auto-entrepreneur",
        href: "/outils/simulateur-auto-entrepreneur",
      }}
    >
      <Toc items={TOC} />

      <p>
        En micro-entreprise (le nom officiel de l’auto-entreprise), vous ne payez pas vos cotisations sur un
        bénéfice mais sur votre <strong>chiffre d’affaires encaissé</strong>. C’est la force du régime (pas de
        chiffre d’affaires, pas de cotisations) et sa limite : vos frais ne sont jamais déduits. Pour savoir si le
        régime vous convient, il faut donc raisonner en trois temps : combien l’Urssaf prélève, combien le fisc
        prélève, et ce qu’il reste une fois vos dépenses professionnelles payées.
      </p>

      <H2 id="cotisations">Les taux de cotisations sociales 2026</H2>
      <p>
        Les cotisations sociales sont un pourcentage fixe du chiffre d’affaires, déclaré chaque mois ou chaque
        trimestre sur autoentrepreneur.urssaf.fr (y compris quand il est nul). Elles financent l’assurance maladie,
        la retraite de base et complémentaire, les indemnités journalières et les allocations familiales. S’y ajoute
        la <strong>contribution à la formation professionnelle (CFP)</strong>, qui ouvre vos droits à la formation.
      </p>
      <Table
        head={["Activité", "Cotisations 2026", "CFP", "Total"]}
        rows={[
          ["Vente de marchandises, restauration, hébergement (BIC)", "12,3 %", "0,1 %", "12,4 %"],
          ["Prestations de services commerciales ou artisanales (BIC)", "21,2 %", "0,3 % (artisans) / 0,1 % (commerçants)", "21,3 à 21,5 %"],
          ["Professions libérales non réglementées (BNC, Sécurité sociale des indépendants)", "25,6 %", "0,2 %", "25,8 %"],
          ["Professions libérales réglementées affiliées à la Cipav", "23,2 %", "0,2 %", "23,4 %"],
        ]}
        caption="Taux Urssaf applicables au 1er janvier 2026. Le taux BNC hors Cipav est passé de 24,6 % à 25,6 %, dernière marche du calendrier de hausse engagé en 2024."
      />
      <p>
        Le point clé de 2026 concerne les <strong>libéraux non réglementés</strong> (consultants, développeurs,
        formateurs, graphistes…) : leur taux atteint 25,6 %, contre 21,1 % jusqu’en juin 2024. En contrepartie, ils cotisent
        davantage pour leur retraite complémentaire. Beaucoup d’articles citent encore 21,1 % ou 21,2 % pour les
        BNC : ce taux est périmé. Les libéraux réglementés rattachés à la Cipav (architectes, psychologues,
        ostéopathes, etc.) restent à 23,2 %.
      </p>
      <Box tone="warning" title="BIC ou BNC : ne vous trompez pas de ligne">
        <p>
          Un développeur freelance ou un consultant relève en général des BNC (25,6 %), un plombier ou un
          photographe qui vend des tirages des BIC (21,2 % pour la partie services, 12,3 % pour la vente). La
          catégorie est fixée à l’immatriculation, sur le guichet unique de l’INPI : vérifiez-la sur votre
          attestation, car elle détermine aussi l’abattement fiscal.
        </p>
      </Box>

      <H2 id="exemples">Trois exemples de revenu net en 2026</H2>
      <p>
        Les calculs ci-dessous reprennent exactement la méthode de notre{" "}
        <A href="/outils/simulateur-auto-entrepreneur">simulateur auto-entrepreneur</A> : cotisations et CFP sur
        le chiffre d’affaires annuel, impôt au barème 2026 (revenus 2025) sur le chiffre d’affaires après
        abattement pour une personne seule sans autre revenu, et une CFE estimée (son montant réel dépend de votre
        commune). Aucun frais professionnel n’est déduit : c’est à vous de les retrancher.
      </p>

      <H3>1. Consultante en BNC, 48 000 € de chiffre d’affaires (4 000 € par mois)</H3>
      <Table
        head={["Poste", "Barème progressif", "Versement libératoire"]}
        rows={[
          ["Chiffre d’affaires annuel", "48 000 €", "48 000 €"],
          ["Cotisations sociales (25,6 %)", "− 12 288 €", "− 12 288 €"],
          ["CFP (0,2 %)", "− 96 €", "− 96 €"],
          ["Impôt sur le revenu", "− 2 608 € (sur 31 680 € imposables)", "− 1 056 € (2,2 %)"],
          ["CFE estimée", "− 900 €", "− 900 €"],
          ["Revenu net annuel", "32 108 €", "33 660 €"],
          ["Soit par mois", "2 676 €", "2 805 €"],
        ]}
        highlightLast
        caption="Taux de prélèvement global : 33,1 % au barème, 29,9 % avec le versement libératoire. Avec l’ACRE (19,2 % au lieu de 25,6 %), les cotisations baissent d’environ 3 070 € pendant la période d’exonération."
      />
      <p>
        Un calcul fait avec l’ancien taux de 21,1 % et sans CFE aboutit à environ 3 060 € par mois pour le même chiffre
        d’affaires : l’écart de près de 400 € par mois vient de la hausse du taux BNC, de la CFE et de l’impôt au
        barème. Ici, le versement libératoire fait gagner environ 1 550 € par an, car cette consultante n’a pas
        d’autre revenu qui ferait baisser son taux moyen.
      </p>

      <H3>2. Artisan en prestations de services BIC, 30 000 € de chiffre d’affaires</H3>
      <UL>
        <li>Cotisations (21,2 %) : 6 360 € ; CFP artisan (0,3 %) : 90 € ; CFE estimée : 550 €.</li>
        <li>
          Revenu imposable après abattement de 50 % : 15 000 €. Impôt au barème : 374 € avant décote, ramené à{" "}
          <strong>0 €</strong> après la décote (897 € − 45,25 % de l’impôt brut pour une personne seule).
        </li>
        <li>Avec le versement libératoire (1,7 %), il paierait 510 € d’impôt.</li>
        <li>
          Revenu net : environ <strong>23 000 € par an</strong> au barème (1 917 € par mois), avant achats de
          matériaux, outillage et véhicule, qui ne sont pas déductibles.
        </li>
      </UL>
      <p>
        Moralité : pour un revenu modeste, le versement libératoire fait payer un impôt qui n’aurait pas été dû.
        Notre simulateur affiche l’impôt au barème hors décote : si le résultat est faible, vérifiez l’impôt final
        avec le <A href="/outils/simulateur-impot">simulateur d’impôt sur le revenu</A>.
      </p>

      <H3>3. Commerçant en ligne, 80 000 € de ventes</H3>
      <UL>
        <li>Cotisations (12,3 %) : 9 840 € ; CFP (0,1 %) : 80 € ; CFE estimée : 900 €.</li>
        <li>Revenu imposable après abattement de 71 % : 23 200 € ; impôt au barème : 956 € après décote.</li>
        <li>
          Reste : environ 68 200 €. <strong>Mais</strong> ce chiffre inclut le coût des marchandises. Si elles
          représentent 60 % des ventes (48 000 €), le revenu réel tombe à environ 20 000 € par an.
        </li>
      </UL>
      <Box tone="tip" title="La bonne question pour la vente : quelle marge ?">
        <p>
          En achat-revente, le taux de cotisations bas (12,3 %) est trompeur : il s’applique sur le chiffre
          d’affaires, stock compris. Calculez d’abord votre marge avec le{" "}
          <A href="/outils/calculateur-marge">calculateur de marge</A>. Si vos achats dépassent 70 % du chiffre
          d’affaires (au-delà de l’abattement forfaitaire de 71 %), une entreprise au réel peut devenir plus
          intéressante : comparez avec notre outil <A href="/outils/choisir-statut-juridique">quel statut juridique choisir</A>.
        </p>
      </Box>

      <H2 id="plafonds">Plafonds de chiffre d’affaires et sortie du régime</H2>
      <p>Les seuils ont été relevés pour la période 2026-2028 :</p>
      <Table
        head={["Activité", "Plafond annuel 2026 (HT)", "Ancien plafond (2023-2025)"]}
        rows={[
          ["Vente de marchandises, restauration, hébergement, meublés de tourisme classés", "203 100 €", "188 700 €"],
          ["Prestations de services BIC et professions libérales BNC", "83 600 €", "77 700 €"],
          ["Meublés de tourisme non classés", "15 000 €", "–"],
        ]}
      />
      <UL>
        <li>
          <strong>Un dépassement isolé ne fait pas sortir du régime.</strong> Il faut dépasser le plafond deux
          années civiles consécutives : vous basculez alors au régime réel au 1er janvier suivant la deuxième année.
        </li>
        <li>
          <strong>Première année : le plafond est proratisé</strong> selon la durée d’activité. Si vous démarrez le
          1er juillet 2026 en prestations de services, le plafond 2026 est d’environ 83 600 × 184 / 365 ≈ 42 140 €.
        </li>
        <li>
          <strong>Activité mixte</strong> (vente + services) : le chiffre d’affaires total ne doit pas dépasser
          203 100 €, dont 83 600 € au maximum pour les services.
        </li>
      </UL>

      <H2 id="tva">Franchise en base de TVA : 37 500 € et 85 000 €</H2>
      <p>
        La franchise de TVA est un seuil distinct, beaucoup plus bas que les plafonds du régime micro. Tant que
        vous restez dessous, vous facturez sans TVA avec la mention « TVA non applicable, art. 293 B du
        CGI ». La réforme qui devait abaisser ce seuil à 25 000 € a été abrogée par la loi du 3 novembre 2025 :
        les seuils 2026 restent inchangés.
      </p>
      <Table
        head={["Activité", "Seuil de base", "Seuil majoré"]}
        rows={[
          ["Vente, restauration, hébergement", "85 000 €", "93 500 €"],
          ["Prestations de services et professions libérales", "37 500 €", "41 250 €"],
          ["Avocats (activité réglementée)", "50 000 €", "55 000 €"],
          ["Auteurs et artistes-interprètes (livraison d’œuvres, droits)", "50 000 €", "55 000 €"],
        ]}
      />
      <UL>
        <li>
          <strong>Entre le seuil de base et le seuil majoré</strong> : vous restez en franchise pour l’année en
          cours, mais la TVA s’applique à partir du 1er janvier suivant.
        </li>
        <li>
          <strong>Au-delà du seuil majoré</strong> : la TVA est due dès le jour du dépassement. La facture qui
          fait franchir 41 250 € (en services) doit déjà comporter de la TVA.
        </li>
      </UL>
      <Box tone="warning" title="Anticiper le passage à la TVA">
        <p>
          Pour un client professionnel, la TVA est neutre : il la récupère. Pour un particulier, elle renchérit
          votre prix de 20 %. Si votre clientèle est composée de particuliers, prévoyez vos tarifs TTC dès le départ
          ou acceptez de rogner votre marge. Le <A href="/outils/calculateur-tva">calculateur de TVA</A> convertit
          vos prix HT et TTC en un clic. Notez qu’une fois assujetti, vous pouvez aussi récupérer la TVA sur vos
          achats.
        </p>
      </Box>

      <H2 id="impot">Impôt : abattement forfaitaire ou versement libératoire ?</H2>
      <H3>Par défaut : le barème après abattement</H3>
      <p>
        Votre chiffre d’affaires est reporté sur la déclaration de revenus (formulaire 2042-C-PRO). L’administration
        applique un abattement forfaitaire pour frais, puis le barème progressif avec les autres revenus du foyer :
      </p>
      <Table
        head={["Activité", "Abattement", "Revenu imposable pour 40 000 € de CA"]}
        rows={[
          ["Vente de marchandises (BIC)", "71 %", "11 600 €"],
          ["Prestations de services (BIC)", "50 %", "20 000 €"],
          ["Professions libérales (BNC)", "34 %", "26 400 €"],
        ]}
        caption="L’abattement ne peut pas être inférieur à 305 €."
      />
      <H3>En option : le versement libératoire</H3>
      <p>
        Vous payez l’impôt en même temps que vos cotisations, à un taux fixe sur le chiffre d’affaires :{" "}
        <strong>1 %</strong> (vente), <strong>1,7 %</strong> (services BIC), <strong>2,2 %</strong> (BNC). Il est
        réservé aux foyers dont le revenu fiscal de référence de l’avant-dernière année (2024 pour 2026) ne dépasse
        pas la limite de la deuxième tranche du barème par part :
      </p>
      <UL>
        <li>29 579 € pour une personne seule ;</li>
        <li>59 158 € pour un couple ;</li>
        <li>73 947,50 € pour un couple avec un enfant, 88 737 € avec deux enfants.</li>
      </UL>
      <p>
        L’option se demande à l’Urssaf avant le 30 septembre pour l’année suivante, ou au plus tard le dernier jour
        du troisième mois qui suit la création. Elle est intéressante si votre taux marginal d’imposition est de
        30 % ou plus (conjoint aux revenus élevés, par exemple) et coûteuse si votre foyer n’est pas ou peu imposable
        (exemple 2 ci-dessus).
      </p>
      <Box title="Règle rapide pour décider">
        <p>
          Comparez le taux du versement libératoire à votre taux moyen appliqué au revenu après abattement. Pour un
          BNC, le versement libératoire (2,2 % du CA) équivaut à 3,3 % du revenu imposable (2,2 / 0,66). Si votre
          foyer paie en moyenne plus de 3,3 % d’impôt sur ce revenu, l’option est gagnante. En BIC services, le
          point d’équilibre est à 3,4 % (1,7 / 0,5), en vente à 3,4 % également (1 / 0,29).
        </p>
      </Box>

      <H2 id="acre">ACRE : une exonération réduite à 25 % depuis le 1er juillet 2026</H2>
      <p>
        L’aide à la création ou à la reprise d’entreprise (ACRE) réduit les cotisations sociales au démarrage. Le
        décret n° 2026-69 du 6 février 2026 a changé la donne pour les micro-entrepreneurs :
      </p>
      <Table
        head={["Activité", "Taux normal", "ACRE (création avant le 1er juillet 2026)", "ACRE (création depuis le 1er juillet 2026)"]}
        rows={[
          ["Vente (BIC)", "12,3 %", "6,15 %", "9,2 %"],
          ["Services (BIC)", "21,2 %", "10,6 %", "15,9 %"],
          ["Libéral (BNC)", "25,6 %", "12,8 %", "19,2 %"],
        ]}
        caption="Depuis le 1er juillet 2026, l’exonération est de 25 % : vous payez 75 % du taux normal. Les créations antérieures conservent le taux réduit de moitié."
      />
      <UL>
        <li>
          <strong>Qui y a droit ?</strong> Notamment les demandeurs d’emploi indemnisés ou inscrits six mois sur les
          18 derniers mois, les bénéficiaires du RSA ou de l’ASS, les 18-25 ans (29 ans en situation de handicap),
          les moins de 30 ans sans droits suffisants au chômage, les créateurs installés en quartier prioritaire ou
          en zone France ruralités revitalisation, les titulaires d’un contrat CAPE.
        </li>
        <li>
          <strong>Condition commune</strong> : ne pas en avoir bénéficié au cours des trois années précédentes.
        </li>
        <li>
          <strong>Durée</strong> : jusqu’à la fin du troisième trimestre civil qui suit le début d’activité. Pour
          un démarrage le 3 septembre 2026, l’ACRE court jusqu’au 30 juin 2027.
        </li>
        <li>
          <strong>Démarche</strong> : l’ACRE n’est pas automatique en micro-entreprise. Envoyez le formulaire de
          demande à l’Urssaf avec vos justificatifs au plus tard <strong>60 jours</strong> après le début
          d’activité. Sans réponse sous 30 jours, la demande est acceptée.
        </li>
      </UL>
      <p>
        Sur notre exemple de consultante à 48 000 €, l’ACRE « nouvelle formule » fait économiser environ 3 070 € de
        cotisations pour douze mois d’exonération (4 000 € encaissés par mois), contre 6 140 € avec l’ancienne exonération de 50 %.
      </p>

      <H2 id="cfe">CFE, compte bancaire et autres obligations</H2>
      <H3>La cotisation foncière des entreprises (CFE)</H3>
      <UL>
        <li>Exonération totale l’année de création, puis base réduite de moitié l’année suivante.</li>
        <li>Exonération si le chiffre d’affaires de l’avant-dernière année ne dépasse pas 5 000 €.</li>
        <li>
          Au-delà, une cotisation minimale fixée par votre commune : entre 250 € et 597 € sous 10 000 € de chiffre
          d’affaires, jusqu’à 1 194 € entre 10 001 € et 32 600 €, jusqu’à 2 509 € entre 32 601 € et 100 000 €.
        </li>
        <li>
          À payer le 15 décembre sur votre espace professionnel impots.gouv.fr. L’année de création, déposez le
          formulaire 1447-C-SD avant le 31 décembre.
        </li>
      </UL>
      <p>
        C’est l’oubli classique de la deuxième année : un avis de 500 à 1 000 € tombe en novembre alors que rien
        n’a été provisionné.
      </p>
      <H3>Compte bancaire dédié</H3>
      <p>
        Un compte séparé devient obligatoire lorsque votre chiffre d’affaires dépasse 10 000 € deux années civiles
        consécutives. Un second compte de particulier suffit ; un compte professionnel n’est pas exigé. Dans les
        faits, séparer les flux dès le premier euro simplifie vos déclarations et vos relances clients.
      </p>
      <H3>Livre des recettes et factures</H3>
      <p>
        Vous devez tenir un livre des recettes (et un registre des achats en activité de vente) et émettre des
        factures conformes. Notre <A href="/outils/generateur-facture">générateur de factures</A> intègre les
        mentions obligatoires, dont la mention d’exonération de TVA. Pour la facturation électronique qui arrive
        pour les micro-entreprises en septembre 2027, voir notre{" "}
        <A href="/blog/guide-freelance-2026">guide du freelance : TJM et facturation</A>.
      </p>

      <H2 id="pieges">Les 7 erreurs qui coûtent cher</H2>
      <OL>
        <li>
          <strong>Utiliser un taux périmé</strong> (21,1 % au lieu de 25,6 % en BNC) : sur 50 000 € de chiffre
          d’affaires, c’est 2 250 € de cotisations sous-estimées.
        </li>
        <li>
          <strong>Confondre chiffre d’affaires et revenu</strong> : ni les frais, ni le matériel, ni le stock ne
          sont déductibles.
        </li>
        <li>
          <strong>Oublier la TVA</strong> au franchissement de 41 250 € en services : la TVA non facturée reste
          due, sur vos propres deniers.
        </li>
        <li>
          <strong>Demander l’ACRE trop tard</strong> : passé 60 jours, elle est perdue.
        </li>
        <li>
          <strong>Opter pour le versement libératoire par réflexe</strong> alors que votre foyer est peu imposé.
        </li>
        <li>
          <strong>Ne pas provisionner</strong> : mettez de côté environ 30 % de chaque encaissement en BNC (cotisations
          + impôt + CFE), 25 % en services BIC.
        </li>
        <li>
          <strong>Rester en micro par habitude</strong> quand les frais réels dépassent l’abattement ou que le
          chiffre d’affaires approche le plafond : c’est le moment de comparer les statuts avec notre{" "}
          <A href="/blog/guide-creation-entreprise-2026">guide micro, EURL ou SASU</A>.
        </li>
      </OL>

      <H2 id="aller-plus-loin">Pour aller plus loin</H2>
      <UL>
        <li>
          Fixer un tarif qui couvre vraiment vos cotisations et vos jours non facturés :{" "}
          <A href="/outils/calculateur-tjm-freelance">calculateur de TJM freelance</A>.
        </li>
        <li>
          Comparer votre net en micro avec un CDI équivalent : <A href="/outils/freelance-vs-cdi">freelance vs CDI</A>.
        </li>
        <li>
          Mesurer l’écart entre micro, EURL et SASU pour votre chiffre d’affaires :{" "}
          <A href="/outils/choisir-statut-juridique">quel statut juridique choisir</A>.
        </li>
      </UL>
    </ArticleShell>
  );
}
