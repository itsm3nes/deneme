import { customAlphabet, nanoid } from "nanoid";

export const newId = () => nanoid(16);

const slugPart = customAlphabet("abcdefghijkmnpqrstuvwxyz23456789", 10);
const codePart = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

export const newSlug = () => slugPart();
export const newAccessCode = () => codePart();

export function slugify(input: string): string {
  const map: Record<string, string> = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
    Ç: "c",
    Ğ: "g",
    İ: "i",
    Ö: "o",
    Ş: "s",
    Ü: "u",
  };
  return input
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (ch) => map[ch] ?? ch)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export { nanoid };
