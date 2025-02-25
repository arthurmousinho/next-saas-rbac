import z from "zod";

import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";

import { prisma } from "@/lib/prisma";
import { roleSchema } from "@saas/auth";
import { BadRequestError } from "../_errors/bad-request-error";

export function getPendingInvites(app: FastifyInstance) {

    app
        .withTypeProvider<ZodTypeProvider>()
        .get(
            '/pending/invites',
            {
                schema: {
                    tags: ['invites'],
                    summary: 'Get all user pending invites',
                    response: {
                        200: z.object({
                            invites: z.array(z.object({
                                id: z.string().uuid(),
                                organization: z.object({
                                    name: z.string()
                                }),
                                createdAt: z.date(),
                                role: roleSchema,
                                email: z.string().email(),
                                author: z.object({
                                    id: z.string().uuid(),
                                    name: z.string().nullable(),
                                    avatarUrl: z.string().url().nullable(),
                                }).nullable()
                            }))
                        })
                    }
                }
            },
            async (request, reply) => {
                const userId = await request.getCurrentUserId();

                const user = await prisma.user.findUnique({
                    where: {
                        id: userId
                    }
                })

                if (!user) {
                    throw new BadRequestError('User not found')
                }

                const invites = await prisma.invite.findMany({
                    where: {
                        email: user.email
                    },
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        createdAt: true,
                        author: {
                            select: {
                                id: true,
                                name: true,
                                avatarUrl: true,
                            }
                        },
                        organization: {
                            select: {
                                name: true,
                            }
                        }
                    },
                })

                return reply.status(200).send({ invites });
            }
        )

}