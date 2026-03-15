import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertisseur de Temperature - Gratuit",
  description:
    "Convertissez entre Celsius, Fahrenheit et Kelvin instantanement. Thermometre visuel et formules de conversion.",
  keywords: ["convertisseur temperature", "celsius fahrenheit", "kelvin celsius", "conversion temperature", "thermometre"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
