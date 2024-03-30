function loadProduct() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("q");
  if (productId) {
    fetch("../Data/products/products.json")
      .then((response) => response.json())
      .then((products) => {
        console.log("products",products)
        const product = products.find(
          (item) => parseInt(item.id) === parseInt(productId)
        );
        if (product) {
            console.log("product",product)
          const parentDiv = document.querySelector(
            ".small-container.single-product .row"
          );

          // Create and append image div
          const imgDiv = document.createElement("div");
          imgDiv.classList.add("col-2");
          const img = document.createElement("img");
          img.src = product.image;
          img.style.width = "100%";
          imgDiv.appendChild(img);
          parentDiv.appendChild(imgDiv);

          // Create and append details div
          const detailsDiv = document.createElement("div");
          detailsDiv.classList.add("col-2");
          const p1 = document.createElement("p");
          p1.textContent = `Home / ${product.name}`;
          const h1 = document.createElement("h1");
          h1.textContent = `${product.name} by HRX`;
          const h4 = document.createElement("h4");
          h4.textContent = product.price;
          const input = document.createElement("input");
          input.type = "number";
          input.value = "1";
          input.id = "quantityInput";
          const btn = document.createElement("a");
          btn.href = "";
          btn.classList.add("btn");
          btn.onclick = (event) => addToCart(event,product)
          btn.textContent = "Add To Cart";
          const h3 = document.createElement("h3");
          h3.textContent = "Product Details";
          const p2 = document.createElement("p");
          p2.textContent = product.description;

          detailsDiv.appendChild(p1);
          detailsDiv.appendChild(h1);
          detailsDiv.appendChild(h4);
          detailsDiv.appendChild(input);
          detailsDiv.appendChild(btn);
          detailsDiv.appendChild(h3);
          detailsDiv.appendChild(p2);
          parentDiv.appendChild(detailsDiv);
        } else {
          console.error("Product not found");
        }
        // Loop through products
      })

      .catch((error) => console.error("Error loading products:", error));
  }
}

const BuyerItems = [
  { text: "Products", link: "SearchProducts.html" },
  {text : "Purchase History",link:"PurchaseHistory.html"}
];

const SellerItems = [
  { text: "Add Product", link: "UploadItem.html" },
  { text: "Products", link: "SellingItems.html" },
];
function generateNavbar() {
  const navbar = document.getElementById("MenuItems");

  // Clear existing items
  navbar.innerHTML = "";
  if (localStorage.getItem("user")) {
    let userDetails = JSON.parse(localStorage.getItem("user"));
    console.log("userDetails", userDetails);
    let navItems = userDetails.type == "seller" ? SellerItems : BuyerItems;
    console.log("navItems", navItems);
    navItems.forEach((item) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.textContent = item.text;
      a.href = item.link;
      li.appendChild(a);
      navbar.appendChild(li);
    });
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.classList.add("btn-outline-danger");
    btn.textContent = "LOGOUT";
    btn.onclick = (event) => handlelogout(event)
    li.appendChild(btn);
    navbar.appendChild(li);
  }
}
function handlelogout(e){
  e.preventDefault()
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
  window.location="Login.html";
}

function addToCart(e,product) {
    e.preventDefault();
    let quantityInput = document.getElementById("quantityInput").value
    console.log("quantityIput",quantityInput)
    // Retrieve existing cart items from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Add the new item to the cart
    let tempProd = cart.filter((f) => f.id == product.id)
    quantityInput = tempProd.length > 0 ? ( parseInt(quantityInput) + tempProd[0].quantity) : parseInt(quantityInput) ;
    if(tempProd.length > 0 )  cart =  cart.filter((f) => f.id != product.id)
    cart.push({...product,quantity:quantityInput});

    // Update the cart in local storage
    localStorage.setItem('cart', JSON.stringify(cart));
    showToast("The Item has been added to the cart")

}

function showToast(message) {
  let toastContainer = document.getElementById('toastContainer');
  let toastMessage = document.getElementById('toastMessage');
  toastMessage.innerText = message;
  toastContainer.style.display = 'block';
  setTimeout(function() {
    toastContainer.style.display = 'none';
  }, 3000);
}

function closeToast() {
  let toastContainer = document.getElementById('toastContainer');
  toastContainer.style.display = 'none';
}
window.onload = () => {
  let cartItems =  JSON.parse(localStorage.getItem("cart")) || []
  if (cartItems.length > 0) document.querySelector('.cart-badge').textContent = cartItems.length
  generateNavbar();
  loadProduct();
};
