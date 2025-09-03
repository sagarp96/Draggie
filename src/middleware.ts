import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const isProd = process.env.NODE_ENV === "production";
  const nonce = crypto.randomUUID();

  const reqHeaders = new Headers(request.headers);
  reqHeaders.set("x-nextjs-nonce", nonce);
  reqHeaders.set("x-nonce", nonce);

  const res = NextResponse.next({ request: { headers: reqHeaders } });

  await updateSession(request);

  const supabaseHost = "*.supabase.co";

  // IMPORTANT: relax prod CSP so the app hydrates even if Next doesn't attach nonce
  const scriptSrc = isProd
    ? `'self' 'unsafe-inline' https:` // removed 'strict-dynamic' and rely on inline allowance
    : `'self' 'unsafe-inline' 'unsafe-eval' http: https: ws:`;

  const styleSrc = `'self' 'unsafe-inline'`; // keep inline styles allowed

  const connectSrc = [
    `'self'`,
    `https://${supabaseHost}`,
    `wss://${supabaseHost}`,
    isProd ? "" : "ws: http: https:",
    "https://vitals.vercel-insights.com",
  ]
    .filter(Boolean)
    .join(" ");

  const csp = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    // Optional: forbid inline event handlers while allowing inline <script> tags
    "script-src-attr 'none'",
    `style-src ${styleSrc}`,
    `connect-src ${connectSrc}`,
    `img-src 'self' data: blob: https://${supabaseHost}`,
    "font-src 'self' data:",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "worker-src 'self' blob:",
  ].join("; ");

  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("x-nextjs-nonce", nonce);
  res.headers.set("x-nonce", nonce);

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
