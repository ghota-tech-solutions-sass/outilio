import { A, ArticleShell, Box, H2, H3, OL, Table, Toc, UL } from "../_components/Article";

const SOURCES = [
  {
    label: "Urssaf – Taux de cotisations des auto-entrepreneurs (2026)",
    url: "https://www.urssaf.fr/accueil/actualites/taux-cotisations-autoentrepeneur.html",
  },
  {
    label: "Service-Public Entreprendre – Mentions obligatoires d’une facture (F31808)",
    url: "https://entreprendre.service-public.gouv.fr/vosdroits/F31808",
  },
  {
    label: "Service-Public Entreprendre – Délais de paiement entre professionnels et pénalités de retard (F23211)",
    url: "https://entreprendre.service-public.gouv.fr/vosdroits/F23211",
  },
  {
    label: "Légifrance – Code de commerce, articles L441-10 à L441-16 (délais de paiement)",
    url: "https://www.legifrance.gouv.fr/codes/id/LEGISCTA000038411055",
  },
  {
    label: "impots.gouv.fr – Je passe à la facturation électronique",
    url: "https://www.impots.gouv.fr/professionnel/je-passe-la-facturation-electronique",
  },
  {
    label: "Service-Public Entreprendre – Franchise en base de TVA (F21746)",
    url: "https://entreprendre.service-public.gouv.fr/vosdroits/F21746",
  },
  {
    label: "Service-Public Entreprendre – Seuils de chiffre d’affaires de la micro-entreprise (F32353)",
    url: "https://entreprendre.service-public.gouv.fr/vosdroits/F32353",
  },
  {
    label: "economie.gouv.fr (DGCCRF) – Délais de paiement : les règles à connaître",
    url: "https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/delais-de-paiement-les-regles-connaitre",
  },
];

const TOC = [
  { id: "principe", label: "Le TJM se calcule à l’envers, à partir du revenu visé" },
  { id: "jours", label: "Étape 1 : compter ses vrais jours facturables" },
  { id: "chiffre", label: "Étape 2 : le chiffre d’affaires nécessaire" },
  { id: "exemple", label: "Exemple complet : 3 000 € net par mois" },
  { id: "garde-fous", label: "Étape 3 : les garde-fous (TVA, plafond, statut)" },
  { id: "pieges-prix", label: "Les erreurs de tarification" },
  { id: "facture", label: "Facturer : mentions obligatoires" },
  { id: "paiement", label: "Délais de paiement, pénalités et relances" },
  { id: "e-facture", label: "Facturation électronique : ce qui change" },
];

