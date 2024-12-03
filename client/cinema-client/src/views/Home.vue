<template>
  <div class="home">
    <MovieCarousel class="carousel" />

    <div class="genres-section">
      <div class="genre-row" v-for="(genre, index) in genres" :key="index">
        <h2 class="genre-title">{{ genre.name }}</h2>
        <div class="genre-movies-container">
          <button class="scroll-button prev" @click="scrollLeft(index)">&#10094;</button>

          <div class="movies-list" :ref="'moviesList' + index">
            <div
              v-for="movie in genre.movies"
              class="movie-card"
              @click="viewMovie(movie._id)"
              @mouseover="hoverMovie(movie._id)"
              @mouseleave="hoverMovie(null)"
              :class="{ 'darken': hoveredMovie && hoveredMovie !== movie._id }"
            >
              <img :src="`https://image.tmdb.org/t/p/w300${movie.posterPath}`" :alt="movie.title">
            </div>
          </div>

          <button class="scroll-button next" @click="scrollRight(index)">&#10095;</button>
        </div>

        <div class="see-more-container">
          <router-link to="/movies" class="all-movies-button">See More</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import MovieCarousel from "@/components/MovieCarousel.vue";

export default {
  name: "Home",
  components: {
    MovieCarousel,
  },
  data() {
    return {
      movies: [],
      genres: [
        { id: 28, name: "Action 💥", movies: [] },
        // { id: 878, name: "Science Fiction ⚗️", movies: [] },
        { id: 10749, name: "Romance 💖", movies: [] },
        { id: 27, name: "Horror 👻", movies: [] },
      ],

      hoveredMovie: null, // Track the hovered movie
    };
  },
  async created() {
    try {
      const response = await axios.get("http://localhost:3000/api/movies");
      this.movies = response.data;

      this.genres.forEach((genre) => {
        genre.movies = this.movies.filter((movie) => movie.genres.some((g) => g.id === genre.id));
      });

      //console.log(this.genres);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  },
  methods: {
    viewMovie(id) {
      this.$router.push(`/movies/${id}`);
    },
    scrollLeft(index) {
      const list = this.$refs[`moviesList${index}`][0]; 
      if (list) {
        list.scrollBy({
          left: -300,
          behavior: "smooth", // smooth scrolling doesn't seem to work
        });
      }
    },
    scrollRight(index) {
      const list = this.$refs[`moviesList${index}`][0];
      if (list) {
        list.scrollBy({
          left: 300,
          behavior: "smooth", 
        });
      }
    },
    hoverMovie(id) {
      this.hoveredMovie = id;
    },
  },
};
</script>

<style scoped>
.home {
  width: 100%;
  margin: 0 auto;
  color: white;
}

.genres-section {
  margin: 5rem 20%;
}

.genre-row {
  margin-bottom: 30px;
}

.genre-title {
  font-size: 1.8rem;
  margin-bottom: 10px;
  margin-left: 20px;
  color: #f90;
}

.genre-movies-container {
  position: relative;
  display: flex;
  align-items: center;
}

.movies-list {
  display: flex;
  overflow-x: auto;
  gap: 2rem;
  padding: 50px;
  scrollbar-width: none; /* Hides scrollbar in Firefox */
  scroll-behavior: smooth;
  transition: transform 2s ease-in-out; /* doesn't work with buttons */
}

.movies-list::-webkit-scrollbar {
  display: none; /* Hides scrollbar in Chrome/Safari */
}

.movie-card {
  width: 300px;
  flex-shrink: 0;
  text-align: center;
  cursor: pointer;
  border-radius: 5%;
  transition: transform 0.2s ease;
  transition: opacity 0.3s ease-in;
  opacity: 1;
}

.movie-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 0px 2rem rgba(255, 150, 0, 0.7);
}

.movie-card.darken {
  transition: opacity 0.3s ease-out;
  opacity: 0.2;
}

.movie-card img {
  width: 100%;
  border-radius: 10px;
}

.scroll-button {
  background-color: rgba(0, 0, 0, 0.6);
  color: #f90;
  border: none;
  padding: 10px;
  cursor: pointer;
  display: flex;
  position: absolute;
  z-index: 2;
  font-size: 2rem;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  top: 50%;
  transform: translateY(-50%);
}

.scroll-button.prev {
  left: 10px;
}

.scroll-button.next {
  right: 10px;
}

.genre-movies-container:hover .scroll-button {
  transition: opacity 0.3s ease-in;
  opacity: 1;
}

.scroll-button {
  transition: opacity 0.3s ease-out;
  opacity: 0;
}
.see-more-container {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end; /* Align to the right */
  padding-right: 20px; /* Add spacing from the right */
}

.all-movies-button {
  background-color: transparent; /* No background */
  color: orange; /* Text in blue */
  border: 2px solid orange; /* Blue border */
  padding: 5px 10px; /* Smaller padding */
  font-size: 0.9rem; /* Smaller font size */
  text-decoration: none;
  border-radius: 5px; /* Slightly rounded corners */
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  cursor: pointer;
}

.all-movies-button:hover {
  background-color: orange; /* Orange background on hover */
  color: white; /* White text on hover */
  border-color: orange; /* Match border to background */
}

</style>
