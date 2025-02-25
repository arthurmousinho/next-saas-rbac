import { authMiddleware } from "@/http/middlewares/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { roleSchema } from "@saas/auth";

export function getMembership(app: FastifyInstance) {

    app
        .withTypeProvider<ZodTypeProvider>()
        .register(authMiddleware)
        .get(
            '/organizations/:slug/membership',
            {
                schema: {
                    tags: ['organizations'],
                    summary: 'Get user membership on organization',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        slug: z.string(),
                    }),
                    response: {
                        200: z.object({
                            membership: z.object({
                                id: z.string(),
                                role: roleSchema,
                                userId: z.string().uuid(),
                                organizationId: z.string(),
                            })
                        })
                    }
                }
            },
            async (request, reply) => {
                const { slug } = request.params;
                const { membership } = await request.getUserMembership(slug);

                return reply.status(200).send({
                    membership: {
                        id: membership.id,
                        role: membership.role,
                        userId: membership.userId,
                        organizationId: membership.organizationId,
                    }
                });

            }
        )

}