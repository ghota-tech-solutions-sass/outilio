import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertisseur de Température - Gratuit",
  description:
    "Convertissez entre Celsius, Fahrenheit et Kelvin instantanément. Thermomètre visuel et formules de conversion.",
  keywords: ["convertisseur temperature", "celsius fahrenheit", "kelvin celsius", "conversion temperature", "thermometre"],
  alternates: { canonical: "https://outilis.fr/outils/convertisseur-temperature" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
