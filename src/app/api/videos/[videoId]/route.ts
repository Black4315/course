import { NextRequest, NextResponse } from 'next/server';
// import type { RouteContext } from 'next';
import path from 'path';
import fs from 'fs/promises';

async function fetchVideoData(videoId: string) {
    const filePath = path.resolve('./data/videos.json');
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const videos = JSON.parse(fileContent);
        return videos.find((video: { videoId: string }) => video.videoId === videoId) || null;
    } catch (error) {
        console.error('Error reading video data:', error);
        return null;
    }
}


export async function GET(request: NextRequest,context: any) {
    const { videoId } = await context.params;

    if (!videoId) {
        return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }
    const videoData = await fetchVideoData(videoId);

    if (!videoData) {
        return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json(videoData);
}
