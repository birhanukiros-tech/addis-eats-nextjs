import { NextResponse } from "next/server";

export function middleware(request) {
  const customerCookie = request.cookies.get(
    "addis-eats-customer"
  )?.value;

  if (!customerCookie) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set(
      "next",
      request.nextUrl.pathname
    );

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*"],
};