const axios = require('axios')
const movieActorData = []
const movies = []
const getActors = () => axios.get('https://movie-api-lyalzcwvbg.now.sh/actors')

getActors()
  .then((response) => {
    const actorArray = response.data
    actorArray.forEach((actor) => {
      const actMovies = actor.movies
      actMovies.forEach((movie) => {
        if (movies.includes(movie) === false)
          movies.push(movie)
      })
    })
    console.log(movies)
    for (let iter = 0; iter < movies.length; iter++) {
      const temp = []
      console.log('iter', iter)
      console.log(movies[iter])
      actorArray.forEach((actor) => {
        const actMovies = actor.movies
        actMovies.forEach((movie, index) => {
          if (movie === movies[iter]) {
            temp.push(actor.actorName)
          }
        })
      })
      console.log(temp)
    }
  })
  .catch((error) => {
    console.log(error)
  })

