import { api } from "../api-client";

interface Request {
    name: string;
    domain: string | null;
    shouldAttachUsersByDomain: boolean;
}

type Response = void;

export async function createOrganization(data: Request): Promise<Response> {
    const result = await api.post(
        'organizations',
        {
            json: {
                name: data.name,
                domain: data.domain,
                shouldAtachUsersByDomain: data.shouldAttachUsersByDomain
            }
        }
    ).json<Response>();

    return result;
}