const listHelper = require('../utils/list_helper')
test('dummy returns one', () => {
  const blogs = [2, 4, 6, 8]
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
} )
