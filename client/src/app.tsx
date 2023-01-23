import React, { useState } from "react";
import "./app.scss"
import Garage from './pages/garage'
import Winners from './pages/winners'

export default function App() {
  const [page, setPage] = useState<string>("garage")
  return (
    <div>
      <nav className="menu">
        <button onClick={() => setPage("garage")}>Garage</button>
        <button onClick={() => setPage("winners")}>Winners</button>
      </nav>
      {page == "garage" ? <Garage /> : <Winners />}
    </div>
  )
}