"use client"
import { showAlert, useExamTimer } from '@/lib';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react'
import { LuAlarmClock } from 'react-icons/lu';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { toast, } from 'react-toastify';


export function toggleModel() {
  const openModelBtns = document.querySelectorAll('[data-model-target]')
  const closeModelBtns = document.querySelectorAll('[data-model-close]')


  openModelBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const model = document.getElementById((btn as HTMLElement).dataset.modelTarget || "");
      if (model) toggle(model as HTMLElement);
    });
  });


  closeModelBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const model = document.getElementById((btn as HTMLElement).dataset.modelClose || "");
      if (model) toggle(model as HTMLElement);
    });
  });

  function toggle(model: HTMLElement | null) {
    if (!model) return;
    model.classList.toggle("hidden")
    setTimeout(() => model.classList.toggle("active"), 400)
  }
}


const Exam = (
  { className, id, questions, examTime, setExamTime, setExam }:
    {
      className: string;
      id: number;
      questions: { question: string; answers: string[] }[] | undefined;
      examTime: number;
      setExamTime: (state: any) => void
      setExam: (state: any) => void
    }
) => {
  const [finalAnswers, setfinalAnswers] = useState<string[]>([])
  const [viewedQues, setviewedQues] = useState(0)
  const [timer, examTimer] = useExamTimer(examTime);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);


  const closeExam = (id: number) => {
    showAlert({
      title: "متأكد يا بطل؟",
      text: "لو خرجت دلوقتي هتضيع تقدمك ومش هتقدر ترجعه!",
      icon: "question",
      comfirm: "😓 آه، عاوز أخرج",
      cancel: "💪 لأ، كمل!", action: () => {
        const confirmButton = document.querySelector(".swal2-confirm");
        if (confirmButton) confirmButton.setAttribute("data-model-close", `exam`);
        toggleModel()

      }, props: {
        focusCancel: true,
        reverseButtons: false
      }
    }).then((result) => {
      if (result.isConfirmed) { setExamTime(1); document.body.classList.remove("overflow-hidden"); setExam((prev: object) => ({ ...prev, Order: false })) }
    })


    document.body.classList.add("overflow-hidden");
  }

  // handel submit form
  useEffect(() => {

    const requestSubmitForm = (e: Event) => {
      e.preventDefault();

      if (questions?.length && finalAnswers.length === questions.length && finalAnswers.every(answer => answer !== undefined)) {
        setIsSubmitted(true);

        toast.success('ما شاء الله! بالسهولة دي؟', {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        setTimeout(() => {
          formRef.current?.submit();
        }, 2000);
      } else {
        toast.error('لسه في أسئلة ناقصة، كمل للآخر!', {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
      }
    };

    formRef.current?.addEventListener('submit', requestSubmitForm)

    return () => {
      formRef.current?.removeEventListener('submit', requestSubmitForm)
    }
  }, [finalAnswers])


  //handle time end exam if it ends
  useEffect(() => {

    if (timer === 0 && !isSubmitted) {
      toast.error("يااهه! الوقت سرقك", {
        position: "top-center",
        autoClose: 2000,
        onClose() {
          setExam((prev: any) => ({ ...prev, Order: false }))
          document.body.classList.remove("overflow-hidden");
        },
        theme: "colored",
      });

    }
  }, [timer, isSubmitted]);



  // exam question slider animaiton
  useGSAP(() => {
    gsap.to("#exam_slider", {
      transform: `translateX(${-100 * viewedQues}%)`,
      duration: 1,
      ease: "power2.inOut",
    });
  }, [viewedQues])

  useEffect(toggleModel, [])


  return (
    <div id={`exam`} className={`fixed opacity-0 hidden scale-60  pointer-events-none top-0 z-99 overflow-x-hidden transition-all [&:active]:delay-400 [&.active]:scale-100 [&.active]:opacity-100 [&.active]:pointer-events-auto ${className} `} >

      <div className="flex justify-center mb-10">
        <div className="absolute top-4 left-4 text-white text-4xl font-extralight cursor-pointer" onClick={() => closeExam(id)}>
          <RiArrowLeftSLine />
        </div>
        <span id='timeBar' className={`${timer < 60 && ('animate-[bg-color-time_1.5s_steps(1)_infinite]')} bg-yellow-100 text-white px-8 font-sans py-1.5 text-md md:text-lg lg:text-xl rounded-md shadow-[0_0_30px_rgba(255,255,0,0.8)] flex items-center gap-2`}>
          <LuAlarmClock className="text-2xl -mx-1 lg:text-2xl" />
          {examTimer}
        </span>
      </div>

      <div className="flex justify-center mt-auto mb-11 gap-4 ">
        {questions?.map((_, i) => (
          <button key={i} onClick={() => setviewedQues(i)} className={`exam-btn ${viewedQues == i && 'bg-white text-blue-200'}`}>{i + 1}</button>
        ))}

      </div>

      <div className="grow-[.7]" >
        <form action="" method='POST' ref={formRef} className={`${isSubmitted && 'pointer-events-none'}`}>
          <input type="hidden" name="exam_id" value={id} />
          <div id="exam_slider" className="relative flex w-[98%] gap-2.5">

            {questions?.map(({ question, answers }, i) => (
              <div key={i} className="bg-white w-full rounded-3xl shrink-0 min-h-full p-6 py-9 sm:p-9 flex flex-col justify-between">
                <p className="text-[#333] font-medium text-xl md:text-2xl 2xl:text-3xl">{i + 1} - <br /> {question}</p>

                <div className="mt-7 flex flex-col space-y-7">
                  {answers.map((answer, idx) => (
                    <label
                      key={idx}
                      htmlFor={`q${i}-a${idx}`}
                      className={`group flex items-center gap-4 px-3 md:px-4 shadow-[0_0_19px_4px_#d5daee] transition-all duration-100 rounded-md cursor-pointer ${finalAnswers[i] == `q${i}-a${idx}` && 'bg-blue-100'}`}
                    >

                      {/* Radio Input */}
                      <input
                        type="radio"
                        id={`q${i}-a${idx}`} // unique ID per question-answer pair
                        name={`question-${i}`} // unique name per question
                        value={answer}
                        className="hidden peer"
                        onChange={() => {
                          setfinalAnswers((prev) => {
                            const updated = [...prev]; // Spread ensures a new array reference
                            updated[i] = `q${i}-a${idx}`;
                            return [...updated]; // Force a fresh reference for rerender
                          })
                        }}
                      />
                      <div
                        className="w-6 h-6 rounded-[3px] border-2 border-blue-100 flex items-center justify-center cursor-pointer peer-checked:before:bg-white before:w-2 before:h-2 before:rounded-full peer-checked:border-white"
                      />
                      <span className="text-[16px] relative px-4 2xl:text-xl text-[#333] py-4 md:py-4.5 before:absolute before:top-0 before:h-full before:w-[1.6px] before:bg-[#d2d2d2ab] before:-left-1.5 peer-checked:text-white">{answer}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </form>

      </div>
      <div className="flex justify-center mt-5 gap-5">
        <button className="exam-btn" onClick={() => setviewedQues(prev => ((prev > 0) ? prev - 1 : prev))}> <RiArrowLeftSLine /></button>
        {viewedQues == questions!.length - 1 ?
          <button className="poup-btn btn-success cursor-pointer px-6 "
            form={formRef.current?.id} onClick={() => (formRef.current!.requestSubmit())}>Finish !</button>
          : <button className="exam-btn" onClick={() => setviewedQues(prev => prev <= questions!.length - 2 ? prev + 1 : prev)}><RiArrowRightSLine /></button>
        }

      </div>
    </div>

  )
}

export default Exam
