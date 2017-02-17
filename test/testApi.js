const chai = require('chai')
const expect = chai.expect
describe('testing for insert into database operation', function () {
  const request = require('request')
  const options = {
    method: 'POST',
    url: 'http://localhost:4000/insertMovie',
    headers:
    {
      'postman-token': '542e52a9-6394-3328-3e56-074124cd264f',
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded'
    }
  }
  it('should return an empty object when all movies are inserted', function () {
    request(options, function (error, response, body) {
      if (error) throw new Error(error)
      expect(body).to.eqls('{}')
    })
  })
})
describe('testing for get operation when valid movie is given', function () {
  const resultString = '[{"moviename":"Movie 4","releasedate":"Jan-01-2015","actors":[""],"studio":"dreamworks"}]'
  const request = require('request')
  const options = {
    method: 'GET',
    url: 'http://localhost:4000/movie/Movie%204',
    headers:
    {
      'postman-token': 'c105af0d-a05a-9da3-c9ce-a07785193cd1',
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded'
    }
  }
  it('should return an string object with related movie information if valid input is given', function (done) {
    request(options, function (error, response, body) {
      if (error) throw new Error(error)
      expect(body).to.eqls(resultString)
      done()
    })
  })
})

describe('testing for get operation when movie that is given is not in database', function () {
  const request = require('request')
  const options = {
    method: 'GET',
    url: 'http://localhost:4000/movie/Movie%2089',
    headers:
    {
      'postman-token': 'af2a4e45-3ca7-fc12-eac2-fb1f34a20f1a',
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded'
    }
  }
  it('should return an empty object', function () {
    request(options, function (error, response, body) {
      if (error) throw new Error(error)
      expect(body).to.eqls('[]')
    })
  })
})
