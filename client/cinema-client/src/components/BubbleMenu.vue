<template>
  <div class="bubble-container">
    <!-- Floating Bubble -->
    <div class="bubble" @click="toggleMenu">
      <img src="@/assets/account-icon.png" alt="Menu" />
      <span class="order-count" v-if="orderCount > 0">{{ orderCount }}</span>
    </div>

    <!-- Menu -->
    <div class="menu" :class="{ visible: menuVisible }">
      <div class="user-info" v-if="isLoggedIn">
        <p>Welcome, {{ user }}</p>
      </div>
      <div class="orders">
        <h3>Your Orders</h3>
        <template v-if="orders.length > 0">
          <ul>
            <li v-for="order in orders" :key="order.id">
              <template v-if="order.id === 'food'">
                <strong>Food Order:</strong>
                <ul class="food-items">
                  <li v-for="food in groupedFood(order.items)" :key="food.id">
                    <span>{{ food.quantity }}x {{ food.name }}</span>
                    <span> ${{ (food.quantity * food.price) }}</span>
                  </li>
                </ul>
              </template>
              <template v-else>
                <div class="movie-order">
                  <div class="movie-poster">
                    <img :src="`https://image.tmdb.org/t/p/w200${order.posterPath}`" :alt="order.movieTitle" />
                  </div>
                  <div class="session-details">
                    <strong>{{ order.movieTitle }}</strong>
                    <p>
                      <strong>Date:</strong> {{ formatDate(order.dateTimeSession) }} <br />
                      <strong>Time:</strong> {{ formatTime(order.dateTimeSession) }} <br />
                      <strong>Seats:</strong> {{ order.selectedSeats.length }}
                    </p>
                  </div>
                </div>
              </template>
            </li>
          </ul>
        </template>
        <template v-else>
          <p>Nothing here yet. Add some sessions or food to your cart!</p>
        </template>
      </div>
      <div class="checkout-section">
        <template v-if="orders.length > 0">
          <template v-if="isLoggedIn">
            <p>Enjoy exclusive offers and discounts!</p>
            <button class="checkout-button" @click="userCheckout()">Checkout</button>
          </template>
          <template v-else>
            <p>
              <router-link to="/login" @click="menuVisible = false">Log in to enjoy offers and reductions</router-link>, or
              continue as a guest:
            </p>
            <button class="checkout-button" @click="guestCheckout()">Checkout as Guest</button>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      menuVisible: false, // Local state to toggle menu visibility
    };
  },
  async created() {
    // Update correctly from local storage
    this.$store.commit("clearOrders");
    const localorders = JSON.parse(localStorage.getItem("Order") || "[]");
    if (localorders.length > 0) {
      localorders.forEach((order) => {
        this.$store.commit("addOrder", order);
      });
    }
  },
  computed: {
    ...mapState(["orders", "user"]), // Map orders and user state
    ...mapGetters(["orderCount", "isLoggedIn"]), // Map getters
  },
  methods: {
    ...mapActions(["checkout", "saveUserOrders"]), // Map Vuex actions
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    groupedFood(items) {
      const grouped = {};
      items.forEach((item) => {
        if (grouped[item.name]) {
          grouped[item.name].quantity += 1;
        } else {
          grouped[item.name] = { ...item, quantity: 1 };
        }
      });
      return Object.values(grouped);
    },
    formatDate(dateTime) {
      const date = new Date(dateTime);
      const options = { day: "numeric", month: "long" };
      return date.toLocaleDateString(undefined, options);
    },
    formatTime(dateTime) {
      const date = new Date(dateTime);
      const options = { hour: "2-digit", minute: "2-digit" };
      return date.toLocaleTimeString(undefined, options);
    },
    userCheckout() {
      this.saveUserOrders();
      this.checkout();
    },
    guestCheckout() {
      this.checkout();
    },
  },
};
</script>

<style scoped>
.bubble-container {
  position: fixed;
  bottom: 5%;
  right: 5%;
  z-index: 3;
}

.bubble {
  width: 70px;
  height: 70px;
  background-color: #f50;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

.bubble:hover {
  transform: scale(1.1);
}

.bubble img {
  width: 70%;
  height: 70%;
}

.order-count {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background-color: red;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 50%;
  padding: 0.3rem 0.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.menu {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 18rem;
  max-height: 70vh;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  padding: 1rem;
  text-align: left;
  overflow-y: auto;

  /* Default hidden state */
  transform: translateX(100%);
  opacity: 0;
  z-index: -1;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.menu.visible {
  transform: translateX(0);
  opacity: 1;
  z-index: 4;
}

.menu p {
  margin: 0.5rem 0;
}

.menu h3 {
  margin: 0.5rem 0;
}

.menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu li {
  margin: 0.5rem 0;
}

.menu a {
  color: #f90;
  text-decoration: none;
}

.menu a:hover {
  text-decoration: underline;
}

.orders ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.orders li {
  padding: 0.5rem, 0;
  border-bottom: 1px solid #555;
}

.food-items {
  list-style: none;
  padding-left: 1rem;
  margin: 0;
}

.food-items li {
  display: flex;
  justify-content: space-between;
}

.movie-order {
  display: flex;
  align-items: center;
}

.movie-poster img {
  width: 70px;
  margin-right: 1rem;
}

.checkout-section {
  margin-top: 2rem;
}

.checkout-button {
  background-color: #f50;
  color: white;
  font-size: large;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
  width: 100%;
  text-shadow: 1px 1px 2px black;
}

.checkout-button:hover {
  background-color: #f90;
}
</style>
