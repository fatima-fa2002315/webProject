function handleFileChange(event){
    console.log("event", event);
    const selectedFile = event.target.files[0];

    const fileNameSpan = document.querySelector('.file-name');
    fileNameSpan.textContent = selectedFile ? selectedFile.name : 'No file chosen';
}

window.onload = function(){
    const fileInput = document.getElementById('file-input');
    fileInput.addEventListener('change', handleFileChange);
    generateNavbar()
};
function uploadItem(event) {
    event.preventDefault(); 
    
    // Validate form fields
    const productName = document.getElementById('productName').value.trim();
    const rating = document.getElementById('rating').value.trim();
    const description = document.getElementById('description').value.trim();
    const productPrice = document.getElementById('productPrice').value.trim();
    const fileInput = document.getElementById('file-input');
    const selectedFile = fileInput.files[0];
    
    // Check if any field is empty
    if (!productName || !rating || !description || !productPrice || !selectedFile) {
        alert('All fields are required!');
        return;
    }
    
    // Check if rating is within range
    if (rating < 1 || rating > 5) {
        alert('Rating must be between 1 and 5');
        return;
    }
    
    // Check if price is valid
    if (productPrice < 5) {
        alert('Product price must be at least $5');
        return;
    }

    // Prepare form data
    let userDetails = JSON.parse(localStorage.getItem("user"));
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('seller_id',userDetails.id)
    formData.append('rating', rating);
    formData.append('description', description);
    formData.append('price', `$${productPrice}`);
    formData.append('image', selectedFile);

    // Send POST request to Node.js server
    fetch('http://localhost:3000/uploadProduct', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from server:', data);
        alert('Product added successfully!');
        // document.getElementById('uploadItem').reset();
      })
      window.location.href="SellingItems.html"
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
