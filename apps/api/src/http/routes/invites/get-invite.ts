import z from "zod";

import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";

import { prisma } from "@/lib/prisma";
import { roleSchema } from "@saas/auth";
import { BadRequestError } from "../_errors/bad-request-error";

export function getInvite(app: FastifyInstance) {

    app
        .withTypeProvider<ZodTypeProvider>()
        .get(
            '/invites/:inviteId',
            {
                schema: {
                    tags: ['invites'],
                    summary: 'Get an invite',
                    params: z.object({
                        inviteId: z.string().uuid(),
                    }),
                    response: {
                        200: z.object({
                            invite: z.object({
                                id:  z.string().uuid(),
                                organization: z.object({
                                    name: z.string()
                                }),
                                createdAt:  z.date(),
                                role: roleSchema,
                                email: z.string().email(),
                                author: z.object({
                                    id: z.string().uuid(),
                                    name: z.string().nullable(),
                                    avatarUrl: z.string().url().nullable(),
                                }).nullable()
                            })
                        })
                    }
                }
            },
            async (request, reply) => {
                const { inviteId } = request.params;

                const invite = await prisma.invite.findUnique({
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
                    where: {
                        id: inviteId
                    }
                })

                if (!invite) {
                    throw new BadRequestError('Invite not found')
                }

                reply.status(200).send({ invite })
            }
        )

}