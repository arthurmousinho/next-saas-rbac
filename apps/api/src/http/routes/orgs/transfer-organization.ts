import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/http/middlewares/auth";

import z from "zod";

import { BadRequestError } from "../_errors/bad-request-error";
import { organizationSchema } from "@saas/auth";
import { UnauthorizedError } from "../_errors/unauthorized-error";
import { getUserPermissions } from "@/utils/get-user-permissions";

import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export function transferOrganization(app: FastifyInstance) {

    app
        .withTypeProvider<ZodTypeProvider>()
        .register(authMiddleware)
        .patch(
            '/organizations/:slug/owner',
            {
                schema: {
                    tags: ['organizations'],
                    summary: 'Transfer organization ownership',
                    security: [{ bearerAuth: [] }],
                    body: z.object({
                        transferToUserId: z.string().uuid(),
                    }),
                    params: z.object({
                        slug: z.string(),
                    }),
                    response: {
                        204: z.null()
                    }
                }
            },
            async (request, reply) => {
                const { slug } = request.params;

                const userId = await request.getCurrentUserId();
                const { membership, organization } = await request.getUserMembership(slug);

                const { transferToUserId } = request.body;

                const authOrganization = organizationSchema.parse({
                    id: organization.id,
                    ownerId: organization.ownerId,
                });

                const { cannot } = getUserPermissions(userId, membership.role);

                if (cannot('transfer_ownership', authOrganization)) {
                    throw new UnauthorizedError("You're not allowed to transfer this organization ownership.")
                }

                const transferToMembership = await prisma.member.findUnique({
                    where: {
                        organizationId_userId: {
                            organizationId: organization.id,
                            userId: transferToUserId,
                        }
                    }
                });

                if (!transferToMembership) {
                    throw new BadRequestError('Target user is not a member of this organization.')
                }

                await prisma.$transaction([
                    prisma.member.update({
                        where: {
                            organizationId_userId: {
                                organizationId: organization.id,
                                userId: transferToUserId,
                            }
                        },
                        data: {
                            role: 'ADMIN'
                        }
                    }),
                    prisma.organization.update({
                        where: {
                            id: organization.id,
                        },
                        data: {
                            ownerId: transferToUserId,
                        }
                    })
                ])

                return reply.status(204).send()
            }
        )

}