import React, { useEffect } from 'react'
import { IoMdPause, IoMdPlay, IoMdSettings, IoMdSkipBackward, IoMdSkipForward } from 'react-icons/io';
import ProgressBar from './ProgressBar';
import ContainerEvents from './ContainerEvents';
import { IoReload, IoVolumeHighSharp, IoVolumeMuteSharp } from 'react-icons/io5';
import { RiCollapseHorizontalLine, RiExpandHorizontalLine } from 'react-icons/ri';
import { BiExitFullscreen, BiFullscreen } from 'react-icons/bi';
import useVideoControls from './useVideoControls';
import { animshowhide } from '@/lib';
import Settings from './Settings';
import { usePathname } from 'next/navigation';

const VideoControls = ({
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
    setVideo,
    setIsBuffering,
    isBuffering,
    handleProcess,
}: any) => {

     const {  // i called all state and some helper functions in useVideoControls and destructure it for some clean
        settingsBtn,
        controlContainerRef,
        controlRef,
        timeDisplay,
        isSettingOpen,
        volume,
        hideControl,
        setvolume,
        setisSettingOpen,
        onChangeVideo
      } = useVideoControls()

    const { isEnd, isFullscreen, isMute, startPlay, isPlaying } = video
    const timeoutVisibility = 200
    const pathname = usePathname();
    const videoId = pathname.startsWith('/videos/') ? pathname.split('/videos/')[1] : '6';

    useEffect(() => handleVolume(volume), [volume])


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
        if (videoRef.current) {
            // isEnd
            if (isEnd) {
                const timeout = setTimeout(() => {
                    if (isEnd) {
                        nextVideo()
                        setVideo((prev:any) => ({ ...prev, isEnd: false }));
                    }
                }, 3600);

                return () => clearTimeout(timeout); // Clear timeout if isEnd becomes false
            }


            // mute/unmute
            videoRef.current.muted = isMute;
            setvolume((prev:any) => (!isMute && volume <= 0 ? 0.1 : prev))

            // fullscreen
            if (isFullscreen) {
                videoRef.current?.parentElement?.requestFullscreen().catch((err:any) => {
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



    // handle volume
    const handleVolume = (volume: number) => {

        setvolume(volume)
        videoRef.current && (videoRef.current.volume = volume)
        setVideo((pre:any) => ({ ...pre, isMute: volume == 0 }))
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

    return (
        <div ref={controlContainerRef} id='controls' className={` absolute top-0 z-1 flex flex-col transition-opacity w-full h-full ${!startPlay ? 'pointer-events-none opacity-0 hidden' : 'flex'} `}>
            <div className={`absolute w-full h-full ${mobileCheck ? 'bg-black/50 ' : " bg-gradient-to-t from-black/95 via-black/20 to-white/0"}`} />
            <ContainerEvents {...{
                mobileCheck, isPlaying, startPlay, volume, isBuffering, setvolume, isMute, handleProcess, isEnd, videoRef, videoId, nextVideo, prevVideo
            }} />

            <div className={`absolute bottom-0 w-full z-1 px-3`} ref={controlRef}>
                {/* PROGRESS  */}
                <ProgressBar {...{ videoRef, mobileCheck, video_data, onChangeVideo, setIsBuffering }} />

                <div className='controlbtns' >
                    <div className='flex items-center gap-3 sm:gap-5'>
                        {/* replay / play /next */}
                        {!(+videoId! <= 1 || +videoId == 6) && <a href={PlayList.prevVideoUrl()} id="replayBtn" onClick={(e) => { e.preventDefault(); prevVideo() }} aria-label={'Replay'} data-tooltip={'Replay (shift + p)'} className={`video-btn ${mobileCheck && 'hidden'}`}>
                            <IoMdSkipBackward className='scale-[.80]' />
                        </a>}

                        <button id="playPauseBtn" onClick={() => handleProcess('play-pause')} aria-label={(isPlaying ? 'Pause' : 'Play')} data-tooltip={(isPlaying ? 'Pause' : 'Play') + ' (k)'} className='video-btn'>
                            {isPlaying ? <IoMdPause /> : (!isEnd ? <IoMdPlay /> : <IoReload />)}
                        </button>

                        <a href={PlayList.nextVideoUrl()} id="nextBtn" onClick={(e) => { e.preventDefault(); nextVideo() }} aria-label={'Next'} data-tooltip={'Next (shift + n)'} className={`video-btn ${mobileCheck && 'hidden'}`}>
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
    )
}

export default VideoControls