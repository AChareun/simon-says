//Elección de Dificultad

const BOTON_FACIL = document.querySelector("#facil");
const BOTON_DIFICIL = document.querySelector("#dificil");
const dificultad = {
  retraso: 0,
  medioRetraso: 0,
}


BOTON_FACIL.onclick = elegirFacil;
BOTON_DIFICIL.onclick = elegirDificil;

function elegirDificil() {
  document.querySelector("#inicio").classList.add("d-none");
  document.querySelector("#juego").classList.remove("d-none");

  dificultad.retraso = 500;
  dificultad.medioRetraso = 250;
  document.querySelectorAll(".cuadro").forEach(function ($cuadro) {
    $cuadro.style.transition = "opacity 250ms"
  });
}

function elegirFacil() {
  document.querySelector("#inicio").classList.add("d-none");
  document.querySelector("#juego").classList.remove("d-none");

  dificultad.retraso = 1000;
  dificultad.medioRetraso = 500;
  document.querySelectorAll(".cuadro").forEach(function ($cuadro) {
    $cuadro.style.transition = "opacity 500ms"
  });
}


//Simon-Dice

let secuenciaMaquina = [];
let secuenciaJugador = [];
let ronda = 0;

const BOTON_INICIADOR = document.querySelector("#iniciar");

BOTON_INICIADOR.onclick = comenzarJuego;

function comenzarJuego() {

  secuenciaMaquina = [];
  secuenciaJugador = [];
  ronda = 0;

  cambiarBoton(true);
  manejarRonda();
}

function manejarRonda() {
  bloquearInputJugador();
  cambiarEstado("Turno del Ordenador. Presta atención a la secuencia!", true)

  const $nuevoCuadro = generarSecuencia();
  secuenciaMaquina.push($nuevoCuadro);

  const RETRASO_JUGADA = (secuenciaMaquina.length + 1) * dificultad.retraso;

  secuenciaMaquina.forEach(function ($cuadro, index) {
    const RETRASO_RESALTAR = (index + 1) * dificultad.retraso;
    setTimeout(function() {
      resaltarCuadro($cuadro)  
    }, RETRASO_RESALTAR)
  })

  setTimeout(function () {
    desbloquearInputJugador()
    cambiarEstado("Es tu turno! Repite la secuencia del ordenador")
  }, RETRASO_JUGADA)

  secuenciaJugador = [];
  ronda ++;
  actualizarNumeroRonda(ronda);
}

function manejarInputJugador(e) {
  const $cuadroJugador = e.target;
  resaltarCuadro($cuadroJugador);
  secuenciaJugador.push($cuadroJugador);

  const $cuadroMaquina = secuenciaMaquina[secuenciaJugador.length - 1];
  if ($cuadroJugador.id !== $cuadroMaquina.id) {
    perder();
    return
  }

  if (secuenciaJugador.length === secuenciaMaquina.length) {
    bloquearInputJugador();
    setTimeout(manejarRonda, dificultad.retraso)
  }
}

function actualizarNumeroRonda(ronda) {
  document.querySelector("#ronda").textContent = ronda;
}

function generarSecuencia() {
  const $cuadros = document.querySelectorAll(".cuadro");
  const indice = Math.floor(Math.random() * $cuadros.length)

  return $cuadros[indice];
}

function resaltarCuadro($cuadro) {
  $cuadro.style.opacity = 1;
  setTimeout(function() {
    $cuadro.style.opacity = 0.5;
  }, dificultad.medioRetraso)
}

function desbloquearInputJugador() {
  document.querySelectorAll(".cuadro").forEach(function ($cuadro) {
    $cuadro.onclick = manejarInputJugador;
  })
}

function bloquearInputJugador() {
  document.querySelectorAll(".cuadro").forEach(function ($cuadro) {
    $cuadro.onclick = function () {}
  })
}

function cambiarBoton(boton = false) {
  if (boton) {
    BOTON_INICIADOR.textContent = "Reiniciar Juego";
    BOTON_INICIADOR.classList.remove("btn-primary");
    BOTON_INICIADOR.classList.add("btn-danger");
  }else {
    BOTON_INICIADOR.textContent = "Iniciar";
    BOTON_INICIADOR.classList.remove("btn-danger");
    BOTON_INICIADOR.classList.add("btn-primary");
  }
}

function cambiarEstado(estado, error = false) {
  const $ESTADO = document.querySelector("#estado");
  $ESTADO.textContent = estado;

  if (error) {
    $ESTADO.classList.remove("alert-primary");
    $ESTADO.classList.add("alert-danger");
  }else {
    $ESTADO.classList.remove("alert-danger");
    $ESTADO.classList.add("alert-primary");
  }
}

function perder() {
  bloquearInputJugador();
  cambiarEstado("Perdiste! Presiona Reiniciar Juego para volver a intentarlo", true)
}

