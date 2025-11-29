export class AIResponseParser {
    static parse(content: string): any {
        try {
            // Remove markdown code blocks if present
            let cleanContent = content.trim();
            if (cleanContent.startsWith('```json')) {
                cleanContent = cleanContent.replace(/^```json\n/, '').replace(/\n```$/, '');
            } else if (cleanContent.startsWith('```')) {
                cleanContent = cleanContent.replace(/^```\n/, '').replace(/\n```$/, '');
            }

            const parsed = JSON.parse(cleanContent);

            // Basic validation
            if (!parsed.endpoints || !Array.isArray(parsed.endpoints)) {
                throw new Error('Invalid response structure: missing endpoints array');
            }

            return parsed;
        } catch (error) {
            console.error('Failed to parse AI response:', content);
            throw new Error(`Failed to parse AI response: ${(error as Error).message}`);
        }
    }
}
