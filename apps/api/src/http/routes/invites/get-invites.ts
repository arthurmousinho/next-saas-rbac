import { authMiddleware } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import z from "zod";

import { BadRequestError } from "../_errors/bad-request-error";
import { getUserPermissions } from "@/utils/get-user-permissions";

import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";

import { roleSchema } from "@saas/auth";

export function getInvites(app: FastifyInstance) {

    app
        .withTypeProvider<ZodTypeProvider>()
        .register(authMiddleware)
        .get(
            '/organization/:slug/invites',
            {
                schema: {
                    tags: ['invites'],
                    summary: 'Get all organization invites',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        slug: z.string(),
                    }),
                    response: {
                        200: z.object({
                            invites: z.array(z.object({
                                id: z.string().uuid(),
                                createdAt: z.date(),
                                role: roleSchema,
                                email: z.string().email(),
                                author: z.object({
                                    id: z.string().uuid(),
                                    name: z.string().nullable(),
                                }).nullable()
                            }))
                        })
                    }
                }
            },
            async (request, reply) => {
                const { slug } = request.params;

                const userId = await request.getCurrentUserId();
                const { organization, membership } = await request.getUserMembership(slug);

                const { cannot } = getUserPermissions(userId, membership.role);

                if (cannot('get', 'Invite')) {
                    throw new BadRequestError(
                        "You're not allowed to access organization invites"
                    );
                }

                const invites = await prisma.invite.findMany({
                    where: {
                        organizationId: organization.id,
                    },
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        createdAt: true,
                        author: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });

                return reply.status(200).send({ invites });
            }
        )

}