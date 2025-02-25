import { authMiddleware } from "@/http/middlewares/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export function getOrganization(app: FastifyInstance) {

    app
        .withTypeProvider<ZodTypeProvider>()
        .register(authMiddleware)
        .get(
            '/organizations/:slug',
            {
                schema: {
                    tags: ['organizations'],
                    summary: 'Get details from organization',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        slug: z.string(),
                    }),
                    response: {
                        200: z.object({
                            organization: z.object({
                                id: z.string().uuid(),
                                name: z.string(),
                                slug: z.string(),
                                domain: z.string().nullable(),
                                shouldAttachUsersByDomain: z.boolean(),
                                createdAt: z.date(),
                                updatedAt: z.date(),
                                avatarUrl: z.string().url().nullable(),
                                ownerId: z.string().uuid(),
                            })
                        })
                    }
                }
            },
            async (request) => {
                const { slug } = request.params;
                const { organization } = await request.getUserMembership(slug);
                return {
                    organization: {
                        ...organization,
                        shouldAttachUsersByDomain: organization.shouldAttachUsersByDomain ?? false
                    }
                };
            }
        )

}