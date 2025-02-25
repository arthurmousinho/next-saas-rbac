import { authMiddleware } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import z from "zod";

import { BadRequestError } from "../_errors/bad-request-error";
import { getUserPermissions } from "@/utils/get-user-permissions";

import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";
import { projectSchema } from "@saas/auth";

export function getProject(app: FastifyInstance) {

    app
        .withTypeProvider<ZodTypeProvider>()
        .register(authMiddleware)
        .get(
            '/organization/:orgSlug/projects/:projectSlug',
            {
                schema: {
                    tags: ['projects'],
                    summary: 'Get project details',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        orgSlug: z.string(),
                        projectSlug: z.string(),
                    }),
                    response: {
                        200: z.object({
                            project: z.object({
                                id: z.string().uuid(),
                                description: z.string(),
                                name: z.string(),
                                slug: z.string(),
                                avatarUrl: z.string().url().nullable(),
                                organizationId: z.string().uuid(),
                                ownerId: z.string().uuid(),
                                owner: z.object({
                                    id: z.string().uuid(),
                                    name: z.string().nullable(),
                                    avatarUrl: z.string().url().nullable(),
                                })
                            })
                        })
                    }
                }
            },
            async (request, reply) => {
                const { orgSlug, projectSlug } = request.params;

                const userId = await request.getCurrentUserId();
                const { organization, membership } = await request.getUserMembership(orgSlug);

                const { cannot } = getUserPermissions(userId, membership.role);

                const project = await prisma.project.findUnique({
                    where: {
                        slug: projectSlug,
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
                        owner: {
                            select: {
                                id: true,
                                name: true,
                                avatarUrl: true,
                            }
                        }
                    }
                });

                if (!project) {
                    throw new BadRequestError('Project not found');
                }

                const authProject = projectSchema.parse(project);

                if (cannot('get', authProject)) {
                    throw new BadRequestError("You're not allowed to access this project");
                }

                return reply.status(200).send({ project })
            }
        )

}