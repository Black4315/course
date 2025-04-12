"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { IoMdPause } from "react-icons/io";
import { IoMdPlay } from "react-icons/io";
import gsap from 'gsap';
import { IoCaretForwardSharp, IoReload, IoVolumeHighSharp, IoVolumeMuteSharp } from 'react-icons/io5';
import { simpleAnim } from '@/lib';


type ContainerEventsProps = {
  mobileCheck: boolean;
  isPlaying: boolean;
  startPlay: boolean;
  isEnd: boolean;
  isMute: boolean;
  isBuffering: boolean;
  volume: any;
  setvolume: (type: any) => void;
  handleProcess: (type: any) => void;
  videoRef: any;
}
const ContainerEvents: React.FC<ContainerEventsProps> = (
  { mobileCheck,
    isPlaying,
    isBuffering,
    setvolume,
    volume,
    isMute,
    startPlay,
    handleProcess,
    isEnd,
    videoRef
  }
) => {
  const [sec10, setsec10] = useState(true)


  // 10sec animation
  const secAnim = useCallback(() => {
    gsap.to('.sec10',
      {
        opacity: 1,
        onComplete: function (this: gsap.core.Tween) { gsap.to('.sec10', { opacity: 0 }) }
      },
    )
    gsap.to('.icon-sec', {
      ease: 'none',
      duration: 0.2,
      opacity: 1,
      stagger: {
        each: 0.15, // Time between each icon's animation
        onStart: function (this: gsap.core.Tween) {
          gsap.to(this.targets(), { opacity: 1 }); // Show current icon
        },
        onComplete: function (this: gsap.core.Tween) {
          gsap.to(this.targets(), { opacity: 0.3 }); // Hide current icon before the next starts
        }
      }
    })
  }, [])

  const volAnim = useCallback(() => {
    simpleAnim('volumIncontainer', { opacity: 1, duration: 0, onComplete: () => gsap.to('#volumIncontainer', { opacity: 0, duration: 0, delay: 1 }) })
  }, [])

  const clickContainer = () => {
    // play pause animation
    gsap.timeline().fromTo('.fade',
      { opacity: 0, scale: 0.5 },
      { opacity: 0.8, scale: 1, duration: 1.2, ease: "power4.out" }
    )
      .to('.fade',
        { opacity: 0, delay: -1, scale: 1.2, duration: 1.4, ease: "expo.out" }
      );
    handleProcess('play-pause')
  }

  let lastTap = 0;
  // double click 10sec
  const doubletouchContainer = (e: any) => {
    if (mobileCheck && videoRef.current) {
      const currentTime = Date.now();
      const tapLength = currentTime - lastTap;

      if (tapLength < 300 && tapLength > 0) { // Adjust time window as needed
        let firsthalf = e.changedTouches[0].clientX < (e.changedTouches[0].target.offsetWidth / 2)
        if (firsthalf) { videoRef.current.currentTime -= 10; setsec10(false) }
        else { videoRef.current.currentTime += 10; setsec10(true) }
        secAnim()

      }
      lastTap = currentTime;
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInputFocused = ['input', 'textarea', 'select', 'button', 'a'].includes(document.activeElement!.tagName.toLowerCase());

      if (startPlay && (!isInputFocused || document.querySelector('.video-container')?.contains(document.activeElement))) {
        if (typeof +e.key == 'number' && +e.key <= 9 && +e.key >= 0 && e.key !== ' ') {

          let percent: number = (+e.key * 0.1)
          videoRef.current.currentTime = videoRef.current.duration * percent
        }
        switch (e.key) {
          case ' ': case 'k': case 'K':
            e.preventDefault(); // Prevent scrolling when pressing space
            clickContainer()
            break;
          case 'f': case 'F':
            handleProcess('fullscreen');
            break;

          case 'ArrowRight':
            secAnim()
            setsec10(true)
            videoRef.current.currentTime += 5; // Seek forward 5 seconds
            break;

          case 'ArrowLeft':
            secAnim()
            setsec10(false)
            videoRef.current.currentTime -= 5; // Seek backward 5 seconds
            break;

          case 'ArrowDown':
            volAnim()
            e.preventDefault();
            setvolume((pre: any) => Math.max(pre -= 0.1, 0).toFixed(1))
            break;

          case 'ArrowUp':
            volAnim()
            e.preventDefault();
            setvolume((pre: any) => Math.min(+pre + 0.1, 1).toFixed(1));
            break;

          case 'm': case 'M':
            volAnim()
            handleProcess('mute') // Mute/unmute
            break;

          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [startPlay, isPlaying]);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    volAnim()
  }, [volume])

  return (
    <div onClick={() => !mobileCheck && (clickContainer())} onDoubleClick={() => !mobileCheck && handleProcess('fullscreen')} onTouchEnd={(e: any) => { doubletouchContainer(e) }}
      className='grow-1 flex-center z-1  '>


      {startPlay &&
        <div onClick={() => mobileCheck && handleProcess('play-pause')}
          className={`fade w-15 h-15 md:w-20 md:h-20 md:text-4xl text-2xl z-1 rounded-full bg-[#000000bc] flex-center text-[#eeeeee] ${!mobileCheck && 'opacity-0'} `}
        >
          {!mobileCheck ?
            (isPlaying ? <IoMdPlay /> : (!isEnd ? <IoMdPause /> : <IoReload />)) :
            (isPlaying ? <IoMdPause /> : (!isEnd ? <IoMdPlay /> : <IoReload />))
          }
        </div>
      }

      <div className={`sec10 flex text-gray-50 ${mobileCheck ? 'h-[170%] w-[45%] bg-[#e0e0e01e] rounded-[50%]' : 'w-auto h-auto rounded-full bg-[#000000ce] aspect-square'} ${sec10 ? (mobileCheck ? 'right-0 rounded-r-none' : 'left-9/12') : (mobileCheck ? 'rounded-l-none left-0' : 'right-9/12')} `}>

        <div className='flex-center flex-col text-center p-4'>
          <span className={`text-2xl flex  ${sec10 ? ' ' : '-rotate-180'} scale-y-80`}>
            <IoCaretForwardSharp className='-mr-2 opacity-30 icon-sec' />
            <IoCaretForwardSharp className='-mr-2 opacity-30 icon-sec' />
            <IoCaretForwardSharp className='opacity-30 icon-sec' />
          </span>
          <span className='text-xs text-nowrap'>{sec10 ? '+' : '-'} {mobileCheck ? '10' : '5'} secounds</span>
        </div>
      </div>

      <div id='volumIncontainer' className='absolute top-1/5 flex items-center opacity-0 gap-2 text-2xl bg-black/90 rounded-sm p-2 px-4 text-gray-50'>
        {isMute ? <IoVolumeMuteSharp /> : <><IoVolumeHighSharp /> <span className='text-lg mt-[1px]'>{volume * 100}%</span></>}
      </div>
    </div>
  )
}

export default ContainerEvents
