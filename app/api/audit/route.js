import { NextResponse } from 'next/server';
import { AuditEngine } from '@/lib/auditEngine';

export async function POST(request) {
    try {
        const body = await request.json();
        const { url } = body;
        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }
        const report = await AuditEngine.analyzeWebsite(url);
        return NextResponse.json({ success: true, report });
    } catch(e) {
        return NextResponse.json({ error: 'Failed to process website audit' }, { status: 500 });
    }
}
