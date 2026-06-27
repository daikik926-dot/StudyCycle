-- ================================================================
-- StudyCycle データベーススキーマ
-- Supabase Dashboard → SQL Editor に貼り付けて実行してください
-- ================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  handle      TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  faculty     TEXT,
  year        INTEGER,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  rating      NUMERIC(3, 2) NOT NULL DEFAULT 0,
  items_listed    INTEGER NOT NULL DEFAULT 0,
  items_purchased INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, handle, display_name, is_verified)
  VALUES (
    NEW.id,
    split_part(NEW.email, '@', 1),
    split_part(NEW.email, '@', 1),
    NEW.email LIKE '%.ac.jp'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TABLE IF NOT EXISTS textbooks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  isbn            TEXT,
  title           TEXT NOT NULL,
  author          TEXT,
  course          TEXT,
  professor       TEXT,
  price           INTEGER NOT NULL CHECK (price >= 0),
  condition       TEXT,
  has_senior_notes BOOLEAN NOT NULL DEFAULT FALSE,
  cover_url       TEXT,
  status          TEXT NOT NULL DEFAULT 'available'
                    CHECK (status IN ('available', 'reserved', 'sold')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  textbook_id  UUID NOT NULL REFERENCES textbooks(id) ON DELETE CASCADE,
  sender_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  sender_type  TEXT NOT NULL CHECK (sender_type IN ('buyer', 'seller', 'system')),
  content      TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coupons (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  coupon_type  TEXT NOT NULL CHECK (coupon_type IN ('cafe-10', 'bookstore-300')),
  serial_code  TEXT UNIQUE NOT NULL,
  is_used      BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at   TIMESTAMPTZ NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE textbooks  ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: public read"   ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles: owner update"  ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "textbooks: public read"     ON textbooks FOR SELECT USING (TRUE);
CREATE POLICY "textbooks: auth insert"     ON textbooks FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "textbooks: owner update"    ON textbooks FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "textbooks: owner delete"    ON textbooks FOR DELETE USING (auth.uid() = seller_id);
CREATE POLICY "messages: auth read"   ON messages FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "messages: auth insert" ON messages FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "coupons: owner read" ON coupons FOR SELECT USING (auth.uid() = user_id);

-- Supabase Dashboard → Storage で "textbook-covers" バケットを作成（Public: ON）
