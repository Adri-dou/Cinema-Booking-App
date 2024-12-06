<template>
  <div class="seat-selection">
    <div class="movie-info">
      <h1>{{ movieTitle }}</h1>
      <p class="tagline">{{ movieTagline }}</p>
    </div>

    <div class="screen-section">
      <div class="screen">Screen</div>
    </div>

    <div class="cinema-room">
      <div class="row" v-for="(row, rowIndex) in seats" :key="rowIndex">
        <!-- Left side seats -->
        <div
          class="seat"
          v-for="seat in row.slice(0, row.length / 3)"
          :key="seat.id"
          :class="seat.status"
          @click="selectSeat(seat)"
          :style="{ backgroundImage: `url(${getSeatImage(seat.status)})` }"
        >
          {{ seat.id }}
        </div>

        <!-- Aisle -->
        <div class="aisle"></div>

        <!-- Middle side seats -->
        <div
          class="seat"
          v-for="seat in row.slice(row.length / 3, row.length / 3 * 2)"
          :key="seat.id"
          :class="seat.status"
          @click="selectSeat(seat)"
          :style="{ backgroundImage: `url(${getSeatImage(seat.status)})` }"
        >
          {{ seat.id }}
        </div>

        <!-- Aisle -->
        <div class="aisle"></div>

        <!-- Right side seats -->
        <div
          class="seat"
          v-for="seat in row.slice(row.length / 3 * 2, row.length)"
          :key="seat.id"
          :class="seat.status"
          @click="selectSeat(seat)"
          :style="{ backgroundImage: `url(${getSeatImage(seat.status)})` }"
        >
          {{ seat.id }}
        </div>
      </div>
    </div>

    <div class="reservation-info">
      <p class="info">
        Selected seats:  <strong>{{ selectedSeats.map(s => s.id).join(", ") || "None" }}</strong>
      </p>
      <button class="reserve-button" @click="handleReserve()" :disabled="selectedSeats.length === 0">
        Reserve Seats
      </button>
    </div>

    <!-- Popup -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup">
        <img src="@/assets/snacks-popup.png" alt="Snacks Offer" class="popup-image" />
        <h2 class="popup-title">Enhance Your Experience!</h2>
        <p class="popup-text">Order snacks to enjoy with your movie.</p>
        <div class="popup-buttons">
          <router-link to="/" class="popup-button reject-button">No, Thanks</router-link>
          <router-link to="/order-food" class="popup-button accept-button">Order Snacks</router-link>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ['sessionId'],
  data() {
    return {
      session: {},
      seats: [],
      selectedSeats: [],
      movieTitle: "",
      movieTagline: "",
      takenSeats: [],
      showPopup: false, // State for showing the popup
    };
  },
  async created() {
    await this.fetchSessionDetails();
  },
  
  methods: {
    async fetchSessionDetails() {
      try {
        const response = await axios.get(`http://localhost:3000/api/sessions/${this.sessionId}`);
        this.session = response.data;
        const { takenSeats, movie, room } = response.data;

        this.movieTitle = movie.title || "Unknown Movie";
        this.movieTagline = movie.tagline || "Enjoy your movie!";
        this.takenSeats = takenSeats || [];

        // Update if the user has already selected seats in the current session
        const localOrders = JSON.parse(localStorage.getItem("Order")) || [];
        const currentSessionOrder = localOrders.filter(order => order.id === this.sessionId);
        const localTakenSeats = currentSessionOrder.length > 0 ? currentSessionOrder[0].selectedSeats : [];
        this.takenSeats = [...new Set([...this.takenSeats, ...localTakenSeats])];
        
        
        // Fetch room layout dynamically (you could also include it in the session response)
        const roomLayout = this.getRoomLayout(room);
        this.initializeSeats(roomLayout.rows, roomLayout.cols);
      } catch (err) {
        console.error("Failed to fetch session details:", err);
      }
    },

    getRoomLayout(room) {
      // Mock API or static data for room layouts
      const roomLayouts = {
        1: { rows: 10, cols: 20 },
      };
      return roomLayouts[room] || { rows: 10, cols: 20 }; // Default layout
    },

    saveOrderToLocalStorage() {
      // Get the current order from local storage or initialize it
      const orders = JSON.parse(localStorage.getItem("Order")) || [];
      
      // Check if the user has already saved an order for the current session
      if (orders.find(order => order.id === this.sessionId)) {
        // Update the existing order with the new selected seats
        orders.forEach(order => {
          if (order.id === this.sessionId) {
            order.selectedSeats = [...new Set([...order.selectedSeats, ...this.selectedSeats.map(seat => seat.id)])];
          }
        });
      } else {
        // Create a new order object
        const newOrder = {
          id: this.sessionId,
          movieTitle: this.movieTitle,
          selectedSeats: this.selectedSeats.map(seat => seat.id),
          dateTimeSession: this.session.dateTime,
          posterPath: this.session.movie.posterPath,
        };

        // Add the new order to the array
        orders.push(newOrder);
        this.$store.commit("addOrder", newOrder);
      }

      // Save the updated array back to local storage
      localStorage.setItem("Order", JSON.stringify(orders));

      // Reset selected seats locally after saving
      this.selectedSeats.forEach(seat => (seat.status = "reserved"));
      this.selectedSeats = [];

      //alert("Your order has been saved !");
    },

    initializeSeats(rows, cols) {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      this.seats = Array.from({ length: rows }, (_, rowIndex) =>
        Array.from({ length: cols }, (_, colIndex) => {
          const seatId = `${alphabet[rowIndex]}${colIndex + 1}`;
          return {
            id: seatId,
            status: this.takenSeats.includes(seatId) ? "reserved" : "available",
          };
        })
      );
    },

    selectSeat(seat) {
      if (seat.status === "available") {
        seat.status = "selected";
        this.selectedSeats.push(seat);
      } else if (seat.status === "selected") {
        seat.status = "available";
        this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id);
      }
    },

    getSeatImage(status) {
      switch (status) {
        case "available":
          return require("@/assets/seats/seat-available.png");
        case "selected":
          return require("@/assets/seats/seat-selected.png");
        case "reserved":
          return require("@/assets/seats/seat-reserved.png");
        default:
          return require("@/assets/seats/seat-available.png");
      }
    },
    handleReserve() {
      this.saveOrderToLocalStorage();
      this.showPopup = true; // Show popup after reserving seats
    },
  },
};
</script>

