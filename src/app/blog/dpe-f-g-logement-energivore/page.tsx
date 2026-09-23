import { A, ArticleShell, H2, H3, Table, UL } from "../_components/Article";

const SOURCES = [
  {
    label: "Logement à louer décent (critère de performance énergétique) – service-public.gouv.fr",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F35978",
  },
  {
    label: "Location et gel des loyers des passoires énergétiques – ecologie.gouv.fr",
    url: "https://www.ecologie.gouv.fr/politiques-publiques/location-gel-loyers-passoires-energetiques",
  },
  {
    label: "Calcul du DPE : les nouveautés au 1er janvier 2026 – service-public.gouv.fr (actualité A18446)",
    url: "https://www.service-public.gouv.fr/particuliers/actualites/A18446",
  },
  {
    label: "Arrêté du 13 août 2025 (facteur de conversion de l’électricité à 1,9) – Légifrance",
    url: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052134589",
  },
  {
    label: "Arrêté du 19 août 2026 (facteur de conversion à 1,7 au 1er janvier 2027) – Légifrance",
    url: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054747079",
  },
  {
    label: "MaPrimeRénov’ – service-public.gouv.fr (fiche F35083)",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F35083",
  },
  {
    label: "Anah, « Les aides financières en 2026 », édition septembre 2026 (PDF)",
    url: "https://www.anah.gouv.fr/sites/default/files/2026-08/202609_guide-aides-financieres_WEB.pdf",
  },
  {
    label: "MaPrimeRénov’ : recentrage du parcours par geste au 1er septembre 2026 – service-public.gouv.fr (actualité A18332)",
    url: "https://www.service-public.gouv.fr/particuliers/actualites/A18332",
  },
];

