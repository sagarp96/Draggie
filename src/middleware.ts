import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const res = (await updateSession(request)) as NextResponse;
  const isProd = process.env.NODE_ENV === "production";

  const nonce = crypto.randomUUID();
  const supabaseHost = "*.supabase.co";

  // Dev needs inline + eval + ws for HMR. Prod uses nonce and blocks eval.
  const scriptSrc = isProd
    ? `'self' 'nonce-${nonce}' 'strict-dynamic' https:`
    : `'self' 'unsafe-inline' 'unsafe-eval' http: https:`;

  const connectSrc = [
    `'self'`,
    `https://${supabaseHost}`,
    `wss://${supabaseHost}`,
    isProd ? "" : "ws: http: https:", // HMR and dev websockets
  ]
    .filter(Boolean)
    .join(" ");

  const csp = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    `connect-src ${connectSrc}`,
    `img-src 'self' data: blob: https://${supabaseHost}`,
    "font-src 'self' data:",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "worker-src 'self' blob:",
  ].join("; ");

  res.headers.set("Content-Security-Policy", csp);
  if (isProd) {
    // Required for Next.js to add nonce to all its inline scripts/styles
    res.headers.set("x-nextjs-nonce", nonce);
    // Optional: keep for your own use (e.g., useNonce + <Script nonce={...}>)
    res.headers.set("x-nonce", nonce);
  }

  return res;
}

// Exclude static assets. Keep HMR endpoints included so they get the relaxed dev CSP.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
