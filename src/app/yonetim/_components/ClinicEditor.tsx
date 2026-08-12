"use client";

import { useState, useTransition } from "react";
import { saveClinic } from "../actions";
import { initialAdminState, type AdminState } from "@/lib/admin/state";
import type { Clinic } from "@/lib/clinic";

function Text({
  label,
  value,
  onChange,
  hint,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  hint?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type={type}
        className="field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint ? <p className="hint">{hint}</p> : null}
    </div>
  );
}

export function ClinicEditor({ initial }: { initial: Clinic }) {
  const [data, setData] = useState<Clinic>(initial);
  const [result, setResult] = useState<AdminState>(initialAdminState);
  const [isPending, startTransition] = useTransition();
  const [dirty, setDirty] = useState(false);

  /** İç içe alanları yolla günceller: set("address.street", "…") */
  const set = (path: string, value: unknown) => {
    setData((prev) => {
      const next = structuredClone(prev) as Record<string, unknown>;
      const keys = path.split(".");
      let cursor = next;
      for (const key of keys.slice(0, -1)) {
        cursor = cursor[key] as Record<string, unknown>;
      }
      cursor[keys.at(-1)!] = value;
      return next as unknown as Clinic;
    });
    setDirty(true);
    setResult(initialAdminState);
  };

  const setDay = (index: number, key: "open" | "close", value: string) => {
    const weekly = data.hours.weekly.map((day, i) =>
      i === index ? { ...day, [key]: value || null } : day,
    );
    set("hours.weekly", weekly);
  };

  const toggleClosed = (index: number, closed: boolean) => {
    const weekly = data.hours.weekly.map((day, i) =>
      i === index
        ? closed
          ? { ...day, open: null, close: null }
          : { ...day, open: "09:00", close: "19:00" }
        : day,
    );
    set("hours.weekly", weekly);
  };

  const save = () => {
    startTransition(async () => {
      const response = await saveClinic(JSON.stringify(data));
      setResult(response);
      if (response.status === "success") setDirty(false);
    });
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Klinik bilgileri</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-500">
            Bu bilgiler başlıkta, alt bilgide, iletişim sayfasında ve Google&apos;a
            gönderilen yapılandırılmış veride kullanılır.
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={isPending || !dirty}
          className="btn btn-primary btn-sm"
        >
          {isPending ? "Kaydediliyor…" : dirty ? "Kaydet" : "Kaydedildi"}
        </button>
      </div>

      {result.status !== "idle" ? (
        <p
          role="alert"
          className={`mt-5 rounded-xl px-4 py-3 text-sm font-semibold ring-1 ring-inset ${
            result.status === "success"
              ? "bg-green-50 text-green-800 ring-green-200"
              : "bg-red-50 text-red-700 ring-red-100"
          }`}
        >
          {result.message}
        </p>
      ) : null}

      <div className="mt-6 grid gap-5">
        <section className="card p-5">
          <h2 className="text-sm font-bold text-brand-800">Kimlik</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Text label="Klinik adı" value={data.name} onChange={(v) => set("name", v)} />
            <Text
              label="Kısa ad"
              value={data.shortName}
              onChange={(v) => set("shortName", v)}
              hint="Sekme başlıklarında kullanılır."
            />
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-sm font-bold text-brand-800">İletişim</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Text
              label="Telefon"
              value={data.phone.display}
              onChange={(v) => set("phone.display", v)}
              hint="Arama bağlantısı bu numaradan otomatik üretilir."
            />
            <Text
              label="E-posta"
              value={data.email}
              onChange={(v) => set("email", v)}
              type="email"
            />
            <Text
              label="WhatsApp numarası"
              value={data.whatsapp.number}
              onChange={(v) => set("whatsapp.number", v.replace(/\D/g, ""))}
              hint="Ülke koduyla, boşluksuz. Örn. 905321234567"
            />
            <Text
              label="WhatsApp görünen ad"
              value={data.whatsapp.display}
              onChange={(v) => set("whatsapp.display", v)}
            />
          </div>
          <label className="mt-4 flex items-start gap-3 text-sm text-ink-600">
            <input
              type="checkbox"
              checked={data.whatsapp.verified}
              onChange={(e) => set("whatsapp.verified", e.target.checked)}
              className="mt-0.5 size-4.5 rounded accent-aqua-500"
            />
            <span>WhatsApp numarası doğrulandı (uyarı notunu kaldırır)</span>
          </label>
        </section>

        <section className="card p-5">
          <h2 className="text-sm font-bold text-brand-800">Adres</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Text
              label="Sokak / cadde ve numara"
              value={data.address.street}
              onChange={(v) => set("address.street", v)}
            />
            <Text
              label="İlçe"
              value={data.address.district}
              onChange={(v) => set("address.district", v)}
            />
            <Text label="İl" value={data.address.city} onChange={(v) => set("address.city", v)} />
            <Text
              label="Posta kodu"
              value={data.address.postalCode}
              onChange={(v) => set("address.postalCode", v)}
            />
            <Text
              label="Enlem"
              value={String(data.address.geo.lat)}
              onChange={(v) => set("address.geo.lat", Number(v) || 0)}
              hint="Google Maps'te pine sağ tıklayınca çıkan ilk sayı."
            />
            <Text
              label="Boylam"
              value={String(data.address.geo.lng)}
              onChange={(v) => set("address.geo.lng", Number(v) || 0)}
              hint="İkinci sayı."
            />
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-sm font-bold text-brand-800">Çalışma saatleri</h2>
          <div className="mt-4 grid gap-2">
            {data.hours.weekly.map((day, index) => {
              const closed = !day.open;
              return (
                <div
                  key={day.day}
                  className="flex flex-wrap items-center gap-3 border-b border-ink-100 pb-2 last:border-0"
                >
                  <span className="w-24 text-sm font-semibold text-brand-800">
                    {day.day}
                  </span>
                  {closed ? (
                    <span className="flex-1 text-sm text-ink-400">Kapalı</span>
                  ) : (
                    <div className="flex flex-1 items-center gap-2">
                      <input
                        type="time"
                        className="field w-32 py-2"
                        value={day.open ?? ""}
                        onChange={(e) => setDay(index, "open", e.target.value)}
                      />
                      <span className="text-ink-400">–</span>
                      <input
                        type="time"
                        className="field w-32 py-2"
                        value={day.close ?? ""}
                        onChange={(e) => setDay(index, "close", e.target.value)}
                      />
                    </div>
                  )}
                  <label className="flex items-center gap-2 text-xs text-ink-500">
                    <input
                      type="checkbox"
                      checked={closed}
                      onChange={(e) => toggleClosed(index, e.target.checked)}
                      className="size-4 rounded accent-aqua-500"
                    />
                    Kapalı
                  </label>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid gap-4">
            <Text
              label="Özet metin"
              value={data.hours.summary}
              onChange={(v) => set("hours.summary", v)}
              hint="Üst şeritte ve alt bilgide görünen kısa yazı."
            />
            <Text
              label="Not"
              value={data.hours.note}
              onChange={(v) => set("hours.note", v)}
            />
            <label className="flex items-start gap-3 text-sm text-ink-600">
              <input
                type="checkbox"
                checked={data.hours.verified}
                onChange={(e) => set("hours.verified", e.target.checked)}
                className="mt-0.5 size-4.5 rounded accent-aqua-500"
              />
              <span>
                Saatler klinikten teyit edildi (iletişim sayfasındaki sarı taslak
                notunu kaldırır)
              </span>
            </label>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-sm font-bold text-brand-800">Sosyal medya</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Text
              label="Instagram"
              value={data.social.instagram}
              onChange={(v) => set("social.instagram", v)}
            />
            <Text
              label="Facebook"
              value={data.social.facebook}
              onChange={(v) => set("social.facebook", v)}
            />
          </div>
        </section>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={isPending || !dirty}
          className="btn btn-primary"
        >
          {isPending ? "Kaydediliyor…" : dirty ? "Kaydet" : "Kaydedildi"}
        </button>
      </div>
    </div>
  );
}
