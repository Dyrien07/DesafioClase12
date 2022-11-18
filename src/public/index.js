


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


})


