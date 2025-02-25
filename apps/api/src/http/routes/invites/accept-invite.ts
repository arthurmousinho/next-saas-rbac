import z from "zod";

import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";

import { prisma } from "@/lib/prisma";
import { roleSchema } from "@saas/auth";
import { BadRequestError } from "../_errors/bad-request-error";

export function acceptInvite(app: FastifyInstance) {

    app
        .withTypeProvider<ZodTypeProvider>()
        .post(
            '/invites/:inviteId/accept',
            {
                schema: {
                    tags: ['invites'],
                    summary: 'Accept an invite',
                    params: z.object({
                        inviteId: z.string().uuid(),
                    }),
                    response: {
                        204: z.null()
                    }
                }
            },
            async (request, reply) => {
                const userId = await request.getCurrentUserId();
                const { inviteId } = request.params;

                const invite = await prisma.invite.findUnique({
                    where: {
                        id: inviteId
                    }
                })

                if (!invite) {
                    throw new BadRequestError('Invite not found or expired')
                }

                const user = await prisma.user.findUnique({
                    where: {
                        id: userId
                    }
                })

                if (!user) {
                    throw new BadRequestError('User not found')
                }

                if (invite.email !== user.email) {
                    throw new BadRequestError('This invite belongs to another user')
                }

                await prisma.$transaction([
                    prisma.member.create({
                        data: {
                            userId: userId,
                            role: roleSchema.parse(invite.role),
                            organizationId: invite.organizationId
                        }
                    }),
                    prisma.invite.delete({
                        where: {
                            id: inviteId
                        }
                    })
                ])

                return reply.status(204).send();
            }
        )

}