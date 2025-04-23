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
import Link from "next/link";
import { useUser } from "@/context/userContext";
import { useQuery } from "@tanstack/react-query";

type CommentType = {
    user: string;
    profilePicture: string;
    date: string;
    comment: string;
};

const Hero = ({ user, mobileCheck }: { user: any; mobileCheck: boolean }) => {
    const { user_data, setUser_data } = useUser();
    const [hydrated, setHydrated] = useState(false);
    const [comments, setcomments] = useState<CommentType[]>([])
    const [skeletonComments, setskeletonComments] = useState(Array(3).fill({
        profilePicture: <Skeleton variant="circular" sx={{ width: '3.75rem', height: '3.75rem', '@media (min-width: 640px)': { width: '5rem', height: '5rem' }, aspectRatio: '1 / 1' }} />,
        user: <Skeleton height={10} width="40%" />,
        date: <Skeleton height={10} width="20%" style={{ marginTop: '6px' }} />,
        comment: (
            <>
                <Skeleton variant="text" width={'100%'} />
                <Skeleton variant="text" width={'60%'} />
            </>
        )
    }))
    const [isWide, setIsWide] = useState(false);
    const [isVideoStart, setIsVideoStart] = useState(false);

    useEffect(() => {
        setHydrated(true);
        document.body.classList.add('overflow-y-auto', 'pointer-events-auto')
    }, []);


    const { data: commentsData } = useQuery({
        queryKey: ['comments'],
        queryFn: async () => {
            const res = await fetch('/api/comments');
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        }
    });

    useEffect(() => {
        if (commentsData) {
            setcomments(commentsData);
        }
    }, [commentsData]);

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

    // update the user golobal state when the user is logged in
    useEffect(() => {
        if (user) {
            setUser_data(user);
        }
    }, [user, setUser_data]);
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
                            {curriculm.map(({ Icon, tooltip, Action, link }, index) => (
                                <li key={index}
                                    data-tooltip={tooltip}
                                    onClick={(e) => {
                                        !Action && window.history.pushState({}, '', '#' + link);
                                        if (!Action) {
                                            window.scrollTo({
                                                top: (mobileCheck && isVideoStart && !isWide) ? document.getElementById(link)!.offsetTop - 300 : document.getElementById(link)?.offsetTop
                                            })
                                        } else {
                                            showPopup({
                                                title: '', html: <div className="max-sm:-m-1 sm:mt-5 "><Action user={user_data} /></div>,
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
                                    onKeyDown={(e) => (e.key === ' ') && (e.preventDefault(), e.currentTarget.click())}
                                    role="button"
                                    tabIndex={0}
                                    className="group p-3 relative border duration-300 hover:bg-gray-400 hover:border-gray-400 transition-all border-gray-200 rounded-full cursor-pointer focus">

                                    <Icon className="text-gray-400 transition-all group-hover:text-white text-lg" key={index} />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='col-start-1 row-start-2 max-md:mx-2 mt-3 md:my-4 '>
                        <h2 className="h2 mb-6 max-md:hidden">Course Materials</h2>

                        <div className="px-9 py-6.5 max-xs:px-7 max-xs:py-4.5 md:py-4 shadow-[0_0_30px_15px_rgba(0,0,0,.05)] rounded-sm">
                            <h2 className="h2 mb-3 mt-7 hidden max-md:block text-[1.3rem]">{hydrated ? 'Course Materials' : <Skeleton variant="text" width={'60%'} />}</h2>
                            <div className="md:flex justify-between *:flex-1  gap-30 ">
                                {courseMat.map((item: any, i) => (
                                    <ul key={i}>
                                        {item.map(({ id, title, icon, righthand }: any, idx: number) => (
                                            <li key={id} className={`li`} style={{ border: idx == item.length - 1 ? 'none' : '' }}>
                                                {hydrated ? (<>
                                                    <Image src={icon} alt={icon} width={19} height={19} />
                                                    <p className='mx-3.5 max-xs:text-base text-[1.15rem] leading-6 '>{title}: </p>
                                                    <span className="ml-auto max-xs:text-sm text-end">{righthand}</span>
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
                            {(comments.length == 0 ? skeletonComments : comments).map(({ user, profilePicture, date, comment }, index) => (
                                <li key={index} className="li mb-5" style={{ border: index == comments.length - 1 ? 'none' : '' }}>
                                    <div className="flex gap-4 sm:gap-7 w-full">
                                        {comments.length > 0 ? (
                                            <div className="shrink-0 w-15 h-15 sm:w-20 sm:h-20 rounded-full overflow-hidden flex-center bg-[#e4e4e4]">
                                                <Image src={profilePicture} alt={user} width={300} height={0} className="w-full h-full object-cover" />
                                            </div>
                                        ) : (profilePicture)}
                                        <div className="w-full">
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
                        <form action="" method="post" onSubmit={(e) => {
                            e.preventDefault();
                            const textarea = e.currentTarget.querySelector('textarea');
                            if (textarea) textarea.value = ""; 
                        }}>
                            {hydrated && (
                                <>
                                    <input type="hidden" name="id" value={user.id} />
                                    <input type="hidden" name="username" value={user.username} />
                                    <textarea
                                        role="textbox"
                                        tabIndex={0}
                                        name="comment"
                                        placeholder="Write a comment"
                                        className="w-full min-h-42 rounded-sm p-5 text-[#939393] text-lg font-medium md:text-xl resize-y border-none shadow-[0_0_30px_15px_rgba(0,0,0,.07)] outline-none max-h-80 "
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
