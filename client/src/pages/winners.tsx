import React, { useEffect, useState } from "react"
import ICar from "../common/ICar"
import IWinner from "../common/IWinner"
import {getAllCars, getAllWinners} from "../common/services"
import CarShape from "../components/car-shape"


export default function Winners() {
  const [winners, setWinners] = useState<Array<IWinner>>([])
  const [cars, setCars] = useState<Array<ICar>>([])

  useEffect(()=>{
    getAllWinners().then(     
       data => setWinners(data)
    )
    getAllCars().then(
       data => setCars(data)
    )
  },[])  

 return (
   <div>
      <table>
        <thead>
          <tr>            
            <th>Number</th>
            <th>Car</th>
            <th>Name</th>
            <th>Wins</th>
            <th>Best time (seconds)</th>
          </tr>
        </thead>
        <tbody>
          {                     
          winners.map(winner => {
            return {...cars.filter(car=>car.id == winner.id).pop(), ...winner}
          }).map( data => {
            return (
              <tr>
                <td>{data.id}</td>                
                <td>{data.name}</td>                
                <td><CarShape color={data.color} /></td>
                <td>{data.wins}</td>
                <td>{data.time}</td>     
              </tr>
            )
          })
          }
        </tbody>
      </table>
  </div>
  );
}

