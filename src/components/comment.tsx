import { useState } from "react";

export default function Comment({ comment }: { comment: string; }) {
    const [expanded, setExpanded] = useState(false);
    let isText = typeof comment === 'string';
    const isLong = isText? comment.length > 175 : false;
    console.log(comment.length)
    return (
        <div className="text-[#999] text-[1.1rem] sm:text-lg mt-3 whitespace-pre-wrap">
            <p
                className={`break-words ${!expanded && isLong ? "line-clamp-2" : ""}`}
                style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: !expanded && isLong ? 2 : "unset",
                    overflow: "hidden",
                }}
            >
                {comment}
            </p>

            {isLong && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-blue-600 mt-1 text-sm cursor-pointer hover:underline"
                >
                    {expanded ? "Show less" : "Show more"}
                </button>
            )}
        </div>
    );
};