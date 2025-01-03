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
        let results = ""
        product.forEach(({ title, price, image, id }) => {
            results += `
            <div class="card shadow p-3 mb-5 rounded" style="width: 15rem;">
                <img src="${image}" class="card-img-top" alt="...">
                <div class="card-body text-center">
                    <h3 class="card-title">${title}</h3>
                    <p class="fw-bold">Price: ${price} Rs</p>
                    <div class="d-flex">
                        <button class="btn btn-secondary  addToCart" data-id=${id}>Add to Cart</button>
                        <button disabled="disabled" class="btn btn-secondary">View</button>
                    </div>

                </div>
            </div>
            `
            productDom.innerHTML = results
        });
    }

    static getButton(products) {
        const buttons = [...document.querySelectorAll(".addToCart")]
        buttons.forEach(button => {
            let id = button.dataset.id
            let cart = Storage.getCart() || cart2
            let inCart = cart.find(item => item.id == id)
            if (inCart) {
                button.innerText = "In Cart"
                button.disabled = true
            }

            button.addEventListener("click", e => {
                e.target.innerHTML = "In Cart"
                e.target.disabled = true
                let cartProduct = products.filter(product => product.id == id)
                Storage.saveCart(cartProduct[0])
                UI.countItem(Storage.getCart())

            })
        });
    }
    static getCartDisplay() {
        let items = Storage.getCart()
        UI.total(items)

        if (items !== null) {
            let totalRow = ""
            items.forEach((item) => {

                totalRow += `
                <tr>
                    <td ><img src="${item.image}" class="cart-image" alt=""></td>
                    <td>${item.title}</td>
                    <td>${item.price}</td>
                    
                    <td ><a href="#"class="delete" > <i class="fas fa-trash-alt " data-id=${item.id} ></i></a></td>
                </tr>
                    `
            });
            cartDom.innerHTML = totalRow
        }

    }
    static countItem(cart) {
        if (cart == null) {
            itemCounter.innerText = cart.length
        } else {
            itemCounter.innerText = cart.length
        }
    }
    static DeleteFromLocalStorage(id) {
        let carts = Storage.getCart()
        carts.forEach((item, index) => {
            if (item.id == id) {
                carts.splice(index, 1)
            }
        });
        localStorage.setItem("cart", JSON.stringify(carts))
    }
    static total(cart) {
        let itemTotal = 0

        cart.forEach(item => {
            itemTotal += item.price
        });
        total.innerText = itemTotal
    }
   
}

//  Storage

class Storage {
    static saveCart(item) {
        let carts
        if (localStorage.getItem("cart") == null) {
            carts = []
        } else {
            carts = JSON.parse(localStorage.getItem("cart"))
        }
        carts.push(item)
        localStorage.setItem("cart", JSON.stringify(carts))

    }
    static getCart() {
        let cartItem
        if (localStorage.getItem("cart") == null) {
            cartItem = []
        } else {
            cartItem = JSON.parse(localStorage.getItem("cart"))
        }
        return cartItem
    }
}

// Functionality

async function displayProduct() {
    let productList = new Products()
    let ui = new UI()
    let product = await productList.getProducts()
    ui.displayProduct(product)
    UI.getButton(product)
    UI.countItem(Storage.getCart())
    cartView()
  

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