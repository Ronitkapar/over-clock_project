import React from 'react';
import Editor from '@monaco-editor/react';

interface EndpointSchemaTabProps {
    value: string;
    onChange: (value: string | undefined) => void;
    language?: string;
    readOnly?: boolean;
}

export function EndpointSchemaTab({
    value,
    onChange,
    language = 'json',
    readOnly = false,
}: EndpointSchemaTabProps) {
    return (
        <div className="h-[500px] w-full border rounded-md overflow-hidden">
            <Editor
                height="100%"
                defaultLanguage={language}
                value={value}
                onChange={onChange}
                options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    readOnly: readOnly,
                    automaticLayout: true,
                    formatOnPaste: true,
                    formatOnType: true,
                }}
            />
        </div>
    );
}
