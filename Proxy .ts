import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/categories") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/suppliers") ||
    pathname.startsWith("/stock") ||
    pathname.startsWith("/alerts") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/settings");

  if (isProtected && !isLoggedIn) {
    return Response.redirect(new URL("/sign-in", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};