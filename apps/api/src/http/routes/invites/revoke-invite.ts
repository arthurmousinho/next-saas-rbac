import { authMiddleware } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import z from "zod";

import { BadRequestError } from "../_errors/bad-request-error";
import { getUserPermissions } from "@/utils/get-user-permissions";

import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";

export function revokeInvite(app: FastifyInstance) {

    app
        .withTypeProvider<ZodTypeProvider>()
        .register(authMiddleware)
        .post(
            '/organization/:slug/invites/:inviteId',
            {
                schema: {
                    tags: ['invites'],
                    summary: 'Revoke an invite',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        slug: z.string().uuid(),
                        inviteId: z.string().uuid()
                    }),
                    response: {
                        204: z.null()
                    }
                }
            },
            async (request, reply) => {
                const { slug } = request.params;

                const userId = await request.getCurrentUserId();
                const { organization, membership } = await request.getUserMembership(slug);

                const { cannot } = getUserPermissions(userId, membership.role);

                if (cannot('delete', 'Invite')) {
                    throw new BadRequestError("You're not allowed to delete an invite");
                }

                const invite = await prisma.invite.findUnique({
                    where: {
                        id: request.params.inviteId,
                        organizationId: organization.id
                    }
                })

                if (!invite) {
                    throw new BadRequestError('Invite not found.');
                }

                await prisma.invite.delete({
                    where: {
                        id: invite.id
                    }
                })  

                reply.status(204).send()
            }
        )

}