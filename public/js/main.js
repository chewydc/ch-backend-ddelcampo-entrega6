//-------------------------------------------------------------------
// Desafio Entregable N°6: Websocket
// Fecha de entrega tope: 25-10-21
// Alumno: Damian del Campo
//-------------------------------------------------------------------
const socket = io.connect();

listarProductos();
//---------------------------------------
//Si recibo un evento update refresco la lista de productos.
socket.on('updateProd', () => {
    console.log("evento updateProd llego al cliente")
    listarProductos() 
});

//---------------------------------------
//Leo el formulario y envio los datos a la API  
const form = document.querySelector('form');
form.addEventListener('submit', () => {
    const data = { title: form[0].value, price: form[1].value, thumbnail: form[2].value };
    fetch('/api/productos', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        })
        // cuando guardo el producto, emito un evento de "nuevoProducto" al servidor.
        .then(socket.emit('nuevoProducto', 'Se cargo nuevo Producto!'))
        .catch(error => console.error(error))
})

listarMensajes();

//---------------------------------------
//Si recibo un evento update refresco la lista de productos.
socket.on('updateMsj', () => {
    console.log("evento updateMsj llego al cliente")
    listarMensajes() 
});

const botnEnviar = document.getElementById('enviar')
botnEnviar.addEventListener('click', () => {
    const mail = document.getElementById('mail')
    const msj = document.getElementById('mensaje')
    const data = { mail: mail.value, mensaje: msj.value };
    fetch('/api/mensajes', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        })
        .then(socket.emit('nuevoMensaje', 'Se cargo nuevo Mensaje!'))
        .catch(error => console.error(error))
})
//---------------------------------------
//Armo el listado de productos para mostrar 
async function listarProductos() {
    const plantilla = await buscarPlantillaProducto()
    const productos = await buscarProductos()
    const html = armarHTML(plantilla, productos)
    document.getElementById('productos').innerHTML = html
}

async function listarMensajes() {
    const plantillaMsj = await buscarPlantillaMensaje()
    const mensajes = await buscarMensajes()
    const htmlMsj = armarHTMLmsj(plantillaMsj, mensajes)
    document.getElementById('mensajes').innerHTML = htmlMsj
}


//---------------------------------------
//Ejecuto API del lado del cliente
function buscarProductos() {
    return fetch('/api/productos')
        .then(prod => prod.json())
}
function buscarMensajes() {
    return fetch('/api/mensajes')
        .then(msjs => msjs.json())
}
//---------------------------------------
//Busco plantilla Handlebars
function buscarPlantillaProducto() {
     return fetch('/plantillas/productos.hbs')
         .then(respuesta => respuesta.text())
 }
 function buscarPlantillaMensaje() {
    return fetch('/plantillas/mensajes.hbs')
        .then(respuesta2 => respuesta2.text())
}
//---------------------------------------
//Armo Html
function armarHTML(plantilla, productos) {
     const render = Handlebars.compile(plantilla);
     const html = render({ productos })
    return html
}
function armarHTMLmsj(plantillaMsj, mensajes) {
    const render = Handlebars.compile(plantillaMsj);
    const html = render({ mensajes })
   return html
}

