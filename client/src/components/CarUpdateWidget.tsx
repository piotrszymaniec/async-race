import React, { FormEvent, useEffect, useState } from "react"
import ICar from '../common/ICar'
import { updateCar } from "../common/services"

interface CarUpdateWidgetProps {
  car: ICar
  disabled: boolean
  onCarChanged: () => void
}
export default function CarUpdateWidget(props: CarUpdateWidgetProps) {
  const [car, setCar] = useState(props.car)
  useEffect(() => {
    setCar(props.car)
  }, [props.car])

  return (<div className="car-update">
    <input disabled={props.disabled || props.car.name === ""} type="text" name="car-name" id="car-name" value={car.name} onChange={(e: FormEvent<HTMLInputElement>) => setCar({ ...car, name: e.currentTarget.value })} />
    <input disabled={props.disabled || props.car.name === ""} type="color" name="car-color" id="car-color" value={car.color} onChange={(e: FormEvent<HTMLInputElement>) => setCar({ ...car, color: e.currentTarget.value })} />
    <button onClick={() => {
      updateCar(car).then(res => props.onCarChanged())
    }}
      disabled={props.disabled || props.car.name === ""}
    >UPDATE</button>
  </div>)
}