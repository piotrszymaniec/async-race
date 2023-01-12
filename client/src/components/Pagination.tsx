import React, { useState } from 'react'
interface IPaginationProps {
  count:number
  page:number
  perPage:number
  onChange: (page:number)=>void
}

export default function Pagination(props:IPaginationProps) {
  const [page,setPage] = useState<number>(props.page)

  return(
      <div>        
        <button disabled={page==1} onClick={()=>{
          setPage(last=>last-1)
          props.onChange(page)
        }} >Prev</button>
        <button disabled={(page)*props.perPage>props.count} onClick={()=>{
          setPage(last=>last+1)
          props.onChange(page)
        }}>Next</button>
      </div>
  )
}