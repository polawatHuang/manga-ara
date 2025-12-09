const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/upload`;

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
