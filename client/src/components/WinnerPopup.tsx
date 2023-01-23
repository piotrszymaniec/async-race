import React from 'react'
import './winner-popup.scss'

interface WinnerPopupProps {
  name: string
  time: number
}
export default function WinnerPopup(props:WinnerPopupProps) {
  return (<div className='winner-popup'>
    <div>Race Winner</div>
    <div>{props.name}</div>
    <div>{props.time}sec</div>
  </div>)
}