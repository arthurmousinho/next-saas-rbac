import { authMiddleware } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import z from "zod";

import { BadRequestError } from "../_errors/bad-request-error";
import { getUserPermissions } from "@/utils/get-user-permissions";

import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";

export function getProjects(app: FastifyInstance) {

    app
        .withTypeProvider<ZodTypeProvider>()
        .register(authMiddleware)
        .get(
            '/organization/:slug/projects',
            {
                schema: {
                    tags: ['projects'],
                    summary: 'Get projects',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        slug: z.string()
                    }),
                    response: {
                        200: z.object({
                            projects: z.array(
                                z.object({
                                    id: z.string().uuid(),
                                    description: z.string(),
                                    name: z.string(),
                                    slug: z.string(),
                                    avatarUrl: z.string().nullable(),
                                    createdAt: z.date(),
                                    organizationId: z.string().uuid(),
                                    ownerId: z.string().uuid(),
                                    owner: z.object({
                                        id: z.string().uuid(),
                                        name: z.string().nullable(),
                                        avatarUrl: z.string().nullable(),
                                    })
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

                if (cannot('get', 'Project')) {
                    throw new BadRequestError("You're not allowed to access this organization projects");
                }

                const projects = await prisma.project.findMany({
                    where: {
                        organizationId: organization.id,
                    },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        ownerId: true,
                        organizationId: true,
                        avatarUrl: true,
                        createdAt: true,
                        owner: {
                            select: {
                                id: true,
                                name: true,
                                avatarUrl: true,
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });

                return reply.status(200).send({ projects })
            }
        )

}