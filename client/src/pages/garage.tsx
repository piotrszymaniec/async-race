import React, { FormEvent, useEffect, useState } from "react"
import ICar from "../ICar"
import GarageItem from '../components/GarageItem'
import CarFactoryWidget from "../components/CarFactoryWidget"
import CarUpdateWidget from "../components/CarUpdateWidget"
import "./garage.scss"


export default function Garage() {
  const [carList, setCarList] = useState<Array<ICar>>([])
  const [carCount, setCarCount] = useState(0)
  const [changedCar, setChangedCar] = useState<ICar>({name:'',color:''})

  const [page, setPage] = useState(1)
  const [startRace, setStartRace] = useState<boolean>(false)

  const results:Array<string|number> = []

  // useEffect(()=>{
  // Promise.allSettled(carList.map(carData => {        
  //      return fetch(`http://localhost:3000/engine?status=started&id=${carData.id}`,{method: "PATCH"}).then(res=>{
  //         console.log(res.status)
  //         return res.json()
  //       }).then(
  //         (v) => {
  //            return fetch(`http://localhost:3000/engine?status=drive&id=${carData.id}`,{method: "PATCH"}).then(res=>{
  //             console.log(res.status)
  //             if(res.status ===200) {
  //               return v.velocity
  //             } else {
  //               return 'fail'
  //             }
  //           })
  //         }
  //       )      
  //     })
  //     ).then(res=>console.log(res))

  // },[startRace])
  

  useEffect(()=>{                
    fetch("http://localhost:3000/garage?_page=1&_limit=7", {
      method: "GET"
    }).then(res=>{
      // setCarCount(parseInt(res.headers.get("X-Total-Count")))
      return res.json()
    }).then(data => setCarList(data))        
  },[])

  function getPage(page:number) {
    fetch(`http://localhost:3000/garage?_page=${page}&_limit=7`, {
      method: "GET"
    }).then(res=>res.json()).then(data => setCarList(data)) 
  }

  return (
  <div>
    <div className="car-menu">
      <CarFactoryWidget 
        onGetTotalCarsNumber={(newCarsCount)=>setCarCount(carCount+newCarsCount)}
        onAddCar={(carData)=>{
          setCarList(last=>{
            return [...last,carData]
          })
        }} 
      />
      <CarUpdateWidget car={changedCar} onCarChanged={(car:ICar)=>{
        setChangedCar(car)
        getPage(page)
        }}
        />      
    </div>
    <div>
      <button onClick={()=>{setStartRace(true)}} disabled={startRace}>Race</button>
    </div>
    <div>
      <h2>Cars in garage: ({carCount})</h2>
      <h3>Page number: {page}</h3>
      {carList.map((car,index) => {
        return (
        <GarageItem 
          start={startRace} 
          onStart={()=>{ 
            results[index] = 'start'
            console.log(JSON.stringify(results))
            }
          }

          onFinish={(res)=>{
            results[index]=res
            console.log(JSON.stringify(results))
            if (!results.find(item => item === 'start')) {
              console.log('finish')
            }
            }
          } 
          carData={car}
          onCarChange={(car:ICar)=>{setChangedCar(car)}} 
          key={car.id} 
        />)})
      }
    </div>
    {page>1? <button className="pageButton" onClick={()=>{
      //todo refactor ugly code
      const tmp = page-1
      setPage(tmp)
      getPage(tmp)
      }}>Prev Page</button>:""}
      {/* 7 is limit of cars shown */}
     {(carCount-(page*7))>=0?<button className="pageButton" onClick={()=>{const tmp=page+1;setPage(page+1); getPage(tmp)}}>Next Page</button>:<button disabled className="pageButton" onClick={()=>{const tmp=page+1;setPage(page+1); getPage(tmp)}}>Next Page</button>}    
  </div>)  
}