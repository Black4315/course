// import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
// import path from 'path';

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { videoName: string } } 
// ) {
//   const { videoName } = params;
//   const range = req.headers.get("range");

//   if (!videoName) {
//     return NextResponse.json({ error: "Video name is required" }, { status: 400 });
//   }

//   if (!range) {
//     return NextResponse.json({ error: "Requires Range header" }, { status: 400 });
//   }

//   const videoPath = path.resolve(`./public/assets/videos/${videoName}`);

//   let videoSize: number;
//   try {
//     videoSize = fs.statSync(videoPath).size;
//   } catch (error) {
//     return NextResponse.json({ error: "Video not found" }, { status: 404 });
//   }

//   const CHUNK_SIZE = 10 ** 6; // 1MB
//   const start = Number(range.replace(/\D/g, ""));
//   const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

//   const contentLength = end - start + 1;

//   const headers = new Headers({
//     "Content-Range": `bytes ${start}-${end}/${videoSize}`,
//     "Accept-Ranges": "bytes",
//     "Content-Length": contentLength.toString(),
//     "Content-Type": "video/mp4",
//   });

//   const videoStream = fs.createReadStream(videoPath, { start, end });

//   return new Response(new ReadableStream({
//     start(controller) {
//       videoStream.on("data", (chunk) => controller.enqueue(chunk));
//       videoStream.on("end", () => controller.close());
//       videoStream.on("error", (err) => controller.error(err));
//     }
//   }), {
//     status: 206,
//     headers,
//   });
// }
export async function GET(){

  return NextResponse.json({ video: "Video name" }, { status: 200 }); 

}