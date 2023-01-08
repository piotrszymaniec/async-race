import React, { FormEvent, useEffect, useState } from "react"
import ICar from "../ICar"
import GarageItem from '../components/GarageItem'
import CarSelectionWidget from "../components/car-selection-widget"
import CarFactoryWidget from "../components/CarFactoryWidget"
import "./garage.scss"
import CarUpdateWidget from "../components/CarUpdateWidget"


export default function Garage() {

  interface ICarSpeed {
    velocity?: number,
    distance?: number
  }
  const [carList, setCarList] = useState<Array<ICar>>([])
  const [carCount, setCarCount] = useState(0)
  const [carSpeed, setCarSpeed] = useState<ICarSpeed>({})  
  const [page, setPage] = useState(1)

  const onSelect = ({ }) => {

  }

  useEffect(()=>{        
    const urlCars = "http://localhost:3000/garage?_page=1&_limit=7"    
    fetch(urlCars, {
      method: "GET"
    }).then(res=>{
      setCarCount(parseInt(res.headers.get("X-Total-Count")))
      return res.json()
    }).then(data => setCarList(data))
    
    const urlCarSpeed = "http://localhost:3000/engine?id=1&status=started"
    //get car velocity
    // fetch(urlCarSpeed, {
    //   method: "PATCH"
    // }).then(res=>res.json()).then(data => setCarSpeed(data)) 
  },[carCount])
  function getPage(page:number) {
    //fetch new cars list ?
    const urlCars = `http://localhost:3000/garage?_page=${page}&_limit=7`
    fetch(urlCars, {
      method: "GET"
    }).then(res=>res.json()).then(data => setCarList(data)) 
  }
  return (
  <div>
    <nav>
      {}
      <CarFactoryWidget 
      //i want to preserve old number of cars already in garage and show cars added with "create many cards" button i real time
      //but now car counter is overriten by newly created cars
      onGetTotalCarsNumber={(newCarsCount)=>setCarCount(carCount+newCarsCount)}

      onAddCar={(carData)=>{
        setCarList(last=>{
          return [...last,carData]
        })
      }} />      
      <h2>Cars in garage: ({carCount})</h2>
      <h3>Page number: {page}</h3>
      
    </nav>
    <div>{carList.map(el => {return (<GarageItem key={el.id}  />)})}</div>
    {page>1? <button className="pageButton" onClick={()=>{
      //todo refactor ugly code
      const tmp = page-1
      setPage(tmp)
      getPage(tmp)
      }}>Prev Page</button>:""}
      {/* 7 is limit of cars shown */}
    {(carCount-(page*7))>=0?<button className="pageButton" onClick={()=>{const tmp=page+1;setPage(page+1); getPage(tmp)}}>Next Page</button>:<button disabled className="pageButton" onClick={()=>{const tmp=page+1;setPage(page+1); getPage(tmp)}}>Next Page</button>}
    
    {/* <div>{carSpeed.velocity}</div> */}
  </div>)  
}