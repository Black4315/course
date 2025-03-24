import { arrowRight } from '@/utils'
import Image from 'next/image'

const Header = () => {
  
  return (
    <header className='bg-gray-100 '>
      <div className="common-padding py-3 screen-max-width">
        <ul className="flex">
          {['Home','Courses','Course Details'].map((e,i)=>(
            <div key={i} className='flex'>
              <li className={`flex text-md md:text-xl tracking-wide cursor-pointer ${i==2?'text-black':'font-light'} transition-all hover:text-black`}>
                {e} 
              </li>
                {i!=2 && 
                  <Image 
                    className='mx-1.5 '
                    src={arrowRight} 
                    width={15}
                    height={15}
                    alt={'arrow'}
                /> }
            </div>
          ))}
    
        </ul>
        <h1 className='text-3xl md:text-[45px] font-[600] mt-7 -mb-0.5 '>
          Starting SEO at your Home
        </h1>

      </div>
    </header>
  )
}

export default Header
