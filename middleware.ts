import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {},
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Protect admin routes.
        if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
          const role = (token as any)?.role as string | undefined;
          return role === "ADMIN" || role === "STAFF";
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};


