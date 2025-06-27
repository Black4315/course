"use client";
import React, { useEffect, useState, useTransition, } from 'react'
import { createTooltip,} from '../../lib';
import useVideoControls from './useVideoControls';
import { PlayIcon } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/userContext';
import VideoControls from './VideoControls';

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

  const {  // i called all state and some helper functions in useVideoControls and destructure it for some clean
    videoRef,
    settingsBtn,
    controlContainerRef,
    controlRef,
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
    setloadedData,
    setisSettingOpen,
    onChangeVideo
  } = useVideoControls()
  const { isEnd, isFullscreen, isMute, startPlay, isPlaying } = video


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
    isPlayList: true,
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
    queryFn: async () => {
      const res = await fetch(`/api/videos/${videoId}`);
      if (!res.ok) throw new Error("Failed to fetch video data");
      return res.json();
    },
  });

  useEffect(() => {
    if (data) setvideo_data(data);
     updateUserProgress()
  }, [data]);

  const updateUserProgress = (end = false) => {
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


  /// create tooltip for elements And check if the user is on a mobile user agent 
  useEffect(() => {
    !mobileCheck && createTooltip();
    videoRef.current?.load(); // force metadata to load
  }, [video_data])


  // Updates loaded metadata when a video loads   
  const handleMetaData = (e: any) => setloadedData(pre => [...pre, e]);


  return (
    <div className={`${isWide ? 'max-h-[75svh]' : 'max-w-[750px]'} ${!mobileCheck && 'min-w-[330px]'} video-container aspect-[3/2] flex-center relative bg-black select-none`}>
      <video
        ref={videoRef}
        className={`${!startPlay && 'brightness-30 cursor-pointer object-cover h-full'} ${isWide && !isFullscreen ? 'max-h-[75svh] h-full' : ''} w-full ${isFullscreen && 'h-dvh'} peer  ${!video_data && 'pointer-events-none'}`}
        preload="metadata"
        playsInline={true}
        tabIndex={0}
        onEnded={() => { handleProcess('end'); onStart(false);  updateUserProgress(true); }}
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

      {(isBuffering || !video_data) && (
        <div className="absolute inset-0 flex pointer-events-none z-2 items-center justify-center bg-black/50">
          <div className="w-12 h-12 border-2 border-[#eee] border-t-[#666] rounded-full animate-spin"></div>
        </div>
      )}

      {(isEnd || routeChanging) && <div className={`fixed inset-0 top-0 w-full ${mobileCheck ? 'h-[3px]' : 'h-[2px]'} bg-red-200/90 animate-shrink `} />}

      {(!startPlay && video_data) && <div
        className='w-15 h-15 md:w-20 md:h-20 text-xl sm:text-2xl top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2 rounded-full z-1 bg-white pointer-events-none
        absolute flex-center text-red-200 peer-focus:border-1 peer-focus:border-red-200'
      ><PlayIcon /></div>
      }

      {/* controls */}
      <VideoControls {...{
        PlayList,
        videoRef,
        video,
        video_data,
        loadedData,
        onStart,
        mobileCheck,
        nextVideo,
        prevVideo,
        onExpand,
        isWide,
        setloadedData,
        setVideo,
        setIsBuffering,
        isBuffering,
        handleProcess,
      }} />
      {/* controls */}
    </div>
  )
}

export default VideoPlayer
