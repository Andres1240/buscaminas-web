let filas
let columnas
let minas

let tablero=[]
let primeraJugada=true
let juegoTerminado=false
let celdasAbiertas=0
let minasRestantes=0

function nuevoJuego(){

    filas = parseInt(document.getElementById("tamano").value)
    columnas = filas
    minas = parseInt(document.getElementById("minas").value)

    if(minas >= filas*columnas){

        alert("Demasiadas minas para el tamaño del tablero")
        return
    }

    const contenedor = document.getElementById("tablero")

    contenedor.innerHTML=""

    contenedor.style.gridTemplateColumns = `repeat(${columnas},40px)`

    tablero=[]
    primeraJugada=true
    juegoTerminado=false
    celdasAbiertas=0
    minasRestantes=minas

    document.getElementById("estado").innerText=""
    actualizarContador()

    for(let i=0;i<filas;i++){

        tablero[i]=[]

        for(let j=0;j<columnas;j++){

            const boton=document.createElement("button")

            boton.className="celda"

            boton.onclick=()=>clickCelda(i,j)

            boton.oncontextmenu=(e)=>{
                e.preventDefault()
                ponerBandera(i,j)
            }

            contenedor.appendChild(boton)

            tablero[i][j]={

                mina:false,
                abierta:false,
                bandera:false,
                minasAlrededor:0,
                elemento:boton
            }
        }
    }
}

function actualizarContador(){

    document.getElementById("contadorMinas").innerText=minasRestantes
}

function ponerBandera(f,c){

    if(juegoTerminado) return

    let celda=tablero[f][c]

    if(celda.abierta) return

    if(!celda.bandera){

        celda.bandera=true
        celda.elemento.innerText="🚩"
        minasRestantes--

    }else{

        celda.bandera=false
        celda.elemento.innerText=""
        minasRestantes++
    }

    actualizarContador()
}

function generarMinas(evitarFila,evitarCol){

    let generadas=0

    while(generadas<minas){

        let f=Math.floor(Math.random()*filas)
        let c=Math.floor(Math.random()*columnas)

        if((f!==evitarFila || c!==evitarCol) && !tablero[f][c].mina){

            tablero[f][c].mina=true
            generadas++
        }
    }

    calcularNumeros()
}

function calcularNumeros(){

    for(let i=0;i<filas;i++){

        for(let j=0;j<columnas;j++){

            if(tablero[i][j].mina) continue

            let contador=0

            for(let x=-1;x<=1;x++){

                for(let y=-1;y<=1;y++){

                    let nf=i+x
                    let nc=j+y

                    if(nf>=0 && nf<filas && nc>=0 && nc<columnas){

                        if(tablero[nf][nc].mina) contador++
                    }
                }
            }

            tablero[i][j].minasAlrededor=contador
        }
    }
}

function clickCelda(f,c){

    if(juegoTerminado) return

    let celda=tablero[f][c]

    if(celda.bandera) return

    if(primeraJugada){

        generarMinas(f,c)
        primeraJugada=false
    }

    abrirCelda(f,c)

    verificarVictoria()
}

function abrirCelda(f,c){

    let celda=tablero[f][c]

    if(celda.abierta) return

    celda.abierta=true

    celda.elemento.classList.add("abierta")

    if(celda.mina){

        celda.elemento.innerText="💣"

        terminarJuego(false)

        return
    }

    celdasAbiertas++

    if(celda.minasAlrededor>0){

        celda.elemento.innerText=celda.minasAlrededor

    }else{

        for(let x=-1;x<=1;x++){

            for(let y=-1;y<=1;y++){

                let nf=f+x
                let nc=c+y

                if(nf>=0 && nf<filas && nc>=0 && nc<columnas){

                    abrirCelda(nf,nc)
                }
            }
        }
    }
}

function terminarJuego(gano){

    juegoTerminado=true

    for(let i=0;i<filas;i++){

        for(let j=0;j<columnas;j++){

            if(tablero[i][j].mina){

                tablero[i][j].elemento.innerText="💣"
            }
        }
    }

    if(gano){

        document.getElementById("estado").innerText="🎉 Ganaste"

    }else{

        document.getElementById("estado").innerText="💣 Perdiste"
    }
}

function verificarVictoria(){

    if(celdasAbiertas === (filas*columnas - minas)){

        terminarJuego(true)
    }
}

nuevoJuego()