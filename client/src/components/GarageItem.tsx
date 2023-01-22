import React, { useEffect, useState } from 'react'
import ICar from '../common/ICar'
import CarShape from './car-shape'
import './garage-item.css'
interface IGarageItemProps {
  carData: ICar;
  start: number | string;
  onStart: ()=>void;  
  onCancel: ()=>void;
  onRemove: ()=>void
  onSelect: (car:ICar)=>void
}

export default function GarageItem(props:IGarageItemProps) {
  const animationState = props.start;
  const time = typeof props.start == 'number'? props.start : null; 

  return(
    <div className='garage-item'>
      <div className='car-name'>{props.carData.name}</div>
      <div className='garage-item-controls'>
        <button className='change' onClick={()=>props.onSelect(props.carData)}>Change 🔧</button>
        <button className='remove' onClick={()=>props.onRemove()}>Remove ❌</button>
      </div>
      <div className='car-race-controls'>
        <button onClick={()=>{
         props.onStart()                
        }}>▶</button>
        <button onClick={()=>{
           props.onCancel()
        }        
        }>◼</button> 
      </div>
      <div className={`car ${props.start != 'initial' && 'animate'}`} style={{animationDuration:`${time}ms`,animationPlayState:animationState=='paused'?'paused':'running'}}>
        <CarShape color={props.carData.color} />
        </div>      
    </div>
  )
}