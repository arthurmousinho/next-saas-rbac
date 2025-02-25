import { authMiddleware } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";

import z from "zod";

import { BadRequestError } from "../_errors/bad-request-error";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { roleSchema } from "@saas/auth";

import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";

export function getMembers(app: FastifyInstance) {

    app
        .withTypeProvider<ZodTypeProvider>()
        .register(authMiddleware)
        .get(
            '/organization/:slug/members',
            {
                schema: {
                    tags: ['members'],
                    summary: 'Get all organization members',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        slug: z.string()
                    }),
                    response: {
                        200: z.object({
                            members: z.array(
                                z.object({
                                    userId: z.string().uuid(),
                                    id: z.string().uuid(),
                                    role: roleSchema,
                                    name: z.string().nullable(),
                                    avatarUrl: z.string().url().nullable(),
                                    email: z.string().email(),
                                })
                            )
                        })
                    }
                }
            },
            async (request, reply) => {
                const { slug } = request.params;

                const userId = await request.getCurrentUserId();
                const { organization, membership } = await request.getUserMembership(slug);

                const { cannot } = getUserPermissions(userId, membership.role);

                if (cannot('get', 'User')) {
                    throw new BadRequestError("You're not allowed to access this organization members.");
                }

                const members = await prisma.member.findMany({
                    select: {
                        id: true,
                        role: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatarUrl: true
                            }
                        }
                    },
                    where: {
                        organizationId: organization.id
                    },
                    orderBy: {
                        role: 'asc'
                    }
                })

                const membersWithRoles = members.map(
                    ({ user: { id: userId, ...user }, ...member }) => {
                        return {
                            ...user,
                            ...member,
                            userId
                        }
                    }
                )

                return reply.status(200).send({ members: membersWithRoles })
            }
        )

}