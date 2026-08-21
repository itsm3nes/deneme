"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { saveGallery, uploadGalleryImage } from "../actions";
import { initialAdminState, type AdminState } from "@/lib/admin/state";
import type { BeforeAfterCase, Gallery, Photo } from "@/lib/gallery";
import { Icon } from "@/components/site/Icons";

/**
 * Görseller sunucuya gönderilmeden önce **tarayıcıda** küçültülüp WebP'ye
 * çevrilir. Böylece telefondan çekilmiş 5 MB'lık bir fotoğraf ~200 KB'a iner:
 * Server Action gövde sınırına takılmaz, depo şişmez, site hızlı açılır.
 */
const MAX_EDGE = 1600;
const QUALITY = 0.82;

async function shrinkImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return file;
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", QUALITY),
  );
  if (!blob) return file;
  return new File([blob], "gorsel.webp", { type: "image/webp" });
}

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

type Props = { initial: Gallery };

export function GalleryEditor({ initial }: Props) {
  const [photos, setPhotos] = useState<Photo[]>(initial.photos);
  const [cases, setCases] = useState<BeforeAfterCase[]>(initial.cases);
  const [removed, setRemoved] = useState<string[]>([]);
  const [result, setResult] = useState<AdminState>(initialAdminState);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  const touch = () => {
    setDirty(true);
    setResult(initialAdminState);
  };

  /** Seçilen dosyaları küçültüp sırayla yükler. */
  const upload = async (files: FileList, onDone: (src: string) => void) => {
    for (const file of Array.from(files)) {
      setBusy(file.name);
      try {
        const small = await shrinkImage(file);
        const formData = new FormData();
        formData.append("dosya", small);
        formData.append("ad", file.name.replace(/\.[^.]+$/, ""));
        const response = await uploadGalleryImage(formData);
        if (response.ok) {
          onDone(response.src);
        } else {
          setResult({ status: "error", message: response.message });
        }
      } catch {
        setResult({ status: "error", message: "Görsel işlenemedi." });
      }
    }
    setBusy(null);
  };

  const addPhotos = async (files: FileList) => {
    await upload(files, (src) => {
      setPhotos((prev) => [...prev, { id: newId(), src, alt: "" }]);
      touch();
    });
  };

  const removePhoto = (index: number) => {
    const photo = photos[index];
    if (!confirm("Bu fotoğraf silinsin mi?")) return;
    setRemoved((prev) => [...prev, photo.src]);
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    touch();
  };

  const movePhoto = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= photos.length) return;
    setPhotos((prev) => {
      const copy = [...prev];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
    touch();
  };

  const setCaseImage = async (index: number, key: "before" | "after", files: FileList) => {
    await upload(files, (src) => {
      setCases((prev) => {
        const old = prev[index][key];
        if (old) setRemoved((r) => [...r, old]);
        return prev.map((item, i) => (i === index ? { ...item, [key]: src } : item));
      });
      touch();
    });
  };

  const save = () => {
    startTransition(async () => {
      const response = await saveGallery(
        JSON.stringify({ photos, cases }),
        removed,
      );
      setResult(response);
      if (response.status === "success") {
        setDirty(false);
        setRemoved([]);
      }
    });
  };

  const saveButton = (
    <button
      type="button"
      onClick={save}
      disabled={isPending || !dirty || Boolean(busy)}
      className="btn btn-primary btn-sm"
    >
      {isPending ? "Kaydediliyor…" : dirty ? "Kaydet" : "Kaydedildi"}
    </button>
  );

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Galeri</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-500">
            Klinik fotoğrafları ve öncesi/sonrası vakaları. Görseller yüklenirken
            otomatik küçültülür, sitede hızlı açılacak boyuta getirilir.
          </p>
        </div>
        {saveButton}
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

      {busy ? (
        <p className="mt-5 rounded-xl bg-aqua-50 px-4 py-3 text-sm font-semibold text-aqua-800 ring-1 ring-aqua-100 ring-inset">
          Yükleniyor: {busy}
        </p>
      ) : null}

      {/* ---------- Klinik fotoğrafları ---------- */}
      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold">Klinik fotoğrafları</h2>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={Boolean(busy)}
            className="btn btn-outline btn-sm"
          >
            + Fotoğraf yükle
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(event) => {
              if (event.target.files?.length) addPhotos(event.target.files);
              event.target.value = "";
            }}
          />
        </div>

        <p className="mt-2 text-sm text-ink-500">
          Sıralama sitede de aynıdır: ilk fotoğraflar ana sayfada, tamamı galeri
          sayfasında görünür.
        </p>

        {photos.length === 0 ? (
          <p className="card mt-4 p-6 text-center text-sm text-ink-500">
            Henüz fotoğraf yok. Fotoğraf eklenene kadar sitede kesikli çerçeveli
            yer tutucular görünür.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo, index) => (
              <div key={photo.id} className="card overflow-hidden">
                <div className="relative aspect-4/3 bg-ink-100">
                  <Image
                    src={photo.src}
                    alt={photo.alt || "Yüklenen fotoğraf"}
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <label className="label text-xs" htmlFor={`alt-${photo.id}`}>
                    Açıklama *
                  </label>
                  <input
                    id={`alt-${photo.id}`}
                    className="field py-2 text-sm"
                    value={photo.alt}
                    placeholder="Örn. Bekleme alanı"
                    onChange={(event) => {
                      const value = event.target.value;
                      setPhotos((prev) =>
                        prev.map((item, i) =>
                          i === index ? { ...item, alt: value } : item,
                        ),
                      );
                      touch();
                    }}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => movePhoto(index, -1)}
                        disabled={index === 0}
                        className="rounded-lg px-2 py-1 text-xs font-semibold text-ink-500 hover:bg-ink-100 disabled:opacity-30"
                        aria-label="Öne al"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => movePhoto(index, 1)}
                        disabled={index === photos.length - 1}
                        className="rounded-lg px-2 py-1 text-xs font-semibold text-ink-500 hover:bg-ink-100 disabled:opacity-30"
                        aria-label="Sona al"
                      >
                        →
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---------- Öncesi / sonrası ---------- */}
      <section className="mt-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold">Öncesi / sonrası vakaları</h2>
          <button
            type="button"
            onClick={() => {
              setCases((prev) => [
                ...prev,
                { id: newId(), title: "", note: "", before: "", after: "" },
              ]);
              touch();
            }}
            className="btn btn-outline btn-sm"
          >
            + Vaka ekle
          </button>
        </div>

        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900 ring-1 ring-amber-200 ring-inset">
          Hasta görselleri yalnızca <strong>yazılı aydınlatılmış onam</strong> ile
          yayımlanabilir. Görseller karşılaştırmalı üstünlük iddiası taşımamalıdır.
        </p>

        <div className="mt-4 grid gap-4">
          {cases.map((item, index) => (
            <div key={item.id} className="card p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {(["before", "after"] as const).map((key) => (
                  <div key={key}>
                    <p className="label text-xs">
                      {key === "before" ? "Öncesi" : "Sonrası"}
                    </p>
                    <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-ink-100">
                      {item[key] ? (
                        <Image
                          src={item[key]}
                          alt={`${item.title} ${key === "before" ? "öncesi" : "sonrası"}`}
                          fill
                          sizes="320px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-xs text-ink-400">
                          Görsel yok
                        </span>
                      )}
                    </div>
                    <label className="btn btn-outline btn-sm mt-2 w-full cursor-pointer">
                      {item[key] ? "Değiştir" : "Görsel seç"}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(event) => {
                          if (event.target.files?.length) {
                            setCaseImage(index, key, event.target.files);
                          }
                          event.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label text-xs">Başlık</label>
                  <input
                    className="field py-2 text-sm"
                    value={item.title}
                    placeholder="Örn. Zirkonyum kaplama"
                    onChange={(event) => {
                      const value = event.target.value;
                      setCases((prev) =>
                        prev.map((c, i) => (i === index ? { ...c, title: value } : c)),
                      );
                      touch();
                    }}
                  />
                </div>
                <div>
                  <label className="label text-xs">Açıklama</label>
                  <input
                    className="field py-2 text-sm"
                    value={item.note}
                    placeholder="Örn. Üst çene ön bölge"
                    onChange={(event) => {
                      const value = event.target.value;
                      setCases((prev) =>
                        prev.map((c, i) => (i === index ? { ...c, note: value } : c)),
                      );
                      touch();
                    }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!confirm("Bu vaka silinsin mi?")) return;
                  setRemoved((prev) =>
                    [...prev, item.before, item.after].filter(Boolean),
                  );
                  setCases((prev) => prev.filter((_, i) => i !== index));
                  touch();
                }}
                className="mt-3 text-xs font-semibold text-red-600 hover:underline"
              >
                Vakayı sil
              </button>
            </div>
          ))}

          {cases.length === 0 ? (
            <p className="card p-6 text-center text-sm text-ink-500">
              Henüz vaka yok. Eklenene kadar galeri sayfasındaki bu bölüm örnek
              panellerle görünür.
            </p>
          ) : null}
        </div>
      </section>

      <div className="mt-8 flex items-center justify-end gap-3">
        {dirty ? (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
            <Icon name="clock" className="size-4" />
            Kaydedilmemiş değişiklik var
          </span>
        ) : null}
        {saveButton}
      </div>
    </div>
  );
}
