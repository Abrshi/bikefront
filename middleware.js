import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const token = req.cookies.get("accessToken")?.value;
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
console.log("Middleware check - Token:", token, "Admin Route:", isAdminRoute);
  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    if (token) {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);

      const { payload } = await jwtVerify(token, secret);

      if (isAdminRoute && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};