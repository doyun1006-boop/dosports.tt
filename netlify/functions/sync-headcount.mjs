import { getStore } from '@netlify/blobs';

export default async () => {
  const store = getStore('academy-schedule');
  const data = await store.get('current', { type: 'json' });
  if (!data || !Array.isArray(data.lessons)) {
    return new Response('no data', { status: 500 });
  }

  const res = await fetch(process.env.SHEET_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      token: process.env.SHEET_API_TOKEN,
      lessons: data.lessons.map(l => ({
        id: l.id, category: l.category, day: l.day,
        startTime: l.startTime, endTime: l.endTime,
        name: l.name, place: l.place
      }))
    })
  });

  const text = await res.text();
  return new Response('STATUS ' + res.status + '\n\n' + text.slice(0, 1500));
};
