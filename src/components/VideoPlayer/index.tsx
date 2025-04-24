"use client";
import React, { useEffect, useState, useTransition, } from 'react'
import { IoMdPause, IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";
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
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/userContext';

interface Video_data {
  id: number;
  title: string;
  description: string;
  url: string;
  sprites: string[];
  thumbnail: string;
}
interface PlayListType {
  isPlayList: boolean;
  length: number;
  nextVideoUrl: () => string;
  prevVideoUrl: () => string;
  currentVideoUrl: () => string;
}
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

  //load video data
  const [isPending, startTransition] = useTransition();
  const [routeChanging, setRouteChanging] = useState(false);
  const pathname = usePathname();
  const videoId = pathname.startsWith('/videos/') ? pathname.split('/videos/')[1] : '6';
  const [video_data, setvideo_data] = React.useState<Video_data | null>(null)
  const router = useRouter();
  const { user_data, setUser_data } = useUser();
  
// is playlist or not

  const PlayList: PlayListType = {
    isPlayList:true,
    length: 10,
    nextVideoUrl: function () {
      return `/videos/${(+videoId + (this.isPlayList && this.length === +videoId ? 0 : 1))}`;
    },
    prevVideoUrl: function () {
      return `/videos/${(+videoId - (!(+videoId <= 1 || +videoId === 6) ? 1 : 0))}`;
    },
    currentVideoUrl: function () {
      return `/videos/${videoId}`;
    },
  };
// is playlist or not


  const { data, refetch } = useQuery({
    queryKey: ['video', videoId],
    queryFn: () => fetch('/api/videos/' + videoId).then(res => res.json()),
  });

  useEffect(() => {
    if (data) setvideo_data(data);
    handle_prog()
  }, [data]);

  const handle_prog = (end = false) => {
    if (!user_data) return;

    const newProgress = Math.max(user_data.progress, (end ? +videoId + 1 : +videoId) * 10);
    setUser_data((prev: any) => ({ ...prev, progress: newProgress }));

    const sessionProg = parseInt(sessionStorage.getItem('courseProg') || '0');
    sessionStorage.setItem('courseProg', Math.max(sessionProg, newProgress).toString());
  };
  const nextVideo = () => {
    setRouteChanging(true);
    startTransition(() => {
      router.push(PlayList.nextVideoUrl());
    });
  };

  const prevVideo = () => {
    setRouteChanging(true);
    startTransition(() => {
        router.push(PlayList.prevVideoUrl());
    });
  };
  useEffect(() => {
    if (!isPending) {
      setRouteChanging(false);
    }
  }, [isPending]);  
  //load video data


  /// create tooltip for elements And check if the user is on a mobile user agent 
  useEffect(() => {
    !mobileCheck && createTooltip();
    videoRef.current?.load(); // force metadata to load
  }, [video_data])


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
      }, timeoutVisibility);
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
      // isEnd
      if (isEnd) {
        const timeout = setTimeout(() => {
          if (isEnd) {
            nextVideo()
            setVideo((prev) => ({ ...prev, isEnd: false }));
          }
        }, 3600);

        return () => clearTimeout(timeout); // Clear timeout if isEnd becomes false
      }

      //progress
      handleProgress()

      // mute/unmute
      videoRef.current.muted = isMute;
      setvolume(prev => (!isMute && volume <= 0 ? 0.1 : prev))

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
  }, [isFullscreen, isMute, volume, video_data, isEnd])

  useEffect(() => handleVolume(volume), [volume])

  // Updates loaded metadata when a video loads   
  const handleMetaData = (e: any) => setloadedData(pre => [...pre, e]);

  // handle volume
  const handleVolume = (volume: number) => {

    setvolume(volume)
    videoRef.current!.volume = volume
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
      const mobile_video_btns = document.querySelector('#mobile_video_btns')
      clearTimeout(timeout);
      // toggle controls Visiblity when video is paused
      const isCurrentlyVisible = controlContainerRef.current?.style.opacity === "1";
      if (isCurrentlyVisible && !controlRef.current?.contains(e.target) && !mobile_video_btns?.contains(e.target)) {
        hideControls(0)
      }
      else showControls();

    };
    const endTouchHandler = () => {
      if (isPlaying) {
        timeout = setTimeout(() => {
          hideControls();
        }, timeoutVisibility);
      }
    }
    const MoueLeave = () => setTimeout(() => hideControls(), timeoutVisibility)

    setTimeout(() => ((isPlaying) ? hideControls() : startPlay && showControls(), isSettingOpen && showControls()), 0);

    controlContainerRef.current?.addEventListener('mousemove', handler);
    controlContainerRef.current?.addEventListener('mouseleave', () => MoueLeave);
    controlContainerRef.current && (controlContainerRef.current.ontouchstart = touchHandler)
    controlContainerRef.current && (controlContainerRef.current.ontouchend = endTouchHandler)
    window.addEventListener('keydown', handler);

    return () => {
      controlContainerRef.current?.removeEventListener('mousemove', handler);
      controlContainerRef.current?.addEventListener('mouseleave', () => MoueLeave);
      controlContainerRef.current && (controlContainerRef.current.ontouchstart = null)
      controlContainerRef.current && (controlContainerRef.current.ontouchend = null)
      window.removeEventListener('keydown', handler);

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

  return (
    <div className={`${isWide ? 'max-h-[75svh]' : 'max-w-[750px]'} ${!mobileCheck && 'min-w-[330px]'} video-container aspect-[3/2] flex-center relative bg-black select-none`}>
      <video
        ref={videoRef}
        className={`${!startPlay && 'brightness-30 cursor-pointer object-cover h-full'} ${isWide && !isFullscreen ? 'max-h-[75svh] h-full' : ''} w-full ${isFullscreen && 'h-dvh'} peer  ${!video_data && 'pointer-events-none'}`}
        preload="metadata"
        playsInline={true}
        tabIndex={0}
        onEnded={() => { handleProcess('end'); onStart(false); handle_prog(true); }}
        onPlay={() => setVideo((prev) => ({ ...prev, isEnd: false }))}
        onClick={(e) => {
          e.currentTarget.blur();
          e.currentTarget.removeAttribute("poster"), setIsBuffering(true), setVideo((prev) => ({ ...prev, startPlay: true, isPlaying: true }))
        }}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), e.currentTarget.click())}
        onLoadedMetadata={(e) => handleMetaData(e)}
        poster={video_data?.thumbnail}
      >
        <source src={video_data?.url} type="video/webm" />

      </video>
      {(isBuffering || !video_data ) && (
        <div className="absolute inset-0 flex pointer-events-none z-2 items-center justify-center bg-black/50">
          <div className="w-12 h-12 border-2 border-[#eee] border-t-[#666] rounded-full animate-spin"></div>
        </div>
      )}

      {/* controls */}
      {(isEnd || routeChanging) && <div className={`fixed inset-0 top-0 w-full ${mobileCheck ? 'h-[3px]' :'h-[2px]'} bg-red-200/90 animate-shrink `} />}

      {(!startPlay && video_data) && <div
        className='w-15 h-15 md:w-20 md:h-20 text-xl sm:text-2xl top-1/2 left-1/2 
              -translate-x-1/2 -translate-y-1/2 rounded-full z-1 bg-white pointer-events-none
              absolute flex-center text-red-200 peer-focus:border-1 peer-focus:border-red-200'
      ><PlayIcon /></div>
      }

      <div ref={controlContainerRef} id='controls' className={` absolute top-0 z-1 flex flex-col transition-opacity w-full h-full ${!startPlay ? 'pointer-events-none opacity-0 hidden' : 'flex'} `}>
        <div className={`absolute w-full h-full ${mobileCheck ? 'bg-black/50 ' : " bg-gradient-to-t from-black/95 via-black/20 to-white/0"}`} />
        <ContainerEvents {...{
          mobileCheck, isPlaying, startPlay, volume, isBuffering, setvolume, isMute, handleProcess, isEnd, videoRef, videoId, nextVideo, prevVideo
        }} />

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
              {/* replay / play /next */}
              {!(+videoId! <= 1 || +videoId == 6) && <a href={PlayList.prevVideoUrl()} id="replayBtn" onClick={(e) => { e.preventDefault(); prevVideo() }} aria-label={'Replay'} data-tooltip={'Replay (shift + p)'} className={`video-btn ${mobileCheck && 'hidden'}`}>
                <IoMdSkipBackward className='scale-[.80]' />
              </a>}

              <button id="playPauseBtn" onClick={() => handleProcess('play-pause')} aria-label={(isPlaying ? 'Pause' : 'Play')} data-tooltip={(isPlaying ? 'Pause' : 'Play') + ' (k)'} className='video-btn'>
                {isPlaying ? <IoMdPause /> : (!isEnd ? <IoMdPlay /> : <IoReload />)}
              </button>

              <a href={PlayList.nextVideoUrl()} id="nextBtn" onClick={(e) =>{e.preventDefault();nextVideo()}} aria-label={'Next'} data-tooltip={'Next (shift + n)'} className={`video-btn ${mobileCheck && 'hidden'}`}>
                <IoMdSkipForward className='scale-[.80]' />
              </a>
              {/* replay / play /next */}

              {/* volume */}
              {!mobileCheck && (
                <div className='flex items-center gap-5'
                  onMouseEnter={() => { document.getElementById('volume')!.style.width = '70px' }}
                  onMouseLeave={() => { document.getElementById('volume')!.style.width = '0' }}
                >
                  <button id="sound-btn"
                    onClick={() => handleProcess('mute')}
                    aria-label={(isMute ? 'Unmute' : 'Mute')}
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

              {/* volume */}
              <span id="timeDisplay" className='text-xs text-gray-200'>{timeDisplay}</span>
            </div>

            <div className='flex items-center gap-4 sm:gap-6' >
              {/* settings */}
              <button data-tooltip={'Settings'} aria-label={'Settings'} onClick={() => handleProcess('toggle-settings')}
                className={`video-btn ${isSettingOpen ? 'rotate-[30deg]' : 'rotate-0'}`}>{<IoMdSettings />}</button>

              {/* expand */}
              {(!mobileCheck) && (<button className={`video-btn ${isFullscreen && 'hidden'}`} data-tooltip={isWide ? 'Shrink' : 'Expnad'} aria-label={isWide ? 'Shrink' : 'Expnad'} onClick={(e) => onExpand((prev: any) => !prev)}>
                {isWide ? <RiCollapseHorizontalLine /> : <RiExpandHorizontalLine />}
              </button>)}

              {/* fullscreen */}
              <button
                aria-label={(!isFullscreen ? 'Full screen' : 'Exit full screen')}
                data-tooltip={(!isFullscreen ? 'Full screen' : 'Exit full screen') + ' (f)'}
                onClick={() => handleProcess('fullscreen')}
                className='video-btn '
              >
                {!isFullscreen ? < BiFullscreen /> : < BiExitFullscreen />}
              </button>
            </div>
          </div>

        </div>

        <Settings {...{ videoId, isSettingOpen, settingsBtn, setisSettingOpen, videoRef, setVideo, setIsBuffering }} />
      </div>
      {/* controls */}
    </div>
  )
}

export default VideoPlayer
