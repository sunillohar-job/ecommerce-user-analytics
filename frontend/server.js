const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// Simple in-memory mock dataset generator
const USERS_COUNT = 1000
const users = []
const eventsByUser = new Map()

function randInt(min, max) { return Math.floor(Math.random()*(max-min+1))+min }
function sample(arr){ return arr[Math.floor(Math.random()*arr.length)] }

const pages = ['/home','/search','/product/1','/product/2','/cart','/checkout']

for(let i=1;i<=USERS_COUNT;i++){
  const id = `user-${i}`
  const email = `user${i}@example.com`
  users.push({id, email, name: `User ${i}`})
  const sessions = []
  const sessionsCount = randInt(1,5)
  for(let s=0;s<sessionsCount;s++){
    const events = []
    const start = Date.now() - randInt(0, 30)*24*60*60*1000
    const pagesVisited = randInt(1,10)
    for(let p=0;p<pagesVisited;p++){
      const page = sample(pages)
      const duration = randInt(5, 300) // seconds
      events.push({type: 'page_view', page, duration, ts: start + p*1000})
    }
    const purchases = randInt(0,2)
    for(let k=0;k<purchases;k++){
      events.push({type: 'purchase', amount: randInt(5,500), ts: start + 20000 + k*1000})
    }
    events.unshift({type:'session_start', ts: start})
    sessions.push({start, events, pagesVisited, purchases})
  }
  eventsByUser.set(id, sessions)
}

// Search users
app.get('/api/search', (req,res)=>{
  const q = (req.query.q||'').toLowerCase()
  if(!q) return res.json([])
  const resu = users.filter(u=>u.email.includes(q)||u.name.toLowerCase().includes(q)||u.id.includes(q)).slice(0,50)
  res.json(resu)
})

// Get user journey and KPIs for a time range (start/end as epoch ms optional)
app.get('/api/users/:id', (req,res)=>{
  const id = req.params.id
  const sessions = eventsByUser.get(id)
  if(!sessions) return res.status(404).json({error:'not found'})
  const start = parseInt(req.query.start) || 0
  const end = parseInt(req.query.end) || Date.now()
  const filtered = sessions.filter(s=>s.start>=start && s.start<=end)
  // compute KPIs
  let totalPages=0, totalPurchases=0, totalTime=0
  filtered.forEach(s=>{
    totalPages += s.pagesVisited
    totalPurchases += s.purchases
    s.events.forEach(e=>{ if(e.type==='page_view') totalTime += e.duration })
  })
  res.json({userId: id, sessions: filtered, kpis: {sessions: filtered.length, totalPages, totalPurchases, totalTimeSeconds: totalTime}})
})

// KPIs aggregated (simple)
app.get('/api/kpis', (req,res)=>{
  // return basic totals for demo
  let totalEvents=0, totalUsers=users.length, totalPurchases=0
  for(const [id,sessions] of eventsByUser){
    sessions.forEach(s=>{
      totalEvents += s.events.length
      totalPurchases += s.purchases
    })
  }
  res.json({totalUsers, totalEvents, totalPurchases})
})

const PORT = 4000
app.listen(PORT, ()=>console.log('Mock API listening on', PORT))
