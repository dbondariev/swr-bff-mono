export async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string> ?? {}),
  };

  if (init?.body) {
    headers["content-type"] = "application/json";
  }

  const res = await fetch(url, {
    ...init,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed: ${res.status} ${text}`);
  }

  return (await res.json()) as T;
}
