"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

type Mode = "libre" | "wifi" | "vcard";
type EcLevel = "L" | "M" | "Q" | "H";

interface WifiData {
  ssid: string;
  password: string;
  security: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

interface VcardData {
  nom: string;
  prenom: string;
  org: string;
  tel: string;
  email: string;
  url: string;
}

/** Échappement du format WIFI: (caractères spéciaux \ ; , " :) */
function escapeWifi(v: string): string {
  return v.replace(/([\\;,":])/g, "\\$1");
}

/** Échappement des valeurs texte vCard 3.0 (RFC 2426) : \ , ; et retours à la ligne */
function escapeVcard(v: string): string {
  return v
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\r\n|\r|\n/g, "\\n");
}

function buildWifi(w: WifiData): string {
  if (!w.ssid.trim()) return "";
  const parts = [`T:${w.security}`, `S:${escapeWifi(w.ssid)}`];
  if (w.security !== "nopass") parts.push(`P:${escapeWifi(w.password)}`);
  if (w.hidden) parts.push("H:true");
  return `WIFI:${parts.join(";")};;`;
}

function buildVcard(v: VcardData): string {
  const fn = [v.prenom.trim(), v.nom.trim()].filter(Boolean).join(" ");
  if (!fn && !v.org.trim()) return "";
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVcard(v.nom.trim())};${escapeVcard(v.prenom.trim())};;;`,
    `FN:${escapeVcard(fn || v.org.trim())}`,
  ];
  if (v.org.trim()) lines.push(`ORG:${escapeVcard(v.org.trim())}`);
  if (v.tel.trim()) lines.push(`TEL;TYPE=CELL:${v.tel.trim().replace(/[\r\n]/g, "")}`);
  if (v.email.trim()) lines.push(`EMAIL;TYPE=INTERNET:${v.email.trim().replace(/[\r\n]/g, "")}`);
  if (v.url.trim()) lines.push(`URL:${v.url.trim().replace(/[\r\n]/g, "")}`);
  lines.push("END:VCARD");
  return lines.join("\r\n");
}

export default function GenerateurQRCode() {
  const [mode, setMode] = useState<Mode>("libre");
  const [text, setText] = useState("https://outilis.fr");
  const [wifi, setWifi] = useState<WifiData>({ ssid: "", password: "", security: "WPA", hidden: false });
  const [vcard, setVcard] = useState<VcardData>({ nom: "", prenom: "", org: "", tel: "", email: "", url: "" });
  const [size, setSize] = useState("256");
  const [ecLevel, setEcLevel] = useState<EcLevel>("M");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [error, setError] = useState("");

  const content = mode === "wifi" ? buildWifi(wifi) : mode === "vcard" ? buildVcard(vcard) : text;

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    const clearCanvas = () => {
      if (!canvas) return;
      canvas.width = 0;
      canvas.height = 0;
    };

    if (!content.trim()) {
      // Pas de contenu : on vide l'aperçu et le lien de téléchargement
      Promise.resolve().then(() => {
        if (cancelled) return;
        setQrDataUrl("");
        setError("");
        clearCanvas();
      });
      return () => {
        cancelled = true;
      };
    }

    const s = parseInt(size) || 256;
    QRCode.toDataURL(content, {
      width: s,
      margin: 2,
      color: { dark: color, light: bgColor },
      errorCorrectionLevel: ecLevel,
    })
      .then((url) => {
        if (cancelled) return;
        setQrDataUrl(url);
        setError("");
        if (!canvas) return;
        const img = new Image();
        img.onload = () => {
          if (cancelled) return;
          canvas.width = s;
          canvas.height = s;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.drawImage(img, 0, 0, s, s);
        };
        img.src = url;
      })
      .catch(() => {
        if (cancelled) return;
        setQrDataUrl("");
        clearCanvas();
        setError(
          "Contenu trop long pour un QR Code avec ce niveau de correction. Raccourcissez le texte ou choisissez un niveau de correction plus bas (L ou M)."
        );
      });

    return () => {
      cancelled = true;
    };
  }, [content, size, color, bgColor, ecLevel]);

  const download = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = mode === "wifi" ? "qrcode-wifi.png" : mode === "vcard" ? "qrcode-vcard.png" : "qrcode.png";
    a.click();
  };

  const setPreset = (preset: string) => {
    if (preset === "wifi") {
      setMode("wifi");
      return;
    }
    if (preset === "vcard") {
      setMode("vcard");
      return;
    }
    setMode("libre");
    if (preset === "email") setText("mailto:contact@exemple.fr?subject=Bonjour");
    else if (preset === "tel") setText("tel:+33612345678");
    else if (preset === "sms") setText("sms:+33612345678?body=Bonjour");
    else setText("https://outilis.fr");
  };

  const inputClass = "mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none";
  const inputStyle = { borderColor: "var(--border)", background: "var(--surface)" };

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
            Générateur de QR Code gratuit
          </h1>
          <p className="animate-fade-up stagger-2 mt-2 max-w-3xl" style={{ color: "var(--muted)" }}>
            Créez un QR Code instantané pour une URL, un réseau Wi-Fi, un email, un numéro de téléphone ou
            une carte de visite. Personnalisation des couleurs, 4 tailles, téléchargement PNG haute
            résolution. Tout fonctionne dans le navigateur, sans inscription.
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
                  Modèles rapides :
                </span>
                {[
                  { id: "url", label: "URL" },
                  { id: "wifi", label: "Wi-Fi" },
                  { id: "email", label: "Email" },
                  { id: "tel", label: "Téléphone" },
                  { id: "sms", label: "SMS" },
                  { id: "vcard", label: "vCard" },
                ].map((p) => {
                  const active =
                    (p.id === "wifi" && mode === "wifi") || (p.id === "vcard" && mode === "vcard");
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPreset(p.id)}
                      className="rounded-full border px-3 py-1 text-xs font-semibold transition-colors hover:bg-[var(--surface-alt)]"
                      style={{
                        borderColor: active ? "var(--primary)" : "var(--border)",
                        color: active ? "var(--primary)" : "var(--foreground)",
                      }}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>

              {mode === "libre" && (
                <>
                  <label className="mt-4 block text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    Contenu du QR Code
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="URL, texte, email, téléphone..."
                    className="mt-1 h-24 w-full rounded-lg border p-3 focus:outline-none focus:ring-2"
                    style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                  />
                </>
              )}

              {mode === "wifi" && (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                      Nom du réseau (SSID)
                    </label>
                    <input
                      type="text"
                      value={wifi.ssid}
                      onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
                      placeholder="MaBox-Invités"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                      Sécurité
                    </label>
                    <select
                      value={wifi.security}
                      onChange={(e) => setWifi({ ...wifi, security: e.target.value as WifiData["security"] })}
                      className={inputClass}
                      style={inputStyle}
                    >
                      <option value="WPA">WPA / WPA2 / WPA3</option>
                      <option value="WEP">WEP (obsolète)</option>
                      <option value="nopass">Aucune (réseau ouvert)</option>
                    </select>
                  </div>
                  {wifi.security !== "nopass" && (
                    <div>
                      <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                        Mot de passe
                      </label>
                      <input
                        type="text"
                        value={wifi.password}
                        onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                        autoComplete="off"
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                  )}
                  <label className="flex items-center gap-2 self-end pb-2 text-sm" style={{ color: "var(--foreground)" }}>
                    <input
                      type="checkbox"
                      checked={wifi.hidden}
                      onChange={(e) => setWifi({ ...wifi, hidden: e.target.checked })}
                      style={{ accentColor: "var(--primary)" }}
                    />
                    Réseau masqué
                  </label>
                  <p className="sm:col-span-2 text-xs" style={{ color: "var(--muted)" }}>
                    Les caractères spéciaux (\ ; , &quot; :) du nom et du mot de passe sont échappés
                    automatiquement selon le format WIFI: reconnu par iOS et Android.
                  </p>
                </div>
              )}

              {mode === "vcard" && (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {(
                    [
                      { key: "prenom", label: "Prénom", type: "text" },
                      { key: "nom", label: "Nom", type: "text" },
                      { key: "org", label: "Entreprise", type: "text" },
                      { key: "tel", label: "Téléphone", type: "tel" },
                      { key: "email", label: "Email", type: "email" },
                      { key: "url", label: "Site web", type: "url" },
                    ] as { key: keyof VcardData; label: string; type: string }[]
                  ).map((f) => (
                    <div key={f.key}>
                      <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                        {f.label}
                      </label>
                      <input
                        type={f.type}
                        value={vcard[f.key]}
                        onChange={(e) => setVcard({ ...vcard, [f.key]: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                  ))}
                  <p className="sm:col-span-2 text-xs" style={{ color: "var(--muted)" }}>
                    Carte au format vCard 3.0 (champs N et FN inclus, virgules et points-virgules échappés).
                  </p>
                </div>
              )}

              {mode !== "libre" && content && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-xs font-semibold" style={{ color: "var(--muted)" }}>
                    Voir le contenu encodé
                  </summary>
                  <pre
                    className="mt-2 overflow-x-auto whitespace-pre-wrap break-all rounded-lg p-3 text-xs"
                    style={{ background: "var(--surface-alt)" }}
                  >
                    {content}
                  </pre>
                </details>
              )}

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div>
                  <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    Taille (px)
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                  >
                    <option value="128">128 x 128</option>
                    <option value="256">256 x 256</option>
                    <option value="512">512 x 512</option>
                    <option value="1024">1024 x 1024</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    Correction d&apos;erreur
                  </label>
                  <select
                    value={ecLevel}
                    onChange={(e) => setEcLevel(e.target.value as EcLevel)}
                    className={inputClass}
                    style={inputStyle}
                  >
                    <option value="L">L (7 %)</option>
                    <option value="M">M (15 %)</option>
                    <option value="Q">Q (25 %)</option>
                    <option value="H">H (30 %)</option>
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
              <canvas
                ref={canvasRef}
                className="rounded-lg border"
                style={{
                  borderColor: "var(--border)",
                  maxWidth: "100%",
                  height: "auto",
                  display: qrDataUrl ? "block" : "none",
                }}
              />
              {!qrDataUrl && !error && (
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  {mode === "wifi"
                    ? "Saisissez le nom du réseau pour générer le QR Code."
                    : mode === "vcard"
                      ? "Saisissez au moins un nom ou une entreprise pour générer le QR Code."
                      : "Saisissez un contenu pour générer le QR Code."}
                </p>
              )}
              {error && (
                <p className="text-sm" style={{ color: "#dc2626" }} role="alert">
                  {error}
                </p>
              )}
              <button
                onClick={download}
                disabled={!qrDataUrl}
                className="mt-4 rounded-lg px-8 py-3 font-semibold text-white disabled:opacity-50"
                style={{ background: "var(--primary)" }}
              >
                Télécharger PNG
              </button>
            </div>

            <ToolHowToSection
              title="Comment générer un QR Code en 4 étapes"
              description="Le générateur fonctionne entièrement dans votre navigateur. Le contenu saisi n'est envoyé à aucun serveur, sans inscription ni limite d'utilisation."
              totalTime="PT30S"
              steps={[
                {
                  name: "Choisir un modèle",
                  text:
                    "Cliquez sur l'un des 6 modèles rapides (URL, Wi-Fi, Email, Téléphone, SMS, vCard). Les modèles Wi-Fi et vCard affichent un formulaire dédié qui produit la syntaxe standard (WIFI:T:WPA;S:...;P:...;; ou vCard 3.0), reconnue par l'appareil photo des smartphones récents (iOS 11+, Android 10+).",
                },
                {
                  name: "Personnaliser le contenu",
                  text:
                    "Saisissez votre URL ou votre texte. Pour une URL, incluez systématiquement https:// pour éviter les erreurs de scan. Un QR Code peut contenir jusqu'à environ 4 296 caractères alphanumériques (niveau L), mais reste plus rapide à scanner avec moins de 200 caractères.",
                },
                {
                  name: "Ajuster taille, correction et couleurs",
                  text:
                    "Choisissez 256 px pour un usage écran, 512 px ou 1024 px pour une impression A4 ou plus. Le niveau de correction M convient à la plupart des usages ; H est préférable pour un support qui risque d'être abîmé. Conservez un contraste élevé entre le code (foncé) et le fond (clair).",
                },
                {
                  name: "Télécharger et tester",
                  text:
                    "Cliquez sur « Télécharger PNG ». Avant impression ou diffusion, scannez toujours votre QR Code avec deux smartphones différents pour valider la lisibilité, surtout si vous avez modifié les couleurs.",
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
                Voici comment les TPE, restaurateurs, freelances et organisateurs d&apos;événements utilisent les
                QR Codes au quotidien.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Menu de restaurant sans contact
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pointez vers une URL hébergée sur Notion, Google Drive ou votre site. Imprimez le QR sur
                    chevalet acrylique en 512 px minimum pour rester scannable à 50 cm de distance.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Wi-Fi invité
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Le modèle Wi-Fi connecte le smartphone sans saisie du mot de passe. Idéal pour Airbnb,
                    salles d&apos;attente, espaces de coworking. Utilisez un réseau invité distinct du réseau
                    pro : toute personne qui photographie le QR Code obtient le mot de passe.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Carte de visite digitale (vCard)
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Au format vCard 3.0, le QR Code propose d&apos;ajouter le contact en 1 scan dans le
                    répertoire iOS ou Android. Pratique sur les salons et conférences.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Suivi de campagne marketing
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Encodez une URL avec paramètres UTM (?utm_source=flyer&amp;utm_medium=qr) pour mesurer
                    le trafic généré par un flyer ou un panneau dans votre outil d&apos;analyse d&apos;audience.
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
                À savoir avant de créer un QR Code
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Statique vs dynamique.</strong> Le QR Code généré ici est <em>statique</em> : son
                  contenu est encodé directement dans la matrice et ne peut plus être modifié une fois
                  imprimé. Si vous prévoyez de changer régulièrement la destination (campagne saisonnière,
                  menu évolutif), encodez plutôt une URL courte que vous contrôlez (ex.
                  <code> exemple.fr/menu</code>) et redirigez-la côté serveur.
                </p>
                <p>
                  <strong>Niveau de correction d&apos;erreur.</strong> La norme ISO/IEC 18004 définit 4
                  niveaux (L 7 %, M 15 %, Q 25 %, H 30 %). L&apos;outil applique le niveau M par défaut,
                  suffisant pour un usage courant. Pour un QR imprimé sur emballage souple ou textile,
                  choisissez le niveau H, qui reste lisible même avec environ 30 % de la surface
                  endommagée (au prix d&apos;un code plus dense).
                </p>
                <p>
                  <strong>Sécurité.</strong> Un QR Code est neutre : il transporte juste du texte. Le risque
                  vient de la destination. Vérifiez toujours l&apos;URL affichée par votre smartphone avant
                  d&apos;ouvrir un lien depuis un QR Code inconnu. Si le lien encodé déclenche un suivi
                  (paramètres UTM, outil de mesure), informez-en vos utilisateurs dans votre politique de
                  confidentialité.
                </p>
                <p>
                  <strong>Génération 100 % locale.</strong> Le QR Code est calculé dans votre navigateur par
                  la bibliothèque open source « qrcode ». Le contenu saisi (URL, mot de passe Wi-Fi,
                  vCard) n&apos;est envoyé à aucun serveur. Aucun compte, aucun filigrane, aucune limite de
                  génération.
                </p>
              </div>
            </section>

            <ToolFaqSection
              title="Questions fréquentes"
              intro="Les questions les plus posées par les utilisateurs sur la génération de QR Codes."
              items={[
                {
                  question: "Le QR Code généré fonctionne-t-il indéfiniment ?",
                  answer:
                    "Oui. Un QR Code statique (comme celui produit ici) ne se périme pas tant que la destination encodée reste valide. Si vous y mettez une URL, c'est cette URL qui doit rester accessible. Pour du Wi-Fi ou une vCard, le code reste lisible tant que les informations encodées sont à jour.",
                },
                {
                  question: "Puis-je l'utiliser commercialement ou l'imprimer sur des produits ?",
                  answer:
                    "Oui. Denso Wave, l'inventeur du QR Code, a choisi de ne pas exercer ses droits de brevet sur le format standardisé (ISO/IEC 18004) et notre générateur n'ajoute aucun filigrane. Vous pouvez imprimer vos QR Codes sur menus, flyers, emballages ou textiles. Notez simplement que « QR Code » est une marque déposée de Denso Wave.",
                },
                {
                  question: "Quelle taille minimale pour un QR Code imprimé ?",
                  answer:
                    "Règle empirique : la largeur du QR doit faire au moins 1/10 de la distance de scan. Pour un menu lu à 30 cm, 3 cm suffisent. Pour une affiche lue à 2 mètres, prévoyez au minimum 20 cm. Générer en 512 px ou 1024 px permet une impression nette jusqu'à environ 30 cm.",
                },
                {
                  question: "Le scan fonctionne-t-il avec n'importe quelle appli appareil photo ?",
                  answer:
                    "Sur iOS 11+ et sur la plupart des Android récents (appareil photo natif ou Google Lens), le scan fonctionne sans appli tierce. Pour les anciens téléphones, n'importe quel lecteur QR gratuit fait l'affaire.",
                },
                {
                  question: "Les QR Codes colorés sont-ils toujours lisibles ?",
                  answer:
                    "Pas toujours. Il faut un fort contraste entre le code et le fond, et le code doit rester plus sombre que le fond (sinon de nombreux lecteurs échouent). Évitez les couleurs proches (rouge sur vert, jaune sur blanc) et testez systématiquement avec 2 smartphones avant impression.",
                },
                {
                  question: "Mes données Wi-Fi sont-elles envoyées à un serveur ?",
                  answer:
                    "Non. Le QR Code est généré entièrement dans votre navigateur via la bibliothèque locale « qrcode ». Aucune donnée saisie (URL, SSID, mot de passe Wi-Fi, vCard, etc.) n'est envoyée à un serveur. Vous pouvez même couper votre connexion internet après le chargement de la page : la génération continue de fonctionner.",
                },
                {
                  question: "Puis-je ajouter mon logo au centre du QR Code ?",
                  answer:
                    "Pas directement avec ce générateur. Générez le QR en 1024 px avec le niveau de correction H, puis superposez votre logo avec Canva, Figma ou un autre éditeur sur 15 à 20 % de la surface centrale au maximum. Au-delà, le code risque de ne plus être lisible.",
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
