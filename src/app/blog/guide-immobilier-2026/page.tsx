import { A, ArticleShell, Box, H2, H3, OL, Table, Toc, UL } from "../_components/Article";

const SOURCES = [
  {
    label: "HCSF : mesure relative à l’octroi de crédits immobiliers (taux d’effort 35 %, durée 25 ans) – economie.gouv.fr",
    url: "https://www.economie.gouv.fr/hcsf/mesures/mesure-relative-loctroi-de-credits-immobiliers",
  },
  {
    label: "Décision HCSF n° D-HCSF-2021-7 du 29 septembre 2021 – Légifrance",
    url: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000044178669",
  },
  {
    label: "Frais de notaire : les droits de mutation augmentent dans certains départements – service-public.gouv.fr",
    url: "https://www.service-public.gouv.fr/particuliers/actualites/A18183",
  },
  {
    label: "Taux des droits de mutation par département (DMTO) – impots.gouv.fr",
    url: "https://www.impots.gouv.fr/sites/default/files/media/1_metier/3_partenaire/notaires/dmto/dmto_2026-02.pdf",
  },
  {
    label: "Prêt à taux zéro (PTZ) – service-public.gouv.fr (fiche F10871)",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F10871",
  },
  {
    label: "PTZ : offres de prêt émises à compter du 1er avril 2025 – ANIL",
    url: "https://www.anil.org/aj-offres-pret-ptz-2025/",
  },
  {
    label: "Loi n° 2022-270 du 28 février 2022 (loi Lemoine) – Légifrance",
    url: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000045268729",
  },
  {
    label: "Article L113-2-1 du Code des assurances (questionnaire de santé) – Légifrance",
    url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000045271000",
  },
  {
    label: "Promesse de vente d’un logement existant : promesse unilatérale ou compromis – service-public.gouv.fr",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2965",
  },
  {
    label: "Achat immobilier : quelles sont les cinq étapes clés ? – economie.gouv.fr",
    url: "https://www.economie.gouv.fr/particuliers/etapes-achat-immobilier",
  },
  {
    label: "Plus-value immobilière (exonération de la résidence principale) – service-public.gouv.fr",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F10864",
  },
  {
    label: "Observatoire Crédit Logement/CSA : taux moyens d’août 2026",
    url: "https://lobservatoire.creditlogement.fr/publications/analyse-marche-immobilier-aout-2026/",
  },
];

