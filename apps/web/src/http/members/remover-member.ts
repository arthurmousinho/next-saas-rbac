import { api } from "../api-client";

interface Request {
    slug: string;
    memberId: string;
}

export async function removeMember(data: Request){
    await api.delete(`organization/${data.slug}/members/${data.memberId}`);
}