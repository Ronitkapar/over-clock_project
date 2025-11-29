export const APP_CONFIG = {
    name: 'MockGen',
    description: 'AI-Powered API Mocking Studio',
    version: '1.0.0',
    api: {
        baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        mockPrefix: '/api/mock',
    },
    limits: {
        maxEndpointsPerWorkspace: 100,
        maxHistoryItems: 50,
    }
};

export const ROUTES = {
    dashboard: '/dashboard',
    login: '/login',
    signup: '/signup',
    workspace: (id: string) => `/workspaces/${id}`,
};
