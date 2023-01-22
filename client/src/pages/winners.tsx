import React, { useEffect, useState } from "react"
import ICar from "../common/ICar"
import IWinner from "../common/IWinner"
import {getAllCars, getAllWinners} from "../common/services"
import CarShape from "../components/car-shape"
import Pagination from "../components/Pagination"
import "./winners.scss"


export default function Winners() {
  const [winners, setWinners] = useState<Array<IWinner>>([])
  const [cars, setCars] = useState<Array<ICar>>([])
  const [paginationPage,setPaginationPage] = useState(1)

  useEffect(()=>{
    getAllWinners().then(     
       data => setWinners(data)
    )
    getAllCars().then(
       data => setCars(data)
    )
  },[])  
console.log(winners)
 return (
   <div className="winners">
    <h2>Winners ({winners.length})</h2>
    <h3>Page # {paginationPage}</h3>
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
          }).map( (data,index) => {
            console.log(data)
            return (
              <tr key={index}>
                <td>{data.id}</td>                
                <td><CarShape color={data.color} /></td>
                <td>{data.name}</td>                
                <td>{data.wins}</td>
                <td>{data.time}</td>     
              </tr>
            )
          })
          }
        </tbody>
      </table>
      <Pagination perPage={7} count={winners.length} page={paginationPage} onChange={(page)=>{
        setPaginationPage(page)
      }}/>    
  </div>
  );
}