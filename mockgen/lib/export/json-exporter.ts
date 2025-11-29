interface APIBlueprint {
    name: string;
    description: string;
    baseUrl: string;
    endpoints: any[];
    models?: any[];
}

export function generateJSONExport(blueprint: APIBlueprint): string {
    return JSON.stringify(blueprint, null, 2);
}
