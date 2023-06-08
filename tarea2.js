// Cada producto que vende el super es creado con esta clase
class Producto {

    constructor(sku, nombre, precio, categoria, stock) {
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.stock = stock || 10;

    }
}

// Creo todos los productos que vende mi super
const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];

// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku) {

    return new Promise((resolve, reject) => {

        setTimeout(() => {
            console.log("-----------------------------------------------------------------------")
    
            const foundProduct = productosDelSuper.find((product) => product.sku === sku);

            if (foundProduct) {

                resolve(foundProduct);

            } else {

                reject(`El codigo ${sku} no existe en el CARRITO`);
            }

        }, 1500);

    });
}
//funcion que actualiza el stock del super
const actualizarStock = (stock, cantidad)=>{
    return stock += cantidad
}

//funcion para mostrar el stock del super
const mostrarStock = () => {
    productosDelSuper.forEach((prod) => console.log(prod))
}

// Cada producto que se agrega al carrito es creado con esta clase (esto esta bien)
class ProductoEnCarrito {

    constructor(sku, nombre, cantidad) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
    }

}

// Cada cliente que venga a mi super va a crear un carrito
class Carrito {

    // Al crear un carrito, empieza vació
    constructor(precioTotal) {
        this.precioTotal = precioTotal || 0;
        this.productos = [];
        this.categorias = [];
    }

    /**
     * función que agrega @{cantidad} de productos con @{sku} al carrito
     */
    async agregarProducto(sku, cantidad) {
        try {

            const dataBase = await findProductBySku(sku);
            const productoEncontrado = this.productos.find((prod) => prod.sku == sku);

            if (cantidad > dataBase.stock) {
                console.log(`No te puedes pasar del stock del producto ${sku} y se agrega el máximo disponible: ${stockDisponible}`);
                cantidad = dataBase.stock
            }else {
                console.log("\nBusco si existe el producto ....")
                console.log(`Producto a buscar: ${dataBase.nombre} - codigo del producto: ${sku}`);

                if (productoEncontrado) {
                    
                    console.log('El producto  "', dataBase.nombre,'" ya existe en el carrito\n solo se agrega la cantidad ',"\n", producto);
                    console.log("Agrego al carrito la cantidad:", cantidad, "del producto: ", dataBase.nombre)
                    //el producto ya esta en el carrito y se le agrega solo la cantidad 
                    productoEncontrado.cantidad += cantidad;
                    } else {
                        console.log("Producto no existe y sera agregado al carrito")
                        const nuevoProducto = new ProductoEnCarrito(dataBase.sku, dataBase.nombre, cantidad);
                        this.productos.push(nuevoProducto);
                        this.actualizarCategoria(dataBase.categoria)
                }
            }
            //descuento la cantidad del stock, actualizo el carrito y el total
            console.log("Carrito con las cantidades actualizadas y productos despues de agregar")
            this.mostrarCarrito()
            this.precioTotal += dataBase.precio * cantidad;
            dataBase.stock = actualizarStock(dataBase.stock, -cantidad)

        } catch (error) {

            console.log('Producto no encontrado', error);

        }
    }

