const productHolder = document.getElementById("productDiv");
const cartHolder = document.getElementById("cartDiv");
const cartModal = document.getElementById("cartModal");
let productos = [];
let carrito = [];
let usuario = {};

fetch("productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        mostrarProductos(productos);
    });

fetch("userData.json")
    .then(response => response.json())
    .then(data => {
        usuario = data;
    });

document.getElementById("showCartButton").onclick = function () {
    document.getElementById("deliveryMessage").innerText =
        "Enviando pedido a: " + usuario.name + ", " + usuario.address;
    mostrarCarrito();
    cartModal.style.display = "block";
};

document.getElementById("closeCartButton").onclick = function () {
    cartModal.style.display = "none";
};

document.getElementById("finishButton").onclick = function () {
    carrito = [];
    mostrarCarrito();
    cartModal.style.display = "none";
};

document.getElementById("select").onchange = function () {
    let categoria = this.value;
    let lista = [];

    for (let i = 0; i < productos.length; i++) {
        if (categoria === "todo" || productos[i].Categoria === categoria) {
            lista.push(productos[i]);
        }
    }

    mostrarProductos(lista);
};

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
        button.onclick = function () {
            agregarAlCarrito(product);
        };

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
            break;
        }
    }

    if (encontrado === false) {
        carrito.push({
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
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
        let producto = carrito[i];
        const item = document.createElement("div");
        item.className = "cartItem";
        item.innerHTML = "<p>" + producto.name + "</p>" +
            "<p>" + (producto.price * producto.cantidad).toFixed(2) + " €</p>";

        const quantity = document.createElement("input");
        quantity.type = "number";
        quantity.min = 1;
        quantity.max = producto.stock;
        quantity.value = producto.cantidad;
        quantity.onchange = function () {
            let cantidad = Number(quantity.value);
            if (cantidad < 1) cantidad = 1;
            if (cantidad > producto.stock) cantidad = producto.stock;
            producto.cantidad = cantidad;
            mostrarCarrito();
        };

        const removeButton = document.createElement("button");
        removeButton.innerText = "Quitar";
        removeButton.onclick = function () {
            carrito.splice(i, 1);
            mostrarCarrito();
        };

        item.appendChild(quantity);
        item.appendChild(removeButton);
        cartHolder.appendChild(item);

        total = total + producto.price * producto.cantidad;
    }

    document.getElementById("modalTotal").innerText = total.toFixed(2) + " €";
}