import React, { useEffect, useState } from 'react'
import { removeCarFromServer } from '../common';
import ICar from '../ICar'
import CarShape from './car-shape'
import './garage-item.css'
interface IGarageItemProps {
  carData: ICar;
  start: boolean;
  onStart: ()=>void;
  onFinish: (result:string|number)=> void
  onCarChange: (car:ICar) => void
}

export default function GarageItem(props:IGarageItemProps) {
  const [animation, setAnimation] = useState<number|null>(null)
  const [animationState, setAnimationState] = useState<string>('running')
  const [start, setStart] = useState<boolean>(false)  
  useEffect(()=>{
    if (props.start || start) {
      props.onStart()
      fetch(`http://localhost:3000/engine?status=started&id=${props.carData.id}`,{method: "PATCH"}).then(res=>{
          console.log(res.status)          
          return res.json()
        }).then(res=>{
          const time = res.distance/res.velocity
          setAnimation(time)})
    } else {
      setAnimation(null)
    }
  },[props.start, start])

  useEffect(()=>{
   if (animation !== null) {
   fetch(`http://localhost:3000/engine?status=drive&id=${props.carData.id}`,{method: "PATCH"}).then(res=>{
      console.log(res.status)
      setAnimationState('paused')      
      // setStart(false)
    if (props.start){
      if(res.status ===200) {
        props.onFinish(animation)
      } else {
        props.onFinish('fail')
      }    
    }})
  }
  },[animation])

  return(
    <div className='garage-item'>
      <div>
        <button onClick={()=>{props.onCarChange(props.carData)}}>
          Select
        </button>
        <button onClick={()=>{
          removeCarFromServer(props.carData.id).then(
            //refresh garage page
          )
        }}>
          Remove
        </button>
      </div>
      <button 
        onClick={()=>{
        // props.onStart()        
          setStart(true)
        }
        }
      >Go</button>
      <button 
        onClick={()=>{
          setAnimation(null)
          setStart(false) 
        }}
      >Stop</button>{props.carData.name}
      <div 
        className={`car ${animation && 'animate'}`} 
        style={{animationDuration:`${animation}ms`,"animation-play-state":animationState}}
      >
        <CarShape color={props.carData.color} />
      </div>      
    </div>
  )
}