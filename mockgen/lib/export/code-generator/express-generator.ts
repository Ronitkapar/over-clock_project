import { Endpoint } from '@/types/endpoint';

export function generateExpressRoutes(endpoints: Endpoint[]): string {
    return `
const express = require('express');
const router = express.Router();

${endpoints.map(endpoint => `
// ${endpoint.description || endpoint.method + ' ' + endpoint.path}
router.${endpoint.method.toLowerCase()}('${endpoint.path}', (req, res) => {
  res.status(${endpoint.statusCode}).json(${JSON.stringify(endpoint.sampleResponse, null, 2)});
});
`).join('\n')}

module.exports = router;
  `.trim();
}
