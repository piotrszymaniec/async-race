import  ICar from "./ICar"

const url:string = "http://localhost:3000/"

export function getCar(id:number): Promise<ICar> {
  return fetch(url+`garage/${id}`,{
    method:'GET'
  }).then(res=>res.json())
}