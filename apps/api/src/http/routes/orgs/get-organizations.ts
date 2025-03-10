import { authMiddleware } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { roleSchema } from "@saas/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export function getOrganizations(app: FastifyInstance) {

    app
        .withTypeProvider<ZodTypeProvider>()
        .register(authMiddleware)
        .get(
            '/organizations',
            {
                schema: {
                    tags: ['organizations'],
                    summary: 'Get organization wher user is a member',
                    security: [{ bearerAuth: [] }],
                    response: {
                        200: z.object({
                            organizations: z.array(
                                z.object({
                                    id: z.string(),
                                    name: z.string(),
                                    slug: z.string(),
                                    avatarUrl: z.string().nullable(),
                                    role: roleSchema
                                })
                            )
                        })
                    }
                }
            },
            async (request) => {
                const userId = await request.getCurrentUserId();

                const organizations = await prisma.organization.findMany({
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        avatarUrl: true,
                        members: {
                            select: {
                                role: true
                            },
                            where: {
                                userId
                            }
                        }
                    },
                    where: {
                        members: {
                            some: {
                                userId
                            }
                        }
                    }
                });

                const organizationsWithUserRole = organizations.map(
                    ({ members, ...org }) => ({
                        ...org,
                        role: members[0]?.role
                    })
                );

                return {
                    organizations: organizationsWithUserRole
                }
            })

}