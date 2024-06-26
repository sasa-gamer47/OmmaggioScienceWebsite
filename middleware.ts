import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
    publicRoutes: [
        '/',
        '/api/webhook/clerk',
        '/api/uploadthing',
    ],
    ignoredRoutes: [
        '/api/webhook/clerk',
        '/api/uploadthing',
    ]
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};


