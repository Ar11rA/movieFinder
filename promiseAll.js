const axios = require('axios')
const bodyParser = require('body-parser')
const express = require('express')
const {displayDataMovies, insertMovie} = require('./dbMovies')
const getActors = () => axios.get('https://movie-api-lyalzcwvbg.now.sh/actors')
const getMovie = (studio) => axios.get(`https://movie-api-lyalzcwvbg.now.sh/${studio}`)
Array.prototype.diff = function (a) {
  return this.filter(function (i) { return a.indexOf(i) < 0 })
}
const arrayFunctions = [getMovie('paramount'), getMovie('dreamworks'), getActors()]
const app = express()
app.use(bodyParser.urlencoded({
  extended: false
}))
app.get('/movie/:movieName', (req, res) => {
  const name = req.params.movieName
  const displayGivenMovie = displayDataMovies(name)
  displayGivenMovie.then((data) => {
    res.send(data[0])
  })
    .catch(() => {
      res.sendStatus(500)
    })
})
app.post('/insertMovie', (req, response) => {
  const movieData = []
  const movies = []
  const movieActorData = []
  const movieProduction = []
  Promise.all(arrayFunctions).then((response) => {
    const movieResponseArray1 = response[0].data
    movieResponseArray1.forEach((movie) => {
      movieData.push(movie)
      movieProduction[movie.movieName] = 'paramount'
    })
    const movieResponseArray2 = response[1].data
    movieResponseArray2.forEach((movie) => {
      movieData.push(movie)
      movieProduction[movie.movieName] = 'dreamworks'
    })
    const actorArray = response[2].data
    actorArray.forEach((actor) => {
      const actMovies = actor.movies
      actMovies.forEach((movie) => {
        if (movies.includes(movie) === false)
          movies.push(movie)
      })
    })
    for (let iter = 0; iter < movies.length; iter++) {
      const temp = []
      actorArray.forEach((actor) => {
        const actMovies = actor.movies
        actMovies.forEach((movie) => {
          if (movie === movies[iter]) {
            temp.push(actor.actorName)
          }
        })
      })
      movieActorData.push(`${movies[iter]}:${temp}`)
    }
    let names = ''
    let releasedates = ''
    let actors = []
    let studios = ''
    let flag = false
    movieData.forEach((movie) => {
      names = movie.movieName
      releasedates = movie.releaseDate
      studios = movieProduction[names]
      for (let iter = 0; iter < movieActorData.length; iter++) {
        const elementMovieActor = movieActorData[iter]
        if (elementMovieActor.includes(names)) {
          let tempArray = elementMovieActor.split(':')
          actors = tempArray[1].split(',')
          const insMovie = insertMovie(names, releasedates, actors, studios)
          insMovie.then(() => {
            flag = true
          })
            .catch(() => {
              flag = false
            })
        }
      }
    })
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
          const insMovie = insertMovie(names, releasedates, '', studios)
          insMovie.then(() => {
            flag = true
          })
            .catch(() => {
              flag = false
            })
        }
      }
    })
  })
    .catch(() => {
      response.send('Problems')
    })

  response.send('Successfully inserted movie data')

})
app.listen(5000)