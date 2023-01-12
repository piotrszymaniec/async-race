import ICar from "./ICar"
function generateName():string {
  //dummy values
  const carPrefixName = "ABCDEFGHIJKLMNOPRSTUW".split("")
  const carSufixName = "1234567890".split("")
  return `${carPrefixName[Math.floor(Math.random()*carPrefixName.length)]} ${carSufixName[Math.floor(Math.random()*carSufixName.length)]}`
}
function generateColor():string {
  let color = `#${Math.pow(Math.floor(Math.random()*255),3).toString(16)}`  
  while (color.length<7) {
    color+='0'
  }
  return color
}

export default function generateCars():Array<ICar> {  
  const arr:Array<ICar> = []
  for(let i=0;i<100;i++) {
    arr.push({name: generateName(), color: generateColor()})
  }
  return arr
}

export function removeCarFromServer(id:number):Promise<Response> {
  return fetch(`http://localhost:3000/garage/${id}`,{
    method: 'DELETE'
  })
}
