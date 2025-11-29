import { Endpoint } from '@/types/endpoint';
import { SimulationResult } from '@/types/mock-config';

export class ResponseSimulator {
    static async simulate(endpoint: Endpoint): Promise<SimulationResult> {
        const result: SimulationResult = {
            isError: false,
            delayApplied: 0,
            response: null,
            status: endpoint.statusCode,
        };

        // 1. Simulate Delay
        if (endpoint.delayMs > 0) {
            await new Promise((resolve) => setTimeout(resolve, endpoint.delayMs));
            result.delayApplied = endpoint.delayMs;
        }

        // 2. Simulate Error
        if (endpoint.errorRate > 0 && Math.random() < endpoint.errorRate) {
            result.isError = true;
            // Default error response - in real app, pick from defined error responses
            result.status = 500;
            result.response = { error: 'Simulated Internal Server Error' };
            return result;
        }

        return result;
    }
}
