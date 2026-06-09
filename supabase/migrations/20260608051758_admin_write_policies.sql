/*
# Admin Write Policies for Content Tables

## Summary
Adds INSERT, UPDATE, and DELETE policies to the four portal content tables so that
authenticated admin users can manage content through the admin dashboard.
Previously only SELECT policies existed (public read-only).

## Changes

### slides — add write policies for authenticated users
- INSERT: authenticated users can add slides
- UPDATE: authenticated users can edit slides
- DELETE: authenticated users can delete slides

### news_items — add write policies for authenticated users
### members — add write policies for authenticated users
### portal_categories — add write policies for authenticated users

## Security
- All write operations are restricted to `authenticated` role only.
- Public (anon) users retain SELECT-only access — no change to read behaviour.
- These policies enable the admin dashboard to perform full CRUD on all content tables.
*/

-- ─── slides ──────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "admin_insert_slides" ON slides;
CREATE POLICY "admin_insert_slides" ON slides FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_slides" ON slides;
CREATE POLICY "admin_update_slides" ON slides FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_slides" ON slides;
CREATE POLICY "admin_delete_slides" ON slides FOR DELETE
  TO authenticated USING (true);

-- ─── news_items ──────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "admin_insert_news_items" ON news_items;
CREATE POLICY "admin_insert_news_items" ON news_items FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_news_items" ON news_items;
CREATE POLICY "admin_update_news_items" ON news_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_news_items" ON news_items;
CREATE POLICY "admin_delete_news_items" ON news_items FOR DELETE
  TO authenticated USING (true);

-- ─── members ─────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "admin_insert_members" ON members;
CREATE POLICY "admin_insert_members" ON members FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_members" ON members;
CREATE POLICY "admin_update_members" ON members FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_members" ON members;
CREATE POLICY "admin_delete_members" ON members FOR DELETE
  TO authenticated USING (true);

-- ─── portal_categories ───────────────────────────────────────────────────────

DROP POLICY IF EXISTS "admin_insert_portal_categories" ON portal_categories;
CREATE POLICY "admin_insert_portal_categories" ON portal_categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_portal_categories" ON portal_categories;
CREATE POLICY "admin_update_portal_categories" ON portal_categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_portal_categories" ON portal_categories;
CREATE POLICY "admin_delete_portal_categories" ON portal_categories FOR DELETE
  TO authenticated USING (true);
