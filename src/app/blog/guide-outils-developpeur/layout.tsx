import { redirectMetadata } from "../_data/metadata";

export const metadata = redirectMetadata("/categories/dev");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