export default function ArticleGuideFreelance2026() {
  return (
    <ArticleShell
      slug="guide-freelance-2026"
      breadcrumb="Freelance 2026 : TJM et facturation"
      lead="Le taux journalier moyen (TJM) est la décision la plus rentable, ou la plus coûteuse, d’un freelance. Diviser son ancien salaire par 20 jours ne marche pas : il faut partir du revenu visé, compter les jours réellement facturables, puis intégrer cotisations, impôt et frais. Méthode pas à pas, exemple chiffré, puis les règles de facturation 2026."
      sources={SOURCES}
      cta={{
        text: "Calculez le TJM qui correspond à votre objectif de revenu",
        label: "Ouvrir le calculateur de TJM",
        href: "/outils/calculateur-tjm-freelance",
      }}
    >
      <Toc items={TOC} />

      <H2 id="principe">Le TJM se calcule à l’envers, à partir du revenu visé</H2>
      <p>
        Un salarié est payé 12 mois par an, congés compris, et son employeur finance sa protection sociale. Un
        freelance, lui, n’est payé que les jours où il facture. Ces jours doivent donc financer les congés, les
        périodes creuses, la prospection, l’administratif, les cotisations sociales, l’impôt, le matériel et
        l’épargne de précaution. La bonne méthode tient en une formule :
      </p>
      <Box title="La formule du TJM">
        <p>
          <strong>TJM = (revenu net visé + frais professionnels) ÷ (1 − taux de prélèvements) ÷ jours facturables</strong>
        </p>
        <p>
          C’est la logique de notre <A href="/outils/calculateur-tjm-freelance">calculateur de TJM freelance</A>. Tout
          l’enjeu est de bien renseigner les deux paramètres que l’on sous-estime : le taux de prélèvements et le
          nombre de jours réellement facturés.
        </p>
      </Box>

      <H2 id="jours">Étape 1 : compter ses vrais jours facturables</H2>
      <p>Partez d’une année civile et retirez tout ce qui ne sera pas facturé :</p>
      <Table
        head={["Poste", "Jours", "Reste"]}
        rows={[
          ["Jours dans l’année", "365", "365"],
          ["Week-ends", "− 104", "261"],
          ["Jours fériés tombant en semaine (en moyenne)", "− 9", "252"],
          ["Congés (5 semaines, comme un salarié)", "− 25", "227"],
          ["Maladie, imprévus, formation", "− 7", "220"],
          ["Temps non facturable : prospection, devis, compta, relances (≈ 20 %)", "− 44", "176"],
          ["Jours facturables réalistes", "", "≈ 175 à 180"],
        ]}
        numericFrom={1}
        highlightLast
      />
      <p>
        Les freelances en mission longue (régie chez un client, 5 jours sur 5) peuvent monter à 200 ou 210 jours ;
        ceux qui enchaînent des missions courtes (design, rédaction, formation) descendent souvent à 140 ou 160
        jours. En première année, comptez prudemment : le temps de trouver les premiers clients ne se facture pas.
      </p>
      <Box tone="warning" title="Le piège des 20 jours par mois">
        <p>
          « 20 jours × 12 mois = 240 jours » est le calcul le plus répandu, et le plus dangereux : il suppose zéro
          congé, zéro creux et zéro prospection. Même le paramétrage par défaut de notre calculateur (20 jours par
          mois moins 25 jours de congés, soit 215 jours) correspond à un freelance déjà bien installé. Si vous
          démarrez, saisissez plutôt 15 jours par mois.
        </p>
      </Box>

      <H2 id="chiffre">Étape 2 : le chiffre d’affaires nécessaire</H2>
      <p>
        Le taux de prélèvements dépend de votre statut. En micro-entreprise, il est simple : un pourcentage du
        chiffre d’affaires (détails dans notre{" "}
        <A href="/blog/simulateur-auto-entrepreneur-2026">guide de la micro-entreprise 2026</A>).
      </p>
      <Table
        head={["Statut / activité", "Cotisations + CFP", "Impôt (versement libératoire)", "Total sur le CA"]}
        rows={[
          ["Micro BNC (consultant, développeur, formateur…)", "25,8 %", "2,2 %", "28,0 %"],
          ["Micro BNC relevant de la Cipav", "23,4 %", "2,2 %", "25,6 %"],
          ["Micro BIC prestations de services", "21,3 à 21,5 %", "1,7 %", "23,0 à 23,2 %"],
        ]}
        caption="Taux Urssaf 2026. En EURL ou SASU, les prélèvements dépendent du partage entre rémunération et dividendes, et vos frais sont déductibles : comparez avec l’outil « quel statut juridique choisir »."
      />
      <p>
        Ajoutez vos <strong>frais professionnels</strong> : ordinateur et logiciels, téléphone, assurance
        responsabilité civile professionnelle, banque, coworking, déplacements, formation, comptabilité si vous en
        confiez une partie, et la <strong>cotisation foncière des entreprises</strong> (CFE), due à partir de la
        deuxième année. 250 à 500 € par mois est une fourchette courante pour un prestataire intellectuel.
      </p>

      <H2 id="exemple">Exemple complet : viser 3 000 € net par mois</H2>
      <p>
        Hypothèses : développeuse en micro-entreprise BNC, personne seule, objectif de 3 000 € net par mois avant
        impôt, 300 € de frais mensuels, 180 jours facturables.
      </p>
      <OL>
        <li>Besoin annuel avant prélèvements : (3 000 + 300) × 12 = 39 600 €.</li>
        <li>Chiffre d’affaires nécessaire : 39 600 ÷ (1 − 25,8 %) = <strong>53 370 €</strong>.</li>
        <li>TJM : 53 370 ÷ 180 = <strong>≈ 297 € HT par jour</strong>.</li>
      </OL>
      <p>Il reste à intégrer ce que le calcul « avant impôt » laisse de côté :</p>
      <Table
        head={["Scénario", "Chiffre d’affaires", "TJM (180 jours)", "Net mensuel après impôt et CFE"]}
        rows={[
          ["Objectif 3 000 € avant impôt, impôt au barème", "53 370 €", "297 €", "≈ 2 620 €"],
          ["Objectif 3 000 € après impôt, versement libératoire (2,2 %) et CFE de 900 €", "56 250 €", "313 €", "3 000 €"],
          ["Même objectif, mais 215 jours facturés (paramètre par défaut du calculateur)", "56 250 €", "262 €", "3 000 €"],
        ]}
        caption="Impôt au barème 2026 pour une personne seule : environ 3 670 € sur 35 224 € imposables (53 370 € − abattement de 34 %). Avec le versement libératoire : 2,2 % du chiffre d’affaires. CFE : estimation, le montant dépend de la commune."
      />
      <p>
        Écart entre un TJM « naïf » et un TJM réaliste : plus de 50 € par jour, soit environ 9 000 € de chiffre d’affaires sur l’année.
        Comparez aussi le résultat avec un salaire : notre outil <A href="/outils/freelance-vs-cdi">freelance vs CDI</A>{" "}
        donne le TJM équivalent à un salaire brut donné, en tenant compte des congés payés et de la protection
        sociale que vous perdez.
      </p>

      <H2 id="garde-fous">Étape 3 : les garde-fous (TVA, plafond micro, statut)</H2>
      <H3>La TVA dès 37 500 €</H3>
      <p>
        Dans l’exemple, 56 250 € de chiffre d’affaires dépassent largement le seuil de franchise en base de TVA des
        prestations de services (37 500 €, seuil majoré 41 250 €). Votre TJM devient alors un prix hors taxe auquel
        s’ajoutent 20 % de TVA. Neutre pour une entreprise cliente, qui la récupère ; pénalisant pour un client
        particulier. Le <A href="/outils/calculateur-tva">calculateur de TVA</A> vous aide à présenter vos prix HT et
        TTC.
      </p>
      <H3>Le plafond micro à 83 600 €</H3>
      <p>
        Sur 180 jours, le plafond de la micro-entreprise pour les services (83 600 € de chiffre d’affaires en 2026)
        est atteint vers <strong>465 € par jour</strong>. Un dépassement isolé est toléré, mais deux années
        consécutives au-dessus vous font basculer au régime réel. Si vous visez plus haut, ou si vos frais sont
        élevés, le choix du statut devient une question de plusieurs milliers d’euros par an : nous le traitons en
        détail dans le comparatif{" "}
        <A href="/blog/guide-creation-entreprise-2026">micro, EI, EURL ou SASU : quel statut choisir</A>, et vous
        pouvez tester votre cas avec l’outil <A href="/outils/choisir-statut-juridique">quel statut juridique choisir</A>.
      </p>

      <H2 id="pieges-prix">Les erreurs de tarification les plus fréquentes</H2>
      <UL>
        <li>
          <strong>Se caler sur le TJM d’un salarié en portage ou en ESN.</strong> Leur prix inclut la marge de
          l’intermédiaire ; ce n’est pas votre revenu.
        </li>
        <li>
          <strong>Oublier la protection sociale.</strong> Pas d’assurance chômage en micro, des indemnités
          journalières modestes : une prévoyance et une épargne de précaution de 3 à 6 mois de charges font partie
          du prix.
        </li>
        <li>
          <strong>Ne jamais réviser son tarif.</strong> Prévoyez une révision annuelle dans vos contrats. Même 3 %
          par an représentent un écart de près de 16 % au bout de cinq ans.
        </li>
        <li>
          <strong>Accepter des délais de paiement à 60 jours sans acompte.</strong> Sur une mission de trois mois,
          vous financez votre client. Demandez 30 % d’acompte au démarrage.
        </li>
        <li>
          <strong>Brader la première mission</strong> « pour se faire la main » : le premier tarif sert souvent de
          référence au client pour les suivantes.
        </li>
        <li>
          <strong>Vendre des jours au lieu d’un résultat</strong> quand c’est possible : un forfait bien cadré
          (livrables, nombre d’allers-retours) protège votre marge si vous travaillez vite.
        </li>
      </UL>

      <H2 id="facture">Facturer : les mentions obligatoires en 2026</H2>
      <p>
        Une facture doit être émise dès la réalisation de la prestation. Elle comporte au minimum :
      </p>
      <UL>
        <li>la date d’émission et un numéro unique, basé sur une séquence chronologique continue, sans trou ;</li>
        <li>
          votre identité : nom et prénom précédés ou suivis de « Entrepreneur individuel » ou « EI » (ou dénomination
          sociale), adresse, numéro SIREN, et numéro de TVA intracommunautaire si vous êtes redevable de la TVA ;
        </li>
        <li>le nom ou la raison sociale du client et son adresse de facturation ;</li>
        <li>la date de la prestation, sa désignation précise, les quantités (jours) et le prix unitaire hors taxe ;</li>
        <li>
          le taux et le montant de TVA, les totaux HT et TTC, ou la mention « TVA non applicable, art. 293 B du CGI »
          si vous êtes en franchise ;
        </li>
        <li>la date d’échéance du paiement et les conditions d’escompte en cas de paiement anticipé (ou leur absence) ;</li>
        <li>
          le taux des pénalités de retard et, pour un client professionnel, la mention de l’indemnité forfaitaire de
          40 € pour frais de recouvrement.
        </li>
      </UL>
      <p>
        Quatre nouvelles mentions arrivent avec la facturation électronique (1er septembre 2026 pour les grandes
        entreprises et les ETI, 1er septembre 2027 pour les PME et micro-entreprises) : le <strong>SIREN du client</strong>,
        l’adresse de livraison si elle diffère, la <strong>nature de l’opération</strong> (biens, services ou les deux)
        et, le cas échéant, l’option pour le paiement de la TVA d’après les débits. Rien ne vous empêche de les
        ajouter dès maintenant.
      </p>
      <p>
        Chaque mention manquante ou inexacte expose à une amende fiscale de 15 €, plafonnée au quart du montant de la
        facture (article 1737 du CGI). Notre <A href="/outils/generateur-facture">générateur de factures</A> produit
        un PDF conforme, et le <A href="/outils/generateur-mentions-legales">générateur de mentions légales</A>{" "}
        complète votre site professionnel.
      </p>

      <H2 id="paiement">Délais de paiement, pénalités et relances</H2>
      <Table
        head={["Règle (entre professionnels)", "Ce que dit le Code de commerce"]}
        rows={[
          ["Délai par défaut (rien de prévu au contrat)", "30 jours après la réalisation de la prestation"],
          ["Délai maximum convenu", "60 jours à compter de la date de facture, ou 45 jours fin de mois si c’est prévu au contrat"],
          ["Taux des pénalités de retard", "Au moins 3 fois le taux d’intérêt légal ; à défaut de mention, taux de la BCE majoré de 10 points"],
          ["Indemnité forfaitaire de recouvrement", "40 €, due dès le premier jour de retard"],
        ]}
        numericFrom={9}
      />
      <p>
        Les pénalités sont dues sans rappel préalable, mais dans la pratique elles servent surtout de levier de
        négociation. Un process simple suffit : rappel courtois à J+1, relance ferme à J+15 mentionnant les
        pénalités et l’indemnité de 40 €, mise en demeure par lettre recommandée à J+30. Pour les particuliers, ces
        règles ne s’appliquent pas : fixez l’échéance dans votre devis et demandez un acompte.
      </p>

      <H2 id="e-facture">Facturation électronique : ce qui change pour un freelance</H2>
      <p>
        La réforme est entrée en vigueur le 1er septembre 2026. Elle concerne les factures entre entreprises
        assujetties à la TVA établies en France, y compris les micro-entrepreneurs en franchise de TVA (ils restent
        assujettis, même s’ils ne facturent pas de TVA).
      </p>
      <Table
        head={["Obligation", "Grandes entreprises et ETI", "PME, TPE, micro-entreprises"]}
        rows={[
          ["Recevoir des factures électroniques", "1er septembre 2026", "1er septembre 2026"],
          ["Émettre des factures électroniques", "1er septembre 2026", "1er septembre 2027"],
          ["Transmettre les données des ventes aux particuliers et à l’étranger (e-reporting)", "1er septembre 2026", "1er septembre 2027"],
        ]}
        numericFrom={9}
      />
      <UL>
        <li>
          <strong>Dès maintenant</strong> : vous devez pouvoir recevoir les factures de vos fournisseurs au format
          électronique. Concrètement, il faut être rattaché à une <strong>plateforme agréée</strong> par
          l’administration (la liste est publiée sur impots.gouv.fr) ; de nombreux logiciels de facturation et
          banques en ligne jouent ce rôle.
        </li>
        <li>
          <strong>À partir de septembre 2027</strong> : une facture PDF envoyée par e-mail à un client professionnel
          français ne sera plus valable. Elle devra transiter par une plateforme agréée dans un format structuré
          (Factur-X, UBL ou CII).
        </li>
        <li>
          <strong>Clients particuliers ou étrangers</strong> : pas de facture électronique, mais une transmission des
          données de vente (e-reporting) via la même plateforme.
        </li>
      </UL>
      <Box tone="tip" title="Ce qu’il faut faire d’ici 2027">
        <p>
          Choisissez un outil de facturation raccordé à une plateforme agréée, vérifiez que vos fiches clients
          contiennent leur SIREN, et prenez l’habitude des quatre nouvelles mentions. En attendant, notre{" "}
          <A href="/outils/generateur-facture">générateur de factures</A> reste adapté aux factures PDF aux
          particuliers et aux clients qui acceptent encore ce format.
        </p>
      </Box>

      <H2 id="checklist">Checklist du freelance en 2026</H2>
      <OL>
        <li>Compter ses jours facturables de façon réaliste (175 à 180 pour démarrer).</li>
        <li>Calculer son TJM avec le <A href="/outils/calculateur-tjm-freelance">calculateur de TJM</A>, impôt inclus.</li>
        <li>Vérifier le seuil de TVA (37 500 €) et le plafond micro (83 600 €).</li>
        <li>Mettre de côté environ 30 % de chaque encaissement en micro BNC.</li>
        <li>Émettre des factures complètes, avec échéance, pénalités et indemnité de 40 €.</li>
        <li>Se raccorder à une plateforme agréée pour la facturation électronique.</li>
        <li>
          Réévaluer son statut chaque année : <A href="/outils/simulateur-auto-entrepreneur">simulateur auto-entrepreneur</A>{" "}
          et <A href="/outils/choisir-statut-juridique">comparateur de statuts</A>.
        </li>
      </OL>
    </ArticleShell>
  );
}
