import { A, ArticleShell, Box, H2, H3, UL } from "../_components/Article";

const SOURCES = [
  {
    label: "Peut-on rembourser son prêt immobilier par anticipation ? – service-public.gouv.fr (fiche F1669)",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F1669",
  },
  {
    label: "Rembourser son crédit immobilier avant le terme : comment ça marche ? – economie.gouv.fr",
    url: "https://www.economie.gouv.fr/particuliers/emprunter-et-sassurer/rembourser-son-credit-immobilier-avant-le-terme-comment-ca",
  },
  {
    label: "Code de la consommation, articles L313-47 à L313-49 (remboursement anticipé) – Légifrance",
    url: "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000032222295/",
  },
  {
    label: "Code de la consommation, article R313-25 (plafond des indemnités) – Légifrance",
    url: "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000032807570/",
  },
  {
    label: "Loi n° 2022-270 du 28 février 2022 (loi Lemoine) – Légifrance",
    url: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000045268729",
  },
  {
    label: "Article L113-12-2 du Code des assurances (résiliation à tout moment) – Légifrance",
    url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000045271930",
  },
  {
    label: "Observatoire Crédit Logement/CSA : taux moyens d’août 2026",
    url: "https://lobservatoire.creditlogement.fr/publications/analyse-marche-immobilier-aout-2026/",
  },
];

