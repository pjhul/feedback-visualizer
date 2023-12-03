"use state";

import React, { useState } from 'react'

type SearchProps = {
  addData: ({ x, y }: { x: number; y: number }) => void
}

export const Search = (props: SearchProps) => {
  const [search, setSearch] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const session = localStorage.getItem('session')

    try {
      const response = await fetch(`http://164.90.153.245/search?query=${search}&session=${session}`)

      if (response) {
        const data = await response.json()
        props.addData({
          x: data[0],
          y: data[1]
        })
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  )
}
