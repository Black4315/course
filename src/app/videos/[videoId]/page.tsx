import { notFound } from 'next/navigation';
import path from 'path';
import fs from 'fs';
const DefaultPage = require('../../page').default;

interface Props {
    params: { videoId: string };
}

export default async function VideoPage({ params }: Props) {
    const filePath = path.resolve('./data/videos.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const videos = JSON.parse(fileContent);
    const { videoId } = await params;


    const videoExists = videos.some((video: any) => video.videoId === videoId);

    if (!videoExists) {
        notFound();
    }

    // if the video exists, render the default page
    return <DefaultPage />;
}