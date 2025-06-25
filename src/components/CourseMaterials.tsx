import Image from "next/image"
import { duration, Skeleton } from "@mui/material";
import { courseMat } from "@/constants";
import { useEffect, useState } from "react";

const CourseMaterials = () => {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);
    return (

        <>
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
        </>
    )
}

export default CourseMaterials