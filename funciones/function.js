const { insertarJugada, obtenerInformacionJugador } = require('../db/jugadas.js')
async function evaluar_jugada(res1, res2, res3, user_id) {
  let resultado = 0;
  let porcentaje = 0;
  if (res1 == 'correcta') {
    resultado++
  }
  if (res2 == 'correcta') {
    resultado++
  }
  if (res3 == 'correcta') {
    resultado++
  }

  porcentaje = ((resultado * 100) / 3).toFixed(1)

  await insertarJugada(resultado, porcentaje, user_id)
  const jugada = await obtenerInformacionJugador(user_id)
  return jugada
}

async function mostrarRespuesta(preguntas) {
  for (let i = 0; i < preguntas.length; i++) {
    preguntas[i].respuestas = [
      {
        value: 'correcta',
        text: preguntas[i].respuesta_correcta
      },
      {
        value: 'incorrecta',
        text: preguntas[i].respuesta_falsa1
      },
      {
        value: 'incorrecta',
        text: preguntas[i].respuesta_falsa2
      },
      {
        value: 'incorrecta',
        text: preguntas[i].respuesta_falsa3
      },
      {
        value: 'incorrecta',
        text: preguntas[i].respuesta_falsa4
      },
    ]
    preguntas[i].respuestas = preguntas[i].respuestas.sort((elem1, elem2) => Math.random() - 0.5)
  }
}

  module.exports = { evaluar_jugada ,mostrarRespuesta}
