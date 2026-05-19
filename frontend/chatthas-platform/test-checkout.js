const payload = {
  formData: {
    name: 'Test', 
    phone: '0300', 
    address: '123', 
    notes: '', 
    deliveryMethod: 'delivery', 
    branch_id: '550e8400-e29b-41d4-a716-446655440008'
  }, 
  cartItems: [
    {
      id: '550e8400-e29b-41d4-a716-446655440000', 
      name: 'Daal', 
      price: 'Rs. 250', 
      quantity: 1
    }
  ], 
  cartTotal: 250, 
  deliveryFee: 150, 
  tax: 40, 
  discount: 0, 
  grandTotal: 440
};

fetch('http://localhost:5174/api/orders', {
  method: 'POST', 
  headers: {'Content-Type': 'application/json'}, 
  body: JSON.stringify(payload)
})
.then(r => r.json())
.then(data => console.log('RESPONSE:', data))
.catch(console.error);
