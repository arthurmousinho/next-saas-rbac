import { authMiddleware } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";

import z from "zod";
import { projectSchema } from "@saas/auth";

import { BadRequestError } from "../_errors/bad-request-error";
import { getUserPermissions } from "@/utils/get-user-permissions";

import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";

export function updateProject(app: FastifyInstance) {

    app
        .withTypeProvider<ZodTypeProvider>()
        .register(authMiddleware)
        .put(
            '/organization/:slug/projects/:projectId',
            {
                schema: {
                    tags: ['projects'],
                    summary: 'Update a project',
                    security: [{ bearerAuth: [] }],
                    body: z.object({
                        name: z.string(),
                        description: z.string()
                    }),     
                    params: z.object({
                        slug: z.string().uuid(),
                        projectId: z.string().uuid(),
                    }),
                    response: {
                        204: z.null()
                    }
                }
            },
            async (request, reply) => {
                const { slug, projectId } = request.params;
                const { name, description } = request.body;

                const userId = await request.getCurrentUserId();
                const { membership } = await request.getUserMembership(slug);

                const { cannot } = getUserPermissions(userId, membership.role);

                const project = await prisma.project.findUnique({
                    where: {
                        id: projectId,
                        organizationId: membership.organizationId
                    }
                })

                if (!project) {
                    throw new BadRequestError("Project not found");
                }

                const authProject = projectSchema.parse(project);

                if (cannot('update', authProject)) {
                    throw new BadRequestError("You're not allowed to update this project");
                }

                await prisma.project.update({
                    where: {
                        id: projectId
                    },
                    data: {
                        name,
                        description
                    }
                })

                return reply.status(204).send()
            }
        )

}