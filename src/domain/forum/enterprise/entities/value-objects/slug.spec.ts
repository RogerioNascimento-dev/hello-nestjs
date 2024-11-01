import { Slug } from './slug'

describe('Slug', () => {
  it('should be able create a slug from text', () => {
    const slug = Slug.createFromText(`it's An Example Title`)
    expect(slug.value).toEqual('its-an-example-title')
  })
})
