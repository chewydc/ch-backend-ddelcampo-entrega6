//-------------------------------------------------------------------
// Desafio Entregable N°6: Websocket
// Fecha de entrega tope: 25-10-21
// Alumno: Damian del Campo
//-------------------------------------------------------------------
const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const {routerProductos} = require("./router/productos")
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use('/api/productos',routerProductos)


const ContenedorMsjs = require('./router/ContenedorMsjs.js')
const mensajesApi = new ContenedorMsjs('./DB/mensajes.txt')

io.on('connection', clientSocket => {
  console.log(`#${clientSocket.id} se conectó`)

  clientSocket.on('nuevoProducto', () => {
    console.log("Llego el evento del tipo Prod update")
    io.sockets.emit('updateProd')
  })
  
  clientSocket.on('nuevoMensaje', () => {
    console.log("Llego el evento del tipo Msj update")
    io.sockets.emit('updateMsj')
  })

})

app.get("/", (req,res)=> {
  res.sendFile('index.html')
})

//-------------------------------------------
// rutas de la api rest
app.get('/api/mensajes', async (req, res) => {
  res.json(await mensajesApi.listarAll())
})
app.post('/api/mensajes', async (req, res) => {
  res.json(` ${await mensajesApi.guardar(req.body)}!`)
})
//-------------------------------------------------------------------
// Cargo el server
const PORT = process.env.PORT || 8080
const server = httpServer.listen(PORT, () => {
console.info(`Servidor HTTP escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))

