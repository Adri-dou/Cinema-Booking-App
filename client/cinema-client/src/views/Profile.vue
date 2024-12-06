<template>
  <div class="profile-page">
    <h2>Your Profile</h2>
    <p class="email"><strong>Email:</strong> {{ user.email }}</p>
    <button @click="logout" class="logout-button"><strong>Logout</strong></button>

    <!-- Booked Sessions -->
    <div class="sessions-container">
      <div v-if="pastSessions.length > 0" class="sessions past-sessions">
        <h3>Past Sessions</h3>
        <ul>
          <li v-for="session in pastSessions" :key="session.id" class="session-card">
            <img :src="`https://image.tmdb.org/t/p/w200${session.posterPath}`" :alt="session.movieTitle" />
            <div class="details">
              <h4>{{ session.movieTitle }}</h4>
              <p><strong>Date : </strong> {{ formatDate(session.dateTimeSession) }}</p>
              <p><strong>Time : </strong> {{ formatTime(session.dateTimeSession) }}</p>
              <p><strong>Seats : </strong> {{ session.selectedSeats.join(', ') }}</p>
            </div>
          </li>
        </ul>
      </div>
      <div v-else>
        <p class="no-sessions">No past sessions yet.</p>
      </div>

      <div v-if="futureSessions.length > 0" class="sessions future-sessions">
        <h3>Upcoming Sessions</h3>
        <ul>
          <li v-for="session in futureSessions" :key="session.id" class="session-card">
            <img :src="`https://image.tmdb.org/t/p/w200${session.posterPath}`" :alt="session.movieTitle" />
            <div class="details">
              <h4>{{ session.movieTitle }}</h4>
              <p><strong>Date : </strong> {{ formatDate(session.dateTimeSession) }}</p>
              <p><strong>Time : </strong> {{ formatTime(session.dateTimeSession) }}</p>
              <p><strong>Seats : </strong> {{ session.selectedSeats.join(', ') }}</p>
            </div>
          </li>
        </ul>
      </div>
      <div v-else>
        <p class="no-sessions">No upcoming sessions booked.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {}, // User data from backend
      pastSessions: [], // Past sessions
      futureSessions: [], // Future sessions
    };
  },
  async created() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        this.$router.push('/login');
        return;
      }

      // Fetch user profile
      const response = await axios.get('http://localhost:3000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      this.user = response.data.user;

      // Sort sessions into past and future
      const now = new Date();
      this.pastSessions = this.user.bookedSessions.filter(
        (session) => new Date(session.dateTimeSession) < now
      );
      this.futureSessions = this.user.bookedSessions.filter(
        (session) => new Date(session.dateTimeSession) >= now
      );
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      localStorage.removeItem('authToken');
      this.$store.commit('clearUser');
      alert('Session expired. Please log in again.');
      this.$router.push('/login');
    }
  },
  methods: {
    formatDate(dateTime) {
      const date = new Date(dateTime);
      return date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    },
    formatTime(dateTime) {
      const date = new Date(dateTime);
      return date.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: 'numeric',
      });
    },
    logout() {
      localStorage.removeItem('authToken'); // Remove token
      this.$store.commit('clearUser'); // Clear user state
      this.$router.push('/login'); // Redirect to login page
    },
  },
};
</script>

<style scoped>
.profile-page {
  max-width: 600px;
  margin: 5% auto;
  background: #222;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  text-align: center;
  color: white;
  animation: fadeIn 0.8s ease;
}

.profile-page h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #f50;
}

.profile-page .email {
  margin-bottom: 2rem;
}

.logout-button {
  border: 1px solid #f50;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: #f50;
  background-color: transparent;
  cursor: pointer;
  transition: 0.3s ease;
  font-size: 1.2rem;
}

.logout-button:hover {
  background-color: #f50;
  color: white;
}

.sessions-container {
  margin-top: 2rem;
}

.sessions {
  margin-bottom: 2rem;
}

.sessions h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #f50;
}

.session-card {
  display: flex;
  background: #333;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s;
}

.session-card:hover {
  transform: scale(1.05);
}

.session-card img {
  width: 100px;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
}

.session-card .details {
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.session-card .details h4 {
  margin: 0;
  font-size: 1.3rem;
  color: #f50;
}

.no-sessions {
  color: #999;
  font-size: 1.3rem;
  margin: 2rem 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
