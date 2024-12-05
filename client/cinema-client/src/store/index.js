import { createStore } from "vuex";

const store = createStore({
  state: {
    // Global state variables
    orders: [], // Store orders
    user: null, // Store user info
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
      localStorage.removeItem("Order");
    },
    setUser(state, user) {
      state.user = user;
    },
    clearUser(state) {
      state.user = null;
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
        commit("clearOrders");
      } catch (error) {
        console.error("Checkout failed:", error);
        alert("Checkout failed. Please try again.");
      }
    },

    async saveUserOrders({ state, commit }) {
      // Save orders to user's database
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("User is not logged in");
        }
    
        // Iterate through all orders to save them
        for (const order of state.orders) {
          if (order.id !== "food") {
            // Save the full order (aligned with User's bookedSessions schema)
            await fetch(`http://localhost:3000/api/auth/book-session`, {
              method: "POST",
              body: JSON.stringify({
                id: order.id,
                movieTitle: order.movieTitle,
                selectedSeats: order.selectedSeats,
                dateTimeSession: order.dateTimeSession,
                posterPath: order.posterPath,
              }),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
          }
        }
    
        // alert("Orders successfully saved to your account!");
        
      } catch (error) {
        console.error("Failed to save orders to database:", error);
        alert("Failed to save orders to your account. Please try again.");
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
