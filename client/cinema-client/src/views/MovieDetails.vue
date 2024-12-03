<template>
  <div class="movie-details">
    <div 
      class="backdrop" 
      v-if="this.movie.backdropPath !== undefined"
      :style="{ backgroundImage: `url(https://image.tmdb.org/t/p/original${this.movie.backdropPath})` }">
    </div>
    <div class="content">
      <img :src="`https://image.tmdb.org/t/p/w500${this.movie.posterPath}`" :alt="this.movie.title" />
      <div class="details">
        <h2>{{ this.movie.title }}</h2>
        <p class="tagline">{{ this.movie.tagline }}</p>
        <p><strong>Release Date:</strong> {{ this.movie.releaseDate }}</p>
        <p>
          <strong>Runtime:</strong> 
          {{ Math.floor(this.movie.runtime / 60) }}h {{ this.movie.runtime % 60 }}m
        </p>
        <p><strong>Genres: </strong> 
          <span v-for="(genre, index) in this.movie.genres" :key="index">
            {{ genre.name }}<span v-if="index < movie.genres.length - 1">, </span>
          </span>
        </p>
        <p><strong>Rating: </strong>
            <span class="rating" v-if="this.movie.rating !== undefined">⭐ {{ this.movie.rating.toFixed(1) }}</span>
        </p>
        <!--<p>{{ this.movie.synopsis }}</p>-->

        <button @click="showTrailer()" class="trailer-button">Watch Trailer</button>
      </div>
    </div>
    
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <button @click="closeModal()" class="close-button">X</button>
        <div class="responsive-iframe">
          <iframe 
            :src="`https://www.youtube.com/embed/${this.movie.trailerKey}?autoplay=1`" 
            frameborder="0"
            allowfullscreen>
          </iframe>
        </div>
      </div>
    </div>
    <Sessions class="sessions-content" v-if="movie._id" :movieId="movie._id" />
  </div>
</template>

<script>
import axios from 'axios';
import Sessions from '@/components/Sessions.vue';

export default {
  components: {
    Sessions,
  },
  props: ['id'],
  data() {
    return {
      movie: {},
      showModal: false,
    };
  },
  async created() {
    try {
      const response = await axios.get(`http://localhost:3000/api/movies/${this.id}`);
      this.movie = response.data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  },
  methods: {
    
    showTrailer() {
      this.showModal = true;
      /*console.log(`https://www.youtube.com/embed/${this.movie.trailerKey}`);*/
    },
    closeModal() {
      this.showModal = false;
    },
  },
};
</script>

<style scoped>


.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-attachment: fixed;
  filter: blur(5px) brightness(60%);
  z-index: -1;
}

.content {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  width: 40%;
  margin: auto;
  margin-top: 5%;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 20px;
}

.content img {
  width: 50%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.details {
  flex: 1;
}

.details h2 {
  font-size: 2rem;
  margin: 1.5rem 0 3rem 0;
}

.details .tagline {
  font-size: 1.2rem;
  font-style: italic;
  color: #ffa500;
  margin-bottom: 1.5rem;
}

.details p {
  font-size: 1rem;
  color: #ccc;
  margin-bottom: 1rem;
  justify-content: justify;
}

.rating {
  color: #f60;
  font-weight: bold;
}

.reserve-button,
.trailer-button {
  background-color: transparent;
  border: 2px solid #ffa500;
  color: #ffa500;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.reserve-button:hover,
.trailer-button:hover {
  background-color: #ffa500;
  color: #000;
  transform: scale(1.05);
}

.trailer-button::after {
  content: "🎥";
  display: inline-block;
  font-size: 1.2rem;
  transition: transform 0.3s ease-in-out;
}

.trailer-button:hover::after {
  transform: rotate(-360deg);
}

.sessions-content {
  margin: 3rem 20%;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.modal-content {
  background: #222;
  padding: 1rem;
  border-radius: 8px;
  width: 70%;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 2;
}

.close-button:hover {
  color: #ff4500;
}

/* Responsive Iframe */
.responsive-iframe {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
}

.responsive-iframe iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}
</style>
