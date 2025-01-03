let cartCount = 0;

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productName = this.getAttribute('data-product');
        const productPrice = this.getAttribute('data-price');
        
        cartCount++;
        document.getElementById('cart-count').innerText = cartCount;

        alert(`${productName} has been added to your cart!`);
    });
});