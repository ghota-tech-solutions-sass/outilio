import { redirectMetadata } from "../_data/metadata";

export const metadata = redirectMetadata("/blog/guide-impots-revenus-2026");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