    /*---------------- ELIMINAR -------------------------------*/
    async eliminarProducto(sku, cantidad) { 

        const dataBase = await findProductBySku(sku)

        return new Promise( (resolve, reject) =>{
            setTimeout( () => {
        
                const productoExiste = this.productos.find((pro) => pro.sku === sku);
        
                console.log("Busco si existe el producto y su cantidad...")
                //verifico si existe 
                if (!productoExiste) {
                    reject(`El producto ${sku} no existe en el carrito`);
                    return
                }
               
                //si la cantidad es menor a la existente que disminuya la cantidad y conserve la categoria
                if (cantidad < productoExiste.cantidad) {
                    console.log('La cantidad actual en el carrito es:', productoExiste.cantidad , " y se eliminara ->", cantidad)
                    resolve(`Se elimino la cantidad ${cantidad} - del producto ${dataBase.nombre} - codigo: ${sku}`);
                    productoExiste.cantidad -= cantidad
                    
                    console.log("\nCarrito con las cantidades actualizadas y productos despues de eliminar:")
                    this.mostrarCarrito()
                    this.actualizarCategoria(dataBase.categoria)
                    dataBase.stock = actualizarStock(dataBase.stock, cantidad)
                //sila cantidad es mayor o igual a la existente que se alimine el producto y la categoria
                } else if (cantidad >= productoExiste.cantidad) {
                    console.log("La cantidad actual en el carrito es:", productoExiste.cantidad," y Se eliminara ->", cantidad)
                    resolve(`Se eliminó el producto ${dataBase.nombre} - codigo: ${sku}`);
                    const productoIndex = this.productos.indexOf(productoExiste);
                    this.productos.splice(productoIndex, 1);
        
                    //carrito con las categorias y cantidades actualizadas, y stock actualizado
                    this.mostrarCarrito()
                    this.actualizarCategoria(dataBase.categoria)
                    dataBase.stock = actualizarStock(dataBase.stock, cantidad)
                }
            }, 2000)
        })
    }
    /*----------------- Metodos ----------------------------- */
    actualizarCategoria(categoria){
        const indiceCategoria = this.categorias.indexOf(categoria)
        if(indiceCategoria !== -1){
            this.categorias.splice(indiceCategoria, 1)
        }else{
            this.categorias.push(categoria)
        }
        console.log("Lista de Categorias en el carrito:\n", this.categorias)
    }
    mostrarCarrito(){
        return new Promise( (resolve, reject) =>{
            setTimeout(() =>{
                if(this.productos.length != 0){
                    resolve(this.mostrarTiket())
                }else{
                    reject(`El carrito esta vacio`)
                }
            }, 1000)
        })
    }

    mostrarTiket(){
        console.log("*********************************")
        console.log("TIKET DE COMPRAS:")
        //productos del carrito
        this.productos.forEach((prod) =>{
            console.log("\nProducto: ", prod.nombre, "- Cantidad:", prod.cantidad)
        })
        console.log("El total de la compra es: $" + this.precioTotal);
        console.log("*********************************")
        console.log("El Stock actualizado en el Super...")
        mostrarStock()
        
    }  

}


async function main(){
    const carrito = new Carrito();
    console.log("Productos del Super y su Stock: ")
    mostrarStock()
    try{
        //pruebo un producto que no existe o que existe en el super pero no en el carrito
        //await carrito.agregarProducto('STOLMER', 2)
        await carrito.eliminarProducto('RT324GD', 2)

        /*------------------------------------------------------------------*/
        await carrito.agregarProducto('WE328NJ', 2)//3 jabon higiene
        //await carrito.agregarProducto('WE328NJ', 1)
        await carrito.agregarProducto('FN312PPE', 3) // 10 gaseosa bebidas
        await carrito.agregarProducto('XX92LKI', 8)//20 arroz alimentos

        /*------------------------------------------------------------*/
       
        //pruebo borrar 1 producto que ya fue agregado
        // await carrito.eliminarProducto('XX92LKI', 2)
        //     .then(a => console.log(a))
        //     .catch(err => console.log(err))
        //pruebo eliminar el total de un producto ya agregado y su categoria
        //await carrito.agregarProducto('XX92LKI', 8)

        //pruebo el carrito vacio
        //await carrito.eliminarProducto('FN312PPE', 3)
        //await carrito.eliminarProducto('WE328NJ', 3)
        //await carrito.agregarProducto('XX92LKI', 8)

        /*----------------------------------------------*/

        //pruebo volver a agregar
        await carrito.agregarProducto('KS944RUR', 2) // 4 queso lacteos

    }catch(error){
        console.error(error)
    }
}
main()
