const pool = require('./pool.js')


const create_table=async()=> {
  const client = await pool.connect()
  await client.query({
    text:`
    create table if not exists jugadas (
      id serial primary key,
      score int not null ,
      percentage float not null,
      user_id int not null references users(id)
    )
  `
  })
  client.release()
}
create_table()

const obtenerJugadas = async()=> {
  const client = await pool.connect()
  const { rows } = await client.query({
    text: `select name, score, percentage from jugadas join users on users.id = user_id order by percentage desc;`
  }
  )
  client.release()
  return rows
}
const insertarJugada = async(score, percentage, user_id)=> {
  const client = await pool.connect()
  const { rows } = await client.query({
    text: `insert into jugadas (score, percentage, user_id) values ($1, $2, $3) returning *`,
    values: [score, percentage, user_id]
  }
  )
  client.release()
  return rows[0]
}

const obtenerInformacionJugador = async (id) => {
  const client = await pool.connect()
  const { rows } = await client.query({
    text: `select name,(users.id) as idJugador,score,percentage,jugadas.id from jugadas join users on users.id = user_id  where users.id = $1 order by jugadas.id desc limit 1;`,
    values: [id]
  }
  )
  client.release()
  return rows[0]
}

module.exports = { obtenerJugadas, insertarJugada, obtenerInformacionJugador } 