<style scoped>
.seat-selection {
  text-align: center;
  margin: 3rem 10%;
  color: #fff;
}

.movie-info {
  text-align: center;
  margin-bottom: 2rem;
}

.movie-info h1 {
  font-size: 2.5rem;
  color: #ffa500;
  margin-bottom: 0.5rem;
}

.movie-info .tagline {
  font-size: 1.2rem;
  color: #ddd;
}

.screen-section {
  margin-bottom: 2rem;
}

.screen {
  margin: 0 auto;
  padding: 0.5rem;
  background-color: #444;
  color: #fff;
  font-weight: bold;
  border-radius: 8px;
  width: 60%;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.cinema-room {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.row {
  display: flex;
  margin-bottom: 0.5rem;
  justify-content: center;
}

.seat {
  width: 60px;
  height: 60px;
  margin: 0.2rem;
  background-size: cover;
  cursor: pointer;
  border-radius: 4px;
  transition: transform 0.2s ease;
}

.seat:hover {
  transform: scale(1.1);
}

.aisle {
  width: 4rem;
}

.reservation-info {
  margin-top: 2rem;
}

.reserve-button {
  background-color: #ffa500;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.reserve-button:hover {
  background-color: #ff4500;
  transform: scale(1.05);
}

.reserve-button:disabled {
  background-color: #888;
  cursor: not-allowed;
}

/* Popup Overlay */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.5s ease;
  z-index: 100;
}

.popup {
  width: 30%;
  text-align: center;
  color: #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  animation: popupScale 0.5s ease;
}

.popup-image {
  width: 25vw;
  margin: 0 auto;
  display: block;
  border-radius: 8px;
}

.popup-title {
  color: #f90;
  font-size: 1.8rem;
  margin: 1rem 0;
}

.popup-text {
  color: #ddd;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}


.popup-buttons {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}

.popup-button {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  border: 2px solid #f90;
  border-radius: 8px;
  color: #f90;
  text-decoration: none;
  background: transparent;
  transition: background 0.3s ease, transform 0.2s ease;
}

.popup-button:hover {
  background: #ffa500;
  color: #222;
  transform: scale(1.05);
}

.reject-button {
  border-color: #ff4500;
  color: #ff4500;
}

.reject-button:hover {
  background: #ff4500;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes popupScale {
  from {
    transform: scale(0.8);
  }
  to {
    transform: scale(1);
  }
}
</style>
