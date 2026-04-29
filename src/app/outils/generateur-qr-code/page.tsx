"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

export default function GenerateurQRCode() {
  const [text, setText] = useState("https://outilis.fr");
  const [size, setSize] = useState("256");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    if (!text.trim()) return;
    const s = parseInt(size) || 256;
    QRCode.toDataURL(text, {
      width: s,
      margin: 2,
      color: { dark: color, light: bgColor },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        setQrDataUrl(url);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const img = new Image();
        img.onload = () => {
          canvas.width = s;
          canvas.height = s;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.drawImage(img, 0, 0, s, s);
        };
        img.src = url;
      })
      .catch(() => setQrDataUrl(""));
  }, [text, size, color, bgColor]);

  const download = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "qrcode.png";
    a.click();
  };

  const setPreset = (preset: string) => {
    if (preset === "wifi") setText("WIFI:T:WPA;S:NomDuReseau;P:MotDePasse;;");
    else if (preset === "email") setText("mailto:contact@exemple.fr?subject=Bonjour");
    else if (preset === "tel") setText("tel:+33612345678");
    else if (preset === "sms") setText("sms:+33612345678?body=Bonjour");
    else if (preset === "vcard")
      setText(
        "BEGIN:VCARD\nVERSION:3.0\nN:Nom;Prenom\nTEL:+33612345678\nEMAIL:contact@exemple.fr\nEND:VCARD"
      );
    else setText("https://outilis.fr");
  };

  return (
    <>
      <section
        className="py-12"
        style={{ background: "linear-gradient(to bottom, var(--surface-alt), var(--background))" }}
      >
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <h1
            className="animate-fade-up stagger-1 text-3xl font-extrabold md:text-4xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
          >
            Generateur de QR Code gratuit
          </h1>
          <p className="animate-fade-up stagger-2 mt-2 max-w-3xl" style={{ color: "var(--muted)" }}>
            Creez un QR Code instantane pour une URL, un reseau Wi-Fi, un email, un numero de telephone ou
            une carte de visite. Personnalisation des couleurs, 4 tailles, telechargement PNG haute
            resolution. Tout fonctionne dans le navigateur, sans inscription.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div
              className="rounded-xl border p-6 shadow-sm"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                  Modeles rapides :
                </span>
                {[
                  { id: "url", label: "URL" },
                  { id: "wifi", label: "Wi-Fi" },
                  { id: "email", label: "Email" },
                  { id: "tel", label: "Telephone" },
                  { id: "sms", label: "SMS" },
                  { id: "vcard", label: "vCard" },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPreset(p.id)}
                    className="rounded-full border px-3 py-1 text-xs font-semibold transition-colors hover:bg-[var(--surface-alt)]"
                    style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <label className="mt-4 block text-sm font-medium" style={{ color: "var(--foreground)" }}>
                Contenu du QR Code
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="URL, texte, email, telephone..."
                className="mt-1 h-24 w-full rounded-lg border p-3 focus:outline-none focus:ring-2"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              />

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    Taille (px)
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none"
                    style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                  >
                    <option value="128">128 x 128</option>
                    <option value="256">256 x 256</option>
                    <option value="512">512 x 512</option>
                    <option value="1024">1024 x 1024</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    Couleur
                  </label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    Fond
                  </label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
              </div>
            </div>

            <div
              className="flex flex-col items-center rounded-xl border p-8 shadow-sm"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <canvas ref={canvasRef} className="rounded-lg border" style={{ borderColor: "var(--border)" }} />
              <button
                onClick={download}
                disabled={!qrDataUrl}
                className="mt-4 rounded-lg px-8 py-3 font-semibold text-white disabled:opacity-50"
                style={{ background: "var(--primary)" }}
              >
                Telecharger PNG
              </button>
            </div>

            <ToolHowToSection
              title="Comment generer un QR Code en 4 etapes"
              description="Le generateur fonctionne entierement dans votre navigateur. Aucun envoi serveur, aucune inscription, aucune limite d'utilisation."
              totalTime="PT30S"
              steps={[
                {
                  name: "Choisir un modele",
                  text:
                    "Cliquez sur l'un des 6 modeles rapides (URL, Wi-Fi, Email, Telephone, SMS, vCard). Le modele Wi-Fi pre-remplit la syntaxe officielle WIFI:T:WPA;S:...;P:...;; reconnue par tous les smartphones recents (iOS 11+, Android 10+).",
                },
                {
                  name: "Personnaliser le contenu",
                  text:
                    "Saisissez votre URL ou votre texte. Pour une URL, incluez systematiquement https:// pour eviter les erreurs de scan. Un QR Code peut contenir jusqu'a environ 4 296 caracteres alphanumeriques mais reste plus rapide a scanner avec moins de 200 caracteres.",
                },
                {
                  name: "Ajuster taille et couleurs",
                  text:
                    "Choisissez 256 px pour un usage ecran, 512 px ou 1024 px pour une impression A4 ou plus. Conservez un contraste eleve entre le code et le fond : un ratio inferieur a 4:1 reduit fortement le taux de reconnaissance des cameras.",
                },
                {
                  name: "Telecharger et tester",
                  text:
                    "Cliquez sur 'Telecharger PNG'. Avant impression ou diffusion, scannez toujours votre QR Code avec deux smartphones differents pour valider la lisibilite, surtout si vous avez modifie les couleurs.",
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
                Cas d&apos;usage les plus courants
              </h2>
              <p className="mt-2" style={{ color: "var(--muted)" }}>
                Voici comment les TPE, restaurateurs, freelances et evenementiels utilisent les QR Codes au
                quotidien depuis 2020.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Menu de restaurant sans contact
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pointez vers une URL hebergee sur Notion, Google Drive ou votre site. Imprimez le QR sur
                    chevalet acrylique en 512 px minimum pour rester scannable a 50 cm de distance.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Wi-Fi invite
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Le modele Wi-Fi connecte automatiquement le smartphone sans saisie de mot de passe. Ideal
                    pour Airbnb, salles d&apos;attente, espaces de coworking. Utilisez un reseau invite
                    distinct du reseau pro.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Carte de visite digitale (vCard)
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Au format vCard 3.0, le QR Code ajoute le contact en 1 scan dans le repertoire iOS ou
                    Android. Plus durable et ecologique qu&apos;une carte papier sur les salons et
                    conferences.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Suivi de campagne marketing
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Encodez une URL avec parametres UTM (?utm_source=flyer&utm_medium=qr) pour mesurer
                    precisement le ROI d&apos;un flyer ou d&apos;un panneau dans Google Analytics.
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
                A savoir avant de creer un QR Code
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Statique vs dynamique.</strong> Le QR Code genere ici est <em>statique</em> : son
                  contenu est encode directement dans la matrice et ne peut plus etre modifie une fois
                  imprime. Si vous prevoyez de changer regulierement la destination (campagne saisonniere,
                  menu evolutif), encodez plutot une URL courte que vous controlez (ex.
                  <code> exemple.fr/menu</code>) et redirigez-la cote serveur.
                </p>
                <p>
                  <strong>Niveau de correction d&apos;erreur.</strong> Le standard ISO/IEC 18004 definit 4
                  niveaux (L 7%, M 15%, Q 25%, H 30%). Le service utilise ici applique le niveau M par
                  defaut, suffisant pour un usage courant. Pour un QR imprime sur emballage souple ou textile,
                  preferez un service permettant le niveau H qui reste lisible meme avec 30% de la surface
                  endommagee.
                </p>
                <p>
                  <strong>Securite.</strong> Un QR Code est neutre : il transporte juste du texte. Le risque
                  vient de la destination. Verifiez toujours l&apos;URL affichee par votre smartphone avant
                  d&apos;ouvrir un lien depuis un QR Code inconnu. La CNIL recommande aussi de prevenir vos
                  utilisateurs lorsque le scan declenche un suivi marketing.
                </p>
                <p>
                  <strong>Aucune dependance externe payante.</strong> Cet outil utilise une API publique
                  gratuite pour la generation visuelle, et tout reste dans votre navigateur. Aucun compte,
                  aucun watermark, aucune limite de generation.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus posees par les utilisateurs sur la generation de QR Codes."
              items={[
                {
                  question: "Le QR Code genere fonctionne-t-il indefiniment ?",
                  answer:
                    "Oui. Un QR Code statique (comme celui produit ici) ne periment pas tant que la destination encodee reste valide. Si vous y mettez une URL, c'est cette URL qui doit rester accessible. Pour du Wi-Fi ou une vCard, le code reste lisible meme dans 10 ans.",
                },
                {
                  question: "Puis-je l'utiliser commercialement ou l'imprimer sur des produits ?",
                  answer:
                    "Oui sans restriction. Les QR Codes sont libres de droit (la norme ISO/IEC 18004 est ouverte) et notre generateur ne place aucun watermark. Vous pouvez les imprimer sur menus, flyers, packaging, t-shirts, signaletique sans payer de licence.",
                },
                {
                  question: "Quelle taille minimale pour un QR Code imprime ?",
                  answer:
                    "Regle empirique : la largeur du QR doit faire au moins 1/10 de la distance de scan. Pour un menu lu a 30 cm, 3 cm suffisent. Pour une affiche lue a 2 metres, prevoyez minimum 20 cm. Generer en 512 px ou 1024 px permet une impression nette jusqu'a 30 cm.",
                },
                {
                  question: "Le scan fonctionne-t-il avec n'importe quelle appli appareil photo ?",
                  answer:
                    "Sur iOS 11+ (2017) et Android 9+ via Google Lens, l'appareil photo natif scanne directement, sans appli tierce. Pour les anciens telephones, n'importe quel lecteur QR gratuit (QR & Barcode Scanner sur Play Store, par exemple) fonctionne.",
                },
                {
                  question: "Les QR Codes colores sont-ils toujours lisibles ?",
                  answer:
                    "Pas toujours. Il faut un fort contraste entre le code et le fond. Le code doit rester plus sombre que le fond (sinon de nombreux lecteurs echouent). Evitez les rouges purs sur fonds verts (deficit de contraste cone) et testez systematiquement avec 2 smartphones avant impression.",
                },
                {
                  question: "Mes donnees Wi-Fi sont-elles envoyees a un serveur ?",
                  answer:
                    "Non. Le QR Code est genere entierement dans votre navigateur via la bibliotheque locale 'qrcode'. Aucune donnee (URL, SSID, mot de passe Wi-Fi, vCard, etc.) n'est envoyee vers un serveur tiers. Vous pouvez meme deconnecter votre acces internet apres le chargement de la page : la generation continue de fonctionner.",
                },
                {
                  question: "Puis-je ajouter mon logo au centre du QR Code ?",
                  answer:
                    "Pas directement avec ce generateur. Pour ajouter un logo, telechargez le QR en 1024 px puis utilisez Photoshop, Canva ou Figma pour superposer votre logo sur 15-20% de la surface centrale au maximum. Au-dela, le code n'est plus lisible meme avec un haut niveau de correction d'erreur.",
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
