import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/http/middlewares/auth";

import z from "zod";

import { organizationSchema } from "@saas/auth";
import { UnauthorizedError } from "../_errors/unauthorized-error";
import { getUserPermissions } from "@/utils/get-user-permissions";

import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export function shutdownOrganization(app: FastifyInstance) {

    app
        .withTypeProvider<ZodTypeProvider>()
        .register(authMiddleware)
        .delete(
            '/organizations/:slug',
            {
                schema: {
                    tags: ['organizations'],
                    summary: 'Shutdown an organization',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        slug: z.string(),
                    }),
                    response: {
                        204: z.null()
                    }
                }
            },
            async (request, reply) => {
                const { slug } = request.params;

                const userId = await request.getCurrentUserId();
                const { membership, organization } = await request.getUserMembership(slug);

                const authOrganization = organizationSchema.parse({
                    id: organization.id,
                    ownerId: organization.ownerId,
                });

                const { cannot } = getUserPermissions(userId, membership.role);

                if (cannot('delete', authOrganization)) {
                    throw new UnauthorizedError("You're not allowed to shutdown this organization.")
                }

                await prisma.organization.delete({
                    where: {
                        id: organization.id,
                    }
                })

                return reply.status(204).send()
            }
        )

}