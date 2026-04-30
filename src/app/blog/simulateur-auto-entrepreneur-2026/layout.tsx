import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://outilis.fr/blog/simulateur-auto-entrepreneur-2026",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
