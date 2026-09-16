import { getSiteSettings } from "@/db/queries";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { HeroForm } from "@/components/admin/hero-form";

export default async function AdminHeroPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <AdminPageHeader
        title="Hero section"
        description="The homepage hero — ticker strip, background text, and hero media."
      />
      <HeroForm settings={settings} />
    </div>
  );
}
