import { redirectMetadata } from "../_data/metadata";

export const metadata = redirectMetadata("/categories/sante");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
