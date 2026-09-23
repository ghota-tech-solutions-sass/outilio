import { A, ArticleShell, Box, H2, H3, Table, UL } from "../_components/Article";

const SOURCES = [
  {
    label: "Prêt à taux zéro (PTZ) – service-public.gouv.fr (fiche F10871, mise à jour le 15 septembre 2026)",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F10871",
  },
  {
    label: "PTZ : offres de prêt émises à compter du 1er avril 2025 (quotités, durées, différés) – ANIL",
    url: "https://www.anil.org/aj-offres-pret-ptz-2025/",
  },
  {
    label: "Décret n° 2025-299 du 29 mars 2025 relatif aux prêts ne portant pas intérêt – Légifrance",
    url: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000051393341",
  },
  {
    label: "Prêt à taux zéro : quelles nouveautés ? – service-public.gouv.fr (actualité A17337)",
    url: "https://www.service-public.gouv.fr/particuliers/actualites/A17337",
  },
  {
    label: "HCSF : règles d’octroi des crédits immobiliers – economie.gouv.fr",
    url: "https://www.economie.gouv.fr/hcsf/mesures/mesure-relative-loctroi-de-credits-immobiliers",
  },
];

export default function ArticlePTZ2026() {
  return (
    <ArticleShell
      slug="ptz-2026-nouveautes"
      breadcrumb="PTZ 2026 : tout ce qui a changé"
      sources={SOURCES}
      cta={{
        text: "Estimez votre PTZ 2026 en 30 secondes",
        label: "Lancer le simulateur PTZ",
        href: "/outils/simulateur-ptz-2026",
      }}
    >
      <p>
        Le prêt à taux zéro a été profondément remanié. Après une version 2024 jugée trop
        restrictive (recentrée sur les zones tendues et les appartements), la loi de finances pour
        2025 et le décret n° 2025-299 du 29 mars 2025 ont élargi le dispositif à toute la France
        pour les offres de prêt émises depuis le 1er avril 2025, et fait dépendre la part
        finançable des revenus. Ce sont ces règles qui s’appliquent en 2026, le PTZ étant prorogé
        jusqu’au 31 décembre 2027. Résultat : un PTZ accessible à beaucoup plus de ménages,
        notamment dans les villes moyennes et en zone rurale.
      </p>

      <H2>Le PTZ, c’est quoi exactement</H2>
      <p>
        Le PTZ est un prêt immobilier sans intérêts, accordé par les banques pour compléter un prêt
        principal. Son coût est pris en charge par l’État, sous forme de crédit d’impôt versé à la
        banque. Il est réservé aux primo-accédants (pas de propriété de la résidence principale au
        cours des deux dernières années) qui achètent leur future résidence principale, et permet de
        boucler un plan de financement sans alourdir le coût total du crédit. Références légales :
        articles L31-10-2 et suivants du Code de la construction et de l’habitation (CCH).
      </p>

      <H2>Les 4 nouveautés majeures en vigueur en 2026</H2>

      <H3>1. Extension géographique à toute la France</H3>
      <p>
        <strong>C’est le changement le plus structurant.</strong> Depuis le 1er avril 2025, le PTZ
        pour un logement neuf est disponible dans <strong>toutes les zones</strong> du territoire
        (A bis, A, B1, B2 et C). Avant, le neuf n’était financé qu’en zones tendues (A bis, A et
        B1). Cette extension répond à une demande forte des villes moyennes et des zones rurales,
        où la production de logements neufs s’était effondrée. L’ancien reste, lui, limité aux
        zones B2 et C, avec des travaux représentant au moins 25 % du coût total de l’opération.
      </p>

      <H3>2. Réintégration des maisons individuelles neuves</H3>
      <p>
        Les <strong>maisons individuelles neuves</strong> sont à nouveau éligibles, mais avec une
        quotité plus faible que le collectif (de 10 % à 30 % selon la tranche de revenus). C’est un
        retour partiel après l’exclusion de 2024, qui avait suscité une levée de boucliers chez les
        constructeurs et les acheteurs en zone diffuse.
      </p>

      <H3>3. Quotités finançables relevées</H3>
      <p>
        La quotité (part du coût de l’opération finançable en PTZ) dépend désormais de la tranche
        de revenus et du type de logement :
      </p>
      <Table
        head={["Type d’opération", "Tranche 1", "Tranche 2", "Tranche 3", "Tranche 4"]}
        rows={[
          ["Neuf collectif (appartement), toutes zones", "50 %", "40 %", "40 %", "20 %"],
          ["Ancien avec travaux (zones B2 et C)", "50 %", "40 %", "40 %", "20 %"],
          ["Neuf individuel (maison), toutes zones", "30 %", "20 %", "20 %", "10 %"],
        ]}
        caption="Source : ANIL, offres de prêt émises à compter du 1er avril 2025."
      />
      <p>
        Le PTZ ne peut pas dépasser le montant des autres prêts d’au moins deux ans qui financent
        l’opération (de plus d’un quart lorsque la quotité est de 50 %) : il vient toujours en
        complément d’un prêt principal.
      </p>

      <H3>4. Des plafonds de revenus par zone et par tranche</H3>
      <p>
        Les ressources prises en compte sont le plus élevé de deux montants : le revenu fiscal de
        référence (RFR) de l’année N-2 de tous les futurs occupants, ou le coût total de l’opération
        divisé par 9. Ce montant est divisé par un coefficient familial (1 pour une personne, 1,5
        pour deux, 1,8 pour trois, 2,1 pour quatre, 2,4 pour cinq, puis + 0,3 par personne) pour
        déterminer la tranche. Pour une famille de 4 personnes en zone A, le plafond atteint
        102 900 € (49 000 € × 2,1).
      </p>
      <Table
        head={["Zone", "Tranche 1", "Tranche 2", "Tranche 3", "Tranche 4 (plafond)"]}
        rows={[
          ["A bis et A", "25 000 €", "31 000 €", "37 000 €", "49 000 €"],
          ["B1", "21 500 €", "26 000 €", "30 000 €", "34 500 €"],
          ["B2", "18 000 €", "22 500 €", "27 000 €", "31 500 €"],
          ["C", "15 000 €", "19 500 €", "24 000 €", "28 500 €"],
        ]}
        caption="Ressources divisées par le coefficient familial. Les plafonds de revenus du foyer s’obtiennent en multipliant par ce coefficient."
      />
      <p>
        La tranche fixe aussi la durée et le différé, c’est-à-dire la période pendant laquelle vous
        ne remboursez rien sur le PTZ :
      </p>
      <Table
        head={["Tranche", "Différé", "Remboursement", "Durée totale"]}
        rows={[
          ["1", "10 ans", "15 ans", "25 ans"],
          ["2", "8 ans", "12 ans", "20 ans"],
          ["3", "2 ans", "13 ans", "15 ans"],
          ["4", "aucun", "10 ans", "10 ans"],
        ]}
      />

      <H2>Exemple chiffré : famille à Lyon</H2>
      <Box>
        <p style={{ color: "var(--muted)" }}>
          Couple avec 2 enfants, RFR de 50 000 €, achat d’un T3 neuf en zone A (Lyon) pour un coût
          d’opération total de 320 000 €. Ressources retenues : le RFR (50 000 €) est supérieur au
          coût divisé par 9 (35 556 €) ; 50 000 / 2,1 = 23 810 €, soit la tranche 1 du PTZ.
        </p>
        <UL>
          <li>Coût retenu : plafonné à 315 000 € (150 000 € × 2,1 en zone A)</li>
          <li>Quotité tranche 1 : 50 % (neuf collectif)</li>
          <li>
            Montant PTZ : 315 000 × 50 % = <strong>157 500 € sans intérêts</strong>
          </li>
          <li>Durée : 25 ans, dont 10 ans de différé total, puis 875 € par mois pendant 15 ans</li>
          <li>Prêt principal à contracter : 162 500 € (au lieu de 320 000 € sans PTZ)</li>
        </UL>
        <p style={{ color: "var(--muted)" }}>
          Emprunter ces 157 500 € à 3,3 % sur 25 ans coûterait environ 74 000 € d’intérêts : c’est
          l’économie réalisée grâce au PTZ.
        </p>
      </Box>

      <H2>Comment estimer son PTZ 2026</H2>
      <p>
        Pour vérifier votre éligibilité et le montant auquel vous avez droit, utilisez notre{" "}
        <A href="/outils/simulateur-ptz-2026">simulateur PTZ 2026</A>. Saisissez vos revenus, le
        nombre de personnes du foyer, la zone et le type de bien. Le résultat est instantané et
        intègre les barèmes officiels en vigueur depuis le 1er avril 2025.
      </p>
      <p>
        Pour boucler votre plan de financement, vérifiez d’abord ce que les banques vous prêteront
        avec notre <A href="/outils/capacite-emprunt">simulateur de capacité d’emprunt</A>, puis
        chiffrez le prêt principal avec le{" "}
        <A href="/outils/calculateur-pret-immobilier">calculateur de prêt immobilier</A> et les frais
        d’acte avec le <A href="/outils/calculateur-frais-notaire">calculateur de frais de notaire</A>{" "}
        (2 à 3 % seulement dans le neuf, contre 7 à 8 % dans l’ancien). N’oubliez pas l’assurance
        emprunteur, qui couvre aussi le PTZ : comparez-la avec notre{" "}
        <A href="/outils/assurance-emprunteur">simulateur d’assurance emprunteur</A>. Le parcours
        complet est détaillé dans notre guide{" "}
        <A href="/blog/guide-immobilier-2026">acheter sa résidence principale en 2026</A>.
      </p>

      <H2>Pièges à éviter</H2>
      <UL>
        <li>
          <strong>Le PTZ ne couvre pas l’intégralité de l’achat</strong>. Il vient toujours en
          complément d’un prêt principal et exige un apport personnel (frais de notaire au minimum).
        </li>
        <li>
          <strong>Les plafonds de ressources sont stricts</strong>. Si vos revenus dépassent même
          légèrement le plafond de votre zone, vous êtes exclu du dispositif. Comme c’est le RFR de
          l’année N-2 qui compte, un versement sur un PER, déductible du revenu imposable, doit être
          anticipé deux ans avant la demande.
        </li>
        <li>
          <strong>Le différé peut créer un effet ciseau</strong>. Pendant la période de différé,
          vous remboursez uniquement le prêt principal. Quand le PTZ entre en remboursement, vos
          mensualités totales augmentent. Anticipez cette marche dans votre budget, ou demandez à la
          banque un prêt principal « lissé ».
        </li>
        <li>
          <strong>Le PTZ se demande à la banque</strong>. Il ne s’obtient pas en guichet public :
          vous devez le demander dans le cadre de votre dossier de prêt immobilier, auprès d’un
          établissement qui a signé une convention avec l’État.
        </li>
      </UL>

      <H3>Pour qui le PTZ 2026 vaut vraiment le coup</H3>
      <UL>
        <li>Primo-accédants en CDI ou indépendants aux revenus stables, avec un apport limité (10 à 15 %)</li>
        <li>Familles en zones B2 et C, qui étaient exclues du PTZ neuf en 2024</li>
        <li>Acheteurs dans le neuf collectif (immeubles), quel que soit leur emplacement</li>
        <li>Ménages dont les ressources par unité de coefficient familial les placent en tranche 1 ou 2</li>
      </UL>
    </ArticleShell>
  );
}
