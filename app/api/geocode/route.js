export async function POST(req) {
  let location = await req.json();
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${location}&format=json`,
    {
      headers: {
        "User-Agent": "my-weather-app (your@email.com)",
      },
    }
  );
  const data = await response.json();
  return Response.json(data[0]);
}
