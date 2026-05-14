// app/api/auth/callback/route.ts
// One-time use route to get a fresh Google refresh token.
// Visit /api/test-google-auth, sign in, then copy the token printed here into .env

import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code in callback" }, { status: 400 });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI,
    );

    const { tokens } = await oauth2Client.getToken(code);

    // Display the refresh token in the browser so you can copy it into .env
    return new NextResponse(
      `
      <html>
        <body style="background:#111;color:#fff;font-family:monospace;padding:40px;">
          <h2 style="color:#a855f7;">✅ Google Auth Success</h2>
          <p>Copy this refresh token into your <code>.env</code> as <code>GOOGLE_REFRESH_TOKEN</code>:</p>
          <pre style="background:#222;padding:20px;border-radius:8px;word-break:break-all;color:#4ade80;">
${tokens.refresh_token ?? "⚠️ No refresh token returned — go back and try again (make sure prompt:consent is set)"}
          </pre>
          <p style="color:#71717a;margin-top:20px;">Access token (expires ~1hr, you don't need this):</p>
          <pre style="background:#222;padding:10px;border-radius:8px;word-break:break-all;color:#94a3b8;font-size:12px;">
${tokens.access_token}
          </pre>
          <p style="color:#f87171;margin-top:30px;">🔒 Remove or disable this route after use.</p>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: { "Content-Type": "text/html" },
      },
    );
  } catch (error) {
    console.error("Token exchange error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Token exchange failed",
      },
      { status: 500 },
    );
  }
}
