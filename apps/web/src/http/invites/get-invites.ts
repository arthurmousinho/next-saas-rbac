import { api } from "../api-client";
import type { Role } from "@saas/auth";

interface GetInvitesResponse {
    invites: {
        id: string;
        createdAt: string;
        role: Role,
        email: string,
        author: {
            id: string;
            name: string;
        }
    }[]
}

export async function getInvites(org: string) {
    const result = await api
        .get(
            `organization/${org}/invites`,
            {
                next: {
                    tags: [`${org}/invites`]
                }
            }
        )
        .json<GetInvitesResponse>()

    return result
}