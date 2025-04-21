import { NextResponse } from 'next/server';
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


export async function GET(request: Request, { params }: { params: { videoId: string } }) {
    const { videoId } = await params;

    const videoData = await fetchVideoData(videoId)

    if (!videoData) {
        return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json(videoData);
}
