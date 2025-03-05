import { api } from "../api-client";

interface Request {
    slug: string;
}

export async function shutdownOrganization(data: Request){
    await api.delete(`organizations/${data.slug}`);
}