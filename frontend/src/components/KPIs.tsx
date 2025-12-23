import React, {useEffect, useState} from 'react'
import {Pie} from 'react-chartjs-2'
import API_URL from '../config'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
Chart.register(ArcElement, Tooltip, Legend)

export default function KPIs(){
  const [data,setData] = useState<any>(null)
  useEffect(()=>{ fetch(`${API_URL}/api/kpis`).then(r=>r.json()).then(setData) },[])
  if(!data) return <div className="card">Loading KPIs...</div>
  const chartData = {
    labels: ['Users','Events','Purchases'],
    datasets: [{data:[data.totalUsers, data.totalEvents, data.totalPurchases], backgroundColor:['#4f46e5','#06b6d4','#f97316']}]
  }
  return (
    <div className="card">
      <h3>Platform KPIs (mock)</h3>
      <div className="kpi-list">
        <div><strong>{data.totalUsers}</strong> Users</div>
        <div><strong>{data.totalEvents}</strong> Events</div>
        <div><strong>{data.totalPurchases}</strong> Purchases</div>
      </div>
      <div style={{width:200}}>
        <Pie data={chartData} />
      </div>
    </div>
  )
}
