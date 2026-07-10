import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken, verifyPanelToken, ADMIN_COOKIE, PANEL_COOKIE } from "@/lib/session";

/** /admin ve /panel rotalarını korur. Portallar TAMAMEN AYRI: her biri kendi
 *  çerezine bakar, çapraz yönlendirme yoktur. Aynı tarayıcıda iki portala
 *  aynı anda oturum açılabilir. */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const redirectTo = (path: string, withNext = false) => {
    const url = req.nextUrl.clone();
    url.pathname = path;
    url.search = "";
    if (withNext) url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  };

  // --- /admin --- yalnız admin çerezi geçerli
  if (pathname.startsWith("/admin")) {
    const admin = await verifyAdminToken(req.cookies.get(ADMIN_COOKIE)?.value);
    const isLogin = pathname === "/admin/giris";
    if (!admin && !isLogin) return redirectTo("/admin/giris", true);
    if (admin && isLogin) return redirectTo("/admin");
    return NextResponse.next();
  }

  // --- /panel --- yalnız panel (sporcu) çerezi geçerli
  if (pathname.startsWith("/panel")) {
    const athlete = await verifyPanelToken(req.cookies.get(PANEL_COOKIE)?.value);
    if (!athlete) return redirectTo("/giris", true);
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/panel/:path*"],
};
