import { AIProvider, CompletionRequest, CompletionResponse } from './base-provider';

export class LMStudioProvider implements AIProvider {
    private baseUrl: string;

    constructor(baseUrl: string = process.env.LMSTUDIO_BASE_URL || 'http://localhost:1234') {
        this.baseUrl = baseUrl;
    }

    async complete(request: CompletionRequest): Promise<CompletionResponse> {
        const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: request.model,
                messages: [
                    { role: 'system', content: request.systemPrompt },
                    { role: 'user', content: request.userPrompt },
                ],
                temperature: request.temperature || 0.7,
                max_tokens: request.maxTokens || -1,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`LM Studio API error: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            content: data.choices[0].message.content,
            usage: data.usage,
        };
    }
}
