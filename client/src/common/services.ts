import ICar from "./ICar"
import ISort from "./ISort"
import IWinner from "./IWinner"

const url: string = "http://localhost:3000/"

export function getCar(id: number): Promise<ICar> {
  return fetch(url + `garage/${id}`, {
    method: 'GET'
  }).then(res => res.json())
}
export function getAllCars(): Promise<Array<ICar>> {
  return fetch(url + `garage/`, {
    method: 'GET'
  }).then(res => res.json())
}
export function createCar(name: string, color: string): Promise<ICar> {
  return fetch(url + 'garage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, color })
  }).then(res => res.json())
}

export function updateCar(car: ICar): Promise<ICar> {
  return fetch(url + `garage/${car.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: car.name, color: car.color })
  }).then(res => res.json())
}

export function getAllWinners(sortOrder: ISort): Promise<Array<IWinner>> {
  return fetch(url + `winners?_sort=${sortOrder.sort}&_order=${sortOrder.order}`, {
    method: "GET"
  }).then(res => res.json())
}

export function getWinner(id: number): Promise<Response> {
  return fetch(url + `winners/${id}`, {
    method: "GET"
  })
}

export function createWinner(id: number, wins: number, time: number): Promise<IWinner> {
  return fetch(url + `winners`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, wins, time })
  }).then(res => res.json())
}
export function updateWinner(id: number, wins: number, time: number): Promise<IWinner> {
  return fetch(url + `winners/${id}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ wins, time })
  }).then(res => res.json())
}

export function removeCar(id: number): Promise<number> {
  return fetch(url + `garage/${id}`, {
    method: 'DELETE'
  }).then(res => res.status)
}
export function removeWinner(id: number): Promise<number> {
  return fetch(url + `winners/${id}`, {
    method: 'DELETE'
  }).then(res => res.status)
}

export function startCarEngine(id: number): Promise<Response> {
  return fetch(url + `engine?status=started&id=${id}`, { method: "PATCH" })
}
export function stopCarEngine(id: number): Promise<Response> {
  return fetch(url + `engine?status=started&id=${id}`, { method: "PATCH" })
}
export function driveCar(id: number): Promise<Response> {
  return fetch(url + `engine?status=drive&id=${id}`, { method: "PATCH" })
}

export function getPage(page: number): Promise<Response> {
  return fetch(url + `garage?_page=${page}&_limit=7`, {
    method: "GET"
  })
}