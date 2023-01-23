import React from 'react'
import './pagination.scss'
interface IPaginationProps {
  count: number
  page: number
  perPage: number
  onChange: (page: number) => void
}

export default function Pagination(props: IPaginationProps) {
  return (
    <div className='pagination'>
      <button disabled={props.page < 2} onClick={() => {
        props.onChange(props.page - 1)
      }} >Prev</button>
      <button disabled={(props.page) * props.perPage > props.count} onClick={() => {
        props.onChange(props.page + 1)
      }}>Next</button>
    </div>
  )
}