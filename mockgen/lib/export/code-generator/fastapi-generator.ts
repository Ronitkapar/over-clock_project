import { Endpoint } from '@/types/endpoint';

export function generateFastAPIRoutes(endpoints: Endpoint[]): string {
    return `
from fastapi import APIRouter
from typing import Any, Dict

router = APIRouter()

${endpoints.map(endpoint => `
@router.${endpoint.method.toLowerCase()}("${endpoint.path}", status_code=${endpoint.statusCode})
async def ${endpoint.method.toLowerCase()}_${endpoint.path.replace(/\//g, '_').replace(/^_/, '')}():
    """
    ${endpoint.description || endpoint.method + ' ' + endpoint.path}
    """
    return ${JSON.stringify(endpoint.sampleResponse, null, 4)}
`).join('\n')}
  `.trim();
}
