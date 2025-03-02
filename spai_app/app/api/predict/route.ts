import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    const fastApiUrl = process.env.FASTAPI_URL || 'http://localhost:8000/predict/';
    
    const fastApiFormData = new FormData();
    fastApiFormData.append('file', file);
    
    const response = await fetch(fastApiUrl, {
      method: 'POST',
      body: fastApiFormData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('FastAPI error:', errorText);
      throw new Error(`FastAPI service returned ${response.status}`);
    }
    
    const predictions = await response.json();
    
    // Return the predictions
    return NextResponse.json({ predictions });
    
  } catch (error) {
    console.error('Error in predict API route:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}