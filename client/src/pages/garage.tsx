import React, { useEffect, useState } from "react"
export default function Garage() {
  interface ICar {
    name: string,
    color: string,
    id: number
  }
  interface ICarSpeed {
    velocity?: number,
    distance?: number
  }
  const [carStatus, setCarStatus] = useState<Array<ICar>>([])
  const [carSpeed, setCarSpeed] = useState<ICarSpeed>({})
  useEffect(()=>{        
    const urlCars = "http://localhost:3000/garage"
    const urlCarSpeed = "http://localhost:3000/engine?id=1&status=started"
    fetch(urlCars, {
      method: "GET"
    }).then(res=>res.json()).then(data => setCarStatus(data)) 
    fetch(urlCarSpeed, {
      method: "PATCH"
    }).then(res=>res.json()).then(data => setCarSpeed(data)) 
  },[])
  return (
  <div>
    <div>{carStatus.map(el => {return (<div key={el.id}>{el.name}</div>)})}</div>
    <div>{carSpeed.velocity}</div>
  </div>)
  
}