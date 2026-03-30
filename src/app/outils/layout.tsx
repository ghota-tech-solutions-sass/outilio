import RelatedTools from "@/components/RelatedTools";
import ShareButtons from "@/components/ShareButtons";
import FavoriteButton from "@/components/FavoriteButton";
import ToolJsonLd from "@/components/ToolJsonLd";
import LastUpdated from "@/components/LastUpdated";

export default function OutilsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="no-print mx-auto max-w-7xl px-6 2xl:max-w-[1400px] pt-2 flex items-center justify-between">
        <LastUpdated />
        <FavoriteButton />
      </div>
      {children}
      <ShareButtons />
      <RelatedTools />
      <ToolJsonLd />
    </>
  );
}
