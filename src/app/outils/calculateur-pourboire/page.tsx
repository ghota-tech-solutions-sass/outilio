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

  const m = Math.max(0, parseFloat(montant) || 0);
  const p = Math.max(1, parseInt(personnes) || 1);

  const pourboireTheorique = m * (pourcentage / 100);
  const totalTheorique = m + pourboireTheorique;
  const totalParPersonneExact = totalTheorique / p;

  // Arrondi à l'euro supérieur par personne (tolérance pour les imprécisions de calcul flottant)
  const totalParPersonne = arrondi ? Math.ceil(totalParPersonneExact - 1e-9) : totalParPersonneExact;
  // Montants réellement versés : avec l'arrondi, le pourboire effectif dépasse le pourcentage choisi
  const totalBrut = arrondi ? totalParPersonne * p : totalTheorique;
  const pourboire = totalBrut - m;
  const tauxEffectif = m > 0 ? (pourboire / m) * 100 : 0;
  const pourboireParPersonne = pourboire / p;
  // Partage exact : le total en centimes ne se divise pas toujours par le nombre de convives
  const centimesNonDivisibles = !arrondi && p > 1 && Math.round(totalTheorique * 100) % p !== 0;

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
            Calculez le pourboire et partagez l&apos;addition entre convives. En France, le service est déjà compris dans les prix : le pourboire reste facultatif.
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
                  Arrondir à l&apos;euro supérieur (par personne)
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
                  {arrondi && m > 0 && (
                    <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                      soit {tauxEffectif.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} % effectif avec l&apos;arrondi
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Total avec pourboire</p>
                  <p className="mt-2 text-5xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                    {fmt(totalBrut)} &euro;
                  </p>
                </div>
              </div>
            </div>

            {(p > 1 || arrondi) && (
              <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Par personne ({p} {p > 1 ? "personnes" : "personne"})</p>
                <div className="mt-4 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>Pourboire</p>
                    <p className="mt-1 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
                      {fmt(pourboireParPersonne)} &euro;
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>Total à payer</p>
                    <p className="mt-1 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                      {fmt(totalParPersonne)} &euro;
                    </p>
                  </div>
                </div>
                {centimesNonDivisibles && (
                  <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
                    Montant arrondi au centime : selon les convives, la part réelle peut varier d&apos;un centime.
                  </p>
                )}
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
              description="Trois étapes pour adapter le pourboire au contexte (France, États-Unis, autres pays) et éviter le faux pas culturel."
              steps={[
                {
                  name: "Identifier le contexte culturel",
                  text:
                    "France : le service est déjà compris dans les prix affichés (arrêté du 27 mars 1987), le pourboire est un geste facultatif, souvent 5 à 10 % pour remercier d'un bon service. États-Unis : 15 à 20 % sont attendus, car le salaire minimum fédéral des serveurs peut descendre à 2,13 USD/h hors pourboires. Canada : 15 à 20 % d'usage (au Québec, le salaire minimum des salariés au pourboire est réduit). Japon : pas de pourboire.",
                },
                {
                  name: "Saisir l'addition et le pourcentage",
                  text:
                    "Montant : addition totale TTC, sans pourboire. Pourcentage : 5 à 10 % en France (davantage pour un service exceptionnel), 18 à 20 % aux États-Unis (15 % pour un service ordinaire, 22 à 25 % pour un excellent service). Pour les taxis : 10 à 15 % aux États-Unis, arrondi à l'euro supérieur en France.",
                },
                {
                  name: "Partager et arrondir",
                  text:
                    "Nombre de convives : l'outil divise le total (addition + pourboire) par personne. L'option d'arrondi à l'euro supérieur par personne est pratique en espèces pour éviter les centimes ; le pourboire total et le pourcentage effectif sont alors recalculés. En carte bancaire, le partage exact au centime reste possible.",
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
                    Dîner au restaurant en France
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Addition de 85 € à 4 convives : un pourboire de 5 à 10 % représente
                    4,25 à 8,50 € au total, soit 1 à 2 € par personne environ. Geste facultatif
                    mais apprécié pour un service attentionné. Ne rien laisser n&apos;a rien
                    d&apos;impoli : le service est inclus dans les prix.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Voyage aux États-Unis : restaurant
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour un brunch à New York avec 60 USD d&apos;addition : 18 à 20 % de pourboire,
                    soit 11 à 12 USD. Aux États-Unis, le pourboire n&apos;est pas vraiment optionnel :
                    le salaire minimum fédéral des serveurs peut n&apos;être que de 2,13 USD/h, les
                    pourboires constituant l&apos;essentiel de leur rémunération. Moins de 15 % est
                    perçu comme un reproche sur le service.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Partage entre amis avec arrondi
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pizzas à 4 pour 47 € + 8 % de pourboire = 50,76 €, soit 12,69 € par
                    personne. Avec l&apos;arrondi à l&apos;euro supérieur : 13 € par personne, 52 €
                    au total, soit 5 € de pourboire (10,6 % effectifs au lieu de 8 %). Pratique en
                    espèces, sans calcul de centimes.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Hôtellerie et autres prestataires
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Bagagiste d&apos;hôtel : 1 à 2 € par bagage. Femme de chambre : 2 à 5 € par nuit,
                    à laisser chaque jour plutôt qu&apos;en fin de séjour, car le personnel peut changer.
                    Concierge : 5 à 20 € selon le service rendu. Coiffeur en France : pourboire
                    facultatif, quelques euros ou un arrondi à la caisse.
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
                À savoir : le pourboire selon les pays
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>France : prix service compris.</strong> L&apos;arrêté du 27 mars 1987 relatif
                  à l&apos;affichage des prix impose que les prix affichés dans les cafés et restaurants
                  s&apos;entendent &laquo; service compris &raquo;, avec l&apos;indication du taux de
                  service pratiqué par l&apos;établissement (souvent 15 %). Le service n&apos;est donc
                  jamais à ajouter : le pourboire éventuel est un geste volontaire en plus.
                </p>
                <p>
                  <strong>États-Unis et Canada : un pourboire attendu.</strong> Aux États-Unis, le
                  salaire minimum fédéral des employés rémunérés au pourboire est de 2,13 USD/h,
                  l&apos;employeur devant compléter jusqu&apos;au minimum général de 7,25 USD/h si les
                  pourboires ne suffisent pas (plusieurs États imposent davantage). En pratique, les
                  pourboires font l&apos;essentiel du revenu : 18 à 22 % sont la norme au restaurant.
                  Au Canada, 15 à 20 % restent l&apos;usage ; au Québec, les salariés au pourboire ont un
                  salaire minimum réduit (13,30 $ l&apos;heure contre 16,60 $ au taux général depuis le
                  1er mai 2026).
                </p>
                <p>
                  <strong>Japon, Corée du Sud : pas de pourboire.</strong> Au Japon, laisser un
                  pourboire est inhabituel et peut mettre mal à l&apos;aise : le service est considéré
                  comme inclus dans le prix. Si vous tenez à remercier, l&apos;usage est de remettre
                  l&apos;argent dans une enveloppe. La Corée du Sud suit la même convention.
                </p>
                <p>
                  <strong>Italie, Espagne, Allemagne, Suisse : zone intermédiaire.</strong> Italie :
                  vérifiez le ticket (le coperto est un couvert facturé, pas un pourboire ; le servizio
                  peut être inclus). Pourboire en sus de 5 à 10 % si le service a plu. Espagne : pas de
                  norme stricte, arrondi ou 5 à 10 %. Allemagne : 5 à 10 %, annoncés oralement au moment
                  de payer (on indique le montant arrondi au serveur). Suisse : service inclus dans les
                  prix, pourboire facultatif.
                </p>
                <p>
                  <strong>Pourboires et fiscalité en France.</strong> Les pourboires versés
                  volontairement par les clients aux salariés en contact avec la clientèle, en espèces
                  ou par carte bancaire, sont exonérés d&apos;impôt sur le revenu et de cotisations et
                  contributions sociales lorsque la rémunération mensuelle du salarié est inférieure à
                  1,6 Smic (2 916,85 € brut en 2026). Instaurée par la loi de finances pour 2022, cette
                  exonération a été prolongée jusqu&apos;au 31 décembre 2028 par la loi de finances pour
                  2026 (loi n° 2026-103 du 19 février 2026).
                </p>
              </div>
            </section>

            <ToolFaqSection
              title="Questions fréquentes"
              intro="Les questions fréquentes sur le pourboire en France et à l'étranger."
              items={[
                {
                  question: "Le pourboire est-il obligatoire en France ?",
                  answer:
                    "Non. Depuis l'arrêté du 27 mars 1987, les prix affichés dans les établissements de restauration s'entendent « service compris ». Le pourboire est un geste facultatif pour remercier d'un service apprécié. Usage courant : 5 à 10 % au restaurant pour un bon service, davantage pour un service exceptionnel. Ne rien laisser n'est ni grossier ni mal vu en France.",
                },
                {
                  question: "Quel pourcentage de pourboire au restaurant en France ?",
                  answer:
                    "5 à 10 % pour un service correct à bon (entre 4 et 8 € sur une addition de 80 €, par exemple). 10 à 15 % pour un service exceptionnel ou un repas gastronomique. Sur de petites additions (café, boisson), laisser la monnaie ou 1 à 2 € suffit largement. Aux États-Unis, la norme est nettement plus élevée : 18 à 20 % en moyenne.",
                },
                {
                  question: "Comment partager équitablement entre plusieurs convives ?",
                  answer:
                    "Indiquez le nombre de convives : l'outil divise automatiquement (addition + pourboire) par personne. L'option d'arrondi à l'euro supérieur par personne facilite les paiements en espèces ; le pourboire total affiché tient alors compte de l'arrondi, qui augmente un peu le pourcentage réellement laissé. Pour des dépenses payées par plusieurs personnes, utilisez plutôt notre calculateur de partage de frais.",
                },
                {
                  question: "Quel pourboire laisser aux États-Unis ?",
                  answer:
                    "Restaurant : 18 à 20 % (calculés sur le montant avant taxes). 15 % est un minimum, souvent perçu comme un reproche discret sur le service. 22 à 25 % pour un service exceptionnel. Taxi et VTC : 10 à 15 %. Bagagiste : 1 à 2 USD par bagage. Femme de chambre : 2 à 5 USD par nuit. Coiffeur : 15 à 20 %. Vérifiez la note : certains restaurants ajoutent déjà un « service charge » pour les groupes.",
                },
                {
                  question: "Faut-il laisser un pourboire au Japon ou en Asie ?",
                  answer:
                    "Au Japon : non. C'est inhabituel et peut embarrasser : le service est inclus dans le prix. Idem en Corée du Sud. En Chine : pas de tradition de pourboire au quotidien, mais il est accepté dans les hôtels internationaux haut de gamme. À Singapour et Hong Kong : des frais de service de 10 % figurent souvent déjà sur la note (à vérifier).",
                },
                {
                  question: "Les pourboires sont-ils imposables pour le serveur en France ?",
                  answer:
                    "Pas en 2026 pour la plupart des serveurs. Les pourboires versés volontairement par les clients (espèces ou carte bancaire) sont exonérés d'impôt sur le revenu et de cotisations sociales, salariales comme patronales, si la rémunération mensuelle du salarié est inférieure à 1,6 Smic (2 916,85 € brut en 2026). Cette mesure, créée par la loi de finances pour 2022, a été prolongée jusqu'au 31 décembre 2028 par la loi de finances pour 2026. Au-delà de 1,6 Smic, les pourboires sont soumis à l'impôt et aux cotisations.",
                },
                {
                  question: "Espèces, carte ou directement au serveur : quelle méthode privilégier ?",
                  answer:
                    "En France et en Europe, les espèces remises directement au serveur restent la méthode la plus appréciée. Par carte bancaire, la répartition dépend de l'établissement (souvent une cagnotte partagée entre toute l'équipe) ; ces pourboires par carte bénéficient eux aussi de l'exonération fiscale et sociale. Aux États-Unis, le pourboire par carte est la norme (ligne « tip » sur le ticket).",
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
