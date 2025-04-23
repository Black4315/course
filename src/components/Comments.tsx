"use client"
import { useUser } from '@/context/userContext';
import { Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { FaArrowRightLong } from 'react-icons/fa6';

type CommentType = {
    user: string;
    profilePicture: string;
    date: string;
    comment: string;
};

const Comments = () => {
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

    useEffect(() => {
        setHydrated(true);
    }, []);

    return (
        <>
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
                            <input type="hidden" name="id" value={user_data?.id} />
                            <input type="hidden" name="username" value={user_data?.username} />
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
        </>

    )
}

export default Comments