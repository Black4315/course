import { useState, useRef, useCallback, useEffect } from 'react';

const useVideoControls = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const progressBarRef = useRef<HTMLDivElement | null>(null)
    const progressRef = useRef<HTMLDivElement | null>(null)
    const settingsBtn = useRef<HTMLButtonElement | null>(null)
    const previewRef = useRef<HTMLDivElement | null>(null)
    const controlContainerRef = useRef<HTMLDivElement | null>(null)
    const controlRef = useRef<HTMLDivElement | null>(null)
    const bufferedRef = useRef<HTMLDivElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)


    // video state
    const [video, setVideo] = useState({
        startPlay: false,
        isPlaying: false,
        isEnd: false,
        isMute: false,
        isFullscreen: false
    })
    const { isEnd, isFullscreen, isMute, startPlay, isPlaying } = video

    const [timeDisplay, settimeDisplay] = useState('0:00 / 0:00')
    const [isSettingOpen, setisSettingOpen] = useState(false)
    const [hideControl, sethideControl] = useState(false)
    const [volume, setvolume] = useState(1)
    const [loadedData, setloadedData] = useState<(string | Event)[]>([])
    // const mobileCheck = /Mobi|Android/i.test(navigator.userAgent);
    const [isBuffering, setIsBuffering] = useState(false);


     /// Handel process of video play ,pause,etc...
    const handleProcess = (type: 'end' | 'mute' | 'fullscreen' | 'play-pause' | 'toggle-settings') => {
        setVideo((pre) => {
            switch (type) {
                case 'end':
                    return { ...pre, isEnd: true, isPlaying: false };

                case 'mute':
                    return { ...pre, isMute: !pre.isMute };

                case 'fullscreen':
                    return { ...pre, isFullscreen: !pre.isFullscreen };

                case 'play-pause':
                    return { ...pre, isPlaying: !pre.isPlaying };

                case 'toggle-settings':
                    console.log('toggle settings' , isSettingOpen);
                    setisSettingOpen((prev) => !prev);
                    return pre;

                default:
                    return pre;
            }
        });
    };

    // onChangeVideo
    const onChangeVideo = (change: ()=>void | any) => setVideo(change)

    return {
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
        setisSettingOpen,
        onChangeVideo
    };
}

export default useVideoControls;