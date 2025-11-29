
export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

export class RequestValidator {
    static validate(body: any, schema: any): ValidationResult {
        if (!schema) {
            return { valid: true, errors: [] };
        }

        const errors: string[] = [];
        this.validateSchema(body, schema, '', errors);

        return {
            valid: errors.length === 0,
            errors
        };
    }

    private static validateSchema(data: any, schema: any, path: string, errors: string[]) {
        if (schema.type === 'object') {
            if (typeof data !== 'object' || data === null) {
                errors.push(`${path || 'root'}: expected object`);
                return;
            }

            // Check required fields
            if (schema.required && Array.isArray(schema.required)) {
                for (const field of schema.required) {
                    if (!(field in data)) {
                        errors.push(`${path ? path + '.' : ''}${field}: is required`);
                    }
                }
            }

            // Check properties
            if (schema.properties) {
                for (const key in schema.properties) {
                    if (key in data) {
                        this.validateSchema(
                            data[key],
                            schema.properties[key],
                            path ? `${path}.${key}` : key,
                            errors
                        );
                    }
                }
            }
        } else if (schema.type === 'string') {
            if (typeof data !== 'string') {
                errors.push(`${path}: expected string`);
            }
        } else if (schema.type === 'number' || schema.type === 'integer') {
            if (typeof data !== 'number') {
                errors.push(`${path}: expected number`);
            }
        } else if (schema.type === 'boolean') {
            if (typeof data !== 'boolean') {
                errors.push(`${path}: expected boolean`);
            }
        } else if (schema.type === 'array') {
            if (!Array.isArray(data)) {
                errors.push(`${path}: expected array`);
                return;
            }
            if (schema.items) {
                data.forEach((item, index) => {
                    this.validateSchema(
                        item,
                        schema.items,
                        `${path}[${index}]`,
                        errors
                    );
                });
            }
        }
    }
}
