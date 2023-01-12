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

