import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {cookies} from "next/headers";

// This function can be marked `async` if using `await` inside
export async  function middleware(request: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const PUBLIC_ROUTES = ['/forgot-password', '/reset-password', '/sign-in', '/sign-up'];
    const pathName = request.nextUrl.pathname

    if(pathName === '/') return;

    if(token && PUBLIC_ROUTES.includes(pathName)){
        return NextResponse.redirect(new URL('/', request.url))
    }

    if(!token && !PUBLIC_ROUTES.includes(pathName)){
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}
