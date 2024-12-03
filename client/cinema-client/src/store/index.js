import { createStore } from "vuex";

const store = createStore({
  state: {
    // Global state variables
    orders: [], // Store orders
    user: {}, // Store user info
  },
  mutations: {
    // Synchronous mutations to modify state
    addOrder(state, order) {
      state.orders.push(order);
    },
    deleteOrder(state, orderId) {
      state.orders = state.orders.filter(order => order.id !== orderId);
    },
    clearOrders(state) {
      state.orders = [];
    },
    setUser(state, user) {
      state.user = user;
    },
    clearUser(state) {
      state.user = {};
    },
  },
  actions: {
    // Asynchronous actions (e.g., API calls) that commit mutations
    async checkout({ state, commit }) {
      try {
        let total = 0;

        for (const order of state.orders) {
          if (order.id !== "food") {
            // Simulate reserving movie tickets
            await fetch(`http://localhost:3000/api/sessions/${order.id}/reserve`, {
              method: "POST",
              body: JSON.stringify({ seats: order.selectedSeats }),
              headers: { "Content-Type": "application/json" },
            });
          } else {
            // Calculate food order total
            total += order.total;
          }
        }

        alert(`Checkout successful! Total: ${total}`);
        commit("clearOrders"); // Clear orders after successful checkout
        localStorage.removeItem("Order");
      } catch (error) {
        console.error("Checkout failed:", error);
        alert("Checkout failed. Please try again.");
      }
    },
  },
  getters: {
    // Derived state for components
    orderCount: (state) => state.orders.length,
    isLoggedIn: (state) => !!state.user,
  },
});

export default store;
