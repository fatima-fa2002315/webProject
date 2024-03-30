
function loadCart() {
  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const tableBody = document.querySelector(".small-container.cart-page tbody");
  let totalPrice = 0;
  cartItems.forEach((item) => {
    const row = document.createElement("tr");
    totalPrice += parseInt(item.price.split("$")[1]) * parseInt(item.quantity);
    row.innerHTML = `
            <td>
                <div class="cart-info">
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <p>${item.name}</p>
                        <small>Price: ${item.price}</small>
                        <br>
                        <a href="#" class="remove-item"  data-id="${item.id}">Remove</a>
                    </div>
                </div>
            </td>
            <td><input type="number" disabled value="${item.quantity}" min="1"></td>
            <td>${item.price}</td>
        `;
    tableBody.appendChild(row);
  });
  getTotal(totalPrice);

  const removeLinks = document.querySelectorAll('.remove-item');
  removeLinks.forEach(link => {
      link.addEventListener('click', function(event) {
          event.preventDefault();
          const itemId = this.dataset.id;
          console.log("ID of the item to be removed:", itemId);
          const row = this.closest('tr');
          console.log("row",row)
          row.remove();
          totalPrice = 0;
          cartItems = cartItems.filter((f)=> f.id!=itemId)
          cartItems.forEach((i) => totalPrice+=parseInt(i.price.split("$")[1]) * parseInt(i.quantity))
          localStorage.setItem("cart",JSON.stringify(cartItems));
          getTotal(totalPrice)
          // You can add additional logic here to update the cart data or perform other actions
      });
  });
}
function getTotal(total) {
  const tableBody = document.querySelector(".total-price tbody");
  tableBody.innerHTML = "";
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>Total </td>
    <td> ${total} </td>`;
  tableBody.appendChild(row);
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
function checkout(event){
    event.preventDefault()
    let totalPrice = 0
    let cartItems =  JSON.parse(localStorage.getItem("cart")) || [];
    let sellerID =  []
    cartItems.forEach((i) => {totalPrice+=parseInt(i.price.split("$")[1]) * parseInt(i.quantity); sellerID.push(i.seller_id)})
    let currentUser = JSON.parse(localStorage.getItem('user'));
   
    console.log("cartItems",cartItems)
    let data = {
        metadata : cartItems.map((prod) =>  {
            return {
            product_id : prod.id,
            quantity : prod.quantity
            }
        }),
        transaction_price : totalPrice,
        buyer_id : currentUser.id,
        sellerID : sellerID
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    };
    if(currentUser.wallet < totalPrice){
      showToast("You Doesn't have enough money to purchase this")
    }
    else {
    fetch('http://localhost:3000/addtransaction', requestOptions)
      .then(response => {
        response.json()
        showToast("Transaction Successful!")
        localStorage.removeItem("cart")
        currentUser['wallet'] -= totalPrice
        localStorage.setItem("user",JSON.stringify(currentUser))
        window.location.href="PurchaseHistory.html"
      })
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
    }
      // 
}
window.onload = () => {
  let cartItems =  JSON.parse(localStorage.getItem("cart")) || []
  if (cartItems.length > 0) document.querySelector('.cart-badge').textContent = cartItems.length
  generateNavbar();
  loadCart(false);
};

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
