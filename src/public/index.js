console.log("Funcionando");



const socketCliente = io();
const productoForm = document.getElementById("productoForm")
productoForm.addEventListener("submit", (evento) =>{
evento.preventDefault();
const producto ={
    titulo: document.getElementById("title").value,
    price: document.getElementById("price").value,
    Thumbnail: document.getElementById("Thumbnail").value
}
socketCliente.emit("newProducto", producto)

})



socketCliente.on("todosProduct", async (data) =>{
    const contenedorProd = document.getElementById("contenedorProd");
    console.log(data);
    const templatetable = await fetch("./template/table.handlebars")
    const templateForm = await templatetable.text()
    const template = Handlebars.compile(templateForm);

    const HTML = template({producto:data})
   contenedorProd.innerHTML = HTML; 
});

socketCliente.on("messagesChat", (data) =>{
    console.log(data);
    let message = "";
    data.forEach(Element=>{
        message +=  ` <p><span class ="autor"><b>Autor: ${Element.author}</b>
         </span>-  <span class="fecha">-[${Element.fecha}] </span>
         <span class="mensaje"> Mensaje: ${Element.text} </span></p>`
    });
    chatContainer.innerHTML = message;
    })
    
    
    //capturar el nombre del usuario
    
    let user = ""
    Swal.fire({
        title: 'Ingresa tu Emali',
        input: 'email',
        inputLabel: 'Direccion de correo electronico',
        inputPlaceholder: 'Ingresa email',
        allowOutsideClick: false
    }).then(responense => {
        console.log(responense);
        user = responense.value;
        document.getElementById("userName").innerHTML=  "Estas conectado como "+ user;
    })
    //Enviar msj al serviro
    
    const chatForm = document.getElementById("chatForm");
    chatForm.addEventListener("submit", (event)=>{
        event.preventDefault();
        console.log("Mensaje Enviado")
        console.log(user);
        const message = {
            author: user,
            text : document.getElementById("chat").value,
           } 
    
           
           console.log(message);
           socketCliente.emit("newMsg", message);
        
    })
    