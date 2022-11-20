const express = require('express');
const handlebars = require("express-handlebars");
const path = require('path');
const fs = require('fs');
const {Server} = require("socket.io");
const moment = require('moment');

const PORT =  8080;

class Mensaje{
    constructor(ruta) {
        this.ruta = ruta;
}

async  save(obtMensaje) {
    try { 
    const contenidoActual = await fs.promises.readFile(this.ruta ,"utf-8")
      if (contenidoActual.length == 0) {
 
     await fs.promises.writeFile(this.ruta,JSON.stringify(obtMensaje,null,2));

      } else {
        const contenidoJSON = JSON.parse(contenidoActual);
        contenidoJSON.push(obtMensaje);
        await fs.promises.writeFile(this.ruta,JSON.stringify(contenidoJSON,null,2));
        console.log(contenidoJSON)
  

        
      }
        }catch (e) {          
        console.log("error " + e.message);
        }

}
}

class Contenedor{
    constructor(ruta) {
        this.ruta = ruta;
}

async  save(obtProducto) {
    console.log("entre el save");
    try { 
    const contenidoActual = await fs.promises.readFile(this.ruta ,"utf-8")
    console.log("Llegea la linea 16");
      if (contenidoActual.length == 0) {
        const primerContenido ={
            id: 1,
            titulo : obtProducto.title,
            price: obtProducto.price,
            thumbnail: obtProducto.thumbnail
            
            
        }
     obtProducto=  await fs.promises.writeFile(this.ruta,JSON.stringify([primerContenido],null,2));
        return  primerContenido.id;

      } else {
        const contenidoJSON = JSON.parse(contenidoActual);
        const ultimoID =  contenidoJSON[contenidoJSON.length - 1].id+1;
        obtProducto.id = ultimoID;
        contenidoJSON.push(obtProducto);
        await fs.promises.writeFile(this.ruta,JSON.stringify(contenidoJSON,null,2));
        return ultimoID;

        
      }
        }catch (e) {
        console.log("error " + e.message);
        }

}
async getById(id){
    try {
        if(this.ruta.length > 0){
          const productos =  await this.getAll();
        const prducto = productos.find(elemento => elemento.id === id);
        return prducto;
          
        }else{
            return null;
        }

    }catch (e) {
        console.log("error : " + e.message);
                }   
    }
    async getdeleteById(id){try {
        const productos = await this.getAll();
        const newproductos = productos.filter(elemento => elemento.id != id);
        await fs.promises.writeFile(this.ruta, JSON.stringify(newproductos,null,2));
    }catch (e) {
        console.log("error : " + e.message);
        }
        
    }
   async deletAll(){
        try{
            await fs.promises.writeFile(this.ruta, "");
        }catch (e) {
            console.log("error : " + e.message);
        }
            
    }

    async getAll(){
        try {
        const  contenido = await fs.promises.readFile(this.ruta,"utf-8");
        const contenidoJSON = JSON.parse(contenido);
         return contenidoJSON;
      
        }catch (e) {
            console.log("error : " + e.message);  
        }


    }
}



const folder = path.join(__dirname, "views");
const app = express();


const server =  app.listen(PORT,()=>console.log("listening on port " + PORT));
app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.engine("handlebars",handlebars.engine());

app.set("views", folder);
app.set('view engine', 'handlebars');

const productos = new Contenedor("Productos.txt");
const io = new Server(server);
const messages =[];
io.on("connection",async(socket)=>{
   
    console.log("Nuevo Cliente Conectado!");
    const todo = await producto.getAll();
      io.sockets.emit("todosProduct", todo); 
    socket.on("newProducto",async(data)=>{
      await  producto.save(data);
      const todo = await producto.getAll();
      io.sockets.emit("todosProduct", todo);
    })

    socket.emit("messagesChat", messages)
    socket.on("newMsg", async (data)=>{
    const fechaFormat = moment().format('MMMM Do YYYY, h:mm:ss a');
    newdata ={
        ...data,
        fecha: fechaFormat
    }
    messages.push(newdata);
    await chatLog.save(messages);
 
    // Enviamos mensajes a todos los users conectados
    io.sockets.emit("messagesChat", messages )
     
})
    })

app.get("/", async(req,res) => {
    res.render("productos");
});
app.get("/productos", async(req,res) => {
     res.render("listado",{total: await productos.getAll()})
});









const producto = new Contenedor("Productos.txt");
const chatLog = new Mensaje("ChatLog.txt"); 