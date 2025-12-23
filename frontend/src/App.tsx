import React, {useState} from 'react'
import UserSearch from './components/UserSearch'
import UserJourney from './components/UserJourney'
import KPIs from './components/KPIs'

export default function App(){
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  return (
    <div className="app">
      <header>
        <img src="/Warner_Bros_Discovery.png" alt="Logo"  /> 
        <h1>User Analytics</h1>
      </header>
      <main>
        <section className="left">
          <UserSearch onSelect={id=>setSelectedUser(id)} />
          <KPIs />
        </section>
        <section className="right">
          {selectedUser ? <UserJourney userId={selectedUser} /> : <div>Select a user to view journey</div>}
        </section>
      </main>
    </div>
  )
}
