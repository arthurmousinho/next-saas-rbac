import { authMiddleware } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import z from "zod";

import { BadRequestError } from "../_errors/bad-request-error";
import { createSlug } from "@/utils/create-slug";
import { getUserPermissions } from "@/utils/get-user-permissions";

import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";

export function createProject(app: FastifyInstance) {

    app
        .withTypeProvider<ZodTypeProvider>()
        .register(authMiddleware)
        .post(
            '/organization/:slug/projects',
            {
                schema: {
                    tags: ['projects'],
                    summary: 'Create a new project',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        slug: z.string().uuid(),
                    }),
                    body: z.object({
                        name: z.string(),
                        description: z.string(),
                    }),
                    response: {
                        201: z.object({
                            projectId: z.string().uuid(),
                        })
                    }
                }
            },
            async (request, reply) => {
                const { slug } = request.params;
                const { name, description } = request.body;

                const userId = await request.getCurrentUserId();
                const { organization, membership } = await request.getUserMembership(slug);

                const { cannot } = getUserPermissions(userId, membership.role);

                if (cannot('create', 'Project')) {
                    throw new BadRequestError("You're not allowed to create new projects");
                }

                const project = await prisma.project.create({
                    data: {
                        name,
                        description,
                        slug: createSlug(name),
                        organizationId: organization.id,
                        ownerId: userId
                    }
                })

                return reply.status(201).send({
                    projectId: project.id
                })
            }
        )

}