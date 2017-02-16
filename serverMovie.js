const axios = require('axios')
const movieData = []
const movies = []
const movieActorData = []
const movieProduction = []
Array.prototype.diff = function (a) {
  return this.filter(function (i) { return a.indexOf(i) < 0; });
}
const getMovie = (production) => axios.get(` https://movie-api-lyalzcwvbg.now.sh/${production}`)
const getActors = () => axios.get('https://movie-api-lyalzcwvbg.now.sh/actors')
const express = require('express')
const app = express()
const {displayDataMovies, insertMovie} = require('./dbMovies')
const bodyParser = require('body-parser')
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
      return getActors()
    })
    .then((response) => {
      const actorArray = response.data
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
          actMovies.forEach((movie, index) => {
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
      if (flag) { response.send('Successfully inserted movie data') }
      else
      { response.sendStatus(500) }
    })
    .catch((err) => {
      response.send(err)
    })
})
app.listen(4000)
