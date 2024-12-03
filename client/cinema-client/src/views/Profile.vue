<template>
    <div class="profile-page">
      <h2>Welcome to Your Profile</h2>
      <p>Your email: {{ user.email }}</p>
      <button @click="logout">Logout</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        user: {}, // User details fetched from the backend
      };
    },
    async created() {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          this.$router.push('/login');
        }
  
        // Fetch user profile using the token
        const response = await axios.get('http://localhost:3000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        this.user = response.data.user;
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        alert('Session expired. Please log in again.');
        this.$router.push('/login');
      }
    },
    methods: {
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
    max-width: 400px;
    margin: 10% auto;
    background: #555;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
    color: white;
  }
  .profile-page h2 {
    margin-bottom: 1rem;
  }
  .profile-page p {
    margin-bottom: 1.5rem;
  }
  .profile-page button {
    background-color: #ff4500;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .profile-page button:hover {
    background-color: #e63e00;
  }
  </style>
  