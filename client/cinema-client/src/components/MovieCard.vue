<template>
  <div class="movie-card" @click="viewMovie(movie._id)">
    <img :src="`https://image.tmdb.org/t/p/w300/${movie.posterPath}`" :alt="movie.title" />
    <div class="movie-info">
      <h3>{{ movie.title }}</h3>
      <!--<p>{{ movie.synopsis.slice(0, 100) }}...</p>-->
      <span class="rating">⭐ {{ movie.rating.toFixed(1) }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    movie: {
      type: Object,
      required: true
    }
  },
  methods: {
    viewMovie(id) {
      this.$router.push(`/movies/${id}`);
    },
  }
};
</script>
  
<style scoped>
.movie-card {
  cursor: pointer;
  background-color: rgba(20, 20, 20, 0.7);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.movie-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.movie-card img {
  width: 100%;
  height: auto;
}

.movie-info {
  padding: 1rem;
}

.movie-info h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.movie-info p {
  font-size: 0.9rem;
}

.rating {
  color: #f60;
  font-weight: bold;
}
</style>
