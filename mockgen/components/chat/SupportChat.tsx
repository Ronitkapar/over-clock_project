'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export function SupportChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(m => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            if (!response.ok) throw new Error('Failed to get response');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantContent = '';

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: '',
            };

            setMessages(prev => [...prev, assistantMessage]);

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    assistantContent += chunk;

                    setMessages(prev => {
                        const updated = [...prev];
                        const lastMsg = updated[updated.length - 1];
                        if (lastMsg.role === 'assistant') {
                            lastMsg.content = assistantContent;
                        }
                        return updated;
                    });
                }
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                    <MessageCircle className="h-8 w-8" />
                </Button>
            )}

            {isOpen && (
                <Card className="w-[350px] h-[500px] flex flex-col shadow-2xl border-primary/20">
                    <CardHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0 bg-primary/5">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                            MockGen Support
                        </CardTitle>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                            {messages.length === 0 && (
                                <div className="text-center text-muted-foreground text-sm mt-8">
                                    <p>👋 Hi there! How can I help you with MockGen today?</p>
                                </div>
                            )}

                            {messages.map((m) => (
                                <div
                                    key={m.id}
                                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.role === 'user'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-foreground'
                                            }`}
                                    >
                                        {m.content}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-muted rounded-lg px-3 py-2 text-xs text-muted-foreground animate-pulse">
                                        Thinking...
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t bg-background">
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask a question..."
                                    className="flex-1"
                                />
                                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
