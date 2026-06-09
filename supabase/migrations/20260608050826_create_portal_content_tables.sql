/*
# UASA Investor Education Portal — Content Tables

## Summary
Creates four public read-only content tables that back every dynamic section of the
UASA Investor Education Portal frontend. No authentication is required; all data is
intentionally public information.

## New Tables

### slides
Hero carousel items shown at the top of the homepage.
- id (uuid, PK)
- title (text) — headline displayed over the slide image
- subtitle (text) — supporting text beneath the headline
- image_url (text) — full URL to the slide background photo
- cta_text (text) — call-to-action button label
- cta_href (text) — call-to-action button destination
- display_order (int, default 0) — ascending sort order
- is_active (boolean, default true) — hide slides without deleting them
- created_at (timestamptz)

### news_items
Latest-news grid cards on the homepage.
- id (uuid, PK)
- title (text) — article headline
- image_url (text) — card thumbnail
- fallback_image_url (text) — Pexels image shown if primary image fails to load
- category (text) — e.g. Publication, News, Event
- published_date (date) — display date on the card
- content (text, nullable) — full article body (reserved for detail pages)
- created_at (timestamptz)

### members
Arab securities authority member portals grid.
- id (uuid, PK)
- name (text) — authority full name
- country (text) — country display name
- flag (text) — emoji flag
- logo_url (text) — hosted authority logo
- portal_url (text) — link to member's own investor education portal
- display_order (int, default 0)
- created_at (timestamptz)

### portal_categories
The three feature cards (Investor Education, Financial Inclusion, Glossary).
- id (uuid, PK)
- title (text)
- description (text)
- image_url (text)
- fallback_image_url (text)
- icon_name (text) — lucide-react icon name
- color_class (text) — Tailwind bg-* class for the icon badge
- href (text)
- display_order (int, default 0)
- created_at (timestamptz)

## Security
- RLS enabled on all four tables.
- Single SELECT policy per table granting anon + authenticated read access.
- No INSERT/UPDATE/DELETE policies — data is managed via Supabase dashboard / migrations only.
*/

-- ─── slides ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS slides (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text        NOT NULL,
  subtitle      text,
  image_url     text,
  cta_text      text        DEFAULT 'Learn More',
  cta_href      text        DEFAULT '#',
  display_order int         NOT NULL DEFAULT 0,
  is_active     boolean     NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_slides" ON slides;
CREATE POLICY "public_read_slides" ON slides
  FOR SELECT TO anon, authenticated
  USING (true);

-- ─── news_items ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS news_items (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title              text        NOT NULL,
  image_url          text,
  fallback_image_url text,
  category           text        NOT NULL DEFAULT 'News',
  published_date     date,
  content            text,
  created_at         timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_news_items" ON news_items;
CREATE POLICY "public_read_news_items" ON news_items
  FOR SELECT TO anon, authenticated
  USING (true);

-- ─── members ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS members (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text        NOT NULL,
  country       text        NOT NULL,
  flag          text,
  logo_url      text,
  portal_url    text        DEFAULT '#',
  display_order int         NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_members" ON members;
CREATE POLICY "public_read_members" ON members
  FOR SELECT TO anon, authenticated
  USING (true);

-- ─── portal_categories ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS portal_categories (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title              text        NOT NULL,
  description        text,
  image_url          text,
  fallback_image_url text,
  icon_name          text        NOT NULL DEFAULT 'BookOpen',
  color_class        text        NOT NULL DEFAULT 'bg-blue-600',
  href               text        NOT NULL DEFAULT '#',
  display_order      int         NOT NULL DEFAULT 0,
  created_at         timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE portal_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_portal_categories" ON portal_categories;
CREATE POLICY "public_read_portal_categories" ON portal_categories
  FOR SELECT TO anon, authenticated
  USING (true);
