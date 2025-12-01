-- Migration: Add missing columns to locality_baselines for tiered caching

-- Add min_rate column
ALTER TABLE locality_baselines
ADD COLUMN IF NOT EXISTS min_rate NUMERIC;

-- Add max_rate column
ALTER TABLE locality_baselines
ADD COLUMN IF NOT EXISTS max_rate NUMERIC;

-- Add variance column (calculated as percentage)
ALTER TABLE locality_baselines
ADD COLUMN IF NOT EXISTS variance NUMERIC DEFAULT 0;

-- Add confidence_score column
ALTER TABLE locality_baselines
ADD COLUMN IF NOT EXISTS confidence_score NUMERIC DEFAULT 0;

-- Update existing rows with default values
UPDATE locality_baselines
SET 
  min_rate = median_rate * 0.8,  -- Estimate: 20% below median
  max_rate = median_rate * 1.2,  -- Estimate: 20% above median
  variance = 0,
  confidence_score = CASE
    WHEN sample_size >= 15 THEN 85
    WHEN sample_size >= 5 THEN 65
    ELSE 45
  END
WHERE min_rate IS NULL;

-- Create function to calculate variance and confidence
CREATE OR REPLACE FUNCTION calculate_baseline_stats(p_locality TEXT)
RETURNS void AS $$
DECLARE
  v_median NUMERIC;
  v_min NUMERIC;
  v_max NUMERIC;
  v_count INTEGER;
  v_variance NUMERIC;
  v_confidence NUMERIC;
BEGIN
  -- Calculate stats from search history
  SELECT 
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY land_rate),
    MIN(land_rate),
    MAX(land_rate),
    COUNT(*)
  INTO v_median, v_min, v_max, v_count
  FROM locality_search_history
  WHERE locality = p_locality
    AND search_date > CURRENT_DATE - 90;  -- Last 90 days
  
  -- Calculate variance as percentage
  IF v_median > 0 AND v_count > 1 THEN
    v_variance := ((v_max - v_min) / v_median) * 100;
  ELSE
    v_variance := 0;
  END IF;
  
  -- Calculate confidence score
  v_confidence := 50;  -- Base score
  
  -- Sample size bonus
  IF v_count >= 15 THEN
    v_confidence := v_confidence + 30;
  ELSIF v_count >= 5 THEN
    v_confidence := v_confidence + 20;
  ELSIF v_count >= 3 THEN
    v_confidence := v_confidence + 10;
  ELSE
    v_confidence := v_confidence + 5;
  END IF;
  
  -- Variance bonus (only if enough samples)
  IF v_count >= 3 THEN
    IF v_variance <= 10 THEN
      v_confidence := v_confidence + 20;
    ELSIF v_variance <= 20 THEN
      v_confidence := v_confidence + 10;
    ELSE
      v_confidence := v_confidence - 10;
    END IF;
  END IF;
  
  -- Cap for small samples
  IF v_count < 5 THEN
    v_confidence := LEAST(v_confidence, 55);
  END IF;
  
  -- Update or insert baseline
  INSERT INTO locality_baselines (
    locality,
    median_rate,
    min_rate,
    max_rate,
    variance,
    sample_size,
    confidence_score,
    last_updated
  )
  VALUES (
    p_locality,
    v_median,
    v_min,
    v_max,
    v_variance,
    v_count,
    LEAST(100, GREATEST(0, v_confidence)),
    CURRENT_DATE
  )
  ON CONFLICT (locality) 
  DO UPDATE SET
    median_rate = EXCLUDED.median_rate,
    min_rate = EXCLUDED.min_rate,
    max_rate = EXCLUDED.max_rate,
    variance = EXCLUDED.variance,
    sample_size = EXCLUDED.sample_size,
    confidence_score = EXCLUDED.confidence_score,
    last_updated = EXCLUDED.last_updated;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update baselines
CREATE OR REPLACE FUNCTION trigger_update_baseline()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM calculate_baseline_stats(NEW.locality);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_baseline_on_search ON locality_search_history;

CREATE TRIGGER update_baseline_on_search
AFTER INSERT ON locality_search_history
FOR EACH ROW
EXECUTE FUNCTION trigger_update_baseline();

-- Rebuild all existing baselines
DO $$
DECLARE
  loc TEXT;
BEGIN
  FOR loc IN SELECT DISTINCT locality FROM locality_search_history
  LOOP
    PERFORM calculate_baseline_stats(loc);
  END LOOP;
END $$;
