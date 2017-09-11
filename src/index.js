import _ from 'lodash'

const foobar = async () => {
  return Promise.resolve('whoo')
}

const foobanzle = async array => {
  const res = await foobar()
  return `${res} : ${_.head(array)}`
}

export default foobanzle
