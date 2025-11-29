export interface MockConfig {
    delayMs: number;
    errorRate: number; // 0.0 to 1.0
    headers: Record<string, string>;
}

export interface SimulationResult {
    isError: boolean;
    delayApplied: number;
    response: any;
    status: number;
}
