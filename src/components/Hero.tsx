'use client';
import VideoPlayer from "./VideoPlayer"
import { useEffect, useState } from "react";
import CourseTopic from "./CourseTopic";
import Head from "next/head";
import { useUser } from "@/context/userContext";
import Comments from "./Comments";
import CourseMaterials from "./CourseMaterials";
import CurriculmList from "./CurriculmList";

type CommentType = {
    user: string;
    profilePicture: string;
    date: string;
    comment: string;
};

const Hero = ({ user, mobileCheck }: { user: any; mobileCheck: boolean }) => {
    const { user_data, setUser_data } = useUser();
    const [hydrated, setHydrated] = useState(false);
    const [isWide, setIsWide] = useState(false);
    const [isVideoStart, setIsVideoStart] = useState(false);

    useEffect(() => {
        setHydrated(true);
        document.body.classList.add('overflow-y-auto', 'pointer-events-auto')
    }, []);


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

                    {/* video palyer */}
                    <div className={`${isWide ? 'col-span-2' : ''} ${(mobileCheck && isVideoStart && !isWide) && 'sticky top-0 shadow-sm z-9 px-3 sm:px-9 -mx-3 sm:-mx-9 -mt-5 py-3 pt-5 bg-white'}  flex flex-col  max-xl:col-span-2 `}>

                        <VideoPlayer onExpand={setIsWide} onStart={setIsVideoStart} isWide={isWide} mobileCheck={mobileCheck} />
                        <CurriculmList {...{ mobileCheck, isVideoStart, isWide }} /> 
                    </div>

                    {/* course details */} 
                    <div className='col-start-1 row-start-2 max-md:mx-2 mt-3 md:my-4 '>
                        <CourseMaterials {...{mobileCheck}}/>
                    </div> 
                   
                    {/* course topic */}
                    <div className={`${isWide ? 'row-span-2' : ''} max-md:pt-6 flex justify-end max-lg:row-span-2 row-span-4 col-start-2`}>
                        <CourseTopic {...{ user, hydrated }} />
                    </div>

                    {/* comments section */}
                    <Comments />

                </div>
            </section>
        </>
    )
}

export default Hero
