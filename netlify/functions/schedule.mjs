import { getStore } from "@netlify/blobs";

const store = getStore("dosports-live-data");
const KEY = "schedule.json";

function defaultData() {
  return {
    bb: { wdDays:["월","화","수","목","금"], wdTimes:["14:00-15:00","15:00-16:00","16:00-17:00","17:00-18:00","18:00-19:00","19:00-20:00"], wdGrid:Array.from({length:6},()=>Array.from({length:5},()=>[])), note:"", sat:{times:[],cells:[]}, sun:{times:[],cells:[]} },
    sc: { wdDays:["월","화","수","목","금"], wdTimes:["14:00-15:00","15:00-16:00","16:00-17:00","17:00-18:00","18:00-19:00","19:00-20:00"], wdGrid:Array.from({length:6},()=>Array.from({length:5},()=>[])), note:"", sat:{times:[],cells:[]}, sun:{times:[],cells:[]} },
    kd: { wdDays:["월","화","수","목","금"], wdTimes:["14:00-15:00","15:00-16:00","16:00-17:00","17:00-18:00","18:00-19:00","19:00-20:00"], wdGrid:Array.from({length:6},()=>Array.from({length:5},()=>[])), note:"", sat:{times:[],cells:[]}, sun:{times:[],cells:[]} },
    ticker:["공지사항을 입력하세요"],
    memo:{bb:"",sc:"",kd:""}
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

export default async (request) => {
  if (request.method === "GET") {
    const saved = await store.get(KEY, { type: "json" });
    return json({ data: saved?.data || saved || defaultData(), updatedAt: saved?.updatedAt || "" });
  }

  if (request.method === "POST") {
    const body = await request.json().catch(() => null);
    if (!body?.data) return json({ error: "data is required" }, 400);
    const payload = { data: body.data, updatedAt: new Date().toISOString() };
    await store.setJSON(KEY, payload);
    return json({ ok: true, updatedAt: payload.updatedAt });
  }

  return json({ error: "Method not allowed" }, 405);
};