export default function ArticleGuideImmobilier2026() {
  return (
    <ArticleShell
      slug="guide-immobilier-2026"
      breadcrumb="Acheter sa résidence principale en 2026"
      lead="Combien pouvez-vous emprunter, quel apport prévoir, combien coûtent vraiment le notaire et l’assurance, et dans quel ordre avancer ? La méthode complète, avec un plan de financement chiffré de bout en bout."
      sources={SOURCES}
      cta={{
        text: "Première étape : savoir combien vous pouvez emprunter",
        label: "Calculer ma capacité d’emprunt",
        href: "/outils/capacite-emprunt",
      }}
    >
      <p>
        Acheter sa résidence principale reste l’opération financière la plus lourde d’une vie, et
        la plupart des mauvaises surprises viennent d’un budget mal construit au départ : un prix
        visé trop haut par rapport aux règles bancaires, des frais de notaire oubliés, une assurance
        emprunteur acceptée sans comparer. Ce guide suit l’ordre dans lequel une banque analyse
        votre dossier. À chaque étape, vous trouverez la règle applicable en 2026, un ordre de
        grandeur chiffré et l’outil qui permet de faire le calcul sur votre propre situation.
      </p>

      <Toc
        items={[
          { id: "chiffres", label: "Les chiffres clés de septembre 2026" },
          { id: "capacite", label: "Étape 1 : calculer sa capacité d’emprunt" },
          { id: "apport", label: "Étape 2 : l’apport et les frais annexes" },
          { id: "neuf-ancien", label: "Étape 3 : neuf ou ancien, et le PTZ" },
          { id: "assurance", label: "Étape 4 : l’assurance emprunteur" },
          { id: "exemple", label: "Exemple complet : un couple à Lyon" },
          { id: "dpe", label: "Étape 5 : vérifier le DPE et la copropriété" },
          { id: "calendrier", label: "Du compromis à l’acte : étapes et délais" },
          { id: "courtier", label: "Banque en direct ou courtier ?" },
          { id: "pieges", label: "Les pièges à éviter" },
          { id: "investir", label: "Et si vous achetez pour louer ?" },
        ]}
      />

      <H2 id="chiffres">Les chiffres clés de septembre 2026</H2>
      <Table
        head={["Paramètre", "Valeur en 2026"]}
        rows={[
          ["Taux d’effort maximal (HCSF)", "35 % des revenus nets, assurance comprise"],
          ["Durée maximale du prêt (HCSF)", "25 ans (27 ans dans le neuf avec différé)"],
          ["Taux moyen sur 15 ans (août 2026)", "3,14 %"],
          ["Taux moyen sur 20 ans (août 2026)", "3,27 %"],
          ["Taux moyen sur 25 ans (août 2026)", "3,35 %"],
          ["Frais de notaire dans l’ancien", "≈ 7,5 à 8 % du prix"],
          ["Frais de notaire dans le neuf", "≈ 2 à 3 % du prix"],
          ["Droits de mutation départementaux", "5 % dans la plupart des départements, 4,5 % pour les primo-accédants"],
          ["Assurance sans questionnaire de santé", "Jusqu’à 200 000 € assurés par personne, prêt remboursé avant 60 ans"],
        ]}
        caption="Taux : moyennes de l’Observatoire Crédit Logement/CSA, hors assurance. Votre taux dépend de votre profil, de votre apport et de la banque."
      />

      <H2 id="capacite">Étape 1 : calculer sa capacité d’emprunt</H2>
      <p>
        Depuis le 1er janvier 2022, la décision du Haut Conseil de stabilité financière (HCSF) est
        juridiquement contraignante pour les banques. Elle fixe deux limites :
      </p>
      <UL>
        <li>
          <strong>un taux d’effort de 35 % au maximum</strong> : la somme de vos mensualités de
          crédit (le nouveau prêt, assurance comprise, plus les crédits en cours que vous gardez) ne
          doit pas dépasser 35 % de vos revenus nets avant impôt ;
        </li>
        <li>
          <strong>une durée de 25 ans au maximum</strong>, portée à 27 ans lorsque le remboursement
          est différé, par exemple dans l’attente de la livraison d’un logement neuf.
        </li>
      </UL>
      <p>
        Les banques peuvent déroger à ces règles pour 20 % de leur production trimestrielle,
        dérogations réservées en priorité à l’achat de la résidence principale et aux
        primo-accédants. C’est une marge réelle, mais elle se négocie dossier par dossier : ne
        construisez pas votre projet en comptant dessus.
      </p>
      <p>
        Le calcul est mécanique. Avec 4 800 € de revenus nets mensuels à deux, la mensualité
        maximale est de 4 800 × 35 % = 1 680 €. Ce que cette mensualité permet d’emprunter dépend
        ensuite du taux, de la durée et du coût de l’assurance :
      </p>
      <Table
        head={["Mensualité de 1 680 € (assurance 0,26 %)", "Taux − 0,5 pt", "Taux actuel 3,35 %", "Taux + 0,5 pt"]}
        rows={[
          ["Sur 20 ans", "295 366 €", "282 853 €", "271 067 €"],
          ["Sur 25 ans", "344 183 €", "326 669 €", "310 389 €"],
        ]}
        caption="Capital empruntable calculé avec la méthode de notre simulateur de capacité d’emprunt (assurance calculée sur le capital initial)."
      />
      <p>
        Deux enseignements. D’abord, allonger de 20 à 25 ans augmente la capacité d’environ 15 %,
        mais alourdit fortement le coût du crédit. Ensuite, un demi-point de taux pèse près de
        5 % du capital empruntable : comparer les offres n’est pas un détail. Un crédit auto de
        250 € par mois conservé ramène la capacité sur 25 ans de 326 669 € à environ 278 000 € :
        solder un petit crédit avant de déposer son dossier peut valoir plus qu’une augmentation
        de salaire.
      </p>
      <p>
        Les banques regardent aussi le <strong>reste à vivre</strong> (ce qui reste une fois les
        mensualités payées). Aucune règle officielle ne le fixe ; les grilles internes tournent
        souvent autour de 800 € par adulte et 300 € par enfant. Faites le calcul complet, revenus
        locatifs et crédits en cours compris, avec notre{" "}
        <A href="/outils/capacite-emprunt">simulateur de capacité d’emprunt</A>.
      </p>

      <H2 id="apport">Étape 2 : l’apport et les frais annexes</H2>
      <p>
        Aucun texte n’impose d’apport minimal, mais en pratique les banques demandent au moins de
        quoi couvrir les <strong>frais de notaire et de garantie</strong>, soit environ 10 % du
        prix dans l’ancien. Un apport plus élevé (15 à 20 %) améliore nettement le taux proposé.
        Emprunter « à 110 % » reste possible pour les jeunes actifs aux revenus en progression,
        mais devient rare.
      </p>

      <H3>Les frais de notaire en 2026</H3>
      <p>
        Les « frais de notaire » sont surtout des taxes. Dans l’ancien, les droits de mutation
        (DMTO) comprennent une part départementale, une taxe communale de 1,2 % et des frais
        d’assiette. La loi de finances pour 2025 a permis aux départements de relever leur taux de
        4,5 % à 5 % pour les actes signés <strong>du 1er avril 2025 au 31 mars 2028</strong>. La
        grande majorité des départements l’ont fait. Les <strong>primo-accédants</strong> qui
        achètent leur résidence principale (pas de propriété de la résidence principale au cours
        des deux années précédentes) échappent à cette hausse et restent à 4,5 %.
      </p>
      <Table
        head={["Poste (bien à 300 000 €, Rhône)", "Ancien, primo-accédant", "Ancien, déjà propriétaire", "Neuf (280 000 €)"]}
        rows={[
          ["Droits de mutation / taxe de publicité foncière", "17 420 €", "18 956 €", "2 002 €"],
          ["Émoluments du notaire (TTC)", "3 353 €", "3 353 €", "3 161 €"],
          ["Débours et formalités (estimation)", "1 400 €", "1 400 €", "1 400 €"],
          ["Contribution de sécurité immobilière", "300 €", "300 €", "280 €"],
          ["Total", "22 473 € (7,5 %)", "24 009 € (8,0 %)", "6 843 € (2,4 %)"],
        ]}
        highlightLast
        caption="Calculs réalisés avec notre calculateur de frais de notaire (barème des émoluments et taux départementaux 2026)."
      />
      <p>
        À ces frais s’ajoutent la <strong>garantie</strong> du prêt (caution d’un organisme ou
        hypothèque, souvent 1 à 2 % du montant emprunté), les <strong>frais de dossier</strong>{" "}
        (négociables, parfois offerts) et, si vous passez par un courtier, ses honoraires. Estimez
        les frais exacts de votre achat, département par département, avec le{" "}
        <A href="/outils/calculateur-frais-notaire">calculateur de frais de notaire</A>.
      </p>

      <H2 id="neuf-ancien">Étape 3 : neuf ou ancien, et le PTZ</H2>
      <p>
        Le neuf coûte plus cher au mètre carré, mais les frais de notaire sont trois fois plus
        faibles, la performance énergétique est garantie (pas de risque de passoire thermique) et
        c’est là que le <strong>prêt à taux zéro</strong> est le plus accessible. Depuis le
        1er avril 2025, le PTZ finance le neuf dans toutes les zones : jusqu’à 50 % du coût pour un
        appartement (tranche de revenus 1), 40 % en tranches 2 et 3, 20 % en tranche 4 ; pour une
        maison individuelle neuve, 30 %, 20 %, 20 % et 10 %. Dans l’ancien, il n’est accordé qu’en
        zones B2 et C, avec des travaux représentant au moins 25 % du coût de l’opération.
      </p>
      <p>
        Le dispositif, ses plafonds et un exemple chiffré sont détaillés dans notre article{" "}
        <A href="/blog/ptz-2026-nouveautes">PTZ 2026 : ce qui a changé</A>. Pour vérifier votre
        éligibilité en une minute, utilisez le <A href="/outils/simulateur-ptz-2026">simulateur PTZ 2026</A>.
      </p>

      <H2 id="assurance">Étape 4 : l’assurance emprunteur</H2>
      <p>
        L’assurance emprunteur n’est pas obligatoire au sens de la loi, mais aucune banque ne prête
        sans elle. C’est souvent le deuxième coût du crédit après les intérêts : sur un prêt de
        277 500 € à deux, une cotisation de 0,26 % du capital (0,13 % par tête) représente 60 € par
        mois et plus de 18 000 € sur 25 ans.
      </p>
      <Table
        head={["Âge de l’emprunteur (non-fumeur)", "Taux annuel indicatif", "Coût sur 25 ans pour 100 000 € assurés"]}
        rows={[
          ["25 ans", "0,10 %", "2 500 €"],
          ["35 ans", "0,13 %", "3 250 €"],
          ["45 ans", "0,24 %", "6 000 €"],
          ["55 ans", "0,47 %", "11 750 €"],
        ]}
        caption="Moyennes indicatives observées en 2026 pour une assurance déléguée, cotisation calculée sur le capital initial. Fumeurs : + 50 à 100 %."
      />
      <p>Trois règles issues de la loi Lemoine (2022) jouent en votre faveur :</p>
      <UL>
        <li>
          <strong>Le libre choix</strong> : la banque doit accepter une assurance d’un autre
          assureur dès lors qu’elle offre des garanties équivalentes (les critères figurent sur la
          fiche standardisée d’information). Elle ne peut pas modifier le taux du prêt pour autant.
        </li>
        <li>
          <strong>La résiliation à tout moment</strong>, sans frais, pendant toute la durée du prêt.
        </li>
        <li>
          <strong>La suppression du questionnaire de santé</strong> si la part assurée n’excède pas
          200 000 € par personne et si le prêt se termine avant vos 60 ans.
        </li>
      </UL>
      <p>
        Estimez ce que vous économiseriez en déléguant votre assurance avec notre{" "}
        <A href="/outils/assurance-emprunteur">simulateur d’assurance emprunteur</A>.
      </p>

      <H2 id="exemple">Exemple complet : un couple à Lyon</H2>
      <Box title="La situation">
        <p>
          Julie et Karim, 34 et 36 ans, un enfant, gagnent 4 800 € nets par mois à deux (revenu
          fiscal de référence d’environ 51 800 €). Ils sont locataires, n’ont aucun crédit en cours
          et disposent de 45 000 € d’apport. Ils visent un T4 ancien à Lyon affiché 300 000 €.
        </p>
      </Box>
      <Table
        head={["Plan de financement (ancien, 25 ans à 3,35 %)", "Montant"]}
        rows={[
          ["Prix du logement", "300 000 €"],
          ["Frais de notaire (primo-accédants, taux départemental à 4,5 %)", "22 473 €"],
          ["Coût total de l’opération", "322 473 €"],
          ["Apport personnel", "− 45 000 €"],
          ["Montant à emprunter (arrondi)", "277 500 €"],
          ["Mensualité hors assurance", "1 367 €"],
          ["Assurance (0,13 % par emprunteur, quotité 100 % chacun)", "60 €"],
          ["Mensualité totale", "1 427 €"],
          ["Taux d’effort (1 427 € / 4 800 €)", "29,7 %"],
        ]}
        highlightLast
      />
      <p>
        Le dossier respecte la règle des 35 % avec une marge confortable, et le reste à vivre
        (3 373 €) dépasse largement les repères bancaires. Le coût total du crédit ressort à
        environ 132 600 € d’intérêts et 18 000 € d’assurance, hors frais de garantie. À noter :
        l’apport couvre les frais de notaire et 7,5 % du prix, ce qui correspond aux attentes des
        banques.
      </p>
      <p>
        <strong>Et sur 20 ans ?</strong> À 3,27 %, la mensualité grimperait à 1 637 € assurance
        comprise, soit un taux d’effort de 34,1 %, juste sous la limite. En échange, le couple
        économiserait environ 35 000 € d’intérêts et d’assurance. C’est l’arbitrage classique :
        une durée courte coûte moins cher mais laisse moins de marge en cas d’imprévu.
      </p>
      <p>
        <strong>Et dans le neuf avec un PTZ ?</strong> Pour un T3 neuf à 280 000 € dans une
        commune de zone A de la métropole, leurs ressources par unité de consommation
        (51 800 / 1,8 ≈ 28 800 €) les placent en tranche 2. Le coût retenu est plafonné à 270 000 €
        (150 000 € × 1,8), d’où un PTZ de 40 % : 108 000 € sans intérêts, remboursables sur 12 ans
        après un différé de 8 ans. Avec 6 843 € de frais de notaire et le même apport, le prêt
        principal tombe à 133 843 €, soit 659 € par mois sur 25 ans hors assurance. La mensualité
        passe de 712 € (assurances comprises) pendant le différé à environ 1 462 € ensuite, quand
        les 750 € mensuels du PTZ s’ajoutent : un taux d’effort de 30,5 %. Emprunter ces
        108 000 € à 3,35 % sur 20 ans aurait coûté environ 40 000 € d’intérêts.
      </p>
      <p>
        Refaites ces calculs avec vos chiffres dans le{" "}
        <A href="/outils/calculateur-pret-immobilier">calculateur de prêt immobilier</A>, qui
        affiche aussi le tableau d’amortissement.
      </p>

      <H2 id="dpe">Étape 5 : vérifier le DPE et la copropriété</H2>
      <p>
        Le diagnostic de performance énergétique n’est pas qu’une étiquette : un logement classé
        F ou G se revend avec une décote et, s’il devait un jour être loué, il tomberait sous le
        coup des interdictions (G depuis 2025, F en 2028, E en 2034). Depuis le 1er janvier 2026,
        le calcul est plus favorable au chauffage électrique : un DPE réalisé avant cette date sur un
        logement chauffé à l’électricité peut afficher une classe moins bonne que celle obtenue
        aujourd’hui (une attestation actualisée se télécharge gratuitement sur l’observatoire de
        l’Ademe). Avant de faire une offre sur une passoire thermique, chiffrez
        les travaux et les aides : notre{" "}
        <A href="/outils/simulateur-maprimerenov">simulateur MaPrimeRénov’</A> estime la prime,
        et notre article <A href="/blog/dpe-f-g-logement-energivore">DPE F ou G : que faire</A>{" "}
        détaille les options.
      </p>
      <p>
        En copropriété, demandez les trois derniers procès-verbaux d’assemblée générale, le montant
        des charges et l’état du fonds de travaux. Un ravalement ou une rénovation énergétique déjà
        votés, mais non encore appelés, pèsent directement sur votre budget.
      </p>

      <H2 id="calendrier">Du compromis à l’acte : étapes et délais</H2>
      <OL>
        <li>
          <strong>Offre d’achat</strong> écrite au prix ou en dessous, acceptée par le vendeur.
        </li>
        <li>
          <strong>Avant-contrat</strong> (compromis ou promesse de vente), signé chez le notaire ou
          entre particuliers. Vous disposez d’un <strong>délai de rétractation de 10 jours</strong>{" "}
          à compter du lendemain de sa notification, sans justification ni pénalité. Un dépôt de
          garantie de 5 à 10 % est souvent demandé.
        </li>
        <li>
          <strong>Condition suspensive d’obtention du prêt</strong> : si vous financez l’achat par
          un crédit, elle est de droit. Précisez le montant, la durée et le taux maximal ; si le
          prêt est refusé dans ces conditions, la vente est annulée et le dépôt de garantie vous
          est rendu. Le délai laissé pour obtenir le prêt ne peut pas être inférieur à un mois ;
          45 à 60 jours sont d’usage.
        </li>
        <li>
          <strong>Offre de prêt</strong> : une fois émise, vous ne pouvez l’accepter qu’après un{" "}
          <strong>délai de réflexion de 10 jours</strong>. Comparez-la ligne par ligne (TAEG,
          assurance, garantie, pénalités de remboursement anticipé, modularité).
        </li>
        <li>
          <strong>Acte authentique</strong> chez le notaire, en général 2 à 3 mois après le
          compromis. Les fonds sont débloqués, vous recevez les clés.
        </li>
      </OL>

      <H2 id="courtier">Banque en direct ou courtier ?</H2>
      <p>
        Un courtier en crédit immobilier (inscrit à l’ORIAS) consulte plusieurs banques à votre
        place, sait lesquelles acceptent votre profil (indépendant, apport faible, dérogation
        HCSF) et négocie aussi l’assurance et la garantie. Il est rémunéré par la banque et,
        souvent, par des honoraires à votre charge, facturés uniquement si le prêt se concrétise.
        C’est utile si votre dossier sort de la norme ou si vous manquez de temps. Si votre profil
        est simple, démarcher trois ou quatre banques vous-même peut suffire. Dans les deux cas,
        arrivez avec votre capacité d’emprunt, votre plan de financement et vos trois derniers
        relevés de compte propres (sans découvert ni incidents).
      </p>

      <H2 id="pieges">Les pièges à éviter</H2>
      <UL>
        <li>
          <strong>Chercher un bien avant de connaître son budget</strong> : faites valider votre
          capacité d’emprunt par une banque ou un courtier avant les visites, et joignez
          l’attestation à votre offre d’achat.
        </li>
        <li>
          <strong>Oublier les frais de garantie et de dossier</strong> : 3 000 à 5 000 € sur un
          prêt de 250 000 €, rarement compris dans les simulations en ligne.
        </li>
        <li>
          <strong>Accepter l’assurance de la banque sans comparer</strong> : c’est l’économie la
          plus facile, et vous pouvez en changer à tout moment après la signature.
        </li>
        <li>
          <strong>Sous-estimer le budget après l’achat</strong> : taxe foncière, charges de
          copropriété, entretien (1 % de la valeur du bien par an en moyenne).
        </li>
        <li>
          <strong>Mal rédiger la condition suspensive</strong> : un taux maximal trop bas ou une
          durée trop courte peut vous faire perdre le dépôt de garantie si la banque propose des
          conditions un peu différentes.
        </li>
        <li>
          <strong>Ignorer l’effet ciseau du PTZ</strong> : la mensualité augmente à la fin du
          différé ; vérifiez que votre budget le supporte.
        </li>
      </UL>

      <H2 id="investir">Et si vous achetez pour louer ?</H2>
      <p>
        L’investissement locatif obéit à d’autres règles : les banques retiennent en général 70 %
        des loyers dans vos revenus, les revenus fonciers sont imposés à votre tranche marginale
        plus 17,2 % de prélèvements sociaux (ils ne sont pas concernés par la hausse de CSG de
        2026), et la plus-value à la revente est taxée, contrairement à celle de la résidence
        principale qui en est exonérée. Calculez le rendement net avec le{" "}
        <A href="/outils/calculateur-rentabilite-locative">calculateur de rentabilité locative</A>{" "}
        et, pour une revente, le{" "}
        <A href="/outils/simulateur-plus-value-immobiliere">simulateur de plus-value immobilière</A>.
        Si vous êtes déjà propriétaire avec un prêt signé à un taux élevé, lisez aussi notre guide
        sur le <A href="/blog/rachat-credit-immo-2026">rachat de crédit immobilier</A>.
      </p>
    </ArticleShell>
  );
}
