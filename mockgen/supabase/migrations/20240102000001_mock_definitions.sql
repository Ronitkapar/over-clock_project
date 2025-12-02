-- Create mock_definitions table
CREATE TABLE IF NOT EXISTS mock_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    method TEXT NOT NULL CHECK (method IN ('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD')),
    path TEXT NOT NULL,
    request_schema JSONB,
    response_schema JSONB,
    response_data JSONB,
    status_code INTEGER DEFAULT 200,
    delay_ms INTEGER DEFAULT 0,
    error_rate NUMERIC(3, 2) DEFAULT 0.0 CHECK (error_rate >= 0 AND error_rate <= 1),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on workspace_id for faster queries
CREATE INDEX idx_mock_definitions_workspace_id ON mock_definitions(workspace_id);

-- Create index on path for faster lookups
CREATE INDEX idx_mock_definitions_path ON mock_definitions(path);

-- Create index on method for faster filtering
CREATE INDEX idx_mock_definitions_method ON mock_definitions(method);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_mock_definitions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_mock_definitions_updated_at
BEFORE UPDATE ON mock_definitions
FOR EACH ROW
EXECUTE FUNCTION update_mock_definitions_updated_at();
