"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EndpointSchemaTab } from './EndpointSchemaTab';
import { EndpointSettingsTab } from './EndpointSettingsTab';
import { Save } from 'lucide-react';

interface EndpointEditorProps {
    initialData?: any;
    onSave?: (data: any) => void;
}

export function EndpointEditor({ initialData, onSave }: EndpointEditorProps) {
    const [requestSchema, setRequestSchema] = useState(initialData?.requestSchema || '{}');
    const [responseSchema, setResponseSchema] = useState(initialData?.responseSchema || '{}');
    const [sampleResponse, setSampleResponse] = useState(initialData?.sampleResponse || '{}');
    const [validationRules, setValidationRules] = useState(initialData?.validationRules || '[]');

    // Settings state
    const [delay, setDelay] = useState(initialData?.delay || 0);
    const [errorRate, setErrorRate] = useState(initialData?.errorRate || 0.0);
    const [statusCode, setStatusCode] = useState(initialData?.statusCode || 200);
    const [customHeaders, setCustomHeaders] = useState(initialData?.customHeaders || '{}');

    const handleSave = () => {
        const data = {
            requestSchema,
            responseSchema,
            sampleResponse,
            validationRules,
            delay,
            errorRate,
            statusCode,
            customHeaders,
        };
        if (onSave) {
            onSave(data);
        }
        console.log('Saved Endpoint Data:', data);
    };

    return (
        <div className="w-full h-full p-4 space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Endpoint Editor</h2>
                    <p className="text-muted-foreground">Configure your mock endpoint behavior and schemas.</p>
                </div>
                <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </Button>
            </div>

            <Tabs defaultValue="response-schema" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="request-schema">Request Schema</TabsTrigger>
                    <TabsTrigger value="response-schema">Response Schema</TabsTrigger>
                    <TabsTrigger value="sample-response">Sample Response</TabsTrigger>
                    <TabsTrigger value="validation">Validation</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <div className="mt-4">
                    <TabsContent value="request-schema">
                        <Card>
                            <CardHeader>
                                <CardTitle>Request Schema</CardTitle>
                                <CardDescription>Define the expected JSON schema for incoming requests.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <EndpointSchemaTab value={requestSchema} onChange={setRequestSchema} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="response-schema">
                        <Card>
                            <CardHeader>
                                <CardTitle>Response Schema</CardTitle>
                                <CardDescription>Define the JSON schema for the response.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <EndpointSchemaTab value={responseSchema} onChange={setResponseSchema} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="sample-response">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sample Response</CardTitle>
                                <CardDescription>Provide a sample JSON response.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <EndpointSchemaTab value={sampleResponse} onChange={setSampleResponse} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="validation">
                        <Card>
                            <CardHeader>
                                <CardTitle>Validation Rules</CardTitle>
                                <CardDescription>Define custom validation rules.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <EndpointSchemaTab value={validationRules} onChange={setValidationRules} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle>Endpoint Settings</CardTitle>
                                <CardDescription>Configure latency, errors, and status codes.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <EndpointSettingsTab
                                    delay={delay}
                                    setDelay={setDelay}
                                    errorRate={errorRate}
                                    setErrorRate={setErrorRate}
                                    statusCode={statusCode}
                                    setStatusCode={setStatusCode}
                                    customHeaders={customHeaders}
                                    setCustomHeaders={setCustomHeaders}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
