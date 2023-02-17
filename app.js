// Declaramos el elemento del DOM para iniciar el juego y crear la tabla para el buscaminas

const btnIniciar = document.getElementById("btnIniciar"); // => Botón para iniciar el juego
const btnReiniciar = document.getElementById("btnReiniciar"); //= > Botón para reiniciar el juego
btnReiniciar.disabled=true;

// Atraemos del DOM con selectores los elementos para mostrar el juego

const contadorBanderas = document.getElementById("numBanderas"); // => Contador de banderas
const contadorBanderasRestantes = document.getElementById("banderasRestantes"); // => Contador de banderas restantes
const containerJuego = document.getElementById("containerJuego"); // => Contenedor del juego
const juego = document.getElementById("juego"); //= > Tablero del juego
const resultadoJuego = document.getElementById("resultadoJuego"); // = > Resultado del juego

// Variables GLOBALES

const tablero = 16; // => Tamaño del tablero
let numBombas = 30; // => Número de bombas
let numBanderas = 0; // => Número de banderas
let casillas = []; // => Array de casillas
let finPartida = false; // => Variable para indicar si la partida ha terminado

// Creamos los eventos para iniciar el juego y reiniciar el juego
btnIniciar.addEventListener("click", createGame);
btnReiniciar.addEventListener("click", restart);


// Función principal para crear el juego

function createGame() {
  btnReiniciar.disabled=false;
  // En caso de que el contenedor del juego esté oculto, lo mostramos y en caso contrario, lo ocultamos y reiniciamos el juego
  if (containerJuego.classList.contains("hidden")) {
    containerJuego.classList.remove("hidden");
    btnIniciar.disabled=true;
  }

  // Definimos el tamaño del tablero en nuestro juego y el recuadro del resultado a mostrar, ya sea de victoria o derrota.

  juego.style.width = `${tablero * 2}rem`;
  resultadoJuego.style.width = `${tablero * 2}rem`;

  // Creamos los arrays donde se almacenarán los datos de los espacios vacios, las minas y juntarlos

  const arrayBomba = Array(numBombas).fill("bomba"); // Array de bombas
  const arrayVacios = Array(tablero * tablero - numBombas).fill("vacio"); // Array de espacios vacios
  const arrayJuego = arrayBomba.concat(arrayVacios); // Array con los datos de bombas y espacios vacios
  arrayJuego.sort(() => Math.random() - 0.5); // Ordenamos aleatoriamente el con ambos arrays

  // Creamos un ciclo que recorra todo el tablero para que de este modo este se cree.
  for (let i = 0; i < tablero * tablero; i++) {
    const casilla = document.createElement("div");
    casilla.setAttribute("id", i);
    casilla.classList.add(arrayJuego[i]);
    juego.appendChild(casilla); // => Añadimos la casilla al juego
    casillas.push(casilla); // => Añadimos la casilla al array de casillas

    // Añadimos el evento click a cada casilla
    casilla.addEventListener("click", (e) => {
      click(e.target);
    });

    // Añadimos el evento click derecho a cada casilla
    casilla.oncontextmenu = function (e) {
      e.preventDefault();
      addBandera(casilla);
    };

    // Añadimos función al hacer doble-click
    casilla.addEventListener("dblclick", (e) => {
      dobleClick(e.target);
    });
  }

  // Añadimos el número de bombas al contador de banderas y al contador de banderas restantes
  clickNumBanderas();

  // Llamamos a la función para añadir los números a las casillas y revisar si hay bombas alrededor
  addNumbers();
}

// Función para colocar las banderas en las casillas del juego
function addBandera(casilla) {
  // Condicional para asegurarnos de que la partida no esté finalizada
  if (finPartida) return;

  // Mencionamos que si la casilla no está marcada y el número de banderas es menor al número de bombas, se añada la bandera
  if (!casilla.classList.contains("marked") && numBanderas < numBombas) {
    //Luego, si la casilla no tiene la bandera, se añade la bandera y se suma 1 al contador de banderas
    if (!casilla.classList.contains("bandera")) {
      casilla.classList.add("bandera");
      casilla.innerHTML = "🚩";
      numBanderas++;
      clickNumBanderas();
      checkResult();
    }
    // De no ser así, se elimina la bandera y se resta 1 al contador de banderas
    else {
      casilla.classList.remove("bandera");
      casilla.innerHTML = "";
      numBanderas--;
      clickNumBanderas();
    }
  }
}

// Creamos la función para analizar si el usuario ganó o perdió
function checkResult() {
  let aciertos = 0; // => Con esta variable contamos las bombas que la persona ha acertado.

  for (let i = 0; i < casillas.length; i++) {
    // Indicamos una condición para que si la casilla tiene la bandera y la bomba, se sume 1 al contador de aciertos
    if (
      casillas[i].classList.contains("bandera") &&
      casillas[i].classList.contains("bomba")
    )
      aciertos++;
  }

  // Comparamos si la ubicación de las bombas es igual al de las banderas al igual que su cantidad, donde confirmamos que la persona ya ha ganado
  if (aciertos === numBombas) {
    finPartida = true; // => Indicamos que la partida ha terminado
    resultadoJuego.classList.remove("hidden");
    resultadoJuego.textContent = "Muy bien, ganaste";
    resultadoJuego.classList.add("back-green");
  }
}

// Función para definir cuando una persona toca una bomba
function bomba(casillaClickeada) {
  finPartida = true;
  casillaClickeada.classList.add("back-red");

  // Desvelamos todas las bombas
  casillas.forEach((casilla, index, array) => {
    if (casilla.classList.contains("bomba")) {
      casilla.innerHTML = "💣";
      casilla.classList.remove("bomba");
      casilla.classList.add("marked");
    }
  });

  // Mostramos el resultado de la partida, que en este caso, perdió
  resultadoJuego.classList.remove("hidden");
  resultadoJuego.textContent = "Lo siento, perdiste";
  resultadoJuego.classList.add("back-red");
}

