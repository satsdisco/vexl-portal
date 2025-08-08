import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:1337/api/presentations?populate=*', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch from Strapi', status: response.status },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json({
      success: true,
      count: data.data.length,
      presentations: data.data
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Connection failed', details: error },
      { status: 500 }
    );
  }
}