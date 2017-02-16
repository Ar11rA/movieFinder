const axios = require('axios')
const movieData = []
const movies = []
const movieActorData = []
const movieProduction = []
const getMovie = (production) => axios.get(` https://movie-api-lyalzcwvbg.now.sh/${production}`)
const getActors = () => axios.get('https://movie-api-lyalzcwvbg.now.sh/actors')

Array.prototype.diff = function (a) {
  return this.filter(function (i) { return a.indexOf(i) < 0; });
}

getMovie('paramount')
  .then((response) => {
    const movieResponseArray1 = response.data
    movieResponseArray1.forEach((movie) => {
      movieData.push(movie)
      movieProduction[movie.movieName] = 'paramount'

    })
    return getMovie('dreamworks')
  })
  .then((response) => {
    const movieResponseArray2 = response.data
    movieResponseArray2.forEach((movie) => {
      movieData.push(movie)
      movieProduction[movie.movieName] = 'dreamworks'

    })
    //console.log(movieData)
    return getActors()
  })
  .then((response) => {
    const actorArray = response.data
    actorArray.forEach((actor) => {
      //console.log(actor.movies)
      const actMovies = actor.movies
      actMovies.forEach((movie) => {
        if (movies.includes(movie) === false)
          movies.push(movie)

      })
    })
    //console.log(movies)
    for (let iter = 0; iter < movies.length; iter++) {
      const temp = []
      // console.log('iter', iter)
      //console.log(movies[iter])
      actorArray.forEach((actor) => {
        //console.log(actor.movies)
        const actMovies = actor.movies
        // console.log(actMovies)
        actMovies.forEach((movie, index) => {
          //console.log(movie)
          if (movie === movies[iter]) {
            temp.push(actor.actorName)
          }
        })
      })
      //console.log(movieData)

      movieActorData.push(`${movies[iter]}:${temp}`)

    }
    //console.log(movieData)
    // console.log(movieActorData)
    //console.log(movieProduction)
    let names = ''
    let releasedates = ''
    let actors = []
    let studios = ''
    let actorMovies = []
    for (let iter = 0; iter < movieActorData.length; iter++) {
      const elementMovieActor = movieActorData[iter]
      let tempArray = elementMovieActor.split(':')
      actorMovies.push(tempArray[0])
    }
    let nameArray = []
    movieData.forEach((movie) => {
      names = movie.movieName
      nameArray.push(names)
    })
    let noActorMovies = nameArray.diff(actorMovies)

    movieData.forEach((movie) => {
      for (let iter = 0; iter < noActorMovies.length; iter++) {
        if (movie.movieName === (noActorMovies[iter])) {
          names = movie.movieName
          releasedates = movie.releaseDate
          studios = movieProduction[names]
          console.log('name', names)
          console.log('releasedates', releasedates)
          console.log('studios', studios)
        }
      }
    })

    movieData.forEach((movie) => {
      names = movie.movieName
      releasedates = movie.releaseDate
      studios = movieProduction[names]
      for (let iter = 0; iter < movieActorData.length; iter++) {
        const elementMovieActor = movieActorData[iter]
        if (elementMovieActor.includes(names)) {
          let tempArray = elementMovieActor.split(':')
          actors = tempArray[1].split(',')
          // console.log('name', names)
          // console.log('releasedates', releasedates)
          // console.log('studios', studios)
          // console.log('actors', actors)
        }
      }
    })
  })
  .catch((error) => {
    console.log(error)
  })

