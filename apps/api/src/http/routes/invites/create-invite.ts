import { authMiddleware } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import z from "zod";

import { BadRequestError } from "../_errors/bad-request-error";
import { getUserPermissions } from "@/utils/get-user-permissions";

import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";
import { roleSchema } from "@saas/auth";

export function createInvite(app: FastifyInstance) {

    app
        .withTypeProvider<ZodTypeProvider>()
        .register(authMiddleware)
        .post(
            '/organization/:slug/invites',
            {
                schema: {
                    tags: ['invites'],
                    summary: 'Create a new invite',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        slug: z.string().uuid(),
                    }),
                    body: z.object({
                        email: z.string().email(),
                        role: roleSchema
                    }),
                    response: {
                        201: z.object({
                            inviteId: z.string().uuid(),
                        })
                    }
                }
            },
            async (request, reply) => {
                const { slug } = request.params;
                const { email, role } = request.body;

                const userId = await request.getCurrentUserId();
                const { organization, membership } = await request.getUserMembership(slug);

                const { cannot } = getUserPermissions(userId, membership.role);

                if (cannot('create', 'Invite')) {
                    throw new BadRequestError("You're not allowed to create new invites");
                }

                const [_, domain] = email.split('@');

                if (
                    organization.shouldAttachUsersByDomain &&
                    organization.domain === domain
                ) {
                    throw new BadRequestError(
                        `Users with ${domain} will join your organization automatically on login.`
                    );
                }

                const inviteWithSameEmail = await prisma.invite.findUnique({
                    where: {
                        email_organizationId: {
                            email,
                            organizationId: organization.id
                        }
                    }
                })

                if (inviteWithSameEmail) {
                    throw new BadRequestError('Another invite with the same e-mail already exists.');
                }

                const memberWithSameEmail = await prisma.member.findFirst({
                    where: {
                        organizationId: organization.id,
                        user: {
                            email: {
                                equals: email
                            }
                        }
                    }
                })

                if (memberWithSameEmail) {
                    throw new BadRequestError(
                        'Another invite with this e-mail already belongs to your organization.'
                    );
                }

                const invite = await prisma.invite.create({
                    data: {
                        email,
                        role,
                        organizationId: organization.id,
                        authorId: userId
                    }
                })

                reply.status(201).send({ inviteId: invite.id })
            }
        )

}