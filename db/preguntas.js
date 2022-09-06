const pool = require('./pool.js')

create_table = async () => {
  const client = await pool.connect()
  await client.query(`
    create table if not exists preguntas (
      id serial primary key,
      pregunta varchar(255) not null,
      respuesta_correcta varchar(255) not null,
      respuesta_falsa1 varchar(255) not null,
      respuesta_falsa2 varchar(255) not null,
      respuesta_falsa3 varchar(255),
      respuesta_falsa4 varchar(255)
    )
  `)
  client.release()
}
create_table()

const obtenerPreguntas = async () => {
  const client = await pool.connect()
  const res = await client.query({
    text: `select * from preguntas order by random() limit 3;`
  })

  client.release()
  return res.rows
}

const crearPregunta = async (pregunta, respuesta_correcta, falsa1, falsa2, falsa3, falsa4) => {
  const client = await pool.connect()
  const { rows } = await client.query({
    text: `insert into preguntas (pregunta, respuesta_correcta, respuesta_falsa1, respuesta_falsa2, respuesta_falsa3, respuesta_falsa4) values ($1, $2, $3,$4, $5, $6) returning *`,
    values: [pregunta, respuesta_correcta, falsa1, falsa2, falsa3, falsa4]
  }
  )
  client.release()
  return rows[0]
}
module.exports = { obtenerPreguntas, crearPregunta }