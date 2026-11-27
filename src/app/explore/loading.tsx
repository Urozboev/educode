import BrandLoader from "@/components/brand/BrandLoader";

/**
 * Sahifa almashganda: layout (yon menyu) joyida, kontent o'rnida logo
 * animatsiyasi. Next.js uni havola ko'ringanda oldindan yuklab qo'yadi.
 */
export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <BrandLoader />
    </div>
  );
}
