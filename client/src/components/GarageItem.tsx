import React, { useEffect, useState } from 'react'
import ICar from '../common/ICar'
import CarShape from './car-shape'
import './garage-item.css'
interface IGarageItemProps {
  carData: ICar;
  start: number | string;
  onStart: ()=>void;
  onCancel: ()=>void;
  onFinish: (result:string|number)=> void
  onRemove: ()=>void
}

export default function GarageItem(props:IGarageItemProps) {
  //const [animation, setAnimation] = useState<number|null>(null)
  //const [animationState, setAnimationState] = useState<string>('running')
  const animationState = props.start;
  const time = typeof props.start == 'number'? props.start : null; 
 // const [start, setStart] = useState<boolean>(false)
  /*useEffect(()=>{
    if (props.start) {
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
  },[props.start])

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
  },[animation])*/

  return(
    <div>
      <div>
        <button onClick={()=>props.onRemove()}>Remove</button>
      </div>
      <div>
      <button onClick={()=>{
         props.onStart()
        
        //setStart(true)
        }}>Go</button>
        <button onClick={()=>{
           props.onCancel()
          //setAnimation(null)
         // setStart(false) 
        }        
        }>Stop</button> 
      </div>
        
        {props.carData.name}
      <div className={`car ${props.start != 'initial' && 'animate'}`} style={{animationDuration:`${time}ms`,animationPlayState:animationState=='paused'?'paused':'running'}}>
        <CarShape color={props.carData.color} />
        </div>      
    </div>
  )
}