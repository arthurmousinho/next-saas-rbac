import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import z from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { prisma } from "@/lib/prisma";
import { env } from "@saas/env";

export async function authenticateWithGithub(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>().post('/sessions/github', {
        schema: {
            tags: ['auth'],
            summary: 'Authenticate with Github',
            body: z.object({
                code: z.string(),
            }),
            response: {
                201: z.object({
                    token: z.string(),
                })
            }
        }
    }, async (request, reply) => {
        const { code } = request.body;

        const githubOAuthUrl = new URL(
            'https://github.com/login/oauth/access_token'
        )

        githubOAuthUrl.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID);
        githubOAuthUrl.searchParams.set('client_secret', env.GITHUB_OAUTH_CLIENT_SECRET);
        githubOAuthUrl.searchParams.set('redirect_uri', env.GITHUB_OAUTH_REDIRECT_URI);
        githubOAuthUrl.searchParams.set('code', code);

        const githubHubAccessTokenResponse = await fetch(
            githubOAuthUrl,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json'
                }
            }
        );

        const githubAccessTokenData = await githubHubAccessTokenResponse.json();

        console.log(githubAccessTokenData)

        const { access_token: githubAccessToken } = z.object({
            access_token: z.string(),
            token_type: z.literal('bearer'),
            scope: z.string(),
        }).parse(githubAccessTokenData);

        const githubUserResponse = await fetch(
            'https://api.github.com/user',
            {
                headers: {
                    Authorization: `Bearer ${githubAccessToken}`,
                }
            }
        );

        const githubUserData = await githubUserResponse.json();

        console.log(githubUserData)

        const { id: githubId, avatar_url: avatarUrl, name, email } = z.object({
            id: z.number().int(),
            avatar_url: z.string().url(),
            name: z.string().nullable(),
            email: z.string().email().nullable(),
        }).parse(githubUserData);

        if (email === null) {
            throw new BadRequestError('Your GitHub account must have an email to authenticate.');
        }

        let user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    avatarUrl,
                    name,
                }
            })
        }

        let account = await prisma.account.findUnique({
            where: {
                provider_userId: {
                    provider: 'GITHUB',
                    userId: user.id
                }
            }
        });

        if (!account) {
            account = await prisma.account.create({
                data: {
                    provider: 'GITHUB',
                    providerAccountId: githubId.toString(),
                    userId: user.id,
                }
            })
        }

        const token = app.jwt.sign(
            {
                name: user.name,
                avatarUrl: user.avatarUrl,
            },
            {
                sub: user.id,
                expiresIn: '7 days',
            }
        );

        return reply.status(201).send({ token });
    })

}