const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/auth`;

export async function POST(req) {
  try {
    const url = new URL(req.url);
    const path = url.searchParams.get('action'); // register, login, logout, verify
    const body = await req.json();
    
    const response = await fetch(`${API_URL}/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
