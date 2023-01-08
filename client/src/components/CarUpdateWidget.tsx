import React from "react"

interface CarUpdateWidgetProps {
  name: string,
  color: string,
  onClick: ()=>void
}
export default function CarUpdateWidget(props:CarUpdateWidgetProps) {
  //const []
  
  return (<>
    <input type="text" name="car-name" id="car-name" value={props.name}/>
    <input type="color" name="car-color" id="car-color" value={props.color} />
    <button onClick={props.onClick}>UPDATE</button>
  </>)
}