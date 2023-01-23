import React from 'react'
import './winner-popup.scss'

interface WinnerPopupProps {
  name: string
  time: number
}
export default function WinnerPopup(props: WinnerPopupProps) {
  return (<div className='winner-popup'>
    <div className='icon'>🥇</div>
    <div className='name'>{props.name}</div>
    <div className='time'>{props.time} sec</div>
  </div>)
}