
CREATE OR REPLACE FUNCTION get_nearby_listings(
  user_lat FLOAT,
  user_lng FLOAT,
  max_dist_meters FLOAT DEFAULT 1000,
  category_filter TEXT[] DEFAULT NULL,
  size_filter TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  category clothing_category,
  size TEXT,
  condition clothing_condition,
  location GEOGRAPHY(POINT, 4326),
  user_id UUID,
  distance FLOAT
) AS 76681
BEGIN
  RETURN QUERY
  SELECT 
    l.id, 
    l.title, 
    l.category, 
    l.size, 
    l.condition, 
    l.location, 
    l.user_id,
    ST_Distance(l.location, ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography) as distance
  FROM listings l
  WHERE l.status = 'AVAILABLE'
    AND ST_DWithin(l.location, ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography, max_dist_meters)
    AND (category_filter IS NULL OR l.category = ANY(category_filter))
    AND (size_filter IS NULL OR l.size = ANY(size_filter))
  ORDER BY distance ASC;
END;
76681 LANGUAGE plpgsql;

