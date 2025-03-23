import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const MODAL_STYLES = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#FFF',
    padding: '50px',
    zIndex: 1000
}
  
const OVERLAY_STYLES = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .7)',
    zIndex: 1000
}

export default function Modal({children, onClose }) {

    const outsideRef = useRef(null);

    useEffect(()=>{
        const outsideZone = outsideRef.current;

        const handleClickOutside = (e) => {
            if (outsideZone && e.target === outsideZone) {
              onClose();
            }
        };
      
        outsideZone?.addEventListener("click", handleClickOutside);
        return () => {
            outsideZone?.removeEventListener("click", handleClickOutside);
        };
    },[onClose]);
  
    return createPortal(
      <>
        <div ref={outsideRef} style={OVERLAY_STYLES} />
        <div style={MODAL_STYLES}>
          {children}
        </div>
      </>,
      document.getElementById('modal')
    )
  }