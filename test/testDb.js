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

describe('when insert into database is performed with valid parameters', function () {
  it('should return id when valid data is input', function (done) {
    insertMovie('movie1', 'Jan-01-1995', ['actor1', 'actor2', 'actor3'], 'Paramount')
      .then((data) => {
        expect(typeof (data[0].id)).to.eqls('number')
        done()
      })
  })
  it('should return id when no actor data is input', function (done) {
    insertMovie('movie1', 'Jan-01-1995', '', 'Paramount')
      .then((data) => {
        expect(typeof (data[0].id)).to.eqls('number')
        done()
      })
  })
})

describe('when insert into database is performed with invalid parameters', function () {
  it('should return error object when invalid data type like arrays is input', function (done) {
    insertMovie('movie1', 'asd', ['actor1', 'actor2', 'actor3'], [])
      .catch((data) => {
        expect(typeof (data)).to.eqls('object')
        done()
      })
  })
  // it('should return error object when invalid data type like objects is input', function (done) {
  //   insertMovie('movie1', 'asd', ['actor1', 'actor2', 'actor3'])
  //     .catch((data) => {
  //       expect(typeof (data)).to.eqls('object')
  //       done()
  //     })
  // })

})