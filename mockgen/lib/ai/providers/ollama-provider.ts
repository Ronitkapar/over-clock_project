import { AIProvider, CompletionRequest, CompletionResponse } from './base-provider';

export class OllamaProvider implements AIProvider {
    private baseUrl: string;

    constructor(baseUrl: string = process.env.OLLAMA_BASE_URL || 'http://localhost:11434') {
        this.baseUrl = baseUrl;
    }

    async complete(request: CompletionRequest): Promise<CompletionResponse> {
        const response = await fetch(`${this.baseUrl}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: request.model,
                system: request.systemPrompt,
                prompt: request.userPrompt,
                stream: false,
                options: {
                    temperature: request.temperature || 0.7,
                    num_predict: request.maxTokens || 4096,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            content: data.response,
            usage: {
                promptTokens: data.prompt_eval_count || 0,
                completionTokens: data.eval_count || 0,
                totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
            },
        };
    }
}
