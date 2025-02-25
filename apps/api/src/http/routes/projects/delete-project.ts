import { authMiddleware } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";

import z from "zod";
import { projectSchema } from "@saas/auth";

import { BadRequestError } from "../_errors/bad-request-error";
import { getUserPermissions } from "@/utils/get-user-permissions";

import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";

export function deleteProject(app: FastifyInstance) {

    app
        .withTypeProvider<ZodTypeProvider>()
        .register(authMiddleware)
        .delete(
            '/organization/:slug/projects/:projectId',
            {
                schema: {
                    tags: ['projects'],
                    summary: 'Delete a project',
                    security: [{ bearerAuth: [] }],
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

                if (cannot('delete', authProject)) {
                    throw new BadRequestError("You're not allowed to delete this project");
                }

                await prisma.project.delete({
                    where: {
                        id: projectId
                    }
                })

                return reply.status(204).send()
            }
        )

}