import React, { useEffect, useState } from "react"
import generateCars from "../common/common"
import ICar from "../common/ICar"
import IWinner from "../common/IWinner"
import GarageItem from '../components/GarageItem'
import CarFactoryWidget from "../components/CarFactoryWidget"
import "./garage.scss"
import CarUpdateWidget from "../components/CarUpdateWidget"
import Pagination from '../components/Pagination'
import WinnerPopup from '../components/WinnerPopup'
import { getWinner, removeCar, createWinner, updateWinner, createCar, removeWinner, startCarEngine, driveCar, getGaragePage, stopCarEngine } from "../common/services"

export default function Garage() {
  const [paginationPage, setPaginationPage] = useState(1)
  const [carStatusList, setCarStatusList] = useState<Array<{ car: ICar, state: string | number }>>([])
  const [carCount, setCarCount] = useState(0)
  const [carForUpdate, setCarForUpdate] = useState({ name: "", color: "#000000" })

  const [buttonsDisabledWhileRacing, setButtonsDisabledWhileRacing] = useState(false)
  const [showWinner, setShowWinner] = useState<boolean>(false)
  const [winner, setWinner] = useState<{ name: string, time: number }>({ name: "", time: 0 })

  useEffect(() => {
    refreshPage(paginationPage)
  }, [paginationPage])

  const onGenerateCars = () => {
    const cars = generateCars()
    cars.forEach((car) => {
      createCar(car.name, car.color)
        .catch(error => {
          console.log(error)
        })
    })
    setCarCount(carCount + cars.length)
  }

  const showWinnerPopup = (name: string, time: number, visible: boolean) => {
    return <WinnerPopup name={name} time={time} visible={visible} />
  }

  const onRace = () => {
    Promise.allSettled(carStatusList.map((carData, index) => {
      setButtonsDisabledWhileRacing(true)
      return startCarEngine(carData.car.id)
        .then(res => {
          return res.json()
        })
        .then((v) => {
          const time = v.distance / v.velocity
          setCarStatusList(last => { last[index].state = time; return [...last] })
          return driveCar(carData.car.id)
            .then(res => {
              if (res.status === 200) {
                setCarStatusList(last => { last[index].state = 'paused'; return [...last] })
                return { id: carData.car.id, name: carData.car.name, v: v.velocity }
              } else {
                setCarStatusList(last => { last[index].state = 'paused'; return [...last] })
                return { id: carData.car.id, name: carData.car.name, v: 0 }
              }
            })
        })
    })
    ).then(res => {
      const winner = res.map(r => {
        if (r.status === 'fulfilled') {
          return r.value
        }
      }).filter(r => r.v !== 0).sort((a, b) => {
        if (a.v === b.v) {
          return 0
        }
        else if (a.v < b.v) {
          return -1
        } else {
          1
        }
      }).pop()
      return winner
    }).then(w => {
      const time = Math.round(500000 / w.v / 10) / 100
      return getWinner(w.id).then(res => {
        if (res.status === 404) {
          return createWinner(w.id, 1, time).then(car => {
            return { name: w.name, time: time }
          })
        } else if (res.status === 200) {
          return res.json().then((w1: IWinner) => updateWinner(w.id, w1.wins + 1, w1.time < time ? w1.time : time)).then(car => {
            return { name: w.name, time: time }
          })
        }
      }).then(winner => {
        setWinner({ name: winner.name, time: winner.time })
        setShowWinner(true)
        setButtonsDisabledWhileRacing(false)
      })
    })
  }

  const refreshPage = (page: number) => {
    getGaragePage(page)
      .then(res => {
        setCarCount(parseInt(res.headers.get("X-Total-Count")))
        return res.json()
      })
      .then(data => setCarStatusList(data.map((car: ICar) => ({ car: car, state: 'initial' }))))
  }

  return (
    <div className="garage">
      {showWinner && showWinnerPopup(winner.name, winner.time, showWinner)}
      <nav className="garage-menu">
        <div className="car-edit-menu">
          <CarFactoryWidget disabled={buttonsDisabledWhileRacing} onAddCar={(car) => { setCarStatusList(last => { return [...last, { car, state: 'initial' }] }) }} />
          <CarUpdateWidget disabled={buttonsDisabledWhileRacing} car={carForUpdate} onCarChanged={() => {
            refreshPage(paginationPage)
          }} />
          <button disabled={buttonsDisabledWhileRacing} className="create-cars" onClick={() => onGenerateCars()}>CREATE MANY CARS</button>
        </div>
        <div className="race-controls">
          <div className="flag-icon">🏁</div><button className="race-button" onClick={() => onRace()}>Race</button>
          <button onClick={() => {
            Promise.allSettled(
              carStatusList.map(data => {
                return stopCarEngine(data.car.id).then(res => {
                  setCarStatusList(last => last.map(car => {
                    return { ...car, state: 'initial' }
                  }))
                });
              }))
            setShowWinner(false)
          }}>Reset</button>
        </div>
      </nav>
      <div>
        <h2>Cars in garage: ({carCount})</h2>
        <h3>Page number: {paginationPage}</h3>

        {carStatusList.map((car, index) => {
          return (
            <GarageItem
              start={car.state}
              onSelect={(car: ICar) => {
                setCarForUpdate(car)
              }}
              onStart={() => {
                startCarEngine(car.car.id)
                  .then(res => {
                    return res.json()
                  })
                  .then(res => {
                    const time = res.distance / res.velocity
                    setCarStatusList(last => { last[index].state = time; return [...last] })
                    driveCar(car.car.id).then(res => {
                      if (res.status === 200) {
                        setCarStatusList(last => { last[index].state = 'paused'; return [...last] })
                      } else {
                        setCarStatusList(last => { last[index].state = 'paused'; return [...last] })
                      }
                    })
                  })
              }}
              onCancel={() => {
                stopCarEngine(car.car.id).then(res => {
                  setCarStatusList(last => { last[index].state = 'initial'; return [...last] })
                });
              }}

              onRemove={() => {
                const carId = car.car.id
                removeCar(carId).then(status => {
                  if (status == 200) {
                    getWinner(carId).then(res => {
                      if (res.status == 200) {
                        removeWinner(carId)
                      }
                    })
                  }
                })
                  .then(status => {
                    refreshPage(paginationPage)
                  })
              }}
              carEditDisabled={buttonsDisabledWhileRacing}
              carData={car.car}
              key={car.car.id}
            />
          )
        })}
      </div>
      <Pagination perPage={7} count={carCount} page={paginationPage} onChange={(currentPage: number) => {
        setPaginationPage(currentPage)
      }} />
    </div>)
}