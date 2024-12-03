<template>
  <div class="food-order">
    <h1 class="title">🍿 Cinema Snacks Order 🍫</h1>
    <div class="food-options">
      <div v-for="item in foodItems" :key="item.id" class="food-item">
        <img :src="item.image" :alt="item.name" />
        <div class="food-details">
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
          <p class="price">$ {{ item.price.toFixed(2) }}</p>
          <button @click="addToOrder(item)" class="add-button">Add to Order</button>
        </div>
      </div>
    </div>
    <div class="order-summary">
      <h2>Your Order Summary</h2>
      <ul>
        <li v-for="(item, index) in groupedOrder" :key="index">
          <span>{{ item.quantity }}x {{ item.name }}</span>
          <span> ${{ (item.price * item.quantity).toFixed(2) }} <button @click="removeFromOrder(item)" class="remove-button">-</button></span>
        </li>
      </ul>
      <p class="total-price">Total: ${{ totalPrice }}</p>
      <button class="checkout-button" @click="checkout()" :disabled="order.length === 0">Save Order</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      foodItems: [
        { id: 1, name: 'Popcorn', description: 'Large buttery popcorn', price: 5.00, image: require('@/assets/food/popcorn.webp') },
        { id: 2, name: 'Churros', description: '12 Churros Pack with chocolate dip', price: 6.00, image: require('@/assets/food/churros.webp') },
        { id: 3, name: 'Candy', description: 'Assorted candy', price: 1.50, image: require('@/assets/food/candies.webp') },
        { id: 4, name: 'Nachos', description: 'Crispy nachos with cheese', price: 4.50, image: require('@/assets/food/nachos.webp') },
        { id: 5, name: 'Soft Drink', description: 'Refreshing soda (500ml)', price: 3.00, image: require('@/assets/food/softdrink.webp') },
        { id: 6, name: 'Ice Cream', description: 'Choose your favorite flavor', price: 4.00, image: require('@/assets/food/icecream.webp') },
        { id: 7, name: 'Hot Dog', description: 'Classic hot dog with condiments', price: 5.50, image: require('@/assets/food/hotdog.webp') },
        { id: 8, name: 'Pretzel', description: 'Soft pretzel with salt and dip', price: 3.50, image: require('@/assets/food/pretzel.webp') },
      ],
      order: [],
    };
  },
  computed: {
    totalPrice() {
      return this.order.reduce((total, item) => total + item.price, 0).toFixed(2);
    },
    groupedOrder() {
      const group = {};
      this.order.forEach((item) => {
        if (group[item.name]) {
          group[item.name].quantity += 1;
        } else {
          group[item.name] = { ...item, quantity: 1 };
        }
      });
      return Object.values(group);
    },
  },
  created() {
    // Load existing food order from local storage
    const savedOrder = JSON.parse(localStorage.getItem('Order')) || [];
    const foodOrder = savedOrder.find(order => order.id === 'food');
    if (foodOrder) {
      this.order = foodOrder.items;
    }
  },
  methods: {
    addToOrder(item) {
      this.order.push(item);
    },
    removeFromOrder(item) {
      // Find the first occurrence of the item and remove it
      const index = this.order.findIndex(orderItem => orderItem.id === item.id);
      if (index !== -1) {
        this.order.splice(index, 1);
      }
    },
    checkout() {
      // Get the existing orders from local storage
      const existingOrders = JSON.parse(localStorage.getItem('Order')) || [];
      // Check if there's already a food order
      const foodOrderIndex = existingOrders.findIndex(order => order.id === 'food');
      
      const newFoodOrder = {
        id: 'food',
        items: this.order,
        total: this.totalPrice,
        //dateTime: new Date().toISOString(),
      };

      if (foodOrderIndex >= 0) {
        // Update the existing food order
        existingOrders[foodOrderIndex] = newFoodOrder;
      } else {
        // Add the new food order
        existingOrders.push(newFoodOrder);
      }

      // Save updated orders back to local storage
      localStorage.setItem('Order', JSON.stringify(existingOrders));

      //Update the Vuex store
      this.$store.commit("deleteOrder", newFoodOrder.id);
      this.$store.commit('addOrder', newFoodOrder);

      alert(`Your food order has been saved ! Total: $${this.totalPrice}`);
      this.$router.push('/');
    },
  },
};
</script>


<style scoped>

.food-order {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  position: relative;
  margin: 3rem 15%;
  z-index: 1;
}

.title {
  font-size: 2.5rem;
  color: #f90;
  margin-bottom: 2rem;
}

.food-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 1rem;
}

.food-item {
  text-align: center;
  background: #333;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
  width: 220px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.food-item:hover {
  transform: scale(1.05);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.7);
}

.food-item img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.food-details h3 {
  font-size: 1.2rem;
  color: #ff6f00;
}

.food-details p {
  font-size: 0.9rem;
  color: #ddd;
  margin: 0.5rem 0;
}

.price {
  color: #ff6f00;
  font-weight: bold;
  font-size: 1.1rem;
}

.add-button {
  background-color: #ff6f00;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: auto;
  transition: background-color 0.3s ease;
}

.add-button:hover {
  background-color: #e65c00;
}

.order-summary {
  margin-top: 2rem;
  text-align: center;
  background: #333;
  border: 1px solid #444;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: 400px;
}

.order-summary ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.order-summary li {
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
}

.total-price {
  margin-top: 1rem;
  font-size: 1.2rem;
  color: #fff;
  font-weight: bold;
}

.remove-button {
  background-color: #f50;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  text-align: center;
  cursor: pointer;
  font-size: 0.8rem;
  margin-left: 0.5rem;
  transition: background-color 0.3s ease;
}

.remove-button:hover {
  background-color: #e60000;
}

.checkout-button {
  background-color: #ff6f00;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1rem;
}

.checkout-button:disabled {
  background-color: #555;
  cursor: not-allowed;
}

.checkout-button:hover:not(:disabled) {
  background-color: #e65c00;
}
</style>
