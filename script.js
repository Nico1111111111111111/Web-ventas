const productHolder = document.getElementById("productDiv");
const cartHolder = document.getElementById("cartDiv");
let productos = [];
let carrito = [];

fetch("productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        mostrarProductos(productos);
    });

document.getElementById("select").addEventListener("change", function () {
    let categoria = this.value;
    let lista = [];

    for (let i = 0; i < productos.length; i++) {
        if (categoria === "todo" || productos[i].Categoria === categoria) {
            lista.push(productos[i]);
        }
    }

    mostrarProductos(lista);
});

function mostrarProductos(lista) {
    productHolder.innerHTML = "";

    lista.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.className = "productCard";

        const nameElement = document.createElement("h3");
        nameElement.innerText = product.name;

        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = product.description;

        const priceElement = document.createElement("p");
        priceElement.className = "price";
        priceElement.innerText = product.price.toFixed(2) + " €";

        const stockElement = document.createElement("p");
        stockElement.innerText = "Disponibles: " + product.stock;

        const button = document.createElement("button");
        button.innerText = "Añadir al carrito";
        button.addEventListener("click", function () {
            agregarAlCarrito(product);
        });

        productDiv.appendChild(nameElement);
        productDiv.appendChild(descriptionElement);
        productDiv.appendChild(priceElement);
        productDiv.appendChild(stockElement);
        productDiv.appendChild(button);
        productHolder.appendChild(productDiv);
    });
}

function agregarAlCarrito(product) {
    if (product.stock === 0) {
        alert("No hay unidades disponibles.");
        return;
    }

    let encontrado = false;

    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].id === product.id) {
            encontrado = true;
            if (carrito[i].cantidad < product.stock) {
                carrito[i].cantidad++;
            } else {
                alert("No hay más unidades disponibles.");
            }
        }
    }

    if (encontrado === false) {
        carrito.push({
            id: product.id,
            name: product.name,
            price: product.price,
            cantidad: 1
        });
    }

    mostrarCarrito();
}

function mostrarCarrito() {
    cartHolder.innerHTML = "";
    let total = 0;

    if (carrito.length === 0) {
        cartHolder.innerText = "El carrito está vacío.";
    }

    for (let i = 0; i < carrito.length; i++) {
        const item = document.createElement("div");
        item.className = "cartItem";
        item.innerHTML = "<p>" + carrito[i].name + " x " + carrito[i].cantidad + "</p>" +
            "<p>" + (carrito[i].price * carrito[i].cantidad).toFixed(2) + " €</p>";

        const button = document.createElement("button");
        button.innerText = "Quitar";
        let posicion = i;
        button.addEventListener("click", function () {
            carrito.splice(posicion, 1);
            mostrarCarrito();
        });

        total = total + carrito[i].price * carrito[i].cantidad;
        item.appendChild(button);
        cartHolder.appendChild(item);
    }

    document.getElementById("cartTotal").innerText = total.toFixed(2) + " €";
}