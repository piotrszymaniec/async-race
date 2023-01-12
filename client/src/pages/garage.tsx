import React, { FormEvent, useEffect, useState } from "react"
import ICar from "../common/ICar"
import GarageItem from '../components/GarageItem'
import CarFactoryWidget from "../components/CarFactoryWidget"
import "./garage.scss"
import CarUpdateWidget from "../components/CarUpdateWidget"
import Pagination from '../components/Pagination'
import { removeCar } from "../common/services"

export default function Garage() {
  interface ICarSpeed {
    velocity?: number,
    distance?: number
  }
  const [paginationPage,setPaginationPage] = useState(1)
  const [carStatusList, setCarStatusList] = useState<Array<{car:ICar, state:string | number}>>([])
  const [carCount, setCarCount] = useState(0)
  
  const [page, setPage] = useState(1)
  const [startRace, setStartRace] = useState<boolean>(false)


  const results:Array<string|number> = []
  const startCarEngine = (id:number) => fetch(`http://localhost:3000/engine?status=started&id=${id}`,{method: "PATCH"})
  const driveCar = (id:number) => fetch(`http://localhost:3000/engine?status=drive&id=${id}`,{method: "PATCH"})

  useEffect(()=>{
      Promise.allSettled(carStatusList.map((carData,index) => {        
        return startCarEngine(carData.car.id)
        .then(res=>{
          
          console.log(res.status)
          return res.json()
        })
        .then((v) => {
          const time = v.distance/v.velocity
          setCarStatusList(last=> {last[index].state = time; return [...last]})  
          return driveCar(carData.car.id)
            .then(res=>{
              console.log(res.status)
                  if(res.status ===200) {
                    setCarStatusList(last=> {last[index].state = 'paused'; return [...last]})
                    return v.velocity
                  } else {
                    setCarStatusList(last=> {last[index].state = 'paused'; return [...last]})
                    return 'fail'
                  }   
            })
        })      
      })      
      ).then(res=>{
        console.log(res)
        res.map(r=>{
          if (r.status === 'fulfilled') {
            console.log(r.value)
            return r.value
          } else {
            return {id:0,name:"", color:""}
          }
        })
      })
    },[startRace]
  )

    
  useEffect(()=>{            
    fetch(`http://localhost:3000/garage?_page=${paginationPage}&_limit=7` , {
      method: "GET"
    }).then(res=>{
      setCarCount(parseInt(res.headers.get("X-Total-Count")))
      return res.json()
    }).then(data => setCarStatusList(data.map((it:ICar)=> ({car:it, state:'initial'}))))    
  },[paginationPage])
  
  console.log('rerendered');
  return (
  <div>
    <nav>
      <CarFactoryWidget 
      onGetTotalCarsNumber={(newCarsCount)=>setCarCount(carCount+newCarsCount)}

      onAddCar={(carData)=>{
        /*setCarList(last=>{
          return [...last,carData]
        })*/
      }} 
      /> 
      <button onClick={()=>{
      setStartRace(true)                      
    }}
    >Race</button>
    <button onClick={()=>{
      //lets stop all cars by using cancelation token
      Promise.allSettled(
        carStatusList.map(data => {
          console.log('reqCancell')
          if (data.state == 'initial') {
            console.log('warn')
          }
          return fetch(`http://localhost:3000/engine?status=stopped&id=${data.car.id}`,{method: "PATCH"}).then(res=>{
            console.log('cancelled')
            setCarStatusList(last=> {data.state = 'initial'; return [...last]})
          });
        })).then(()=>console.log('all stopped'))          
      }     
    }>Reset</button>     
    </nav>
    <div>
      <h2>Cars in garage: ({carCount})</h2>
      <h3>Page number: {paginationPage}</h3>      
    
    {carStatusList.map((car,index) => {      
      return (
        <GarageItem 
        start={car.state} 
        onStart={()=>{
          console.log('reqStart')
          fetch(`http://localhost:3000/engine?status=started&id=${car.car.id}`,{method: "PATCH"})
            .then(res=>{
              //console.log(res.status)          
              return res.json()
            })
            .then(res=>{
              console.log('started')
              const time = res.distance/res.velocity
              setCarStatusList(last=> {last[index].state = time; return [...last]})              
              fetch(`http://localhost:3000/engine?status=drive&id=${car.car.id}`,{method: "PATCH"}).then(res=>{
                  //console.log(res.status)
                  console.log('stopped')
                  //setAnimationState('paused')      
                  // setStart(false)
                  //if (props.start){
                  if(res.status ===200) {
                    setCarStatusList(last=> {last[index].state = 'paused'; return [...last]})
                    //props.onFinish(animation)
                  } else {
                    setCarStatusList(last=> {last[index].state = 'paused'; return [...last]})
                    //props.onFinish('fail')
                  }                  
              })
            })                      
            //results[index] = 'start'
            //console.log(JSON.stringify(results))
        }} 
        onCancel = {()=>{
          console.log('reqCancell')
          if (carStatusList[index].state == 'initial'){
            console.log('warn')
          }
          fetch(`http://localhost:3000/engine?status=stopped&id=${car.car.id}`,{method: "PATCH"}).then(res=>{
            console.log('cancelled')
            setCarStatusList(last=> {last[index].state = 'initial'; return [...last]})
          });
        }}
        onFinish={(res)=>{
          results[index]=res
          console.log(JSON.stringify(results))
          if (!results.find(item => item === 'start')) {
            console.log('finish')
          }
        }} 
        onRemove = {()=>{
          removeCar(car.car.id).then(removedCarId=>{
            //update list
            setCarStatusList(carStatusList.filter(car=>car.car.id!=removedCarId))
            
                fetch(`http://localhost:3000/garage?_page=${page}&_limit=7` , {
                  method: "GET"
                })
                .then(res=>{return res.json()})
                .then(data => setCarStatusList(data.map((it:ICar)=> ({car:it, state:'initial'}))))      
          })

        }}
        carData={car.car} 
        key={car.car.id} 
      />
      )
    })}
    </div>
      <Pagination perPage={7} count={carCount} page={paginationPage} onChange={(page)=>{
        setPaginationPage(page)
      }}/>    
  </div>)  
}