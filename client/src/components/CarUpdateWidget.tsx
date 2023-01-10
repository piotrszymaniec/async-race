import React, { FormEvent, useEffect, useState } from "react"
import ICar from '../common/ICar'

interface CarUpdateWidgetProps {
  // name: string,
  // color: string,
  car: ICar
  // onChange: (name:string, color:string)=>void
  onCarChanged: (car:ICar) => void
}
export default function CarUpdateWidget(props:CarUpdateWidgetProps) {
  const [car,setCar] = useState(props.car)
  useEffect(()=>{
    setCar(props.car)
  },[props.car])
  
  return (<div>
    <input type="text" name="car-name" id="car-name" value={car.name} onChange={(e:FormEvent<HTMLInputElement>)=>setCar({...car, name:e.currentTarget.value})} />
    <input type="color" name="car-color" id="car-color" value={car.color} onChange={(e:FormEvent<HTMLInputElement>)=>setCar({...car, color:e.currentTarget.value})}/>
    <button onClick={()=>{
      // setCar({...car, name:car.name,color:car.color})
      props.onCarChanged(car)
      fetch(`http://localhost:3000/garage/${props.car.id}`,{
      method: 'PUT',
      headers:{
	      'Content-Type':'application/json'
      },
	    body: JSON.stringify({name: car.name, color: car.color})
    })
    }}
    disabled={props.car.name ===""}
    >UPDATE</button>
  </div>)
}