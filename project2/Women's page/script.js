let productDom = document.getElementById("productDom")
let cartBtn = document.getElementById("cartBtn")
let itemCounter = document.getElementById("itemCounter")
let cartDom = document.getElementById('cart-contant')
let clearBtn = document.getElementById("clearCart")
let total = document.getElementById("total")


// addEventListener

document.addEventListener("DOMContentLoaded", displayProduct)
cartBtn.addEventListener("click", cartView)
cartDom.addEventListener("click", DeleteCartDom)
clearBtn.addEventListener("click", clearCart)

let cart2 = []
let countElement = 0

// class 
class Products {
    async getProducts() {
        try {
            let result = await fetch("./data.json")
            let data = await result.json()
            return data.items
        } catch (err) {
            console.log(err)
        }
    }
}
class UI {
    displayProduct(product) {
        let results = "";
        product.forEach(({ title, price, image, id, link }) => {
            results += `
            <div class="card shadow p-3 mb-5 rounded" style="width: 15rem;">
                <img src="${image}" class="card-img-top" alt="...">
                <div class="card-body text-center">
                    <h3 class="card-title">${title}</h3>
                    <p class="fw-bold">Price: ${price} Rs</p>
                    <div class="d-flex">
                        <button class="btn btn-secondary addToCart" data-id=${id}>Add to Cart</button>
                        <a href="${link}" target="_blank" class="btn btn-primary">View</a>
                    </div>
                </div>
            </div>
            `;
            productDom.innerHTML = results;
        });
    }

    static getButton(products) {
        const buttons = [...document.querySelectorAll(".addToCart")];
        buttons.forEach((button) => {
            let id = button.dataset.id;
            button.addEventListener("click", (e) => {
                e.target.innerHTML = "Added";
                let cartProduct = products.find((product) => product.id == id);
                Storage.saveCart(cartProduct);
                UI.countItem(Storage.getCart());
                UI.getCartDisplay();
                setTimeout(() => {
                    e.target.innerHTML = "Add to Cart";
                }, 1000); // Reset button text after 1 second
            });
        });
    }
    static getCartDisplay() {
        let items = Storage.getCart();
        UI.total(items);

        if (items !== null) {
            let totalRow = "";
            items.forEach((item) => {
                totalRow += `
                <tr>
                    <td><img src="${item.image}" class="cart-image" alt=""></td>
                    <td>${item.title}</td>
                    <td>${item.price} Rs</td>
                    <td>${item.quantity}</td>
                    <td><a href="#" class="delete"><i class="fas fa-trash-alt" data-id=${item.id}></i></a></td>
                </tr>
                `;
            });
            cartDom.innerHTML = totalRow;
        }
    }
    static total(cart) {
        let itemTotal = 0;
        cart.forEach((item) => {
            itemTotal += item.price * item.quantity;
        });
        total.innerText = `${itemTotal} Rs`;
    }
    static countItem(cart) {
        let totalItems = 0;
        cart.forEach((item) => {
            totalItems += item.quantity;
        });
        itemCounter.innerText = totalItems;
    }
    static DeleteFromLocalStorage(id) {
        let carts = Storage.getCart();
        carts = carts.filter((item) => item.id != id);
        localStorage.setItem("cart", JSON.stringify(carts));
    }  
}

//  Storage

class Storage {
    static saveCart(item) {
        let carts = this.getCart();
        let existingItem = carts.find((cartItem) => cartItem.id == item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            item.quantity = 1;
            carts.push(item);
        }
        localStorage.setItem("cart", JSON.stringify(carts));
    }
    static getCart() {
        return JSON.parse(localStorage.getItem("cart")) || [];
    }
}

// Functionality

async function displayProduct() {
    let productList = new Products();
    let ui = new UI();
    let product = await productList.getProducts();
    ui.displayProduct(product);
    UI.getButton(product);
    UI.countItem(Storage.getCart());
    cartView();
}

function cartView() {
    UI.getCartDisplay()
}

function DeleteCartDom(e) {
    if (e.target.classList.contains("fa-trash-alt")) {
        let id = e.target.dataset.id

        UI.DeleteFromLocalStorage(id)
        UI.getCartDisplay()
        UI.countItem(Storage.getCart())
        displayProduct()

    }
}

function clearCart() {
    localStorage.clear()
    UI.getCartDisplay()
    displayProduct()
}