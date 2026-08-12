import { redirect } from "next/navigation";
import { ClinicEditor } from "../_components/ClinicEditor";
import { isAuthenticated, isPanelEnabled } from "@/lib/admin/auth";
import clinicJson from "../../../../content/clinic.json";
import type { Clinic } from "@/lib/clinic";

export default async function ClinicPage() {
  if (!isPanelEnabled() || !(await isAuthenticated())) redirect("/yonetim/giris");

  // Türetilmiş alanlar (siteUrl vb.) yerine ham JSON düzenlenir.
  return <ClinicEditor initial={clinicJson as Clinic} />;
}
