import type { TApiErrorBody } from "@/types/api";

class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly messages: string[] = [message],
  ) {
    super(message);
    this.name = "HttpError";
  }
}

async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const isFormData = init.body instanceof FormData;
  if (init.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(`/api${path}`, { ...init, headers });
  } catch {
    throw new HttpError(0, "Unable to reach the server. Check your connection.");
  }

  if (!response.ok) {
    const body: TApiErrorBody = await response.json().catch(() => ({}));
    const messages = Array.isArray(body.message)
      ? body.message
      : [body.message ?? "Something went wrong. Please try again."];
    throw new HttpError(response.status, messages[0], messages);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

function toFieldErrors(error: unknown, fields: string[]): Record<string, string> {
  if (!(error instanceof HttpError)) {
    return {};
  }
  if (error.status === 409 && fields.includes("username")) {
    return { username: error.message };
  }
  const fieldErrors: Record<string, string> = {};
  if (error.status === 400) {
    for (const message of error.messages) {
      const field = fields.find((name) => message.startsWith(name));
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = message;
      }
    }
  }
  return fieldErrors;
}

function isUnauthorized(error: unknown): boolean {
  return error instanceof HttpError && error.status === 401;
}

function errorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    if (error.status === 403) return "You don't have access to this data.";
    if (error.status === 404) return "The requested data was not found.";
    return error.messages.join(". ");
  }
  return "Something went wrong. Please try again.";
}

export { HttpError, http, toFieldErrors, isUnauthorized, errorMessage };
