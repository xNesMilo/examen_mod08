const pool = require('./pool.js')

const create_table = async () => {
  // 1. Solicito un 'cliente' al pool de conexiones
  const client = await pool.connect()

  // 2. Ejecuto la consulta SQL (me traigo un array de arrays)
  await client.query(`
    create table if not exists users (
      id serial primary key,
      name varchar(255) not null,
      email varchar(255) not null unique,
      password varchar(255) not null,
      isadmin boolean not null default false
    )
  `)

  // 3. Devuelvo el cliente al pool
  client.release()
}
create_table()


const get_user = async (email) => {
  const client = await pool.connect()
  const { rows } = await client.query(
    `select * from users where email=$1`,
    [email]
  )
  client.release()
  return rows[0]
}

const create_user = async (name, email, password) => {
  const client = await pool.connect()
  const usuario = await client.query('select * from users')
  let result

  if (usuario.rows == 0) {
    result = await client.query({
      text: `insert into users (name, email, password, isadmin) values ($1, $2, $3, 'true') returning *`,
      values: [name, email, password]
    }
    )
  } else {
    result = await client.query({
      text: `insert into users (name, email, password, isadmin) values ($1, $2, $3, 'false') returning *`,
      values: [name, email, password]
    }
    )
  }
  client.release()

  return result.rows[0]

}

module.exports = { get_user, create_user }