export default function ArticleDpeFG() {
  return (
    <ArticleShell
      slug="dpe-f-g-logement-energivore"
      breadcrumb="DPE F ou G : que faire en 2026"
      sources={SOURCES}
      cta={{
        text: "Estimez le DPE de votre logement et anticipez les travaux",
        label: "Lancer le calculateur DPE",
        href: "/outils/calculateur-dpe",
      }}
    >
      <p>
        Vous avez reçu votre DPE et votre logement est classé F ou G. Mauvaise nouvelle : il est
        officiellement une <strong>passoire thermique</strong>. La loi Climat et résilience
        d’août 2021 a fixé un calendrier strict d’interdiction de location, et les logements G sont
        déjà interdits à la location depuis janvier 2025. Que vous soyez bailleur ou propriétaire
        occupant, les choix qui s’offrent à vous déterminent largement la valeur future du bien.
      </p>

      <H2>Le calendrier des interdictions</H2>
      <p>
        La loi Climat et résilience (loi n° 2021-1104 du 22 août 2021) a intégré la performance
        énergétique dans les critères du logement décent. Un logement non décent ne peut plus être
        mis en location :
      </p>
      <Table
        head={["Date", "Logements concernés"]}
        numericFrom={9}
        rows={[
          ["24 août 2022", "Loyers gelés pour les logements F et G : aucune hausse possible, ni en cours de bail ni à la relocation"],
          ["1er janvier 2023", "Logements consommant plus de 450 kWh/m²/an d’énergie finale (les pires des G) considérés comme indécents"],
          ["1er janvier 2025", "Tous les logements classés G interdits à la location (déjà en vigueur)"],
          ["1er janvier 2028", "Les logements classés F rejoignent l’interdiction"],
          ["1er janvier 2034", "Les logements classés E à leur tour"],
        ]}
      />
      <p>
        L’interdiction vise les baux signés, renouvelés ou reconduits tacitement à partir de ces
        dates : un bail en cours se poursuit jusqu’à son échéance. Concrètement, si vous louez un
        logement F en septembre 2026, il vous reste environ quinze mois pour le rénover avant que le
        bail ne puisse plus être signé ni renouvelé. Les résidences principales occupées par leur
        propriétaire et les résidences secondaires ne sont pas concernées.
      </p>

      <H3>Ce qui a changé dans le calcul du DPE en 2026</H3>
      <p>
        Depuis le 1er janvier 2026, le facteur de conversion de l’électricité utilisé par le DPE est
        passé de 2,3 à 1,9 (arrêté du 13 août 2025), ce qui améliore mécaniquement l’étiquette des
        logements chauffés à l’électricité. Un arrêté du 19 août 2026 le ramènera à 1,7 au
        1er janvier 2027. Si votre logement est chauffé à l’électricité et que son DPE date d’avant
        2026, il est peut-être sorti de la catégorie F ou G sans aucun travaux : une attestation
        actualisée se télécharge gratuitement sur l’observatoire DPE de l’Ademe, sans refaire le
        diagnostic.
      </p>

      <H2>La décote à la revente : 15 à 20 % en moyenne</H2>
      <p>
        Les notaires de France et les chambres de notaires régionales ont publié en 2024 et 2025
        plusieurs études mesurant l’impact du DPE sur les prix. La{" "}
        <strong>décote moyenne pour un bien classé F ou G</strong> par rapport à un bien équivalent
        classé D ou mieux atteint :
      </p>
      <UL>
        <li>Maisons individuelles : <strong>− 13 à − 22 %</strong> selon les régions</li>
        <li>Appartements dans les grandes villes : <strong>− 10 à − 15 %</strong></li>
        <li>Appartements en zones détendues : <strong>− 15 à − 25 %</strong> (effet de stock plus élevé)</li>
      </UL>
      <p>
        Avant de revendre, simulez la fiscalité avec notre{" "}
        <A href="/outils/simulateur-plus-value-immobiliere">simulateur de plus-value immobilière</A>{" "}
        pour comparer les scénarios « vente avec décote DPE » et « rénovation puis vente ».
      </p>

      <H2>Les 3 options qui s’offrent à vous</H2>

      <H3>Option 1 : rénover pour gagner 1 ou 2 classes</H3>
      <p>
        C’est l’option la plus rentable à moyen terme dans la plupart des cas. Les travaux
        prioritaires pour passer un G en E ou un F en D (coûts indicatifs, à faire chiffrer par des
        artisans RGE) :
      </p>
      <UL>
        <li>
          <strong>Isolation des combles</strong> : 25 à 30 % des déperditions, 30 à 60 €/m², retour
          sur investissement en 4 à 7 ans
        </li>
        <li>
          <strong>Isolation des murs par l’extérieur (ITE)</strong> : 20 à 25 % des déperditions,
          130 à 250 €/m², le plus efficace mais le plus cher
        </li>
        <li>
          <strong>Remplacement de la chaudière</strong> par une pompe à chaleur (air/eau ou
          géothermique) : 50 à 70 % d’économie sur le chauffage
        </li>
        <li>
          <strong>Remplacement des fenêtres</strong> en simple vitrage par du double vitrage : 10 à
          15 % des déperditions
        </li>
        <li>
          <strong>Ventilation</strong> : VMC double flux pour éviter les pertes de chaleur liées à
          l’aération
        </li>
      </UL>
      <p>
        <strong>Coût total moyen pour passer de G à D</strong> : 35 000 à 70 000 € pour une maison
        de 100 m². Les aides réduisent fortement la facture, surtout pour les ménages modestes
        (voir plus bas).
      </p>

      <H3>Option 2 : vendre maintenant avec la décote</H3>
      <p>
        Si vous n’avez ni le budget ni l’envie d’engager des travaux lourds, vendre rapidement évite
        l’aggravation de la décote, qui s’accentue à mesure que les échéances de 2028 et 2034
        approchent. Acceptez une décote de 15 à 20 % et tournez la page. Des acheteurs, souvent
        investisseurs, recherchent ce type de bien pour le rénover avec les aides publiques, dans
        une logique de création de valeur.
      </p>

      <H3>Option 3 : conserver pour un usage personnel</H3>
      <p>
        Si vous occupez le bien en résidence principale ou secondaire, l’interdiction de location ne
        vous concerne pas directement. Les classes F et G restent{" "}
        <strong>autorisées à la vente et à l’occupation personnelle</strong>. Vous pouvez attendre,
        mais la décote au moment de la revente sera de plus en plus importante.
      </p>

      <H2>Les aides MaPrimeRénov’ en 2026</H2>
      <p>
        Le guichet MaPrimeRénov’ a rouvert à la promulgation de la loi de finances pour 2026. Deux
        parcours coexistent, avec des règles resserrées depuis le 1er septembre 2026 :
      </p>
      <UL>
        <li>
          <strong>La rénovation d’ampleur</strong>, accompagnée par un Accompagnateur Rénov’, est
          réservée aux logements de plus de 15 ans classés E, F ou G. Le projet doit faire gagner au
          moins deux classes et comporter au moins deux gestes d’isolation. En maison individuelle,
          l’aide n’est plus accordée si un chauffage au gaz ou au fioul est conservé ou installé.
        </li>
        <li>
          <strong>Le parcours par geste</strong> ne finance plus, depuis le 1er septembre 2026, que
          les chauffages décarbonés (pompe à chaleur air/eau ou géothermique, raccordement à un
          réseau de chaleur), la dépose de cuve à fioul et l’audit énergétique. L’isolation seule et
          les fenêtres n’y sont plus éligibles.
        </li>
      </UL>
      <Table
        head={["Rénovation d’ampleur", "Taux de prise en charge (HT)", "Aide maximale (gain de 3 classes ou plus)"]}
        rows={[
          ["Ménages très modestes", "80 %", "32 000 €"],
          ["Ménages modestes", "60 %", "24 000 €"],
          ["Ménages intermédiaires", "45 %", "18 000 €"],
          ["Ménages aux revenus supérieurs", "10 %", "4 000 €"],
        ]}
        caption="Dépense éligible plafonnée à 30 000 € HT pour un gain de 2 classes et 40 000 € HT pour 3 classes ou plus. Total des aides plafonné à 100 %, 90 %, 80 % ou 50 % du montant TTC selon la catégorie."
      />
      <p>
        À cela s’ajoutent l’éco-prêt à taux zéro (jusqu’à 50 000 € sur 20 ans pour financer le
        reste à charge), la prise en charge de l’accompagnement (jusqu’à 2 000 €), les aides locales
        et la TVA réduite à 5,5 % sur les travaux de rénovation énergétique. Dans le parcours par
        geste, les primes CEE versées par les fournisseurs d’énergie se cumulent avec MaPrimeRénov’.
        Estimez votre prime et votre reste à charge avec notre{" "}
        <A href="/outils/simulateur-maprimerenov">simulateur MaPrimeRénov’ 2026</A>.
      </p>

      <H2>Estimer le DPE et le coût des travaux</H2>
      <p>
        Avant de décider, faites un diagnostic précis. Notre{" "}
        <A href="/outils/calculateur-dpe">calculateur DPE</A> donne une estimation rapide à partir
        de la surface, du chauffage et de l’isolation. Pour un résultat opposable, faites réaliser
        un DPE par un diagnostiqueur certifié.
      </p>
      <p>
        Pour modéliser l’impact financier d’une rénovation sur un bien loué, utilisez aussi notre{" "}
        <A href="/outils/calculateur-rentabilite-locative">calculateur de rentabilité locative</A>{" "}
        pour comparer les scénarios « loyer après travaux » et « cession avec décote ». Vous achetez
        un logement à rénover ? Intégrez les travaux à votre plan de financement dès le départ : notre
        guide <A href="/blog/guide-immobilier-2026">acheter sa résidence principale en 2026</A>{" "}
        détaille la méthode.
      </p>

      <H3>Synthèse : que faire selon votre profil</H3>
      <UL>
        <li>
          <strong>Bailleur, logement classé G</strong> : impossible de signer ou de renouveler un
          bail depuis janvier 2025. Travaux ou vente rapide.
        </li>
        <li>
          <strong>Bailleur, logement classé F</strong> : interdiction au 1er janvier 2028, soit
          environ quinze mois pour agir. Vérifiez d’abord si le nouveau calcul du DPE ne vous fait
          pas déjà changer de classe.
        </li>
        <li>
          <strong>Propriétaire occupant F ou G</strong> : aucune contrainte légale. Décision
          économique selon votre horizon de revente.
        </li>
        <li>
          <strong>Investisseur à la recherche d’opportunités</strong> : un bien F ou G acheté avec
          décote puis rénové peut prendre 30 à 50 % de valeur après travaux, à condition de chiffrer
          précisément les travaux et les aides auxquelles vous avez droit.
        </li>
      </UL>
    </ArticleShell>
  );
}
