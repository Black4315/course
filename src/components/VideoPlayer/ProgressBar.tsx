import { formatTime } from '@/lib';
import React, { useEffect, useRef } from 'react'
import useVideoControls from './useVideoControls';

interface Video_data {
    id: number;
    title: string;
    description: string;
    url: string;
    sprites: string[];
    thumbnail: string;
}

const ProgressBar = ({ videoRef, mobileCheck, video_data, onChangeVideo, setIsBuffering }:
    {   videoRef: any;
        mobileCheck: boolean; 
        video_data: Video_data | null; 
        onChangeVideo: (change: any) => void ; 
        setIsBuffering: (change: any) => void ;}) => {
    const {
        progressBarRef,
        previewRef, 
        progressRef,
        bufferedRef,
        settimeDisplay,
    } =  useVideoControls()

  
    useEffect(() => {
        if (videoRef.current && progressBarRef.current) {
            handleProgress()
        }
    }, [video_data])

    // handle progress
    const handleProgress = () => {
        if (!videoRef.current || !progressBarRef.current) return;

        let isDragging = false, newTime = 0;
        const [start, move, end] = mobileCheck ? ['touchstart', 'touchmove', 'touchend'] : ['mousedown', 'mousemove', 'mouseup'];
        const getRect = () => progressBarRef.current!.getBoundingClientRect();
        const getRectPrev = () => previewRef.current!.getBoundingClientRect();


        // update preview
        const updatePreview = (e: any) => {
            const rect = getRect();
            const rectPrev = getRectPrev();
            const clientX = e.clientX ?? e.changedTouches?.[0]?.clientX;
            const offsetX = Math.min(Math.max(clientX - rect.left, 0), rect.width);

            // // new time and handle previw video and time
            newTime = (offsetX / rect.width) * videoRef.current!.duration;
            const previewTime = previewRef.current?.querySelector('span') as HTMLSpanElement;
            previewTime.textContent = Number.isNaN(newTime) ? '0:00' : formatTime(newTime);

            const sprites = video_data?.sprites || ['/assets/images/1x1.png',];
            const columns = 10;
            const rows = 5

            const spriteImage = new window.Image(); // this image have no need exept know width and height of frame sprite 
            spriteImage.src = sprites[0];


            const thumbWidth = (spriteImage.width / columns);
            const thumbHeight = (spriteImage.height / rows);
            const duration = videoRef.current!.duration;
            const time = (offsetX / rect.width) * duration;

            const totalFrames = columns * rows * sprites.length;
            const frameIndex = Math.floor((time / duration / 1.18) * totalFrames);

            const spriteIndex = Math.floor(frameIndex / (columns * rows));
            const indexInSprite = frameIndex % (columns * rows);

            const row = Math.floor(indexInSprite / columns);
            const col = indexInSprite % columns;
            const thumbPrev = previewRef.current!.querySelector('#preview') as HTMLDivElement

            // i wanna .6 as scale factor in here but there is changeing in width of preview on resizeing so i made default width 196px
            // to know ratio of scale factor i used this formula of 196
            // .615 / (196) = 0.00306
            const scaleFactor = (.615 / 196) * thumbPrev.getBoundingClientRect().width

            previewRef.current!.style.display = 'flex'
            thumbPrev.style.backgroundImage = `url(${sprites[spriteIndex]})`;
            requestAnimationFrame(() => {
                thumbPrev.style.display = 'block';
                thumbPrev.style.left = `${offsetX}px`;
                thumbPrev.style.backgroundSize = `${spriteImage.width * scaleFactor}px ${spriteImage.height * scaleFactor}px`;
                thumbPrev.style.backgroundPosition = `${-col * thumbWidth * scaleFactor}px ${-row * thumbHeight * scaleFactor}px`;
                previewRef.current!.style.left = `${Math.min(Math.max(offsetX - rectPrev.width / 2, 0), rect.width - rectPrev.width)}px`
            })
        };

        // update progress bar as you drag
        const updateProgress = (e: any) => {
            const rect = getRect();
            const clientX = e.clientX ?? e.changedTouches?.[0]?.clientX;
            const offsetX = Math.min(Math.max(clientX - rect.left, 0), rect.width);

            // new time and handle previw video and time
            newTime = (offsetX / rect.width) * videoRef.current!.duration;
            progressRef.current!.style.width = `${(newTime / videoRef.current!.duration) * 100}%`
        }

        // preview handler event
        progressBarRef.current.addEventListener(!mobileCheck ? 'mouseenter' : start, (e: any) => {
            updatePreview(e);
            progressBarRef.current!.addEventListener(move, updatePreview);

            const leaveHandler = () => {
                previewRef.current!.style.display = 'none';
                progressBarRef.current!.removeEventListener(move, updatePreview);
                progressBarRef.current!.removeEventListener(!mobileCheck ? 'mouseleave' : end, leaveHandler);
            };

            progressBarRef.current!.addEventListener(!mobileCheck ? 'mouseleave' : end, leaveHandler);
        });
        // preview handler event

        // progress handler event
        progressBarRef.current!.addEventListener(start, (e: any) => {
            onChangeVideo((pre:any) => ({ ...pre, isEnd: false, isPlaying: false }));
            isDragging = true;

            // for update preview and progress in start
            updatePreview(e)
            updateProgress(e)

            const moveHandler = (e: any) => { isDragging && (updatePreview(e), updateProgress(e)) };

            // update main video 
            const endHandler = () => {
                isDragging = false;
                videoRef.current!.currentTime = newTime;

                // hide the preview
                previewRef.current!.style.display = 'none'
                onChangeVideo((pre:any) => ({ ...pre, isPlaying: true }));

                // clean handler
                document.removeEventListener(move, moveHandler);
                document.removeEventListener(end, endHandler);
            };
            document.addEventListener(move, moveHandler);
            document.addEventListener(end, endHandler);
        });
        // progress handler event


        // Update main progress bar
        videoRef.current.addEventListener('timeupdate', () => {
            if (videoRef.current && !isDragging) {
                const progressPercent = (videoRef.current.currentTime / videoRef.current.duration) * 100;
                progressRef.current && (progressRef.current.style.width = `${progressPercent}%`);
                videoRef.current.duration && settimeDisplay(formatTime(videoRef.current.currentTime) + ' / ' + formatTime(videoRef.current.duration));
                handleBuffer()
                setIsBuffering(false)
            }
        });

        // loading
        videoRef.current.addEventListener('waiting', () => {
            setIsBuffering(true)
        })


        videoRef.current.addEventListener('seeked', handleBuffer)
    };


    const handleBuffer = () => {
        if (!videoRef.current || !bufferedRef.current) return;

        const video = videoRef.current;
        let bufferedPercent = 0;

        for (let i = 0; i < video.buffered.length; i++) {
            const start = video.buffered.start(i);
            const end = video.buffered.end(i);

            if (video.currentTime >= start && video.currentTime <= end) {
                bufferedPercent = (end / video.duration) * 100
            }
        }

        bufferedRef.current.style.width = `${bufferedPercent}%`;
    };


    return (
        <div ref={progressBarRef} className={`relative w-full h-1 hover:h-[7px] draggable duration-75 transition-all bg-white/20 cursor-pointer `} id="progressBarRef">
            <span className="absolute w-full bottom-0 sm:-bottom-1 z-1 h-5 bg-transparent"></span>
            <div className="progress relative z-1" ref={progressRef} id="progress"></div>
            <div className="w-0 h-full bg-[#b3b3b39d] absolute top-0 " ref={bufferedRef}></div>

            <div className="preview" ref={previewRef}>
                <div className='rounded-md w-[150px] sm:w-[200px] aspect-video p-0.5 relative bg-white overflow-hidden'>
                    <div id="preview" className='h-full rounded-md'></div>
                </div>
                <span className="mt-1.5 font-bold" id="previewTime">00:00</span>
            </div>
        </div>
    )
}

export default ProgressBar