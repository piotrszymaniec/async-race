import React, { useState } from 'react'
import './winner-popup.scss'

interface WinnerPopupProps {
  name: string
  time: number
  visible: boolean
}
export default function WinnerPopup(props: WinnerPopupProps) {
  const [hidden, setHidden] = useState(false)
  return (
    <div className={`winner-popup ${(hidden && props.visible) ? 'hide' : ''}`}>
      <div className='close-btn' onClick={() => setHidden(true)}>✖</div>
      <div className='icon'>🥇</div>
      <div className='name'>{props.name}</div>
      <div className='time'>{props.time} sec</div>
    </div>)
}