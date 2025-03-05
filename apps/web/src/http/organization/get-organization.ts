import { api } from "../api-client"

interface Request {
    slug: string;
}

interface Response {
    organization: {
        id: string;
        name: string;
        slug: string;
        domain: string | null;
        shouldAttachUsersByDomain: boolean;
        avatarUrl: string | null;
        createdAt: string;
        updatedAt: string;
        ownerId: string;
    }
}

export async function getOrganization(data: Request): Promise<Response> {
    const result = await api.get(`organizations/${data.slug}`).json<Response>()
    return result;
}