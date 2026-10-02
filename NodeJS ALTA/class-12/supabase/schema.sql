-- Enable PostGIS extension for location-based discovery
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. PROFILES
-- Extends auth.users. Store privacy-preserving location and general preferences.
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  location GEOGRAPHY(POINT, 4326), -- Approximate location
  bio TEXT,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  completed_exchanges_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. LISTINGS
CREATE TYPE listing_status AS ENUM ('AVAILABLE', 'PENDING_EXCHANGE', 'EXCHANGED', 'REMOVED');
CREATE TYPE clothing_category AS ENUM ('T-shirt', 'Shirt', 'Hoodie', 'Sweatshirt', 'Jacket', 'Jeans', 'Trousers');
CREATE TYPE clothing_condition AS ENUM ('Like New', 'Good', 'Fair');

CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category clothing_category NOT NULL,
  size TEXT NOT NULL,
  condition clothing_condition NOT NULL,
  color TEXT,
  style TEXT,
  brand TEXT,
  status listing_status DEFAULT 'AVAILABLE',
  location GEOGRAPHY(POINT, 4326) NOT NULL, -- Store listing location (can be same as profile or specific)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. LISTING IMAGES
CREATE TABLE listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. EXCHANGE PREFERENCES
-- What the user is looking for in exchange
CREATE TABLE exchange_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  preferred_category clothing_category[],
  preferred_size TEXT[],
  preferred_style TEXT[],
  open_to_alternatives BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. OFFERS
CREATE TYPE offer_status AS ENUM ('SENT', 'ACCEPTED', 'DECLINED', 'CANCELLED');

CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  offered_listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  requested_listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  message TEXT,
  status offer_status DEFAULT 'SENT',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT different_users CHECK (sender_id <> receiver_id)
);

-- 6. EXCHANGES
CREATE TYPE exchange_status AS ENUM (
  'ACCEPTED',
  'MEETING_PENDING',
  'MEETING_CONFIRMED',
  'EXCHANGE_PENDING',
  'COMPLETED',
  'CANCELLED'
);

CREATE TABLE exchanges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE NOT NULL,
  user_a UUID REFERENCES profiles(id) NOT NULL,
  user_b UUID REFERENCES profiles(id) NOT NULL,
  status exchange_status DEFAULT 'ACCEPTED',
  meeting_date DATE,
  meeting_time TIME,
  meeting_area TEXT, -- Public location description
  user_a_confirmed BOOLEAN DEFAULT FALSE,
  user_b_confirmed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. RATINGS
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exchange_id UUID REFERENCES exchanges(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exchange_id, reviewer_id)
);

-- 8. SAVED LISTINGS
CREATE TABLE saved_listings (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, listing_id)
);

-- 9. NOTIFICATIONS
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- e.g., 'OFFER_RECEIVED', 'OFFER_ACCEPTED'
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. REPORTS
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  target_id UUID NOT NULL, -- Can be listing_id or user_id
  target_type TEXT NOT NULL CHECK (target_type IN ('listing', 'user')),
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'pending', -- pending, reviewed, resolved
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES for performance
CREATE INDEX idx_listings_location ON listings USING GIST (location);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_size ON listings(size);
CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_exchanges_status ON exchanges(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- ROW LEVEL SECURITY (RLS)
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchanges ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- POLICIES
-- Profiles: Anyone can view, only owner can edit
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Listings: Anyone can view AVAILABLE, only owner can edit/delete
CREATE POLICY "Listings are viewable by everyone" ON listings FOR SELECT USING (true);
CREATE POLICY "Users can insert own listings" ON listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own listings" ON listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own listings" ON listings FOR DELETE USING (auth.uid() = user_id);

-- Listing Images: Viewable by everyone, owner can manage
CREATE POLICY "Listing images are viewable by everyone" ON listing_images FOR SELECT USING (true);
CREATE POLICY "Users can insert images for own listings" ON listing_images FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete images for own listings" ON listing_images FOR DELETE USING (
  EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND user_id = auth.uid())
);

-- Exchange Preferences: Viewable by everyone (for matching), owner can edit
CREATE POLICY "Exchange preferences are viewable by everyone" ON exchange_preferences FOR SELECT USING (true);
CREATE POLICY "Users can manage own preferences" ON exchange_preferences FOR ALL USING (auth.uid() = user_id);

-- Offers: Only sender and receiver can see/manage
CREATE POLICY "Offers are viewable by participants" ON offers FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can create offers" ON offers FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own offers" ON offers FOR UPDATE USING (auth.uid() = sender_id);

-- Exchanges: Only participants can see/manage
CREATE POLICY "Exchanges are viewable by participants" ON exchanges FOR SELECT USING (auth.uid() = user_a OR auth.uid() = user_b);
CREATE POLICY "Participants can update exchange details" ON exchanges FOR UPDATE USING (auth.uid() = user_a OR auth.uid() = user_b);

-- Ratings: Viewable by everyone, only participant can rate
CREATE POLICY "Ratings are viewable by everyone" ON ratings FOR SELECT USING (true);
CREATE POLICY "Participants can create ratings" ON ratings FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM exchanges WHERE id = exchange_id AND (user_a = auth.uid() OR user_b = auth.uid()))
);

-- Saved Listings: Only owner can see/manage
CREATE POLICY "Users can manage own saved listings" ON saved_listings FOR ALL USING (auth.uid() = user_id);

-- Notifications: Only owner can see/manage
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- Reports: Only reporter and admin can see
CREATE POLICY "Users can create reports" ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Reporters can view own reports" ON reports FOR SELECT USING (auth.uid() = reporter_id);
