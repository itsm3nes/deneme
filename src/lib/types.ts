export type GalleryStatus = "draft" | "sent" | "completed";

export type Photographer = {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  studio: string | null;
  locale: string;
  created_at: string;
};

export type Gallery = {
  id: string;
  photographer_id: string;
  slug: string;
  title: string;
  description: string | null;
  client_name: string;
  client_email: string | null;
  access_code: string | null;
  min_selections: number | null;
  max_selections: number | null;
  allow_notes: number;
  status: GalleryStatus;
  cover_photo_id: string | null;
  created_at: string;
  submitted_at: string | null;
  reopened_at: string | null;
};

export type Photo = {
  id: string;
  gallery_id: string;
  original_name: string;
  base_name: string;
  stored_name: string;
  thumb_name: string;
  mime: string;
  bytes: number;
  width: number | null;
  height: number | null;
  position: number;
  created_at: string;
};

export type Selection = {
  gallery_id: string;
  photo_id: string;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type GallerySummary = Gallery & {
  photo_count: number;
  selected_count: number;
};
