import { redirect } from "next/navigation";
import { isAuthenticated, isPanelEnabled } from "@/lib/admin/auth";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  if (isPanelEnabled() && (await isAuthenticated())) redirect("/yonetim");

  return (
    <div className="mx-auto max-w-md">
      <div className="card p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold">Yönetim paneli</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          Site içeriğini düzenlemek için parolanızı girin.
        </p>

        {isPanelEnabled() ? (
          <div className="mt-6">
            <LoginForm />
          </div>
        ) : (
          <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-900 ring-1 ring-amber-200 ring-inset">
            <p className="font-bold">Panel henüz açık değil.</p>
            <p className="mt-2">
              Sunucuda <code className="rounded bg-amber-100 px-1">ADMIN_PASSWORD</code>{" "}
              ortam değişkenini tanımlayın (en az 8 karakter). Vercel
              kullanıyorsanız: Project Settings → Environment Variables.
            </p>
            <p className="mt-2">
              Kendi bilgisayarınızda denemek için proje kökündeki{" "}
              <code className="rounded bg-amber-100 px-1">.env.local</code>{" "}
              dosyasına ekleyin:
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-amber-100 p-3 text-xs">
              ADMIN_PASSWORD=uzun-ve-tahmin-edilemez-bir-parola
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
