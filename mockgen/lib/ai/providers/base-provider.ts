export interface CompletionRequest {
    systemPrompt: string;
    userPrompt: string;
    model: string;
    temperature?: number;
    maxTokens?: number;
}

export interface CompletionResponse {
    content: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

export interface AIProvider {
    complete(request: CompletionRequest): Promise<CompletionResponse>;
}
