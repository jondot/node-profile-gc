import foobanzle from '../index'

describe('foobanzle', () => {
  it('with functions', async () => {
    const res = await foobanzle([1,2,3])
    expect({res}).toMatchSnapshot()
  })
})
