import { faker } from '@faker-js/faker';

/**
 * Generate realistic mock data based on JSON schema type information
 */
export class DataGenerator {
    /**
     * Generate data from a JSON schema
     */
    static generateFromSchema(schema: any, count = 1): any {
        if (!schema) return null;

        // If schema specifies array, generate multiple items
        if (schema.type === 'array') {
            const itemCount = count || faker.number.int({ min: 3, max: 5 });
            return Array.from({ length: itemCount }, () =>
                this.generateFromSchema(schema.items || {}, 1)
            );
        }

        // Generate single item based on type
        return this.generateValue(schema);
    }

    /**
     * Generate a single value based on schema properties
     */
    private static generateValue(schema: any): any {
        const type = schema.type || 'string';
        const format = schema.format;
        const fieldName = schema.title || '';

        // Handle enum
        if (schema.enum && schema.enum.length > 0) {
            return faker.helpers.arrayElement(schema.enum);
        }

        // Handle different types
        switch (type) {
            case 'object':
                return this.generateObject(schema);

            case 'string':
                return this.generateString(format, fieldName);

            case 'number':
            case 'integer':
                return this.generateNumber(schema);

            case 'boolean':
                return faker.datatype.boolean();

            case 'null':
                return null;

            default:
                return this.generateString(format, fieldName);
        }
    }

    /**
     * Generate an object with properties
     */
    private static generateObject(schema: any): any {
        const properties = schema.properties || {};
        const result: any = {};

        Object.keys(properties).forEach((key) => {
            result[key] = this.generateValue(properties[key]);
        });

        return result;
    }

    /**
     * Generate a string value based on format and field name hints
     */
    private static generateString(format?: string, fieldName?: string): string {
        const lowerFieldName = (fieldName || '').toLowerCase();

        // Handle format-specific generation
        if (format === 'email') return faker.internet.email();
        if (format === 'uri' || format === 'url') return faker.internet.url();
        if (format === 'date-time' || format === 'date') return faker.date.recent().toISOString();
        if (format === 'uuid') return faker.string.uuid();

        // Handle field name hints
        if (lowerFieldName.includes('email')) return faker.internet.email();
        if (lowerFieldName.includes('name')) {
            if (lowerFieldName.includes('first')) return faker.person.firstName();
            if (lowerFieldName.includes('last')) return faker.person.lastName();
            if (lowerFieldName.includes('full')) return faker.person.fullName();
            return faker.person.fullName();
        }
        if (lowerFieldName.includes('username')) return faker.internet.username();
        if (lowerFieldName.includes('password')) return faker.internet.password();
        if (lowerFieldName.includes('phone')) return faker.phone.number();
        if (lowerFieldName.includes('address')) return faker.location.streetAddress();
        if (lowerFieldName.includes('city')) return faker.location.city();
        if (lowerFieldName.includes('country')) return faker.location.country();
        if (lowerFieldName.includes('company')) return faker.company.name();
        if (lowerFieldName.includes('job') || lowerFieldName.includes('title')) return faker.person.jobTitle();
        if (lowerFieldName.includes('description') || lowerFieldName.includes('bio')) return faker.lorem.paragraph();
        if (lowerFieldName.includes('url') || lowerFieldName.includes('website')) return faker.internet.url();
        if (lowerFieldName.includes('color')) return faker.color.human();
        if (lowerFieldName.includes('id')) return faker.string.uuid();
        if (lowerFieldName.includes('image') || lowerFieldName.includes('avatar')) return faker.image.avatar();

        // Default to lorem text
        return faker.lorem.words(3);
    }

    /**
     * Generate a number value
     */
    private static generateNumber(schema: any): number {
        const min = schema.minimum ?? 0;
        const max = schema.maximum ?? 1000;
        const isInteger = schema.type === 'integer';

        if (isInteger) {
            return faker.number.int({ min, max });
        }
        return faker.number.float({ min, max, fractionDigits: 2 });
    }

    /**
     * Generate a user object (common use case)
     */
    static generateUser(): any {
        return {
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            avatar: faker.image.avatar(),
            username: faker.internet.username(),
            createdAt: faker.date.past().toISOString(),
        };
    }

    /**
     * Generate a product object (common use case)
     */
    static generateProduct(): any {
        return {
            id: faker.string.uuid(),
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: parseFloat(faker.commerce.price()),
            category: faker.commerce.department(),
            image: faker.image.url(),
            inStock: faker.datatype.boolean(),
            createdAt: faker.date.past().toISOString(),
        };
    }

    /**
     * Generate a post/article object (common use case)
     */
    static generatePost(): any {
        return {
            id: faker.string.uuid(),
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraphs(3),
            author: this.generateUser(),
            createdAt: faker.date.past().toISOString(),
            updatedAt: faker.date.recent().toISOString(),
        };
    }
}
