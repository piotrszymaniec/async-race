import React, { useEffect, useState } from 'react'
import ICar from '../common/ICar'
import CarShape from './CarShape'
import './garage-item.scss'
interface IGarageItemProps {
  carData: ICar;
  start: number | string;
  carEditDisabled: boolean
  onStart: () => void;
  onCancel: () => void;
  onRemove: () => void
  onSelect: (car: ICar) => void
}

export default function GarageItem(props: IGarageItemProps) {
  const animationState = props.start;
  const time = typeof props.start == 'number' ? props.start : null;

  return (
    <div className='garage-item'>
      <div className='car-name'>{props.carData.name}</div>
      <div className='garage-item-controls'>
        <button disabled={props.carEditDisabled} className='change' title='Change car details' onClick={() => props.onSelect(props.carData)}>Change 🔧</button>
        <button disabled={props.carEditDisabled} className='remove' title='Remove car from garage and winners' onClick={() => props.onRemove()}>Remove ❌</button>
      </div>
      <div className='car-race-controls'>
        <button title='Start car' onClick={() => {
          props.onStart()
        }}>▶</button>
        <button title='Stop car' onClick={() => {
          props.onCancel()
        }
        }>◼</button>
      </div>
      <div className={`car ${props.start != 'initial' && 'animate'}`} style={{ animationDuration: `${time}ms`, animationPlayState: animationState == 'paused' ? 'paused' : 'running' }}>
        <CarShape color={props.carData.color} />
      </div>
    </div>
  )
}