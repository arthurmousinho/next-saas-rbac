import { api } from "../api-client"

interface Request {
    slug: string;
}

interface Response {
    billing: {
        seats: {
            amount: number;
            unit: number;
            price: number;
        },
        projects: {
            amount: number;
            unit: number;
            price: number;
        },
        total: number;
    }
}

export async function getBilling(data: Request): Promise<Response> {
    const result = await api.get(`organizations/${data.slug}/billing`).json<Response>();
    return result;
}