import  ICar from "./ICar"
import  IWinner from "./IWinner"

const url:string = "http://localhost:3000/"

export function getCar(id:number): Promise<ICar> {
  return fetch(url+`garage/${id}`,{
    method:'GET'
  }).then(res=>res.json())
}
export function getAllCars(): Promise<Array<ICar>> {
  return fetch(url+`garage/`,{
    method:'GET'
  }).then(res=>res.json())
}
export function createCar(name:string, color:string): Promise<ICar> {
  return fetch('http://localhost:3000/garage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({name, color})
  }).then(res=>res.json())
}

// Optional:
// _page=[integer]
// _limit=[integer]
//If _limit param is passed api returns a header X-Total-Count that countains total number of records.
// _sort=['id'|'wins'|'time']
// _order=['ASC'|'DESC']
// export function getPageWinners(id:number): Promise<Array<IWinner>> { 
//   return fetch(`http://localhost:3000/winners?_page=1&_limit=7`, {
//     method: "GET"
//   }).then(res=>res.json())
// }
export function getAllWinners(): Promise<Array<IWinner>> { 
  return fetch(`http://localhost:3000/winners`, {
    method: "GET"
}).then(res=>res.json())}

export function getWinner(id:number): Promise<Response> { 
  return fetch(`http://localhost:3000/winners/${id}`, {
    method: "GET"
  })
}
// .then(res=>res.json())}

export function createWinner(id:number, wins:number, time:number) {
  return fetch(`http://localhost:3000/winners`,{
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },    
    body: JSON.stringify({id, wins, time})
  }).then(res=>res.json())
}
export function updateWinner(id:number, wins:number, time:number) {
  return fetch(`http://localhost:3000/winners/${id}`,{
    method: "PUT",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({wins, time})
  }).then(res=>res.json())
}

export function removeCar(id:number): Promise<number> {
  return fetch(url+`garage/${id}`,{
    method:'DELETE'
  }).then(res=>res.status)
}