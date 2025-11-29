export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    avatar_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            workspaces: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    description: string | null
                    settings: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    description?: string | null
                    settings?: Json | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    description?: string | null
                    settings?: Json | null
                    created_at?: string
                    updated_at?: string
                }
            }
            endpoints: {
                Row: {
                    id: string
                    workspace_id: string
                    blueprint_id: string | null
                    method: string
                    path: string
                    description: string | null
                    request_schema: Json | null
                    response_schema: Json | null
                    sample_response: Json | null
                    status_code: number
                    delay_ms: number
                    error_rate: number
                    custom_headers: Json | null
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    workspace_id: string
                    blueprint_id?: string | null
                    method: string
                    path: string
                    description?: string | null
                    request_schema?: Json | null
                    response_schema?: Json | null
                    sample_response?: Json | null
                    status_code?: number
                    delay_ms?: number
                    error_rate?: number
                    custom_headers?: Json | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    workspace_id?: string
                    blueprint_id?: string | null
                    method?: string
                    path?: string
                    description?: string | null
                    request_schema?: Json | null
                    response_schema?: Json | null
                    sample_response?: Json | null
                    status_code?: number
                    delay_ms?: number
                    error_rate?: number
                    custom_headers?: Json | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}
