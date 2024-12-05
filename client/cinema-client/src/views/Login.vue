<template>
  <div class="auth-form">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="email" required placeholder="Enter your email" />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" v-model="password" required placeholder="Enter your password" />
      </div>
      <button type="submit">Login</button>
    </form>
    <p>
      Don't have an account?
      <router-link to="/register">Register here</router-link>
    </p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  async created() {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.$router.push('/profile');
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', {
          email: this.email,
          password: this.password,
        });

        // Save token to localStorage
        localStorage.setItem('authToken', response.data.token);
        // Save token to cookies
        //document.cookie = `authToken=${response.data.token}; path=/;`;

        // Set email in store
        this.$store.commit('setUser', this.email);

        // Redirect to Profile page
        this.$router.push('/profile');
      } catch (error) {
        console.error(error.response?.data?.message || 'Login failed.');
        alert(error.response?.data?.message || 'Invalid credentials. Try again.');
      }
    },
  },
};
</script>

<style scoped>
.auth-form {
  max-width: 400px;
  margin: 5% auto;
  background: #555;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.auth-form h2 {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.auth-form button {
  background-color: #f50;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.auth-form button:hover {
  background-color: #f90;
}

.auth-form p {
  margin-top: 1rem;
}

.auth-form a {
  color: #f50;
  text-decoration: none;
}

.auth-form a:hover {
  text-decoration: underline;
}
</style>
