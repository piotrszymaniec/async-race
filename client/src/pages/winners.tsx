import React, { useEffect, useState } from "react"
import ICar from "../common/ICar"
import {getCar} from "../common/services"
import CarShape from "../components/car-shape"
interface IWinner {
  id: number
  wins: number
  time: number
}

// Optional:
// _page=[integer]
// _limit=[integer]
//If _limit param is passed api returns a header X-Total-Count that countains total number of records.
// _sort=['id'|'wins'|'time']
// _order=['ASC'|'DESC']
const getWinners = (): Promise<Array<IWinner>> => fetch(`http://localhost:3000/winners?_page=1&_limit=7`, {method: "GET"}).then(res=>res.json())
const getWinner = (id: number): Promise<IWinner> => fetch(`http://localhost:3000/winner/${id}`, {method: "GET"}).then(res=>res.json())

export default function Winners() {
  const [winners, setWinners] = useState<Array<IWinner>>([])
  const [winningCarsData, setWinningCarsData] = useState<Array<ICar>>([])

  useEffect(()=>{
    getWinners().then(winners=>{
      Promise.allSettled(winners.map(winner=>{
        return getCar(winner.id)
      })).then(res=>{
        return res.map(r=> {
          if (r.status === 'fulfilled') {
            console.log(r.value)
            return r.value
          } else {
            return {id:0,name:"", color:""}
          }
        })}
      ).then(cars=>setWinningCarsData(cars))
    })
  },[])


  return (
    <div>
      <h1>Winners</h1>
      <h2>Page (#3)</h2>
      <div className="winners">    
        <div>{winningCarsData.map(car => {
          return (<div className="car">{car.name} <CarShape color={car.color} /></div>)
        })}</div>        
      </div>
    </div>
  )
}

