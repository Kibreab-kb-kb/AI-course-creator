import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";
import { createClient } from "./lib/supabase/server";

const publicRoutes = ["/auth", "/otp", "/api/:path/:trpc"];

const isAuthenticated = async () => {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  return user.data.user ? true : false;
};

export async function middleware(request: NextRequest) {
  await updateSession(request);
  const url = request.nextUrl.clone();
  const authenticated = await isAuthenticated();

  if (request.nextUrl.pathname === "/") {
    if (authenticated) {
      url.pathname = "/home";
      return NextResponse.redirect(url);
    } else {
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }
  }

  if (publicRoutes.includes(request.nextUrl.pathname) && authenticated) {
    url.pathname = "/home";
    return NextResponse.redirect(url);
  } else if (
    !publicRoutes.includes(request.nextUrl.pathname) &&
    !authenticated
  ) {
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|.*?trpc.*?|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