export default function ArticleRachatCreditImmo2026() {
  return (
    <ArticleShell
      slug="rachat-credit-immo-2026"
      breadcrumb="Rachat de crédit immo 2026"
      sources={SOURCES}
      cta={{
        text: "Estimez votre gain en 30 secondes",
        label: "Lancer le calculateur",
        href: "/outils/calculateur-rachat-credit",
      }}
    >
      <p>
        Après le pic de fin 2023 (jusqu’à 4,5 % sur 20 ans), les conditions d’emprunt se sont
        détendues. En août 2026, les taux moyens s’établissent à 3,14 % sur 15 ans, 3,27 % sur
        20 ans et 3,35 % sur 25 ans, hors assurance. Si vous avez signé en 2023 ou début 2024, la
        question du rachat se pose sérieusement. Mais entre les frais, l’assurance, l’indemnité de
        remboursement anticipé et la durée restante, l’arbitrage n’est pas évident. Voici comment
        trancher en 5 minutes.
      </p>

      <H2>La règle de l’écart de 0,7 à 1 point</H2>
      <p>
        C’est la règle empirique citée par les courtiers : pour qu’un rachat soit intéressant, il
        faut un <strong>écart de taux d’au moins 0,7 à 1 point</strong> entre votre taux actuel et le
        nouveau taux proposé. En dessous, les frais (pénalités, garantie, dossier) consomment une
        trop grande partie de l’économie attendue.
      </p>
      <p>
        Mais cette règle ne vaut que si vous êtes <strong>dans le premier tiers de votre prêt</strong>.
        Pourquoi ? Parce que les intérêts sont concentrés en début de prêt (l’amortissement du
        capital est progressif). Plus vous êtes avancé dans votre échéancier, moins le rachat est
        intéressant, même avec un gros écart de taux.
      </p>

      <H2>Les frais à anticiper</H2>
      <p>Le coût total d’un rachat de crédit comprend plusieurs postes :</p>
      <UL>
        <li>
          <strong>Indemnité de remboursement anticipé (IRA)</strong> : pour un prêt à taux fixe, elle
          ne peut dépasser ni six mois d’intérêts sur le capital remboursé (au taux moyen du prêt),
          ni 3 % du capital restant dû ; c’est le plus faible des deux qui s’applique, et votre
          contrat peut prévoir moins, voire rien. Pour 200 000 € restant dus à 4 % : six mois
          d’intérêts = 4 000 €, 3 % = 6 000 €, l’IRA est donc plafonnée à 4 000 €. Aucune IRA
          n’est due si le remboursement fait suite à la vente du logement pour un changement de
          lieu de travail, au décès ou à la cessation forcée de l’activité de l’emprunteur ou de son
          conjoint.
        </li>
        <li>
          <strong>Frais de dossier</strong> de la nouvelle banque : 500 à 1 500 € en général,
          souvent négociables.
        </li>
        <li>
          <strong>Frais de garantie</strong> : nouvelle hypothèque ou nouvelle caution. Pour une
          caution de type Crédit Logement, comptez de l’ordre de 1 à 1,5 % du capital ; une
          hypothèque coûte plus cher (frais d’acte notarié et taxes).
        </li>
        <li>
          <strong>Éventuels honoraires de courtier</strong> : environ 1 % du capital, uniquement si
          vous passez par un courtier.
        </li>
      </UL>
      <p>
        Pour un rachat de 200 000 €, comptez en moyenne <strong>4 500 à 8 000 € de frais au
        total</strong>. C’est cette somme qu’il faut amortir avec l’économie d’intérêts générée par
        le nouveau taux.
      </p>

      <H2>Exemple chiffré : rachat ou pas ?</H2>
      <Box>
        <p className="font-semibold" style={{ color: "var(--primary)" }}>
          Cas A : prêt signé début 2024 à 4,2 %
        </p>
        <UL>
          <li>Capital restant dû : 220 000 € sur 22 ans</li>
          <li>Mensualité actuelle : 1 278 € (hors assurance)</li>
          <li>Nouveau taux : 3,2 %</li>
          <li>Nouvelle mensualité : 1 162 €</li>
          <li>
            Économie mensuelle : <strong>116 €</strong>
          </li>
          <li>Frais totaux du rachat : environ 8 000 € (IRA de 4 620 €, soit six mois d’intérêts, garantie d’environ 2 600 € et frais de dossier)</li>
          <li>
            Délai d’amortissement des frais : 8 000 / 116 ≈ <strong>69 mois (moins de 6 ans)</strong>
          </li>
          <li>
            Si vous gardez le bien et le prêt plus de 6 ans : <strong>rachat rentable</strong>
          </li>
        </UL>
        <p className="font-semibold" style={{ color: "var(--primary)" }}>
          Cas B : prêt signé en 2018 à 1,5 %
        </p>
        <UL>
          <li>Capital restant dû : 150 000 € sur 12 ans</li>
          <li>Nouveau taux proposé : 3,2 %</li>
          <li>
            L’écart est <strong>négatif</strong> : − 1,7 point
          </li>
          <li>
            <strong>Aucun intérêt</strong> à racheter, vous dégraderiez votre situation
          </li>
        </UL>
      </Box>

      <H2>Ne pas oublier l’assurance emprunteur</H2>
      <p>
        La loi Lemoine de 2022 permet de changer d’assurance emprunteur{" "}
        <strong>à tout moment, sans frais ni pénalités</strong>, à condition que le nouveau contrat
        offre des garanties équivalentes. C’est souvent le premier levier d’économies, et le plus
        simple à actionner. Une assurance déléguée peut coûter deux à trois fois moins cher qu’un
        contrat groupe bancaire, surtout pour les emprunteurs jeunes et non-fumeurs.
      </p>
      <p>
        <strong>Conseil pratique</strong> : avant même de penser au rachat, faites jouer la loi
        Lemoine. Passer de 0,34 % à 0,12 % sur un capital initial de 200 000 € fait économiser
        440 € par an, soit environ 5 000 € sur onze ans restants, sans rachat de crédit. Chiffrez
        votre cas avec notre <A href="/outils/assurance-emprunteur">simulateur d’assurance emprunteur</A>.
      </p>

      <H2>Renégocier avec sa banque ou changer de banque ?</H2>
      <p>Deux options existent :</p>
      <UL>
        <li>
          <strong>Renégocier avec votre banque actuelle</strong> : pas d’IRA, pas de nouvelle
          garantie, frais réduits (un avenant). Mais la banque sait que partir vous coûtera et vous
          proposera un taux moins agressif que la concurrence.
        </li>
        <li>
          <strong>Faire racheter par une autre banque</strong> : taux plus agressif, mais IRA, frais
          de garantie et de dossier. Plus rentable à partir d’un écart d’un point ou plus.
        </li>
      </UL>
      <p>
        <strong>Stratégie</strong> : commencez par obtenir des offres concurrentes (au moins trois
        banques ou un courtier), puis présentez-les à votre banque actuelle pour négocier. Si elle
        s’aligne, vous gagnez sans avoir à changer.
      </p>

      <H2>Les outils pour décider en 5 minutes</H2>
      <p>
        Notre <A href="/outils/calculateur-rachat-credit">calculateur de rachat de crédit</A> intègre
        tous les frais et calcule en temps réel l’économie nette et le délai d’amortissement.
        Saisissez votre taux actuel, le nouveau taux, le capital restant et la durée restante.
      </p>
      <p>
        Pour simuler une nouvelle situation complète (changement de bien ou allongement de durée),
        utilisez notre <A href="/outils/calculateur-pret-immobilier">calculateur de prêt immobilier</A>{" "}
        pour comparer plusieurs scénarios. Si vous envisagez plutôt d’acheter un nouveau logement,
        vérifiez d’abord votre <A href="/outils/capacite-emprunt">capacité d’emprunt</A>.
      </p>

      <H3>Checklist avant de signer un rachat</H3>
      <UL>
        <li>Écart de taux d’au moins 0,7 point (mieux : 1 point)</li>
        <li>Vous êtes dans le premier tiers du prêt (les intérêts y sont concentrés)</li>
        <li>Capital restant supérieur à 70 000 € (pour amortir les frais)</li>
        <li>Horizon de détention supérieur au délai d’amortissement des frais</li>
        <li>Vous avez déjà fait jouer la loi Lemoine sur l’assurance</li>
        <li>Vous avez comparé au moins trois offres de banques différentes</li>
        <li>Le TAEG (et pas seulement le taux nominal) est nettement plus bas</li>
      </UL>
    </ArticleShell>
  );
}
