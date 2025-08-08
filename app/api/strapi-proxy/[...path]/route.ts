import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getUserRole } from '@/lib/auth-helpers';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathString = path.join('/');
  
  // Public read access for published content
  const response = await fetch(`${STRAPI_URL}/api/${pathString}${req.nextUrl.search}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  const data = await response.json();
  return NextResponse.json(data);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathString = path.join('/');
  
  // Check authentication
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Get user and role
  const user = await currentUser();
  const role = await getUserRole();
  if (role === 'viewer') {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }
  
  const body = await req.json();
  
  // Forward request with auth headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${STRAPI_ADMIN_TOKEN}`,
    'x-user-id': userId,
    'x-role': role,
  };
  
  // Add user email if available
  if (user?.emailAddresses?.[0]?.emailAddress) {
    headers['x-user-email'] = user.emailAddresses[0].emailAddress;
  }
  
  const response = await fetch(`${STRAPI_URL}/api/${pathString}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathString = path.join('/');
  
  // Check authentication
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Get role
  const role = await getUserRole();
  if (role === 'viewer') {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }
  
  const body = await req.json();
  
  const response = await fetch(`${STRAPI_URL}/api/${pathString}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${STRAPI_ADMIN_TOKEN}`,
      'x-user-id': userId,
      'x-role': role,
    },
    body: JSON.stringify(body),
  });
  
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathString = path.join('/');
  
  // Check authentication
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check role - must be at least manager for delete
  const role = await getUserRole();
  if (role === 'viewer' || role === 'ambassador') {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }
  
  const response = await fetch(`${STRAPI_URL}/api/${pathString}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${STRAPI_ADMIN_TOKEN}`,
    },
  });
  
  return NextResponse.json(null, { status: response.status });
}