const { Router, text } = require('express');
const { obtenerPreguntas, crearPregunta } = require('../db/preguntas.js');
const { obtenerJugadas } = require('../db/jugadas.js');
const { evaluar_jugada, mostrarRespuesta } = require('../funciones/function.js');
let jugada, ruta, idJugador
const router = Router();

// Vamos a crear un middleware para ver si el usuario está logueado o no
function protected_route(req, res, next) {
  if (!req.session.user) {
    req.flash('errors', 'Debe loguearse primero')
    return res.redirect('/login')
  }
  // Si llegamos hasta acá, guardamos el usuario de la sesión en una variable de los templates
  res.locals.user = req.session.user;
  // Finalmente, seguimos el camino original
  next()
}

function protegerNewQuestion(req, res, next) {
  if (req.session.user.isadmin == false) {
    return res.redirect('/')
  }
  next()
}


router.get('/', protected_route, async (req, res) => {
  const nombre_usuario = req.session.user.name
  const id_usuario = req.session.user.id
  const jugadas = await obtenerJugadas()
  // Visibility = 'hidden'

  // Console.log(nombre_usuario, id_usuario, idJugador);
  if (ruta == 'lets_play') {
    if (idJugador == id_usuario) {
      visibility = 'visible'
    }
  } else {
    visibility = 'hidden'
  }

  res.render('index.html', { jugadas, jugada, visibility })
});

router.get('/new_question', protected_route, protegerNewQuestion, (req, res) => {
  ruta = 'new_question'
  res.render('new_question.html')
});

router.post('/new_question', protected_route, async (req, res) => {
  ruta = 'new_question'
  const pregunta = req.body.pregunta
  const respuesta_correcta = req.body.respuesta_correcta,
    falsa1 = req.body.respuesta_falsa1,
    falsa2 = req.body.respuesta_falsa2,
    falsa3 = req.body.respuesta_falsa3,
    falsa4 = req.body.respuesta_falsa4;
  await crearPregunta(pregunta, respuesta_correcta, falsa1, falsa2, falsa3, falsa4)
  res.redirect('/')
});

router.get('/lets_play', protected_route, async (req, res) => {
  let preguntas = await obtenerPreguntas();
  mostrarRespuesta(preguntas)
  res.render('lets_play.html', { preguntas })
});

router.post('/lets_play', protected_route, async (req, res) => {
  ruta = 'lets_play'
  const respuesta1 = req.body.respuesta1,
    respuesta2 = req.body.respuesta2,
    respuesta3 = req.body.respuesta3,
    user_id = req.session.user.id
  jugada = await evaluar_jugada(respuesta1, respuesta2, respuesta3, user_id)
  idJugador = jugada.idjugador
  // console.log(jugada);
  res.redirect('/')
});

// async function mostrarRespuesta(preguntas) {
//   for (let i = 0; i < preguntas.length; i++) {
//     preguntas[i].respuestas = [
//       {
//         value: 'correcta',
//         text: preguntas[i].respuesta_correcta
//       },
//       {
//         value: 'incorrecta',
//         text: preguntas[i].respuesta_falsa1
//       },
//       {
//         value: 'incorrecta',
//         text: preguntas[i].respuesta_falsa2
//       },
//       {
//         value: 'incorrecta',
//         text: preguntas[i].respuesta_falsa3
//       },
//       {
//         value: 'incorrecta',
//         text: preguntas[i].respuesta_falsa4
//       },
//     ]
//     preguntas[i].respuestas = preguntas[i].respuestas.sort((elem1, elem2) => Math.random() - 0.5)
//   }
// }

router.get('*', (req, res) => {
  res.render('404.html')
});

module.exports = router;