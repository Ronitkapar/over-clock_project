-- Users table (handled by Supabase Auth)
-- Extending with custom profile
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workspaces (Projects)
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Blueprints (Generated API structure)
CREATE TABLE api_blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  blueprint JSONB NOT NULL,  -- Full API structure
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Endpoints
CREATE TABLE endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  blueprint_id UUID REFERENCES api_blueprints(id) ON DELETE CASCADE,
  method TEXT NOT NULL,  -- GET, POST, PUT, PATCH, DELETE
  path TEXT NOT NULL,
  description TEXT,
  request_schema JSONB,
  response_schema JSONB,
  sample_response JSONB,
  status_code INTEGER DEFAULT 200,
  delay_ms INTEGER DEFAULT 0,
  error_rate DECIMAL(3,2) DEFAULT 0.0,  -- 0.0 to 1.0
  custom_headers JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workspace_id, method, path)
);

-- Request History (for testing panel)
CREATE TABLE request_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  endpoint_id UUID REFERENCES endpoints(id) ON DELETE SET NULL,
  method TEXT NOT NULL,
  url TEXT NOT NULL,
  headers JSONB,
  body JSONB,
  response_body JSONB,
  response_status INTEGER,
  response_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exports
CREATE TABLE exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  export_type TEXT NOT NULL,  -- 'openapi', 'express', 'fastapi', etc.
  content TEXT NOT NULL,
  file_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_workspaces_user_id ON workspaces(user_id);
CREATE INDEX idx_endpoints_workspace_id ON endpoints(workspace_id);
CREATE INDEX idx_endpoints_method_path ON endpoints(method, path);
CREATE INDEX idx_request_history_workspace_id ON request_history(workspace_id);
CREATE INDEX idx_exports_workspace_id ON exports(workspace_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at
    BEFORE UPDATE ON workspaces
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_endpoints_updated_at
    BEFORE UPDATE ON endpoints
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
