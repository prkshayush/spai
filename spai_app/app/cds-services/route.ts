import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  
  const cdsServices = {
    "services": [
      {
        "id": "skin-analysis",
        "title": "Skin Lesion Analysis",
        "description": "AI-powered skin lesion analysis and treatment recommendations",
        "hook": "patient-view"
      }
    ]
  };

  return NextResponse.json(cdsServices, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}