import { prisma } from "@/lib/prisma";

import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import z from "zod";

export async function requestPasswordRecover(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>().post(
        '/password/recover',
        {
            schema: {
                tags: ['auth'],
                summary: 'Request password recover',
                body: z.object({
                    email: z.string().email()
                }),
                response: {
                    201: z.null()
                }
            }
        }, async (request, reply) => {
            const { email } = request.body;

            const userFormEmail = await prisma.user.findUnique({
                where: {
                    email
                }
            })

            if (!userFormEmail) {
                // We don't want people to know if user realy exists!
                return reply.status(201).send()
            }

            const { id: code } = await prisma.token.create({
                data: {
                    type: 'PASSWORD_RECOVER',
                    userId: userFormEmail.id
                }
            })

            // send e-mail with password recover link

            console.log('Recover password token: ' + code);
            reply.status(201).send();
        })

}