import { api } from "../api-client"

interface Response {
    organizations: {
        role: string;
        name: string;
        id: string;
        slug: string;
        avatarUrl: string | null;
    }[]
}

export async function getOrganizations() {
    const result = await api.get('organizations', {
        next: {
            tags: ['organizations']
        }
    }).json<Response>()
    return result
}