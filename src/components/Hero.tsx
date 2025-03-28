'use client';
import { courseMat, curriculm } from "@/constants"
import VideoPlayer from "./VideoPlayer"
import { useEffect, useState } from "react";
import CourseTopic from "./CourseTopic";
import Image from "next/image";
import { FaArrowRightLong } from "react-icons/fa6";
import { showPopup } from "../lib";
import { duration, Skeleton } from "@mui/material";
import Head from "next/head";

type CommentType = {
    user: string;
    profilePicture: string;
    date: string;
    comment: string;
};

const Hero = ({ user, mobileCheck }: { user: any; mobileCheck: boolean }) => {
    const [hydrated, setHydrated] = useState(false);
    const [comments, setcomments] = useState<CommentType[]>([])
    const [isWide, setIsWide] = useState(false);
    const [isVideoStart, setIsVideoStart] = useState(false);

    useEffect(() => {
        setHydrated(true);
        document.body.classList.add('overflow-y-auto','pointer-events-auto')
    }, []);


    useEffect(() => {
        fetch('/api/comments')
            .then((res) => res.json())
            .then((data) => setcomments(data))
            .catch((err) => console.error('Error:', err));

    }, [])

    const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const videoSchema = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: "Course Overview",
        description: "Get an overview of this programing crash course.",
        thumbnailUrl: siteUrl + "/assets/images/thumbnail.webp",
        uploadDate: "2025-03-26",
        duration: 'PT3M30S',
        contentUrl: siteUrl + "/assets/videos/shahinVideo/360p.webm",
        embedUrl: siteUrl,
        potentialAction: {
            "@type": "SeekToAction",
            "target": `${siteUrl}/assets/videos/shahinVideo/360p.webm#t={seek_to_second_number}`,
            "startOffset-input": "required name=seek_to_second_number",
        },
    }

    return (
        <>
            <Head>
                <title>Course Details</title>
                <meta name="description" content="Master SEO from the ground up with our ultimate crash course! Learn essential skills, uncover advanced strategies, and elevate your website to dominate search rankings like a pro." />

                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }} />
            </Head>
            <section className='common-padding py-4.5 screen-max-width mb-10'>
                <div className="flex flex-col gap-7 lg:grid lg:grid-rows-[repeat(4,auto)] lg:grid-cols-[minmax(500px,750px)_auto] xl:grid-cols-[minmax(600px,750px)_auto]">
                    <div className={`${isWide ? 'col-span-2' : ''} ${(mobileCheck && isVideoStart && !isWide) && 'sticky top-0 shadow-sm z-9 px-3 sm:px-9 -mx-3 sm:-mx-9 -mt-5 py-3 pt-5 bg-white'}  flex flex-col  max-xl:col-span-2 `}>

                        <VideoPlayer onExpand={setIsWide} onStart={setIsVideoStart} isWide={isWide} mobileCheck={mobileCheck} />
                        <ul className={`flex gap-3 mx-6 md:mx-2 lg:mt-10 ${(mobileCheck && isVideoStart) ? 'mt-3' : ' mt-5 '}`}>
                            {curriculm.map(({ Icon, tooltip, Action }, index) => (
                                <li key={index}
                                    data-tooltip={tooltip}
                                    onClick={(e) => {
                                        if (typeof Action == 'string') {
                                            window.scrollTo({
                                                top: (mobileCheck && isVideoStart && !isWide) ? document.getElementById("comments")!.offsetTop - 300 : document.getElementById("comments")?.offsetTop
                                            })
                                        } else {
                                            showPopup({
                                                title: '', html: <div className="max-sm:-m-1 sm:mt-5 "><Action user={user} /></div>,
                                                action: () => {
                                                    const popup = document.querySelector(".swal2-popup") as HTMLElement;
                                                    if (popup) {
                                                        popup.parentElement!.style.display = 'block';
                                                        popup.parentElement!.style.padding = '0';

                                                    }
                                                }, props: {
                                                    customClass: { closeButton: 'focus:shadow-none', popup: `max-sm:!w-svw max-sm:h-svh max-sm:!rounded-none sm:top-1/2 sm:-translate-y-1/2` }
                                                }
                                            })
                                        }
                                    }}
                                    className="group p-3 relative border duration-300 hover:bg-gray-400 hover:border-gray-400 transition-all border-gray-200 rounded-full cursor-pointer">

                                    <Icon className="text-gray-400 transition-all group-hover:text-white text-lg" key={index} />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='col-start-1 row-start-2 max-md:mx-2 mt-3 md:my-4 '>
                        <h2 className="h2 mb-6 max-md:hidden">Course Materials</h2>

                        <div className="px-9 py-6.5 md:py-4 shadow-[0_0_30px_15px_rgba(0,0,0,.05)] rounded-sm">
                            <h2 className="h2 mb-3 mt-7 hidden max-md:block text-[1.3rem]">{hydrated ? 'Course Materials' : <Skeleton variant="text" width={'60%'} />}</h2>
                            <div className="md:flex justify-between *:flex-1  gap-30 ">
                                {courseMat.map((item: any, i) => (
                                    <ul key={i}>
                                        {item.map(({ id, title, icon, righthand }: any, idx: number) => (
                                            <li key={id} className={`li`} style={{ border: idx == item.length - 1 ? 'none' : '' }}>
                                                {hydrated ? (<>
                                                    <Image src={icon} alt={icon} width={19} height={19} />
                                                    <p className='mx-3.5 text-[1.15rem] leading-6 '>{title}: </p>
                                                    <span className="ml-auto text-end">{righthand}</span>
                                                </>) : (<Skeleton key={id} variant="text" width={'100%'} />)}

                                            </li>
                                        ))}
                                    </ul>
                                ))}
                            </div>

                        </div>
                    </div>

                    <div className={`${isWide ? 'row-span-2' : ''} max-md:pt-6 flex justify-end max-lg:row-span-2 row-span-4 col-start-2`}>
                        <CourseTopic {...{ user, hydrated }} />
                    </div>

                    <div id="comments" className={`col-start-1 row-start-3 max-md:mt-5 mx-1 mt-3 `}>
                        {/* comments */}
                        <h2 className="h2 mb-3 tracking-wide ">Comments</h2>
                        <ul className="mb-10">
                            {comments.map(({ user, profilePicture, date, comment }, index) => (
                                <li key={index} className="li mb-5" style={{ border: index == comments.length - 1 ? 'none' : '' }}>
                                    <div className="flex gap-4 sm:gap-7">
                                        <Image src={profilePicture} alt={user} width={300} height={0} className="w-15 h-15 sm:w-20 sm:h-20 rounded-full object-cover" />
                                        <div>
                                            <p className="text-[1.15rem] sm:text-[1.25rem] text-[#6c6c6c]">{user}</p>
                                            <p className="text-[0.9rem] sm:text-base text-[#999999]">{date}</p>
                                            <p className="text-[1.1rem] sm:text-lg mt-3 text-[#999999]">{comment}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* send comment */}
                    <div>
                        <form action="" method="post">
                            {hydrated && (
                                <>
                                    <input type="hidden" name="id" value={user.id} />
                                    <input type="hidden" name="username" value={user.username} />
                                    <textarea
                                        name="comment"
                                        placeholder="Write a comment"
                                        className="w-full h-42 rounded-sm p-5 text-[#939393] text-lg font-medium md:text-xl resize-y border-none shadow-[0_0_30px_15px_rgba(0,0,0,.07)] outline-none min-h-25 max-h-100"
                                    ></textarea>
                                    <button type="submit" className="button gap-3 ">
                                        Submit Review <FaArrowRightLong />
                                    </button>
                                </>
                            )}
                        </form>

                    </div>

                </div>
            </section>
        </>
    )
}

export default Hero
