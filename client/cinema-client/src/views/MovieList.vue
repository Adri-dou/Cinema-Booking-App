<template>
  <div class="movie-list">

    <h1>🎥 Now Showing 🎥</h1>
    <div class="genre-filter">
      <label for="genre-select">Filter by Genre:</label>
      <select id="genre-select" v-model="selectedGenre" @change="filterMovies">
        <option value="">All</option>
        <option v-for="genre in allGenres" :key="genre" :value="genre">{{ genre }}</option>
      </select>
    </div>
    
    <div class="movie-grid">
      <MovieCard 
        class="movie-card" v-for="movie in filteredMovies" 
        :movie="movie"
        @mouseover="hoverMovie(movie._id)"
        @mouseleave="hoverMovie(null)"
        :class="{ 'darken': hoveredMovie && hoveredMovie !== movie._id }"/>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import MovieCard from '@/components/MovieCard.vue';

export default {
  data() {
    return {
      movies: [],
      filteredMovies: [],
      allGenres: [],
      selectedGenre: '',
      hoveredMovie: null,
    };
  },
  async created() {
    try {
      const response = await axios.get('http://localhost:3000/api/movies');
      this.movies = response.data;
      this.filteredMovies = this.movies;
      
      // Extract unique genres from movies
      const genreSet = new Set();
      this.movies.forEach(movie => {
        movie.genres.forEach(genre => genreSet.add(genre.name));
      });
      this.allGenres = Array.from(genreSet);
      
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  },
  components: {
    MovieCard,
  },
  methods: {
    filterMovies() {
      if (this.selectedGenre === '') {
        this.filteredMovies = this.movies;
      } else {
        this.filteredMovies = this.movies.filter((movie) => movie.genres.some((g) => g.name === this.selectedGenre));
      }
    },
    hoverMovie(movieId) {
      this.hoveredMovie = movieId;
    },
  },
};
</script>

<style scoped>
.movie-list {
  margin: 5%;
  text-align: center;

}

h1 {
  margin-bottom: 3rem;
  color: #f90;
}

.genre-filter {
  margin: 3rem 0;
}

.genre-filter label {
  margin-right: 0.5rem;
}

.genre-filter select {
  color: white;
  background-color: #222;
  border: 1px solid #333;
  border-radius: 0.25rem;
  padding: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin: 1rem 10%;
}

.movie-card {
  width: 300px;
  transition: opacity 0.3s ease-in;
  opacity: 1;
}

.movie-card:hover {
  box-shadow: 0 0 3rem rgba(255, 150, 0, 0.7);
}

.movie-card.darken {
  transition: opacity 0.3s ease-out;
  opacity: 0.5;
}
</style>
  