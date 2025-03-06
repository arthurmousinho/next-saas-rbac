import { api } from "../api-client";
import type { Role } from "@saas/auth";

interface Request {
    slug: string;
    memberId: string;
    role: Role;
}

export async function updateMember(data: Request) {
    await api.put(
        `organization/${data.slug}/members/${data.memberId}`,
        {
            json: {
                role: data.role
            }
        }
    )
}