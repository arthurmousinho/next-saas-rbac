import { api } from "../api-client";

interface Request {
    slug: string;
    name: string;
    domain: string | null;
    shouldAttachUsersByDomain: boolean;
}

export async function updateOrganization(data: Request) {
    await api.put(
        `organizations/${data.slug}`,
        {
            json: {
                name: data.name,
                domain: data.domain,
                shouldAtachUsersByDomain: data.shouldAttachUsersByDomain
            }
        }
    )
}