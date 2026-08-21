import { redirect } from "next/navigation";
import { GalleryEditor } from "../_components/GalleryEditor";
import { isAuthenticated, isPanelEnabled } from "@/lib/admin/auth";
import galleryJson from "../../../../content/gallery.json";
import type { Gallery } from "@/lib/gallery";

export default async function GalleryAdminPage() {
  if (!isPanelEnabled() || !(await isAuthenticated())) redirect("/yonetim/giris");

  return <GalleryEditor initial={galleryJson as Gallery} />;
}
