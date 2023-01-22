import React, { FormEvent, useEffect, useState } from "react"
import ICar from '../common/ICar'


interface CarFactoryWidgetProps {
  onAddCar: (car:ICar) => void  
}

export default function CarFactoryWidget(props:CarFactoryWidgetProps) {
  const [carColor, setCarColor] = useState("#00FF00")
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
    fetch('http://localhost:3000/garage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({name:carName, color:carColor})
    })
    .then(res=>res.json())
    .then(content=>{
      props.onAddCar(content)
      setCarName("")
      setIsFetching(false)
    })
    .catch(error => {
      console.log(error)
      setIsFetching(false)
    })
  } 

  return (
    <div>
      <input type="text" value={carName} onChange={newNameChange}/>
      <input type="color" color={carColor} onChange={carColorChange}/>
      <button disabled={isFetching} onClick={onCreateCar}>CREATE</button>
    </div>
  )
}