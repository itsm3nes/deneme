import doctorsJson from "../../content/doctors.json";
import faqsJson from "../../content/faqs.json";
import partnersJson from "../../content/partners.json";
import postsJson from "../../content/posts.json";
import testimonialsJson from "../../content/testimonials.json";

/**
 * Hekim kadrosu, sık sorulan sorular, hasta yorumları, blog yazıları ve
 * anlaşmalı kurumlar. Tümü `content/` altındaki JSON dosyalarında tutulur ve
 * yönetim panelinden (`/yonetim`) düzenlenir.
 */

export type Doctor = {
  slug: string;
  name: string;
  title: string;
  field: string;
  bio: string;
  interests: string[];
  placeholder?: boolean;
};

export type Faq = { q: string; a: string; group: string };

export type Testimonial = {
  name: string;
  city: string;
  text: string;
  treatment: string;
  placeholder?: boolean;
};

export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingMinutes: number;
  category: string;
  /** Basit paragraf/başlık/liste bloklarından oluşan gövde */
  body: PostBlock[];
};

export type Partners = {
  verified: boolean;
  items: { name: string; note: string; source: string }[];
};

export const doctors = doctorsJson as Doctor[];
export const faqs = faqsJson as Faq[];
export const testimonials = testimonialsJson as Testimonial[];
export const posts = postsJson as Post[];
export const partners = partnersJson as Partners;

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
