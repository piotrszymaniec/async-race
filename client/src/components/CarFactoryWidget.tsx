import React, { FormEvent, useEffect, useState } from "react"
import ICar from '../common/ICar'
import { createCar } from "../common/services"


interface CarFactoryWidgetProps {
  onAddCar: (car:ICar) => void  
}

export default function CarFactoryWidget(props:CarFactoryWidgetProps) {
  const [carColor, setCarColor] = useState("#000000")
  const carColorChange = (e:FormEvent<HTMLInputElement>) => {
    setCarColor(e.currentTarget.value)
  }
  const [carName, setCarName] = useState("")
  const [isFetching, setIsFetching] = useState(false)
  const newNameChange = (e:FormEvent<HTMLInputElement>) => {
      setCarName(e.currentTarget.value)
  }
  
  const onCreateCar = () => {
    setIsFetching(true)
    createCar(carName, carColor)    
    .then(car=>{
      props.onAddCar(car)
      setCarName("")
      setIsFetching(false)
    })
    .catch(error => {
      console.log(error)
      setIsFetching(false)
    })
  } 

  return (
    <div className="car-create">
      <input type="text" value={carName} onChange={newNameChange}/>
      <input type="color" color={carColor} onChange={carColorChange}/>
      <button disabled={isFetching} onClick={onCreateCar}>CREATE</button>
    </div>
  )
}