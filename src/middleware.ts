import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/session";

/** /admin (yalnızca admin) ve /panel (oturumlu sporcu/admin) rotalarını korur. */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);

  const redirectTo = (path: string, withNext = false) => {
    const url = req.nextUrl.clone();
    url.pathname = path;
    url.search = "";
    if (withNext) url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  };

  // --- /admin --- (paneller tamamen ayrı: yalnız admin oturumu)
  if (pathname.startsWith("/admin")) {
    const isLogin = pathname === "/admin/giris";
    if (!session && !isLogin) return redirectTo("/admin/giris", true);
    if (session?.role === "admin" && isLogin) return redirectTo("/admin");
    // Sporcu oturumu admin'e giremez; ama /panel'e geri atmak yerine admin
    // GİRİŞİNE gider (portallar ayrı — isteyen admin hesabıyla giriş yapar).
    if (session && session.role !== "admin" && !isLogin) return redirectTo("/admin/giris", true);
    return NextResponse.next();
  }

  // --- /panel --- (yalnız sporcu oturumu; admin kendi paneline)
  if (pathname.startsWith("/panel")) {
    if (!session) return redirectTo("/giris", true);
    if (!session.athleteId) return redirectTo("/admin");
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/panel/:path*"],
};
