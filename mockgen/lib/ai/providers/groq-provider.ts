import { AIProvider, CompletionRequest, CompletionResponse } from './base-provider';

export class GroqProvider implements AIProvider {
    private apiKey: string;
    private baseUrl: string = 'https://api.groq.com/openai/v1/chat/completions';

    constructor(apiKey: string = process.env.GROQ_API_KEY || '') {
        this.apiKey = apiKey;
    }

    async complete(request: CompletionRequest): Promise<CompletionResponse> {
        if (!this.apiKey) {
            throw new Error('Groq API key is missing');
        }

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: request.model,
                messages: [
                    { role: 'system', content: request.systemPrompt },
                    { role: 'user', content: request.userPrompt },
                ],
                temperature: request.temperature || 0.7,
                max_tokens: request.maxTokens || 4096,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Groq API error: ${response.status} - ${error}`);
        }

        const data = await response.json();

        return {
            content: data.choices[0].message.content,
            usage: data.usage,
        };
    }
}
