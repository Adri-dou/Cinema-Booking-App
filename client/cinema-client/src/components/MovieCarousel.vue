<template>
    <div class="carousel">
      
      <div
        class="carousel-slide"
        :class="{ active: index === currentSlide }"
        v-for="(movie, index) in movies"
        :key="movie.id"
      >
        <div
          class="carousel-image"
          :style="{ backgroundImage: `url( https://image.tmdb.org/t/p/original${movie.backdropPath})` }"
        ></div>
  
        <div class="overlay">
          <h2 class="movie-title">{{ movie.title }}</h2>
          <button class="book-now" @click="viewMovie(movie._id)">Book Now</button>
        </div>
      </div>

      <button class="carousel-button prev" @click="prevSlide">&#10094;</button>
      <button class="carousel-button next" @click="nextSlide">&#10095;</button>
  
      <div class="dots">
        <span
          v-for="(movie, index) in movies"
          :key="index"
          :class="{ active: index === currentSlide }"
          @click="setSlide(index)"
        ></span>
      </div>
    </div>
  </template>
  
<script>
  import axios from "axios";
  
  export default {
    
    data() {
      return {
        movies: [],
        currentSlide: 0,
        slideInterval: null,
      };
    },
    mounted() {
      this.fetchMovies();
      this.startAutoSlide();
    },
    beforeDestroy() {
      clearInterval(this.slideInterval);
    },
    methods: {
      async fetchMovies() {
        try {
          const response = await axios.get("http://localhost:3000/api/movies"); // Use your backend API
          this.movies = response.data.slice(0, 5);
        } catch (error) {
          console.error("Error fetching movies:", error);
        }
      },
      nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.movies.length;
      },
      prevSlide() {
        this.currentSlide =
          (this.currentSlide - 1 + this.movies.length) % this.movies.length;
      },
      setSlide(index) {
        this.currentSlide = index;
      },
      startAutoSlide() {
        // Change slide every 5 seconds
        this.slideInterval = setInterval(this.nextSlide, 5000);
      },
      viewMovie(id) {
        this.$router.push(`/movies/${id}`);
      },
    },
  };
</script>
  
<style scoped>
.carousel {
  position: relative;
  width: 100%;
  height: 80vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 100%;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: all 0.8s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-slide.active {
  left: 0;
  opacity: 1;
}

.carousel-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
}

.carousel-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0), transparent);
  z-index: 1;
}

.overlay {
  position: absolute;
  bottom: 10%;
  left: 5%;
  color: white;
  text-shadow: 0px 0px 10px black;
  z-index: 20;
  padding: 20px;
}

.movie-title {
  font-size: 4rem;
  margin-bottom: 10px;
}

.book-now {
  background-color: transparent;
  color: orange;
  border: 2px solid orange;
  padding: 10px 30px;
  font-size: 1.2rem;
  text-shadow: none;
  border-radius: 8px;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  cursor: pointer;
}

.book-now:hover {
  background-color: orange;
  color: white;
  border-color: orange;
}

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: #f90;
  border: none;
  padding: 15px;
  font-size: 2rem;
  cursor: pointer;
  border-radius: 50%;
  z-index: 2;
}

.carousel-button.prev {
  left: 10px;
}

.carousel-button.next {
  right: 10px;
}

.carousel:hover .carousel-button {
  transition: opacity 0.3s ease-in;
  opacity: 1;
}

.carousel-button {
  transition: opacity 0.3s ease-out;
  opacity: 0;
}

.dots {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.7rem;
  z-index: 2;
}

.dots span {
  width: 0.8rem;
  height: 0.8rem;
  background-color: rgba(255, 250, 130, 0.5);
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid #000;
}

.dots span.active {
  background-color: #fb2;
}
</style>
  