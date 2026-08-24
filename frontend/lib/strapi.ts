const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function strapiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Strapi API error: ${res.status}`);
  }
  return res.json();
}
