import React, { useEffect, useState } from 'react'
import ICar from '../ICar'
import './garage-item.css'
interface IGarageItemProps {
  carData: ICar;
}

export default function GarageItem(props:IGarageItemProps) {
  const [animation, setAnimation] = useState<string|null>(null)
  const [animationState, setAnimationState] = useState<string>('running')
  const [start, setStart] = useState<boolean>(false)
  useEffect(()=>{
    if (start) {
      fetch(`http://localhost:3000/engine?status=started&id=${props.carData.id}`,{method: "PATCH"}).then(res=>{
          console.log(res.status)          
          return res.json()
        }).then(res=>{
          const time = res.distance/res.velocity
          setAnimation(`${time}ms`)})}
  },[start])

  useEffect(()=>{
   if (animation !== null) {
   fetch(`http://localhost:3000/engine?status=drive&id=${props.carData.id}`,{method: "PATCH"}).then(res=>{
      console.log(res.status)
      setAnimationState('paused')      
      setStart(false)
      
    })
  }
  },[animation])

  return(
    <div>
      <button onClick={()=>{
        setAnimation(null)
        setStart(true)
        }}>Go</button>
      <div className={`car ${animation && 'animate'}`} style={{animationDuration:animation,"animation-play-state":animationState}}>{props.carData.name}</div>      
    </div>
  )
}