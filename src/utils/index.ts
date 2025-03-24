import lock from '../../public/assets/svg/lock.png'
import presentation from '../../public/assets/svg/teacher.png'
import dollar from '../../public/assets/svg/dollar.png'

import clock from '../../public/assets/svg/clock.svg'
import book from '../../public/assets/svg/book.svg'
import reading from '../../public/assets/svg/reading.svg'
import file from '../../public/assets/svg/file.svg'
import globe from '../../public/assets/svg/globe.svg'
import window from '../../public/assets/svg/window.svg'
import add from '../../public/assets/svg/add.svg'
import arrowRight from '../../public/assets/svg/arrowRight.svg'
import minimize from '../../public/assets/svg/minimize.svg'

import React from 'react'
const PlayIcon = ({ size = ".8em", color = "currentColor" }) => {
  return React.createElement('svg', {
    stroke: color,
    fill: color,
    strokeWidth: '0',
    viewBox: '0 0 448 512',
    height: size,
    width: size,
    xmlns: 'http://www.w3.org/2000/svg',
  }, 
    React.createElement('path', { d: "M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" })
  );
};
export { 
    book,
    lock,
    reading,
    clock,
    file,
    globe,
    window,
    add,
    minimize,
    PlayIcon,
    arrowRight,
    presentation,
    dollar,
}