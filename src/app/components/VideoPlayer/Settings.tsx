"use client"
import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react'
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { MdOutlineHighQuality, MdSpeed } from 'react-icons/md';
import { GrFormCheckmark } from 'react-icons/gr';


const Settings = ({ isSettingOpen, settingsBtn, setisSettingOpen, videoRef, setVideo , setIsBuffering}:
  { isSettingOpen: boolean; settingsBtn: any; setisSettingOpen: (state: any) => void; videoRef: any; 
    setVideo: (state: any) => void; setIsBuffering: (state: any)=>void }) => {

  const settingRef = useRef<HTMLDivElement | null>(null)
  const mobileCheck = /Mobi|Android/i.test(navigator.userAgent);
  const [isOpenQ, setIsOpenQ] = useState(false);
  const [isOpenS, setIsOpenS] = useState(false);
  const [videoQuality, setvideoQuality] = useState(360);
  const [playbackS, setplaybackS] = useState(1);


  const handleQualityChange = (newQuality: number) => {
    if(!videoRef.current ) return;

    const currentTime = videoRef.current.currentTime || 0;
    const source_ele =  videoRef.current.querySelector('source')
    let video_src = `/assets/videos/shahinVideo/${newQuality}p.webm`

    // if only source not loaded
    source_ele.src != video_src && source_ele.setAttribute("src", video_src);
    
    setIsBuffering(true)
    videoRef.current.load();
    videoRef.current!.currentTime = currentTime;

    // to active loader spin
    videoRef.current.oncanplay = () => {
      
      setVideo((prev: any) => ({ ...prev, isPlaying: prev.isPlaying? true : false }))
    };
  };

  useEffect(() => {
    (videoRef.current as HTMLVideoElement).playbackRate = playbackS
    isSettingOpen ? gsap.to('.settings', { opacity: 1, duration: .35 }) : gsap.to('.settings', { opacity: 0 })

    const handleClickOutside = (e: MouseEvent) => {
      if (
        settingRef.current &&
        !settingRef.current.contains(e.target as Node) &&
        settingsBtn.current !== e.target
      ) {
        setisSettingOpen(false);
      }
    };

    // delay adding event listener to avoid close before opens
    if (isSettingOpen) {
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isSettingOpen, isOpenQ, isOpenS]);




  return (
    <>
      {isSettingOpen && <div ref={settingRef}
        className={`settings ${!mobileCheck ? 'bottom-19 right-3 rounded-2xl w-65 h-50' : 'top-1/4 bottom-0 left-0 right-0'} absolute flex overflow-hiddxen overflow-auto  parent overflow-x-hidden opacity-0 z-1 scheme-dark  py-2 text-gray-50 bg-[#161616f5]`}>
        <div className={`${isOpenQ || isOpenS ? '-translate-x-1/1' : 'translate-x-0'} flex w-full transition-all`}>

          <div className={`w-full flex flex-col shrink-0`}>
            <button
              onClick={(e) => setIsOpenQ(!isOpenQ)}
              className="p-2 px-3 w-full flex items-center justify-between cursor-pointer text-gray-50 hover:bg-[#333] transition *:flex *:items-center"
            >

              <span className='gap-3 tex-sm'><MdOutlineHighQuality className='text-gray-50 text-[1.5rem]' /> Quality</span>
              <span className='text-xs text-gray-300'>{videoQuality}p  <RiArrowRightSLine className='text-2xl  text-gray-50' /></span>
            </button>

            <button
              onClick={(e) => {
                setIsOpenS(!isOpenS)
                setTimeout(() => {
                  const targetElement = (e.target as HTMLElement).closest('.parent');
                  const scrollContainer = (targetElement?.querySelector('.scroll') as HTMLElement);

                  targetElement?.scrollTo({
                    top: scrollContainer?.offsetTop / 1.5,
                    behavior: "smooth",
                  });
                }, 0);
              }}
              className="p-2 px-3 w-full flex items-center justify-between cursor-pointer text-gray-50 hover:bg-[#333] transition *:flex *:items-center"
            >

              <span className='gap-3 tex-sm'><MdSpeed className='text-gray-50 text-[1.5rem]' /> Playback speed</span>
              <span className='text-xs text-gray-300'>{playbackS == 1 ? 'Normal' : playbackS}  <RiArrowRightSLine className='text-2xl  text-gray-50' /></span>
            </button>
          </div>


          {isOpenQ && (
            <div className="w-full shrink-0">

              <p className=' px-3 text-sm flex gap-2 border-b-1 border-white/20 py-2.5 items-center mb-3'>
                <RiArrowLeftSLine
                  onClick={() => setIsOpenQ(false)}
                  className='text-2xl -mt-0.5 cursor-pointer text-gray-50' /> Quality
              </p>
              <ul className="flex flex-col w-full ">
                {[1080, 720, 480, 360, 240].map((quality, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setvideoQuality(quality);
                      handleQualityChange(quality)
                      setIsOpenQ(false)
                      setisSettingOpen(false)
                    }}
                    className="px-4 py-2 w-full flex items-center gap-2 hover:bg-gray-700 cursor-pointer transition"
                  >
                    <div className={`w-4 ${quality == videoQuality && 'scroll'}`}>{quality == videoQuality ? <GrFormCheckmark /> : ''}</div> {quality}p
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isOpenS && (
            <div className="w-full shrink-0">
              <p className=' px-3 text-sm flex gap-2 border-b-1 border-white/20 py-2.5 items-center mb-3'>
                <RiArrowLeftSLine
                  onClick={() => setIsOpenS(false)}
                  className='text-2xl -mt-0.5 cursor-pointer text-gray-50' /> Playback speed
              </p>
              <ul className="flex flex-col w-full ">
                {[2, 1.75, 1.5, 1.25, 1, 0.75, 0.5, 0.25].map((speed, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setplaybackS(speed);
                      setIsOpenS(false)
                      setisSettingOpen(false)
                    }}
                    className="px-4 py-2 w-full flex items-center gap-2 hover:bg-gray-700 cursor-pointer transition"
                  >
                    <div className={`w-4 ${speed == playbackS && 'scroll'}`}>{speed == playbackS ? <GrFormCheckmark /> : ''}</div> {speed == 1 ? 'Normal' : speed}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>}
    </>
  )
}

export default Settings
