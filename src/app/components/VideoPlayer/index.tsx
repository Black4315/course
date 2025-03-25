"use client";
import React, { useEffect, } from 'react'
import { IoMdPause } from "react-icons/io";
import { IoMdPlay } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { IoReload } from "react-icons/io5";

import { IoVolumeHighSharp } from "react-icons/io5";
import { IoVolumeMuteSharp } from "react-icons/io5";
import { RiCollapseHorizontalLine, RiExpandHorizontalLine } from "react-icons/ri";

import { BiFullscreen } from "react-icons/bi";
import { BiExitFullscreen } from "react-icons/bi";

import { animshowhide, createTooltip, formatTime, simpleAnim } from '../../lib';
import ContainerEvents from './ContainerEvents';
import Settings from './Settings';
import useVideoControls from './useVideoControls';
import { PlayIcon } from '@/utils';


const VideoPlayer = ({ onExpand, isWide, onStart, mobileCheck }:
  { onExpand: (state: any) => void; onStart: (state: any) => void; isWide: boolean; mobileCheck: boolean }) => {

  const {
    videoRef,
    progressBarRef,
    progressRef,
    settingsBtn,
    previewRef,
    controlContainerRef,
    controlRef,
    bufferedRef,
    canvasRef,
    video,
    timeDisplay,
    isSettingOpen,
    volume,
    loadedData,
    hideControl,
    isBuffering,
    setIsBuffering,
    setVideo,
    setvolume,
    handleProcess,
    settimeDisplay,
    setloadedData,
    setisSettingOpen
  } = useVideoControls()
  const { isEnd, isFullscreen, isMute, startPlay, isPlaying } = video
  const timeoutVisibility = 200

  /// create tooltip for elements And check if the user is on a mobile user agent 
  useEffect(() => {
    !mobileCheck && createTooltip();
    videoRef.current?.load(); // force metadata to load
  }, [])


  //start video play,pause
  useEffect(() => {
    // ensures that loaded before handling playback
    if (!videoRef.current || !loadedData.length) return;

    // handle play/pause logic
    isPlaying && startPlay ? (
      videoRef.current.play(),
      onStart(true)
    ) : videoRef.current.pause();

    if (!mobileCheck && !isPlaying) {
      setTimeout(() => {
        startPlay ? animshowhide('#controls', true) : animshowhide('#controls', false)
      }, 50);
    }
    else {
      if (isSettingOpen) {
        setTimeout(() => {
          animshowhide('#controls', true)
        }, timeoutVisibility);
      }
      else {
        let cleanup = handleHideControl()
        setTimeout(() => (!isPlaying) && animshowhide('#controls', true), timeoutVisibility)
        return cleanup

      }
    }

  }, [loadedData, startPlay, isPlaying, isSettingOpen, hideControl])

  useEffect(() => {
    if (videoRef.current && progressBarRef.current) {
      //progress
      handleProgress()

      // mute/unmute
      videoRef.current.muted = isMute
      handleVolume(volume)


      // fullscreen
      if (isFullscreen) {
        videoRef.current?.parentElement?.requestFullscreen().catch(err => {
          console.warn('fullscreen failed: ', err);
        });
      } else if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => {
          console.warn('exiting fullscreen failed: ', err);
        });
      }

      /// rotate the screen to landscape (mobile only)
      if (mobileCheck) {
        if ((screen.orientation as any).lock) {
          (screen.orientation as any).lock('landscape').catch((err: any) => {
            console.warn('screen rotation failed:', err);
          });
        }
        const handleRotation = () => (screen.orientation.type.includes("landscape")) ? onExpand(true) : onExpand(false)
        handleRotation()
        window.addEventListener("orientationchange", handleRotation);
        return () => window.removeEventListener("orientationchange", handleRotation);

      }
    }
  }, [isFullscreen, isMute, volume])


  // Updates loaded metadata when a video loads   
  const handleMetaData = (e: any) => setloadedData(pre => [...pre, e]);

  // handle volume
  const handleVolume = (volume: number) => {

    videoRef.current!.volume = volume
    setvolume(volume)
    setVideo((pre) => ({ ...pre, isMute: volume == 0 }))
  }

  // handel video hover
  const handleHideControl = () => {
    if (!controlRef.current) return;

    const controls = '#controls';
    let timeout: ReturnType<typeof setTimeout>;
    const showControls = () => animshowhide(controls, true);
    const hideControls = (delay?: number) => animshowhide(controls, false, delay);


    const handler = (e: any) => {
      if (!mobileCheck) {
        showControls()
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          showControls(); hideControls();
          if (controlRef.current?.contains(e.target)) showControls()

        }, timeoutVisibility);
      }
    };

    const touchHandler = (e: any) => {

      clearTimeout(timeout);
      // toggle controls Visiblity when video is paused
      const isCurrentlyVisible = controlContainerRef.current?.style.opacity === "1";
      isCurrentlyVisible && !controlRef.current?.contains(e.target) ? hideControls(0) : showControls();

      if (isPlaying) {
        timeout = setTimeout(() => {
          hideControls();
        }, timeoutVisibility);

      }
    };
    const MoueLeave = () => setTimeout(() => hideControls(), timeoutVisibility)

    setTimeout(() => ((isPlaying) ? hideControls() : startPlay && showControls(), isSettingOpen && showControls()), 0);

    controlContainerRef.current?.addEventListener('mousemove', handler);
    controlContainerRef.current?.addEventListener('mouseleave', () => MoueLeave);
    controlContainerRef.current!.ontouchstart = touchHandler;
    window.addEventListener('keydown', handler);

    return () => {
      controlContainerRef.current?.removeEventListener('mousemove', handler);
      controlContainerRef.current?.addEventListener('mouseleave', () => MoueLeave);
      window.removeEventListener('keydown', handler);
      controlContainerRef.current!.ontouchstart = null;

    };
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

      const sprites = [
        '/assets/images/preview/sprite_sequence-1.jpg',
        '/assets/images/preview/sprite_sequence-2.jpg',
        '/assets/images/preview/sprite_sequence-3.jpg',
        '/assets/images/preview/sprite_sequence-4.jpg',
        '/assets/images/preview/sprite_sequence-5.jpg',
      ];
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

      // i wanna .6 as scale factor in here but there is changeing in width of preview on resizeing so i made default width (196) /.6 = 0.00306
      const scaleFactor = 0.00306 * thumbPrev.getBoundingClientRect().width

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

    progressBarRef.current.addEventListener(!mobileCheck ? 'mouseenter' : start, (e: any) => {
      updatePreview(e)
      progressBarRef.current!.addEventListener(move, (e) => updatePreview(e));
      progressBarRef.current!.addEventListener(!mobileCheck ? 'mouseleave' : end, () => { previewRef.current!.style.display = 'none' });
    });

    progressBarRef.current!.addEventListener(start, (e: any) => {
      setVideo(pre => ({ ...pre, isEnd: false, isPlaying: false }));
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
        setVideo(pre => ({ ...pre, isPlaying: true }));

        // clean handler
        document.removeEventListener(move, moveHandler);
        document.removeEventListener(end, endHandler);
      };
      document.addEventListener(move, moveHandler);
      document.addEventListener(end, endHandler);
    });


    // Update main progress bar
    videoRef.current.addEventListener('timeupdate', () => {
      if (videoRef.current && !isDragging) {
        const progressPercent = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        progressRef.current && (progressRef.current.style.width = `${progressPercent}%`);
        videoRef.current.duration && settimeDisplay(formatTime(videoRef.current.currentTime) + ' / ' + formatTime(videoRef.current.duration));
        handleBuffer()

      }
    });

    // loading
    videoRef.current.addEventListener('waiting', () => {
      setIsBuffering(true)
    })
    videoRef.current.addEventListener('playing', () => {
      setIsBuffering(false);
    });

    videoRef.current.addEventListener('seeked', handleBuffer)
  };

  return (
    <div className={`${isWide ? 'max-h-[75svh]' : 'max-w-[750px]'} video-container aspect-[3/2] flex-center relative bg-black select-none`}>
      <video
        ref={videoRef}
        className={`${!startPlay && 'brightness-30 cursor-pointer object-cover h-full'} ${isWide && !isFullscreen ? 'max-h-[75svh] h-full' : ''} w-full ${isFullscreen && 'h-dvh'} `}
        preload="metadata"
        controls={false}
        playsInline={true}
        onEnded={() => { handleProcess('end'); onStart(false) }}
        onPlay={() => setVideo((prev) => ({ ...prev, isEnd: false }))}
        onClick={(e) => {
          e.currentTarget.removeAttribute("poster"), setIsBuffering(true), setVideo((prev) => ({ ...prev, startPlay: true, isPlaying: true }))
        }}
        onLoadedMetadata={(e) => handleMetaData(e)}
        poster='/assets/images/thumbnail.webp'
      >
        <source src={`/assets/videos/shahinVideo/360p.webm`} type="video/webm" />

      </video>
      {isBuffering && (
        <div className="absolute inset-0 flex pointer-events-none z-2 items-center justify-center bg-black/50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* controls */}
      {!startPlay && <div
        className='w-15 h-15 md:w-20 md:h-20 text-xl sm:text-2xl top-1/2 left-1/2 
                -translate-x-1/2 -translate-y-1/2 rounded-full z-1 bg-white pointer-events-none
                absolute flex-center text-red-200 '
      ><PlayIcon /></div>
      }

      <div ref={controlContainerRef} id='controls' className={` absolute top-0 z-1 flex flex-col transition-opacity w-full h-full ${!startPlay ? 'pointer-events-none opacity-0 hidden' : 'flex'} `}>
        <div className={`absolute w-full h-full ${mobileCheck ? 'bg-black/50 ' : " bg-gradient-to-t from-black/95 via-black/20 to-white/0"}`} />
        <ContainerEvents {...{ mobileCheck, isPlaying, startPlay, volume, isBuffering, setvolume, isMute, handleProcess, isEnd, videoRef }} />

        <div className={`absolute bottom-0 w-full z-1 px-3`} ref={controlRef}>
          {/* PROGRESS  */}
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

          <div className='controlbtns' >
            <div className='flex items-center gap-3 sm:gap-5'>
              <button id="playPauseBtn" onClick={() => handleProcess('play-pause')} data-tooltip={(isPlaying ? 'Pause' : 'Play') + ' (k)'} className='video-btn'>
                {isPlaying ? <IoMdPause /> : (!isEnd ? <IoMdPlay /> : <IoReload />)}
              </button>

              {!mobileCheck && (
                <div className='flex items-center gap-5'
                  onMouseEnter={() => { document.getElementById('volume')!.style.width = '70px' }}
                  onMouseLeave={() => { document.getElementById('volume')!.style.width = '0' }}
                >
                  <button id="sound-btn"
                    onClick={() => handleProcess('mute')}
                    data-tooltip={(isMute ? 'Unmute' : 'Mute') + ' (m)'} className='video-btn'>
                    {isMute ? <IoVolumeMuteSharp /> : <IoVolumeHighSharp />}
                  </button>
                  <div id='volume' className='flex items-center transition-all overflow-x-clip w-0 h-2.5 -m-2.5 relative'>
                    <div className='absolute h-[3px] bg-white pointer-events-none' style={{ width: volume * 60 + 'px' }} />
                    <input
                      type="range"
                      id="volumeRange"
                      min="0"
                      max="1"
                      step="0.1"
                      // defaultValue="1" 
                      value={volume}
                      onChange={(e: any) => handleVolume(e.target.value)} />
                  </div>
                </div>)

              }
              <span id="timeDisplay" className='text-xs text-gray-200'>{timeDisplay}</span>
            </div>

            <div className='flex items-center gap-4 sm:gap-6' >
              <button data-tooltip={'Settings'} onClick={() => handleProcess('toggle-settings')}
                className={`video-btn ${isSettingOpen ? 'rotate-[30deg]' : 'rotate-0'}`}>{<IoMdSettings />}</button>

              {(!mobileCheck) && (<button className={`video-btn ${isFullscreen && 'hidden'}`} data-tooltip={isWide ? 'Shrink' : 'Expnad'} onClick={(e) => onExpand((prev: any) => !prev)}>
                {isWide ? <RiCollapseHorizontalLine /> : <RiExpandHorizontalLine />}
              </button>)}

              <button data-tooltip={(!isFullscreen ? 'Full screen' : 'Exit full screen') + ' (f)'}
                onClick={() => handleProcess('fullscreen')}
                className='video-btn '
              >
                {!isFullscreen ? < BiFullscreen /> : < BiExitFullscreen />}
              </button>
            </div>
          </div>

        </div>

        <Settings {...{ isSettingOpen, settingsBtn, setisSettingOpen, videoRef, setVideo }} />
      </div>
      {/* controls */}
    </div>
  )
}

export default VideoPlayer
