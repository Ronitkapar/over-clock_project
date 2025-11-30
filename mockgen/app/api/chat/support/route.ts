import { streamSupportResponse } from '@/lib/ai/support-agent';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();
    return streamSupportResponse(messages);
}
