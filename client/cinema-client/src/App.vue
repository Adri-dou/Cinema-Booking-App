<template>
  <div id="app">
    <header>
      <div class="logo">
        <router-link to="/">CineMaBaguette</router-link>
      </div>
      <SearchBar class="search-bar" />
      <nav>
        <router-link to="/order-food">Snacks</router-link>
        <router-link to="/prices">Our Offers</router-link>
        <router-link to="/profile">
          <img src="@/assets/account-icon.png" alt="Login" />
        </router-link>
      </nav>
    </header>

    <main>
      <router-view />
      <BubbleMenu />
    </main>

    
    <footer>
      <div class="footer-content">
        
        <div class="footer-about">
          <img src="@/assets/cinema-baguette.png" alt="CineMaBaguette Logo" class="footer-logo" />
        </div>

        <div class="footer-contact">
          <h3>Contact</h3>
          <p>📍 Adress</p>
          <p>📞 Phone</p>
          <p>✉️ Email</p>
        </div>

        <div class="footer-social">
          <h3>Follow us</h3>
          <div class="social-icons">
            <a href="#"><i class="fa fa-facebook"></i></a>
            <a href="#"><i class="fa fa-twitter"></i></a>
            <a href="#"><i class="fa fa-google"></i></a>
            <a href="#"><i class="fa fa-instagram"></i></a>
            <a href="#"><i class="fa fa-pinterest"></i></a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import BubbleMenu from './components/BubbleMenu.vue';
import SearchBar from './components/SearchBar.vue';

export default {
  name: 'App',
  components: {
    BubbleMenu,
    SearchBar,
  },
};
</script>

<style>
/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 140%;
}

body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  font-family: "Arial", sans-serif;
  background: linear-gradient(110deg, #050505 40%, #333 100%);
  background-size: cover;
  color: #ccc;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header Styles */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #111;
  padding: 1rem;
  color: #ddd;
}

header .logo a {
  color: #ddd;
  font-weight: bold;
  font-size: 1.5rem;
  text-decoration: none;
}

header img {
  height: 2rem;
}

nav {
  display: flex;
  align-items: center;
}

nav a {
  margin: 0 1rem;
  color: #f3f4f6;
  text-decoration: none;
  display: flex;
  align-items: center;
}

nav a:hover {
  text-decoration: underline;
}

.search-bar {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

/* Footer Styles */
footer {
  background: #111;
  padding: 2rem 15%;
  color: #ddd;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}

.footer-about,
.footer-contact,
.footer-social {
  margin: 0 1rem;
  max-width: 300px;
}

.footer-logo {
  width: 60%;
  margin-bottom: 1rem;
}
/*
.footer-about p {
  margin: 1rem 0;
  line-height: 1.5;
  color: #f90;
  text-decoration: none;
}

.footer-about p:hover {
  text-decoration: underline;
}
*/
.footer-contact h3,
.footer-social h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #f90;
}

.social-icons {
  display: flex;
  gap: 2rem;
}

.social-icons a {
  margin-right: 0.5rem;
  font-size: 1.5rem;
  color: #ddd;
  text-decoration: none;
  transition: color 0.3s ease;
}

.social-icons a:hover {
  color: #f90;
}

/* Responsiveness */
@media (max-width: 780px) {
  .footer-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer-about,
  .footer-contact,
  .footer-social {
    margin: 1rem 0;
  }
}
</style>
