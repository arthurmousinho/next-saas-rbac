import { authMiddleware } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";

import z from "zod";

import { BadRequestError } from "../_errors/bad-request-error";
import { getUserPermissions } from "@/utils/get-user-permissions";

import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";

export function removeMember(app: FastifyInstance) {

    app
        .withTypeProvider<ZodTypeProvider>()
        .register(authMiddleware)
        .delete(
            '/organization/:slug/members/:memberId',
            {
                schema: {
                    tags: ['members'],
                    summary: 'Remove a member from the organization',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        slug: z.string(),
                        memberId: z.string().uuid(),
                    }),
                    response: {
                        204: z.null()
                    }
                }
            },
            async (request, reply) => {
                const { slug, memberId } = request.params;

                const userId = await request.getCurrentUserId();
                const { organization, membership } = await request.getUserMembership(slug);

                const { cannot } = getUserPermissions(userId, membership.role);

                if (cannot('delete', 'User')) {
                    throw new BadRequestError("You're not allowed to remove this member from the organization.");
                }

                const member = await prisma.member.findMany({
                    where: {
                        organizationId: organization.id,
                        userId: memberId
                    }
                });

                if (!member) {
                    throw new BadRequestError("Member not found.");
                }

                await prisma.member.delete({
                    where: {
                        id: memberId,
                        organizationId: organization.id
                    },
                });

                return reply.status(204).send();
            }
        )

}