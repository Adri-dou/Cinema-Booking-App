<template>
  <div class="search-bar">
    <input
      type="text"
      v-model="query"
      placeholder="Search for a movie..."
      class="search-input"
    />
    <ul class="search-results" v-if="filteredMovies.length">
      <li
        v-for="movie in filteredMovies"
        :key="movie._id"
        @click="selectMovie(movie)"
        class="search-result-item"
      >
        {{ movie.title }}
      </li>
    </ul>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      query: '', // User input
      movies: [], // All movies fetched from the server
      filteredMovies: [], // Movies matching the query
    };
  },
  async created() {
    try {
      // Fetch all movies when the component is created
      const response = await axios.get('http://localhost:3000/api/movies');
      this.movies = response.data || [];
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  },
  watch: {
    query(newQuery) {
      const trimmedQuery = newQuery.trim().toLowerCase();
      this.filteredMovies = trimmedQuery
        ? this.movies.filter((movie) =>
            movie.title.toLowerCase().includes(trimmedQuery)
          )
        : [];
    },
  },
  methods: {
    // Handle movie selection
    selectMovie(movie) {
      this.query = '';
      this.filteredMovies = []; // Close the dropdown
      this.$router.push(`/movies/${movie._id}`);
    },
  },
};
</script>

<style scoped>
.search-bar {
  max-width: 20rem;
  margin: 0 auto;
  z-index: 8;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  border: 1px solid #555;
  border-radius: 100px;
  background-color: #333; /* Dark gray background */
  color: white;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-input:focus {
  border-color: #f90; /* Highlight color */
  box-shadow: 0 0 8px rgba(249, 144, 0, 0.8); /* Glowing effect */
}

.search-results {
  position: absolute;
  top: calc(100% + 0.5rem);
  width: 100%;
  max-height: 300px;
  background-color: #222; /* Darker gray for dropdown */
  border: 1px solid #444;
  border-radius: 8px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  z-index: 10;
  animation: fadeIn 0.3s ease-in-out;
}

.search-results li {
  padding: 0.8rem 1rem;
  cursor: pointer;
  color: white;
  transition: background-color 0.3s ease;
}

.search-results li:hover {
  background-color: #f90; /* Highlight the hovered option */
  color: #222; /* Contrast text color */
}

.search-results li:active {
  background-color: #c97300; /* Slightly darker highlight */
}

.search-results::-webkit-scrollbar {
  width: 8px;
}

.search-results::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 4px;
}

.search-results::-webkit-scrollbar-thumb:hover {
  background: #f90;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
