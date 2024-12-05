const Session = require('./models/Session');
const Movie = require('./models/Movie');

const scheduleSessions = async () => {
  try {
    const movies = await Movie.find();
    if (movies.length === 0) {
      console.log('No movies available for scheduling.');
      return;
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14);

    for (let day = 0; day < 14; day++) {
      const date = new Date();
      date.setDate(startDate.getDate() + day);

      for (let room = 1; room <= 10; room++) {
        let availableTime = new Date(date.setHours(9, 0, 0, 0)); // Start scheduling at 9 AM
        const endTime = new Date(date.setHours(23, 0, 0, 0)); // Last session ends at 11 PM

        while (availableTime < endTime) {
          const randomMovie = movies[Math.floor(Math.random() * movies.length)];
          const sessionEnd = new Date(
            availableTime.getTime() + randomMovie.runtime * 60000
          );

          // Adjust sessionEnd to round up to the nearest 15 minutes
          const nextAvailableTime = new Date(sessionEnd);
          nextAvailableTime.setMinutes(
            Math.ceil(nextAvailableTime.getMinutes() / 15) * 15,
            0,
            0
          );

          if (nextAvailableTime > endTime) break;

          const overlappingSession = await Session.findOne({
            room,
            $or: [
              { dateTime: { $lt: nextAvailableTime, $gte: availableTime } },
              { endTime: { $gt: availableTime, $lte: nextAvailableTime } },
            ],
          });

          if (!overlappingSession) {
            await Session.create({
              room,
              movie: randomMovie._id,
              dateTime: availableTime,
              endTime: sessionEnd, 
            });
          }

          availableTime = nextAvailableTime;
        }
      }
    }
  } catch (err) {
    console.error('Error scheduling sessions:', err.message);
  }
};

const removeExpiredSessions = async () => {
  try {
    const result = await Session.deleteMany({ dateTime: { $lt: new Date() } });
    console.log(`${result.deletedCount} expired sessions deleted.`);
  } catch (err) {
    console.error('Error removing expired sessions:', err.message);
  }
};

module.exports = { scheduleSessions, removeExpiredSessions };
