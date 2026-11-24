import type { NextRequest } from "next/server";
import { backendFetch } from "@/utils/api";
import { getSession } from "@/utils/session";

const FORWARDED_REQUEST_HEADERS = ["accept", "content-type"];
const FORWARDED_RESPONSE_HEADERS = [
  "content-type",
  "content-length",
  "cache-control",
  "content-security-policy",
  "x-content-type-options",
];

async function proxy(request: NextRequest, { params }: RouteContext<"/api/[...path]">) {
  const session = await getSession();
  if (!session) {
    return Response.json(
      { statusCode: 401, message: "Your session has expired. Please sign in again." },
      { status: 401 },
    );
  }

  const { path } = await params;
  const target = `/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;

  const headers = new Headers();
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const body = hasBody ? await request.arrayBuffer() : undefined;

  let upstream: Response;
  try {
    upstream = await backendFetch(target, {
      method: request.method,
      headers,
      body: body && body.byteLength > 0 ? body : undefined,
    });
  } catch {
    return Response.json(
      { statusCode: 502, message: "Unable to reach the server. Please try again later." },
      { status: 502 },
    );
  }

  const responseHeaders = new Headers();
  for (const name of FORWARDED_RESPONSE_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }
  if (!responseHeaders.has("cache-control")) {
    responseHeaders.set("cache-control", "no-store");
  }

  const noBody = upstream.status === 204 || upstream.status === 304;
  return new Response(noBody ? null : upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export { proxy as GET, proxy as POST, proxy as PATCH, proxy as PUT, proxy as DELETE };