// Actualizamos el contador de banderas
function clickNumBanderas() {
  contadorBanderas.textContent = numBanderas;
  contadorBanderasRestantes.textContent = numBombas - numBanderas; // => Restamos el número de banderas al número de bombas
}

// Los recuadros como se puede ver, no son botones, son divs, por los que se realiza la función click para que al hacer click en ellos, se realice la acción que se le indique.

function click(casilla) {
  // Comprobamos si la casilla es clickeable
  if (
    casilla.classList.contains("marked") ||
    casilla.classList.contains("bandera") ||
    finPartida
  )
    return;

  if (casilla.classList.contains("bomba")) {
    // Casilla bomba
    bomba(casilla);
  } else {
    let total = casilla.getAttribute("data");
    if (total != 0) {
      // Casilla con bombas cerca
      casilla.classList.add("marked");
      casilla.innerHTML = total;
      return;
    }
    casilla.classList.add("marked");

    // Casilla sin bombas cerca
    revelarCasillas(casilla);
  }
}

function dobleClick(casilla) {
  // Comprobamos si la casilla es clickeable
  if (!casilla.classList.contains("marked") || finPartida) return;

  revelarCasillas(casilla);
}

// Función para revelar las casillas, dependiendo de la casilla que se haya clickeado y todas las de su alrededor no tengan bombas
function revelarCasillas(casilla) {
  const idCasilla = parseInt(casilla.id);
  const Izq = idCasilla % tablero === 0; // => Borde Izquierdo
  const Der = idCasilla % tablero === tablero - 1; // => Borde Derecho


  setTimeout(() => {
    // Simulamos click en la casilla anterior
    if (idCasilla > 0 && !Izq) click(casillas[idCasilla - 1]);

    // Simulamos click en la casilla siguiente
    if (idCasilla < tablero * tablero - 2 && !Der)
      click(casillas[idCasilla + 1]);

    // Simulamos click en la casilla superior
    if (idCasilla >= tablero) click(casillas[idCasilla - tablero]);

    // Simulamos click en la casilla siguiente de la fila anterior
    if (idCasilla > tablero - 1 && !Der)
      click(casillas[idCasilla + 1 - tablero]);

    // Simulamos click en la casilla anterior de la fila anterior
    if (idCasilla > tablero + 1 && !Izq)
      click(casillas[idCasilla - 1 - tablero]);

    // Simulamos click en la casilla inferior
    if (idCasilla < tablero * (tablero - 1))
      click(casillas[idCasilla + tablero]);

    // Simulamos click en la casilla siguiente de la fila siguiente
    if (idCasilla < tablero * tablero - tablero - 2 && !Der)
      click(casillas[idCasilla + 1 + tablero]);

    // Simulamos click en la casilla anterior de la fila siguiente
    if (idCasilla < tablero * tablero - tablero && !Izq)
      click(casillas[idCasilla - 1 + tablero]);
  }, 10);
}

// Añadimos los números de las casillas y que identifique cuando hay una bomba en su cuadrante

function addNumbers() {
  for (let i = 0; i < casillas.length; i++) {
    let total = 0; // => Num de bombas contiguas a una casilla
    const izq = i % tablero === 0; // => Casilla en el borde izquierdo
    const der = i % tablero === tablero - 1; // => Casilla en el borde derecho

    if (casillas[i].classList.contains("vacio")) {
      // Vemos si hay bomba en la casilla anterior
      if (i > 0 && !izq && casillas[i - 1].classList.contains("bomba")) total++;

      // Vemos si hay bomba en la casilla siguiente
      if (
        i < tablero * tablero - 1 &&
        !der &&
        casillas[i + 1].classList.contains("bomba")
      )
        total++;

      // Vemos si hay bomba en la casilla superior
      if (i > tablero && casillas[i - tablero].classList.contains("bomba"))
        total++;

      // Vemos si hay bomba en la casilla siguiente de la fila anterior
      if (
        i > tablero - 1 &&
        !der &&
        casillas[i + 1 - tablero].classList.contains("bomba")
      )
        total++;

      // Vemos si hay bomba en la casilla anterior de la fila anterior
      if (
        i > tablero &&
        !izq &&
        casillas[i - 1 - tablero].classList.contains("bomba")
      )
        total++;

      // Vemos si hay bomba en la casilla inferior
      if (
        i < tablero * (tablero - 1) &&
        casillas[i + tablero].classList.contains("bomba")
      )
        total++;

      // Vemos si hay bomba en la casilla siguiente de la fila siguiente
      if (
        i < tablero * (tablero - 1) &&
        !der &&
        casillas[i + 1 + tablero].classList.contains("bomba")
      )
        total++;

      // Vemos si hay bomba en la casilla anterior de la fila siguiente
      if (
        i < tablero * (tablero - 1) &&
        !izq &&
        casillas[i - 1 + tablero].classList.contains("bomba")
      )
        total++;

      // Guardamos la cantidad de bombas en atributo data
      casillas[i].setAttribute("data", total);
    }
  }
}

function restart() {
  // Vaciamos el juego y el resultado del juego
  juego.innerHTML = "";
  resultadoJuego.innerHTML = "";
  resultadoJuego.classList.add("hidden");
  finPartida = false;
  numBanderas = 0;
  casillas = [];

  // Llamamos al juego nuevamente con los valores totalmente vacíos
  createGame();
}