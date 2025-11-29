-- Rate Limits table
CREATE TABLE rate_limits (
  key TEXT PRIMARY KEY,
  tokens NUMERIC NOT NULL,
  last_refill TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to rate_limits" ON rate_limits FOR ALL USING (true) WITH CHECK (true);

-- Atomic Rate Limit Function (Token Bucket)
CREATE OR REPLACE FUNCTION check_rate_limit(
  request_key TEXT,
  cost NUMERIC,
  capacity NUMERIC,
  refill_rate NUMERIC -- tokens per second
) RETURNS BOOLEAN AS $$
DECLARE
  current_tokens NUMERIC;
  last_refill_time TIMESTAMP WITH TIME ZONE;
  now_time TIMESTAMP WITH TIME ZONE := NOW();
  time_passed NUMERIC;
  new_tokens NUMERIC;
BEGIN
  -- Lock the row if it exists, or insert if not
  INSERT INTO rate_limits (key, tokens, last_refill)
  VALUES (request_key, capacity, now_time)
  ON CONFLICT (key) DO NOTHING;

  -- Select current state
  SELECT tokens, last_refill INTO current_tokens, last_refill_time
  FROM rate_limits
  WHERE key = request_key
  FOR UPDATE;

  -- Calculate refill
  time_passed := EXTRACT(EPOCH FROM (now_time - last_refill_time));
  new_tokens := LEAST(capacity, current_tokens + (time_passed * refill_rate));

  -- Check if enough tokens
  IF new_tokens >= cost THEN
    UPDATE rate_limits
    SET tokens = new_tokens - cost,
        last_refill = now_time
    WHERE key = request_key;
    RETURN TRUE;
  ELSE
    -- Update tokens to new_tokens (capped) so we don't lose the refill
    UPDATE rate_limits
    SET tokens = new_tokens,
        last_refill = now_time
    WHERE key = request_key;
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;
