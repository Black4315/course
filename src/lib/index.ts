import gsap from "gsap";

export function createTooltip() {
  // Select all elements that have the 'tooltip' attribute
  const elements = document.querySelectorAll('[data-tooltip]');

  // Iterate over the selected elements and get the 'tooltip' value
  elements.forEach(element => {
    const tooltipValue = element.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');

    tooltip.className = 'tooltip ' + tooltipValue;
    tooltip.textContent = tooltipValue;
    element.parentElement?.appendChild(tooltip);

    const showTooltip = () => {
      const rect = element.getBoundingClientRect();
      tooltip.style.left = `${Math.max(40,Math.min(rect.left, innerWidth - 60)) + rect.width / 2}px`;
      tooltip.style.top = `${rect.top - 50}px`;
      tooltip.style.opacity = '1';
    };

    const hideTooltip = () => {
      tooltip.style.opacity = '0';
    };

    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
    element.addEventListener('click', hideTooltip);


    // Observe changes to the 'data-tooltip' attribute to update tooltip content
    const observer = new MutationObserver(() => {
      const tooltipValue = element.getAttribute('data-tooltip');
      if (tooltip.textContent !== tooltipValue) {
        tooltip.textContent = tooltipValue; // Update tooltip text if it changes
      }
    });

    observer.observe(element, { attributes: true, attributeFilter: ['data-tooltip'] });

    // Cleanup when the element is removed or when the component unmounts
    element.addEventListener('remove', () => {
      observer.disconnect();
      tooltip.remove(); // Optionally remove the tooltip from the DOM
    });
  });

}

export function simpleAnim(id: string, vars: object) {
  gsap.to(`#${id}`, {
    ...vars,
  })
}

export const animshowhide = (ele: any, show: boolean, delay = 2.2, kill: boolean = true) => {
  kill && gsap.killTweensOf(ele);
  gsap.to(ele, {
    opacity: show ? 1 : 0,
    ease: show ? 'elastic.out' : 'elastic.in',
    duration: 0.2,
    delay: show ? 0 : delay,
  });
};
export function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

////////////////////////////////////////// hero
import { useState, useEffect } from "react";
import withReactContent from 'sweetalert2-react-content'
import Swal, { SweetAlertOptions } from "sweetalert2";
import { ScrollTrigger } from "gsap/all";
import 'sweetalert2/dist/sweetalert2.min.css';

gsap.registerPlugin(ScrollTrigger)


export function useExamTimer(duration: number): [number, string] {
  const [time, setTime] = useState(duration);

  useEffect(() => {
    let currentTime = duration;

    const interval = setInterval(() => {
      if (currentTime <= 0) {
        clearInterval(interval);
      } else {
        currentTime -= 1;
        setTime(currentTime);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [duration]);

  return [time, formatTime(time)];
}


export const showAlert = (
  { title, text, icon, comfirm, cancel, action, props }:
    { title: string, text: string, icon: any, comfirm: any, cancel: any, action: () => void, props?: SweetAlertOptions }) => {
  return withReactContent(Swal).mixin({
    customClass: {
      confirmButton: "poup-btn btn-success ",
      cancelButton: "poup-btn btn-error  "
    },
    buttonsStyling: false
  }).fire({
    title: title,
    text: text,
    icon: icon,
    showCancelButton: true,
    confirmButtonText: comfirm,
    cancelButtonText: cancel,
    reverseButtons: true,
    didOpen: () => {
      action()

    },
    ...props,

  })
}


export const showPopup = (
  { title, html, action, props }:
    { title: string, html?: string | object, action?: () => void, props?: SweetAlertOptions }) => {
  return withReactContent(Swal).fire({
    title: title,
    html: html,
    showConfirmButton: false,
    showCloseButton: true,
    didOpen: action,
    ...props,

  })
}
export const gsapAnim = (target: any, props: object) => {
  return gsap.timeline({
    scrollTrigger: {
      trigger: target,
      toggleActions: "play none none none",
      start: "top 85%",
    },
  }).to(target, {
    ...props,
    duration: 0.8,
    delay: 0.3,
  });
};