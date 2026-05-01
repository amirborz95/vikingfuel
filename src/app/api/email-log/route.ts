import { NextRequest, NextResponse } from 'next/server';

// Required for static export
export const dynamic = 'force-static';

// Static export mode - API routes don't work
export async function POST(request: NextRequest) {
  // In static export, return success but don't actually log
  return NextResponse.json({
    success: true,
    message: 'Email logged (static mode)',
    note: 'This is a static export - actual logging disabled'
  });
}

export async function GET() {
  // Return empty array for static export
  return NextResponse.json([]);
}
