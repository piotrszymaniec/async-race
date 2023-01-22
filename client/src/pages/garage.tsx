import React, { FormEvent, useEffect, useState } from "react"
import generateCars from "../common/common"
import ICar from "../common/ICar"
import IWinner from "../common/IWinner"
import GarageItem from '../components/GarageItem'
import CarFactoryWidget from "../components/CarFactoryWidget"
import "./garage.scss"
import CarUpdateWidget from "../components/CarUpdateWidget"
import Pagination from '../components/Pagination'
import { getWinner, removeCar, createWinner, updateWinner } from "../common/services"

export default function Garage() {
  const [paginationPage,setPaginationPage] = useState(1)
  const [carStatusList, setCarStatusList] = useState<Array<{car:ICar, state:string | number}>>([])
  const [carCount, setCarCount] = useState(0)
  const [carForUpdate, setCarForUpdate] = useState({name:"",color:""})
  const [page, setPage] = useState(1) 
  const startCarEngine = (id:number) => fetch(`http://localhost:3000/engine?status=started&id=${id}`,{method: "PATCH"})
  const driveCar = (id:number) => fetch(`http://localhost:3000/engine?status=drive&id=${id}`,{method: "PATCH"})

const onGenerateCars = () => {
    const cars = generateCars()
    cars.forEach((car) => {        
        fetch('http://localhost:3000/garage', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({name:car.name, color:car.color})
        })
        .then(res=>{          
          return res.json()})
          .catch(error => {
            console.log(error)          
          })        
        })
      setCarCount(carCount+cars.length)
  }  

  const onRace = ()=>{
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
                    return {id:carData.car.id, v:v.velocity}
                  } else {
                    setCarStatusList(last=> {last[index].state = 'paused'; return [...last]})
                    return {id:carData.car.id, v:0}
                  }   
            })
        })      
      })      
      ).then(res=>{
        console.log(res)
        const winner = res.map(r=>{
          if (r.status === 'fulfilled') {
            // console.log(r.value)
            return r.value
          }
       }).filter(r=>r.v!==0).sort((a,b)=>b.v-a.v).pop()
        return winner        
      }).then(w=>{
        console.log(w)
          const time = Math.round(500000/w.v/10)/100
          getWinner(w.id).then(res=>{
            if (res.status === 404) {
              //create new winner
              return createWinner(w.id, 1, time)
            } else if (res.status === 200){
              return res.json().then((w1:IWinner) => updateWinner(w.id,w1.wins+1,w1.time<time?w1.time:time))
              //increment
            }           
          })
        //fetch winner with id of current winner
        //create winner
        })
    }
    
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
      onAddCar={(carData)=>{
        /*setCarList(last=>{
          return [...last,carData]
        })*/
        
      }} 
      /> 
      <CarUpdateWidget car={carForUpdate} onCarChanged={(car)=>{setCarForUpdate(car)}}/>
      <button onClick={()=>{
      onRace()                   
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
    <button onClick={()=>onGenerateCars()}>CREATE MANY CARS</button>  
    </nav>
    <div>
      <h2>Cars in garage: ({carCount})</h2>
      <h3>Page number: {paginationPage}</h3>      
    
    {carStatusList.map((car,index) => {      
      return (
        <GarageItem 
        start={car.state} 
        onSelect={(car:ICar)=>{
          setCarForUpdate(car)
        }}
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
                  } else {
                    setCarStatusList(last=> {last[index].state = 'paused'; return [...last]})
                  }                  
              })
            })                      
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