import { Endpoint } from '@/types/endpoint';

export function generateFiberRoutes(endpoints: Endpoint[]): string {
    return `
package routes

import (
	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(app *fiber.App) {
${endpoints.map(endpoint => `
	// ${endpoint.description || endpoint.method + ' ' + endpoint.path}
	app.${toPascalCase(endpoint.method)}("${endpoint.path}", func(c *fiber.Ctx) error {
		return c.Status(${endpoint.statusCode}).JSON(${JSON.stringify(endpoint.sampleResponse)})
	})
`).join('')}
}
  `.trim();
}

function toPascalCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
