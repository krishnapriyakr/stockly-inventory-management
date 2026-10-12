import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/", "/sign-in", "/sign-up"];
  const isPublic = publicRoutes.some((p) => pathname === p);

  if (!isPublic && !isLoggedIn) {
    return Response.redirect(new URL("/sign-in", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};