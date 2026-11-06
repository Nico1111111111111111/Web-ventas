const productHolder = document.getElementById("productDiv");

fetch("productos.json")
    .then(response => response.json())
    .then(productos => {
        productos.forEach(product => {
            const productDiv = document.createElement("div");

            const nameElement = document.createElement("h3");
            nameElement.innerText = product.name;

            const priceElement = document.createElement("p");
            priceElement.innerText = product.priceElement;

            productDiv.appendChild(nameElement);
            productDiv.appendChild(priceElement);
            productHolder.appendChild(productDiv);
        });
    });