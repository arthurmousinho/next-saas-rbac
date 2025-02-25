import { NextRequest, NextResponse } from "next/server"
import { signInGithub } from "@/http/auth/sign-in-with-github";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.json(
            { error: 'GitHub code was not found' },
            { status: 400 }
        )
    }

    const { token } = await signInGithub({ code });

    (await cookies()).set('token', token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days 
    });

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    redirectUrl.search = '';

    return NextResponse.redirect(redirectUrl);

}