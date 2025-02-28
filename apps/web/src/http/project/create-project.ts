import { api } from "../api-client";

interface Request {
    name: string;
    description: string;
    orgSlug: string;
}

type Response = void;

export async function createProject(data: Request): Promise<Response> {
    const result = await api.post(
        `organization/${data.orgSlug}/projects`,
        {
            json: {
                name: data.name,
                description: data.description
            }
        }
    ).json<Response>();

    return result;
}