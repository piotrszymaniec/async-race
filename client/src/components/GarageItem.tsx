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
      <div>
        <button onClick={()=>props.onSelect(props.carData)}>Select</button>
        <button onClick={()=>props.onRemove()}>Remove</button>
        <span className='car-name'>{props.carData.name}</span>
      </div>
      <div>
      <button onClick={()=>{
         props.onStart()                
        }}>Go</button>
        <button onClick={()=>{
           props.onCancel()
        }        
        }>Stop</button> 
      </div>
      <div className={`car ${props.start != 'initial' && 'animate'}`} style={{animationDuration:`${time}ms`,animationPlayState:animationState=='paused'?'paused':'running'}}>
        <CarShape color={props.carData.color} />
        </div>      
    </div>
  )
}