import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://outilis.fr/blog/guide-outils-developpeur",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
