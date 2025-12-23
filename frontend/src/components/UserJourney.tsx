import React, {useEffect, useState} from 'react'
import API_URL from '../config'

export default function UserJourney({userId}:{userId:string}){
  const [data,setData] = useState<any>(null)
  useEffect(()=>{
    setData(null)
    fetch(`${API_URL}/api/users/${userId}`).then(r=>r.json()).then(setData)
  },[userId])
  if(!data) return <div className="card">Loading user journey...</div>
  return (
    <div className="card">
      <h3>Journey for {data.userId}</h3>
      <div className="kpis-row">
        <div>Sessions: {data.kpis.sessions}</div>
        <div>Pages: {data.kpis.totalPages}</div>
        <div>Purchases: {data.kpis.totalPurchases}</div>
        <div>Total time (s): {data.kpis.totalTimeSeconds}</div>
      </div>
      <div className="sessions">
        {data.sessions.map((s:any, idx:number)=> (
          <details key={idx}>
            <summary>Session {idx+1} — {new Date(s.start).toLocaleString()} — pages {s.pagesVisited} — purchases {s.purchases}</summary>
            <ol>
              {s.events.map((e:any,i:number)=> (
                <li key={i}>{e.type} {e.page?`(${e.page})`:''} {e.amount?`$${e.amount}`:''} — {e.duration?`${e.duration}s`:''}</li>
              ))}
            </ol>
          </details>
        ))}
      </div>
    </div>
  )
}
