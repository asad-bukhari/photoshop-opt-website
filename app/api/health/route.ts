export const runtime = 'nodejs';

export async function GET() {
  return Response.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: '3.0.0'
  });
}
