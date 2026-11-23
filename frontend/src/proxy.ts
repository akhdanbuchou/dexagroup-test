import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/utils/jwt";
import { ROLE_HOME } from "@/utils/roles";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (pathname === "/login") {
    return session
      ? NextResponse.redirect(new URL(ROLE_HOME[session.role], request.url))
      : NextResponse.next();
  }

  if (!session) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    if (token) {
      response.cookies.delete(SESSION_COOKIE);
    }
    return response;
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL(ROLE_HOME[session.role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/admin/:path*", "/attendance/:path*"],
};
