"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

const PRESETS = [5, 10, 15, 20, 25];

export default function CalculateurPourboire() {
  const [montant, setMontant] = useState("50");
  const [pourcentage, setPourcentage] = useState(15);
  const [personnes, setPersonnes] = useState("2");
  const [arrondi, setArrondi] = useState(false);

  const m = parseFloat(montant) || 0;
  const p = parseInt(personnes) || 1;

  const pourboire = m * (pourcentage / 100);
  const totalBrut = m + pourboire;
  const pourboireParPersonne = pourboire / p;
  const totalParPersonne = totalBrut / p;

  const arrondirSup = (n: number) => Math.ceil(n);
  const totalArrondi = arrondi ? arrondirSup(totalParPersonne) : totalParPersonne;
  const pourboireArrondi = arrondi ? totalArrondi - m / p : pourboireParPersonne;

  const fmt = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Restaurant</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur <span style={{ color: "var(--primary)" }}>Pourboire</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez le pourboire ideal et partagez l&apos;addition entre convives.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Inputs */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Montant de l&apos;addition (&euro;)</label>
                  <input type="number" min="0" step="0.01" value={montant} onChange={(e) => setMontant(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Nombre de personnes</label>
                  <input type="number" min="1" max="50" value={personnes} onChange={(e) => setPersonnes(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
              </div>

              <div className="mt-6">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Pourboire : {pourcentage}%</label>
                <input type="range" min="0" max="30" step="1" value={pourcentage} onChange={(e) => setPourcentage(Number(e.target.value))}
                  className="mt-2 w-full" />
                <div className="mt-2 flex gap-2">
                  {PRESETS.map((pct) => (
                    <button key={pct} onClick={() => setPourcentage(pct)}
                      className="rounded-lg border px-3 py-1.5 text-sm font-medium transition-all"
                      style={{ borderColor: pourcentage === pct ? "var(--primary)" : "var(--border)", background: pourcentage === pct ? "rgba(13,79,60,0.05)" : "transparent", color: pourcentage === pct ? "var(--primary)" : "var(--muted)" }}>
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <input type="checkbox" checked={arrondi} onChange={(e) => setArrondi(e.target.checked)} className="h-4 w-4" />
                  Arrondir au-dessus (par personne)
                </label>
              </div>
            </div>

            {/* Results */}
            <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Pourboire total</p>
                  <p className="mt-2 text-5xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
                    {fmt(pourboire)} &euro;
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Total avec pourboire</p>
                  <p className="mt-2 text-5xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                    {fmt(totalBrut)} &euro;
                  </p>
                </div>
              </div>
            </div>

            {p > 1 && (
              <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Par personne ({p} personnes)</p>
                <div className="mt-4 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>Pourboire</p>
                    <p className="mt-1 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
                      {fmt(pourboireArrondi)} &euro;
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>Total a payer</p>
                    <p className="mt-1 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                      {fmt(totalArrondi)} &euro;
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Comparison table */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Comparaison des taux</h2>
              <div className="mt-4 space-y-2">
                {[5, 10, 15, 20, 25].map((pct) => {
                  const tip = m * (pct / 100);
                  return (
                    <div key={pct} className="flex items-center justify-between rounded-lg px-4 py-2"
                      style={{ background: pct === pourcentage ? "rgba(13,79,60,0.05)" : "var(--surface-alt)" }}>
                      <span className="text-sm font-bold" style={{ color: pct === pourcentage ? "var(--primary)" : "var(--foreground)" }}>{pct}%</span>
                      <span className="text-sm" style={{ color: "var(--muted)" }}>Pourboire : {fmt(tip)} &euro;</span>
                      <span className="text-sm font-bold">Total : {fmt(m + tip)} &euro;</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <ToolHowToSection
              title="Comment calculer un pourboire correctement"
              description="Trois etapes pour adapter le pourboire au contexte (France, USA, autres pays) et eviter le faux pas culturel."
              steps={[
                {
                  name: "Identifier le contexte culturel",
                  text:
                    "France : service deja compris dans le prix affiche (15 pourcent par defaut depuis l&apos;arrete du 27 mars 1987 et le decret du 16 juin 1956), pourboire facultatif 5-10 pourcent en geste de remerciement. USA et Canada : 18-20 pourcent indispensables car les salaires de service sont sous le minimum legal hors pourboires. Japon : pourboire considere comme insultant, ne pas en laisser.",
                },
                {
                  name: "Saisir l&apos;addition et le pourcentage",
                  text:
                    "Montant : addition totale TTC, sans avoir deja inclus le pourboire. Pourcentage : 5-10 pourcent en France (15 pourcent pour un service exceptionnel), 18-20 pourcent aux USA (15 pourcent en cas de service ordinaire, 22-25 pourcent pour un excellent service). Pour les taxis : 10-15 pourcent USA, geste rond en France (arrondir au 5 ou 10 superieur).",
                },
                {
                  name: "Partager et arrondir",
                  text:
                    "Nombre de convives : l&apos;outil divise automatiquement le total (addition + pourboire) par personne pour un partage equitable. Option arrondi superieur par personne : tres pratique en cash pour eviter les centimes et simplifier le paiement entre amis. En CB, le partage exact a 2 decimales reste possible.",
                },
              ]}
            />

            <section
              className="rounded-xl border p-6 md:p-8 shadow-sm"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-2xl md:text-3xl font-extrabold"
                style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
              >
                Cas d&apos;usage du calculateur de pourboire
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Diner au restaurant en France
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Addition de 85 EUR a 4 convives : pourboire de 5-10 pourcent =
                    4,25-8,50 EUR au total, soit environ 1-2 EUR par personne. Geste optionnel
                    mais apprecie pour un service attentionne. Pas de probleme de ne rien
                    laisser : le service est legalement inclus dans le prix.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Voyage aux USA : restaurant
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour un brunch a New York avec 60 USD d&apos;addition : tip de 18-20 pourcent
                    soit 11-12 USD. Le tip aux USA n&apos;est PAS optionnel : les serveurs
                    gagnent un salaire minimum federal de 2,13 USD/h, completes par les
                    pourboires consideres comme partie integrante du salaire. Sous 15 pourcent
                    = humiliation pour le serveur.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Partage entre amis avec arrondi
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pizza a 4 a 47 EUR + 8 pourcent de pourboire = 50,76 EUR, soit 12,69 EUR par
                    personne. Avec arrondi superieur : 13 EUR par personne, total recolte
                    52 EUR (1,24 EUR de pourboire bonus pour le serveur). Pratique en cash et
                    evite les calculs de centimes.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Service hotellier et autres prestataires
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Bagagiste hotel : 1-2 EUR par bagage. Femme de chambre : 2-5 EUR par jour
                    laisses a la fin du sejour (pas chaque jour, sinon premier jour seulement).
                    Concierge service : 5-20 EUR selon difficulte. Coiffeur en France :
                    pourboire optionnel 5-10 pourcent ou simple geste rond a la caisse.
                  </p>
                </div>
              </div>
            </section>

            <section
              className="rounded-xl border p-6 md:p-8 shadow-sm"
              style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-2xl md:text-3xl font-extrabold"
                style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
              >
                A savoir : France, USA, Japon, le pourboire selon les pays
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>France : service compris depuis 1987.</strong> L&apos;arrete du 27
                  mars 1987 (et anciennement le decret de 1956) impose l&apos;affichage du prix
                  &laquo; service compris &raquo; dans tous les etablissements de
                  restauration. Cette disposition fixe le service a 15 pourcent du prix HT,
                  reverse en partie aux serveurs via leur convention collective HCR (Hotels
                  Cafes Restaurants). Le pourboire eventuel est donc un veritable bonus, pas
                  un complement de salaire.
                </p>
                <p>
                  <strong>USA et Canada : tipping culture obligatoire.</strong> Aux USA, le
                  Federal Minimum Wage pour les tipped employees est de 2,13 USD/h (depuis
                  1991, federal). Les pourboires couvrent l&apos;ecart avec le minimum legal
                  general (7,25 USD/h federal, plus eleve dans certains Etats). Sans tip, un
                  serveur gagne sous le minimum legal : c&apos;est pourquoi le tipping est
                  socialement obligatoire. Standard 18-22 pourcent en restaurant en 2026.
                </p>
                <p>
                  <strong>Japon, Coree du Sud : ne pas laisser de pourboire.</strong> Au Japon,
                  laisser un pourboire est socialement maladroit voire offensant : le service
                  est considere comme inclus dans le prix et donner extra suggererait que le
                  professionnel est mal paye. Si vous insistez, presenter l&apos;argent dans
                  une enveloppe fermee est l&apos;usage. La Coree du Sud suit la meme
                  convention.
                </p>
                <p>
                  <strong>Italie, Espagne, Allemagne : zone intermediaire.</strong> Italie :
                  servizio pas toujours inclus, verifier le ticket (coperto = couvert obligatoire,
                  pas un pourboire). Pourboire en sus 5-10 pourcent si service plaisant. Espagne :
                  pas de norme stricte, geste rond ou 5-10 pourcent. Allemagne et Suisse : 5-10
                  pourcent annonce a l&apos;oral au moment du paiement (le serveur arrondit
                  lui-meme la note). En Suisse, service deja inclus officiellement.
                </p>
                <p>
                  <strong>Pourboires et fiscalite francaise.</strong> En France, les
                  pourboires verses directement au personnel sont, depuis la loi de finances
                  2022 et jusqu&apos;a fin 2025, exoneres d&apos;impot sur le revenu et de
                  cotisations sociales pour les salaires inferieurs a 1,6 SMIC. Mesure
                  prolongee dans la loi de finances 2026 sous reserve de publication. Pour
                  l&apos;employeur, c&apos;est aussi l&apos;exoneration de cotisations
                  patronales sur ces pourboires.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions frequentes sur le pourboire en France et a l&apos;etranger."
              items={[
                {
                  question: "Le pourboire est-il obligatoire en France ?",
                  answer:
                    "Non. Depuis l&apos;arrete du 27 mars 1987, tous les etablissements de restauration doivent afficher leurs prix &laquo; service compris &raquo; (15 pourcent du HT). Le pourboire est un geste optionnel pour remercier d&apos;un service apprecie. Norme courante : 5-10 pourcent au restaurant pour un bon service, jusqu&apos;a 15 pourcent pour un service exceptionnel. Ne rien laisser n&apos;est ni grossier ni mal vu en France.",
                },
                {
                  question: "Quel pourcentage de pourboire au restaurant en France ?",
                  answer:
                    "5 a 10 pourcent pour un service correct a bon (entre 4 EUR et 8 EUR sur une addition de 80 EUR, par exemple). 10-15 pourcent pour un service exceptionnel, gastronomique ou pour des prestations longues. Sur de petites additions (cafe, soft), un geste arrondi (1 a 2 EUR) suffit largement. Aux Etats-Unis, la norme est nettement plus haute : 18-20 pourcent en moyenne.",
                },
                {
                  question: "Comment partager equitablement entre plusieurs convives ?",
                  answer:
                    "Indiquez le nombre de convives dans le champ correspondant : l&apos;outil divise automatiquement (addition + pourboire) par personne. L&apos;option d&apos;arrondi superieur par personne facilite les paiements en cash en evitant les centimes. En groupe, l&apos;arrondi peut donner un pourboire effectif legerement superieur au pourcentage choisi : c&apos;est un bonus pour le serveur.",
                },
                {
                  question: "Quel pourboire laisser aux Etats-Unis ?",
                  answer:
                    "Restaurant : 18-20 pourcent indispensables (pre-tax aux USA, sur le sous-total avant taxes locales). 15 pourcent au minimum, considere comme une critique discrete du service. 22-25 pourcent pour un service exceptionnel. Taxi / Uber : 10-15 pourcent. Bagagiste : 1-2 USD par bagage. Femme de chambre : 2-5 USD par nuit. Coiffeur : 15-20 pourcent. Manquer au tip est socialement tres mal percu.",
                },
                {
                  question: "Faut-il laisser un pourboire au Japon ou en Asie ?",
                  answer:
                    "Au Japon : non, jamais. C&apos;est socialement maladroit voire offensant : le service est inclus dans le prix et offrir un pourboire suggererait un sous-paiement, ce qui est insultant culturellement. Idem en Coree du Sud. En Chine : pas de tradition de tipping en local, mais accepte dans les hotels internationaux haut de gamme. Singapour, Hong Kong : tip de 10 pourcent souvent deja inclus dans la note (verifier).",
                },
                {
                  question: "Les pourboires sont-ils imposables pour le serveur en France ?",
                  answer:
                    "Mesure d&apos;exoneration en vigueur depuis la loi de finances 2022 : les pourboires verses directement au personnel sont exoneres d&apos;impot sur le revenu et de cotisations sociales (salariales et patronales) pour les salaires inferieurs a 1,6 SMIC. Mesure prevue jusqu&apos;a fin 2025 et generalement reconduite. Au-dela de 1,6 SMIC, les pourboires entrent dans l&apos;assiette imposable et soumis a cotisations.",
                },
                {
                  question: "Cash, CB ou directement au serveur : quelle methode privilegier ?",
                  answer:
                    "En France et en Europe : cash en main directement au serveur reste la methode la plus appreciee (le serveur en a 100 pourcent immediatement, sans risque de partage force). En CB, ajout du tip sur le total : la repartition depend de la politique de l&apos;etablissement (parfois pool partage entre toute l&apos;equipe). Aux USA, le tip CB est la norme et bien gere (tip line sur le ticket).",
                },
              ]}
            />
          </div>
          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
