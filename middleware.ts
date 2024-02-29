import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./lib/token";
import { getErrorResponse } from "./lib/api-helpers";

interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string;
  };
}

const publicAdminApiRoutes = [
  "/api/admin/auth/login",
  "/api/admin/auth/register",
  "/api/admin/uploads",
];

export async function middleware(req: NextRequest) {
  let token: string | undefined;
  if (
    req.cookies.has("token") &&
    req.nextUrl.pathname.includes("/admin") &&
    !publicAdminApiRoutes.includes(req.nextUrl.pathname)
  ) {
    token = req.cookies.get("token")?.value;
  } else if (req.headers.get("Authorization")?.startsWith("Bearer ")) {
    token = req.headers.get("Authorization")?.substring(7);
  }
  const response = NextResponse.next();
  if (!token) {
    if (req.nextUrl.pathname.startsWith("/admin/")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    } else if (req.nextUrl.pathname.includes("/api")) {
      return getErrorResponse(401, "Authorization Required");
    }
  }

  if (
    (!publicAdminApiRoutes.includes(req.nextUrl.pathname) &&
      req.nextUrl.pathname.startsWith("/api/admin")) ||
    req.nextUrl.pathname === "/admin"
  ) {
    try {
      if (token) {
        const { sub } = await verifyJWT<{ sub: string }>(token);
        response.headers.set("X-USER-ID", sub);
        (req as AuthenticatedRequest).user = { id: sub };
        if (req.nextUrl.pathname === "/admin") {
          return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }
      }
    } catch (error) {
      if (req.nextUrl.pathname.startsWith("/api/admin")) {
        return getErrorResponse(401, "Token is invalid or user doesn't exists");
      }

      return NextResponse.redirect(
        new URL(`/admin?${new URLSearchParams({ error: "badauth" })}`, req.url)
      );
    }
  } else if (
    req.nextUrl.pathname.startsWith("/api/template") ||
    publicAdminApiRoutes.includes(req.nextUrl.pathname)
  ) {
    if (token !== process.env.NEXT_PUBLIC_BEARER?.substring(7)) {
      return getErrorResponse(401, "Invalid Authorization Token");
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/:path*"],
};
