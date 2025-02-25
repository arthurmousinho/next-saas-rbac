import { authMiddleware } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";

import z from "zod";

import { BadRequestError } from "../_errors/bad-request-error";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { roleSchema } from "@saas/auth";

import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";

export function updateMember(app: FastifyInstance) {

    app
        .withTypeProvider<ZodTypeProvider>()
        .register(authMiddleware)
        .put(
            '/organization/:slug/members/:memberId',
            {
                schema: {
                    tags: ['members'],
                    summary: 'Update a member',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        slug: z.string(),
                        memberId: z.string().uuid(),
                    }),
                    body: z.object({
                        role: roleSchema
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

                if (cannot('update', 'User')) {
                    throw new BadRequestError("You're not allowed to update this member.");
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

                const { role } = request.body;

                await prisma.member.update({
                    where: {
                        id: memberId,
                        organizationId: organization.id
                    },
                    data: {
                        role: role
                    }
                });

                return reply.status(204).send();
            }
        )

}