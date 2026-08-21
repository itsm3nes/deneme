import { notFound, redirect } from "next/navigation";
import { ItemsEditor } from "../../_components/ItemsEditor";
import { isAuthenticated, isPanelEnabled } from "@/lib/admin/auth";
import { sections, type ListSectionId } from "@/lib/admin/sections";
import { doctors, faqs, posts, testimonials } from "@/lib/content";
import { treatments } from "@/lib/treatments";

const data: Record<ListSectionId, unknown[]> = {
  doctors,
  faqs,
  testimonials,
  treatments,
  posts,
};

/**
 * `PageProps<...>` yerine açık tip kullanılıyor: statik dışa aktarımda bu
 * klasör yayımlanmadığı için üretilen adres tiplerinde yer almaz.
 */
export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  if (!isPanelEnabled() || !(await isAuthenticated())) redirect("/yonetim/giris");

  const { section: sectionId } = await params;
  const section = sections[sectionId as ListSectionId];
  if (!section) notFound();

  return (
    <ItemsEditor
      section={section}
      initialItems={data[sectionId as ListSectionId] as Record<string, unknown>[]}
    />
  );
}
