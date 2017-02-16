const {displayDataMovies, insertMovie} = require('../dbMovies')
const chai = require('chai')
const expect = chai.expect

describe('when display all function is called', function () {
  it('should return array of objects', function (done) {
    displayDataMovies('Movie 1')
      .then((data) => {
        expect(data instanceof Array).to.eqls(true)
        done()
      })
  })
})

describe('when insert into database function is called', function () {
  it('should return id', function (done) {
    insertMovie('movie1','Jan-01-1995',['actor1','actor2','actor3'],'Paramount')
      .then((data) => {
        expect(typeof(data[0].id)).to.eqls('number')
        done()
      })
  })
})