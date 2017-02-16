const dbName = process.env.DEV_MODE === 'test' ? 'testdb' : 'moviedb'
const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://aritraaritra:@localhost:5432/' + dbName)
function displayDataMovies(name) {
  const query = 'select moviename,releasedate,actors,studio from movies where moviename=:name'
  const displayDb = sequelize.query(query, { replacements: { name: name } })
  return displayDb
}
function insertMovie(name, release, actors, studio) {
  const query = 'insert into movies(moviename,releasedate,actors,studio) values (:name,:release,ARRAY[:actors],:studio) returning id'
  return sequelize.query(query, { replacements: { name: name, release: release, actors: actors, studio: studio } })
}
module.exports = {displayDataMovies, insertMovie}
