import { Endpoint } from '@/types/endpoint';

export class ResponseGenerator {
    static generate(endpoint: Endpoint): any {
        // For now, simply return the sample response.
        // In the future, this could generate dynamic data using Faker.js
        // based on the response schema.
        return endpoint.sampleResponse || {};
    }
}
