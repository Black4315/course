"use cdivent"
import { FormEvent, useEffect, useState } from "react";
import { FaArrowUpLong } from "react-icons/fa6";

const AskQues = ({user}:any) => {
  const [input, setInput] = useState(() => sessionStorage.getItem("askInput") || "");
  const [messages, setMessages] = useState(() =>
    JSON.parse(sessionStorage.getItem("ask_messages") || '{"user_messages":[],"res_messages":[]}')
  );

  const {user_messages , res_messages} = messages


  useEffect(()=>{
    sessionStorage.askInput = input
    sessionStorage.ask_messages = JSON.stringify(messages)
  },[input,messages])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries())

    if(!(data.message as string).trim()) return 

    user_messages.push(data.message)
    setMessages((prev: any) => ({ ...prev, user_messages: user_messages }))
    setInput("");
  };
  
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto"; // Reset height
    e.target.style.height = `${e.target.scrollHeight}px`; // Expand to fit content
  };


  const handleKeyDown = (e:any) => {
    if(innerWidth<= 640) return;

    setTimeout(()=>handleInput(e),0)
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      setInput((prev) => prev + "\n ");
    } else if (e.key === "Enter") {

      e.preventDefault();
      const form = e.currentTarget.closest("form") as HTMLFormElement;
      
      form?.requestSubmit()
    }
  };

  return (
    <div className="flex items-center justify-center flex-col min-h-70 ">
      <p className="mb-10 text-black text-xl font-gs w-5/6">أهلاً بيك يا بطل ! عندك أي أسئلة عن الكورس؟ أنا جاهز </p>

      <div className="max-w-lg flex w-full flex-col gap-1 empty:hidden items-end rtl:items-start mb-3 max-h-67 overflow-auto">
        <div className="px-2 w-full">
          {user_messages.map((mess:string,i:number)=>(
            <div key={i} className="flex justify-end">
              <div className="rounded-3xl px-5 py-2.5 max-w-50 w-max bg-gray-message_surface my-2">{mess}</div>
            </div>
          ))}
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex bg-white p-4 rounded-2xl shadow-[0_9px_9px_0px_rgba(0,0,0,0.01),_0_2px_5px_0px_rgba(0,0,0,0.06)] focus-within:shadow-[0_2px_12px_0px_rgba(0,0,0,0.04),_0_9px_9px_0px_rgba(0,0,0,0.01),_0_2px_5px_0px_rgba(0,0,0,0.06)] w-6/6 max-w-lg"
      >
        <textarea
          placeholder="أقدر أساعدك أزاي؟"
          name="message"
          value={input}
          onChange={(e) => { setInput(e.target.value); handleInput(e)}}
          onKeyDown={handleKeyDown}
          dir="rlt"
          className="min-h-16 font-arabic outline-none px-4 py-2 text-gray-700 max-h-40 flex-grow resize-none w-full text-right"
        />
        <button
          type="submit"
          className="bg-black hover:bg-black/70 text-white p-3 rounded-full ml-2 max-h-11 max-w-11"
        >
          <FaArrowUpLong size={20} />
        </button>
      </form>
    </div>
  );
};

export default AskQues;
