//-------------------------------------------------------------------
// Desafio Entregable N°6: Websocket
// Fecha de entrega tope: 25-10-21
// Alumno: Damian del Campo
//-------------------------------------------------------------------
const fs = require('fs')

class ContenedorMsjs {

    constructor(ruta) {
        this.ruta = ruta;
    }

    async listarAll() {
        try {
            const elems = await fs.promises.readFile(this.ruta, 'utf-8')
            return JSON.parse(elems)
        } catch (error) {
            return []
        }
    }

    async guardar(elem) {
        const elems = await this.listarAll()
        const time = new Date()
        const newElem = { ...elem, fyh: time.toLocaleString() }
        elems.push(newElem)

        try {
            await fs.promises.writeFile(this.ruta, JSON.stringify(elems, null, 2))
            return "Mensaje Guardado OK"
        } catch (error) {
            throw new Error(`Error al guardar: ${error}`)
        }
    }

    async borrarAll() {
        try {
            await fs.promises.writeFile(this.ruta, JSON.stringify([], null, 2))
        } catch (error) {
            throw new Error(`Error al borrar todo: ${error}`)
        }
    }
}

module.exports = ContenedorMsjs