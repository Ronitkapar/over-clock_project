import { AIProvider } from './providers/base-provider';
import { OllamaProvider } from './providers/ollama-provider';
import { LMStudioProvider } from './providers/lmstudio-provider';
import { GroqProvider } from './providers/groq-provider';
import { OpenAIProvider } from './providers/openai-provider';
import { SYSTEM_PROMPT, buildUserPrompt } from './prompt-templates';
import { AIResponseParser } from './parser';

export type ProviderType = 'ollama' | 'lmstudio' | 'groq' | 'openai';

export interface GenerationRequest {
    prompt: string;
    provider: ProviderType;
    model: string;
    apiKey?: string; // Optional override
}

export class AIGenerator {
    private getProvider(type: ProviderType, apiKey?: string): AIProvider {
        switch (type) {
            case 'ollama':
                return new OllamaProvider();
            case 'lmstudio':
                return new LMStudioProvider();
            case 'groq':
                return new GroqProvider(apiKey);
            case 'openai':
                return new OpenAIProvider(apiKey);
            default:
                throw new Error(`Unsupported provider: ${type}`);
        }
    }

    async generate(request: GenerationRequest) {
        const provider = this.getProvider(request.provider, request.apiKey);

        const response = await provider.complete({
            systemPrompt: SYSTEM_PROMPT,
            userPrompt: buildUserPrompt(request.prompt),
            model: request.model,
        });

        return AIResponseParser.parse(response.content);
    }
}
