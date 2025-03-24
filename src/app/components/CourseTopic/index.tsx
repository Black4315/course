"use client"
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { add, file, lock, minimize } from "@/utils";
import Image from "next/image";
import { gsapAnim, showAlert, showPopup } from "../../lib";
import Exam, { toggleModel } from "./Exam";
import { courseTopic } from "@/constants";
import Swal from "sweetalert2";
import { ScrollTrigger } from "gsap/all";
import PdfViewer from "../PdfViewer";

gsap.registerPlugin(ScrollTrigger)

const CourseTopic = ({ user }: any) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [courseProg, setCourseProg] = useState(0)
    const [mobileWidth, setmobileWidth] = useState(false)
    const [topicMenuOpen, settopicMenuOpen] = useState(1)
    const [examTime, setExamTime] = useState(0)
    type ExamType = {
        Order: boolean;
        id: number;
        questions: { question: string; answers: string[] }[] | undefined;
    };

    const [exam, setExam] = useState<ExamType>({
        Order: false,
        id: -1,
        questions: [],
    });
    const { id, questions, Order,  } = exam


    /////////////////////////////////////////////////// exam part
    const noExam = () => {
        Swal.fire({
            title: "No questions available!",
            text: "The exam is being prepared for adding the questions.",
            icon: "error"
        });
    }
    const openExam = (time: number,id:number, questions: { question: string; answers: string[] }[] | undefined) => {
        showAlert({
            title: '<h1 class="text-xl font-bold text-blue-600 mb-2">🚀 اختبار سريع!</h1>',
            text: '', icon: 'info', comfirm: '🚀 يلا بينا!', cancel: "No, cancel!", action: () => {
                const confirmButton = document.querySelector(".swal2-confirm");
                if (confirmButton) confirmButton.setAttribute("data-model-target", `exam`);
                toggleModel()
            }, props: {
                showCancelButton: false,
                html: `
                    <div class="p-4 bg-gray-100 rounded-sm shadow-md">
                        <p class="text-lg text-gray-700">
                            ده اختبار بسيط مدته 
                            <span class="text-red-500 font-semibold"> ${time} دقيقة </span>
                            حاول تركز وتخلصه قبل نهاية الوقت! ⏳
                        </p>
                    </div>
                `,
            },
        }).then((result) => {
            if (result.isConfirmed) {
                setExam(prev => ({ ...prev, questions: questions, id: id, Order: true }))
                setExamTime(time * 60); document.body.classList.add("overflow-hidden");
            }
        })

    }

    /////////////////////////////////////////////////// exam part



    useEffect(() => {
        setCourseProg(user.progress)
        const handleResize = () => {
            if (innerWidth <= 768) setmobileWidth(true)
            else setmobileWidth(false)
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])


    // COURSE PROGRESS ANIMATION    
    useGSAP(() => {
        const tl = gsapAnim('.courseProgbar', { width: `${courseProg}%` });

        tl.to(".courseProg", { left: `calc(${courseProg}% - 19px)`, duration: 0.8 }, "<") // "<" makes it run at the same time
            .to(".progPercent", { opacity: 1, duration: 0.5 }, "-=0.3");
    }, [courseProg]);
    return (
        <div className="lg:max-w-[410px] flex-1">
            <h3 className="h3 mb-14 ">Topics for This Course</h3>
            <div className="w-full rounded-md bg-gray-200 h-[5px] relative">
                <div className={`courseProgbar bg-green-200 h-full rounded-md w-0 `} />

                <div className="courseProg text-purple-100 absolute -top-11.5 text-xs -left-[0%] font-sans flex-center flex-col">
                    <span className="border-2 aspect-square w-8 flex-center  rounded-full mb-6 border-gray-borderprog relative p-1 after:border-black/0 after:border-4 after:border-t-gray-borderprog after:-bottom-3 after:absolute after:left-2/5">You</span>
                    <span className='progPercent opacity-0'>{courseProg}%</span>
                </div>
            </div>
            {courseTopic.map(({ id, title, shortTitle, questions, body, ques, minutes, list }) => (
                <div ref={ref} className={`border transition-all duration-300 border-gray-border   ${!mobileWidth ? 'p-6 py-8 mt-15' : 'py-6 mt-8'} ${mobileWidth &&
                    (topicMenuOpen != id && 'h-20')} overflow-hidden `} 
                    style={mobileWidth && topicMenuOpen === id ? { height: ref.current?.scrollHeight } : {}} key={id}>
                    <div className={`${mobileWidth && 'px-6 flex justify-between'}`}>
                        <h4 className={`h4 ${mobileWidth && 'w-0'} flex-grow text-nowrap overflow-hidden text-ellipsis`}>
                            {mobileWidth ?  shortTitle  :  title }
                        </h4>
                        {mobileWidth && (<>
                            <Image
                                className="cursor-pointer w-auto h-auto"
                                onClick={() => settopicMenuOpen((prev) => (prev === id ? 0 : id))}
                                src={topicMenuOpen == id ? add : minimize}
                                width={24}
                                height={24}
                                alt="toggle" 
                                style={{ height: "auto", width: 'auto' }} 

                                />
                        </>)}
                        
                    </div>
                    <p className="body-1 pb-5 border-b-1 border-gray-border">{!mobileWidth && body}</p>
                    <ul>
                        {list.map((item, i) => (
                            <div key={i} >

                                <li
                                    onClick={() => {
                                        (i == 2 && ques != 0) ? openExam(minutes, id, questions) : i == 2 && noExam();
                                        i==list.length-1&&(
                                             showPopup({ title: '', html: <div className="mt-10"><PdfViewer /></div>,
                                                action:()=>{
                                                    const popup = document.querySelector(".swal2-popup") as HTMLElement;
                                                    if (popup) {
                                                        popup.style.background = 'linear-gradient(0deg, #5a78fc 0%, #3e54b5 100%)'
                                                    }
                                                },props:{focusCancel:false}})
                                        )}}
                                    className={`li ${mobileWidth && 'px-6'} ${(i == 2||i==list.length-1) && 'after:h-[1px] after:bg-blue-100  after:w-0 after:absolute after:-bottom-[1px] cursor-pointer hover:after:w-full after:transition-all after:duration-300 after:left-0'}`}
                                >

                                    <Image className="-mt-1 " src={file} width={16} height={16} alt="file" />
                                    <p className='mx-2 text-[1.15rem] leading-6 '>{item}</p>
                                    {i != 2 && <Image className="ml-auto" src={lock} width={16} height={16} alt="lock" />}
                                    {i == 2 && (
                                        <div className="ml-auto flex flex-wrap justify-end gap-1.5 items-center">
                                            <span className="px-1.5 bg-[#f2faf8] rounded-[3px] text-[#57bbb7]">{ques} QUESTION</span>
                                            <span className="px-1.5 bg-[#fdf2f4] rounded-[3px] text-[#e5556f]">{minutes} MINUTE{minutes > 2 && 'S'}</span>
                                        </div>
                                    )}
                                </li>
                            </div>
                        ))}

                    </ul>

                </div>
            ))}
            {Order && <Exam
                {...{ id, questions, setExam, examTime, setExamTime }}
                className={`top-0 left-0 bottom-0 flex flex-col right-0 bg-gradient-to-t from-blue-100 to-blue-200 py-5 p-5`} >

            </Exam>}

        </div>

    )
}

export default CourseTopic
