"use client"
import Image from "next/image";
import React,{ useEffect, useState } from "react";

const LeaderBoard = ({ user }:any) => {
    const [leaderboard, setleaderboard] = useState(Array(6).fill(''))
    const [word, setword] = useState('')

    useEffect(() => {
        if (user.progress <= 30) {
            setword('لسه المشوار في أوله، بس واثق إنك تقدر تكمل وتفاجئنا كلنا.. شد حيلك، عايزين نشوفك في الليدر بورد قريب! 🚀 ');
        } else if (user.progress > 30 && user.progress < 50) {
            setword('عظيم يا صديقي.. أداءك في الكورس ده أفضل من 40% من باقي الطلبة.. كمّل عايز أشوف اسمك في الليدر بورد هنا');
        } else if (user.progress >= 50 && user.progress < 65) {
            setword('رائع جدًا! أداؤك في الكورس أفضل من 60% من الطلبة.. استمر بنفس القوة، أنت قريب جدًا من القمة!');
        } else if (user.progress >= 65 && user.progress <= 80) {
            setword('رائع جدًا! أداؤك في الكورس أفضل من 70% من الطلبة.. استمر بنفس القوة، أنت قريب جدًا من القمة!');
        } else if (user.progress > 80 && user.progress <= 90) {
            setword('مذهل! أنت من بين أفضل 90% من الطلبة.. استمر في هذا الأداء المميز، القمة في انتظارك!');
        } else {
            setword('أنت في القمة! أداءك لا يُضاهى، استمر في إلهام الجميع!');
        }
        
    }, [user]);


    useEffect(() => {
        fetch('/api/leaderboard')
            .then((res) => res.json())
            .then((data) => setleaderboard(data))
            .catch((err) => console.error('Error:', err));

    }, [])
    return (
        <div className="flex flex-col w-[full] items-center h-[90svh] sm:h-[85svh] font-gs">
            <div className="w-full text-[15px]  leading-[175%]">
                <p className="text-purple-400  font-light">Course Name Shown Here</p>
                <p className="text-purple-400 font-bold">Leaderboard</p>
            </div>
            <div className="p-3 rounded-sm flex gap-3 bg-purple-50 items-center mt-6 text-right" dir="rtl">
                <h1 className="text-5xl ">{user.progress <= 20 ?'🔥':'💪'}</h1>
                <p className="text-[15px] w-[75%] font-light text-purple-300  leading-[175%]">{word}</p>
            </div>

            <div className="mt-10 w-full rounded-3xl bg-purple-50 p-7 ">
                <ul className="flex flex-col gap-4">
                    {leaderboard.map(({ name, score, profilePicture },idx)=>(
                        <li key={idx} className="bg-white border-1 h-17 border-black/10 rounded-sm text-purple-300 text-sm py-2 px-3 text-left flex gap-3 items-center">
                            {profilePicture && (
                                <Image
                                    src={profilePicture}
                                    alt={`${name}'s profile`}
                                    width={300}
                                    height={0}
                                    className="w-11 h-11 rounded-full object-cover"
                                />)}
                  
                            <div className="flex w-full items-center justify-between">
                                <span>{name}</span>
                                <span className="text-green-success font-arabic">{score}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default LeaderBoard
