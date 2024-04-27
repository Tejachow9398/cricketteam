const {open} = require('sqlite')
const express = require('express')
const sqlite3 = require('sqlite3')
const path = require('path')

const app = express()
let dbpath = path.join(__dirname, 'cricketTeam.db')

let db = null

let serverinstaliser = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error : ${e.message}`)
    process.exit(1)
  }
}
serverinstaliser()
// get method

app.get('/players/', async (request, response) => {
  const playerquery = `SELECT * FROM cricket_team ORDER BY player_id`
  const playerarray = await db.all(playerquery)
  response.send(playerarray)
})
// post method

app.post('/players/', async (request, response) => {
  const playerdetails = request.body
  const {playerName, jerseyNumber, role} = playerdetails
  const playerquery = `INSERT INTO cricket_team(player_name, jersey_number, role)
  VALUES ( '${playerName}',${jerseyNumber},'${role}')`
  let dbresponse = await db.run(playerquery)
  let playerid = dbresponse.lastID
  response.send({player_id: playerid})
})

//GET method

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerquery = `SELECT * FROM cricket_team WHERE player_id = ${playerId}`
  const playerresponse = await db.get(playerquery)
  response.send(playerresponse)
})

// put method

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerdetails = request.body
  const {playerName, jerseyNumber, role} = playerdetails
  const playerquery = `UPDATE cricket_team SET 
  player_name = '${playerName}',
  jersey_number = ${jerseyNumber},
  role = '${role}'
  WHERE player_id = ${playerId}`
  await db.run(playerquery)
  response.send('Player Added to Team')
})

// delete method

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const query = `DELETE FROM cricket_team WHERE player_id = ${playerId}`
  await db.run(query)
  response.send('Player Removed')
})
