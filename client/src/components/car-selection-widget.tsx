import React, { useEffect, useState } from "react"
import CarUpdateWidget from "./CarUpdateWidget"

interface CarSelectionWidgetProps {
  name: string,
  color: string,
  onClick: ()=>void
}
export default function CarSelectionWidget() {
  const [updatedCarColor, setUpdatedCarColor] = useState("#fff")
  useEffect(()=>{

  },[])
  return (<>
    {/* <CarCreateWidget name="" color="#fff" /> */}
    {/* <CarUpdateWidget name="" color="#fff" onClick={()=> {}}/> */}
  </>)
}