import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const store = getStore("schedule");

  // GET: 데이터 읽기
  if (req.method === "GET") {
    try {
      const data = await store.get("timetable", { type: "json" });
      if (!data) {
        return new Response(JSON.stringify({ empty: true }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
  }

  // POST: 데이터 저장
  if (req.method === "POST") {
    try {
      const body = await req.json();
      await store.setJSON("timetable", body);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
  }

  // OPTIONS: CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/schedule" };
