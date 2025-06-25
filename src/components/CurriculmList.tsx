import { curriculm } from '@/constants';
import { useUser } from '@/context/userContext';
import { showPopup } from '@/lib';

const CurriculmList = ({ mobileCheck, isVideoStart, isWide }: { mobileCheck: boolean; isVideoStart:boolean; isWide:boolean }) => {
    const { user_data, setUser_data } = useUser();
  return (
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
                                    customClass: { popup: `max-sm:!w-svw max-sm:h-svh max-sm:!rounded-none sm:top-1/2 sm:-translate-y-1/2` }
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
    )
}

export default CurriculmList