"use state";

import React, { useState } from 'react'

export const Search = () => {
  const [search, setSearch] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const session = localStorage.getItem('session')

    try {
      const response = fetch(`http://164.90.153.245?query=${search}&session=${session}`)
      console.log(response)
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
