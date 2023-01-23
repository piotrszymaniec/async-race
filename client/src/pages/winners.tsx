import React, { useEffect, useState } from "react"
import ICar from "../common/ICar"
import IWinner from "../common/IWinner"
import ISort from "../common/ISort"
import { getAllCars, getWinnersPage } from "../common/services"
import CarShape from "../components/CarShape"
import Pagination from "../components/Pagination"
import "./winners.scss"


export default function Winners() {
  const [winners, setWinners] = useState<Array<IWinner>>([])
  const [cars, setCars] = useState<Array<ICar>>([])
  const [paginationPage, setPaginationPage] = useState(1)
  const [winnersCount, setWinnersCount] = useState(0)
  const [sortOrder, setSortOrder] = useState<ISort>({ sort: 'id', order: 'ASC' })

  useEffect(() => {
    getWinnersPage(paginationPage, sortOrder).then(res => {
      setWinnersCount(parseInt(res.headers.get("X-Total-Count")))
      return res.json()
    }).then(data => {
      setWinners(data)
    })
    getAllCars().then(
      data => setCars(data)
    )
  }, [sortOrder, paginationPage])

  return (
    <div className="winners">
      <h2>Winners ({winnersCount})</h2>
      <h3>Page # {paginationPage}</h3>
      <table>
        <thead>
          <tr>
            <th className="sort" onClick={() => setSortOrder(so => (so.order === 'DESC') ? { sort: 'id', order: 'ASC' } : { sort: 'id', order: 'DESC' })}>Number</th>
            <th>Car</th>
            <th>Name</th>
            <th className="sort" onClick={() => setSortOrder(so => (so.order === 'DESC') ? { sort: 'wins', order: 'ASC' } : { sort: 'wins', order: 'DESC' })}>Wins</th>
            <th className="sort" onClick={() => setSortOrder(so => (so.order === 'DESC') ? { sort: 'time', order: 'ASC' } : { sort: 'time', order: 'DESC' })}>Best time (seconds)</th>
          </tr>
        </thead>
        <tbody>
          {
            winners.map(winner => {
              return { ...cars.filter(car => car.id == winner.id).pop(), ...winner }
            }).map((data, index) => {
              return (
                <tr key={index}>
                  <td>{data.id}</td>
                  <td><div className="car"><CarShape color={data.color} /></div></td>
                  <td>{data.name}</td>
                  <td>{data.wins}</td>
                  <td>{data.time}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
      <Pagination perPage={7} count={winners.length} page={paginationPage} onChange={(page) => {
        setPaginationPage(page)
      }} />
    </div>
  );
}