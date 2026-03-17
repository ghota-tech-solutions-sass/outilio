import RelatedTools from "@/components/RelatedTools";
import ShareButtons from "@/components/ShareButtons";
import FavoriteButton from "@/components/FavoriteButton";
import ToolJsonLd from "@/components/ToolJsonLd";

export default function OutilsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="no-print mx-auto max-w-5xl px-5 pt-2 flex justify-end">
        <FavoriteButton />
      </div>
      {children}
      <ShareButtons />
      <RelatedTools />
      <ToolJsonLd />
    </>
  );
}
