import React from 'react'
import ICar from '../ICar'
interface IGarageItemProps {
  carData: ICar;
}

export default function GarageItem(props:IGarageItemProps) {

  return(
    <div>
      {props.carData.name}
    </div>
  )
}