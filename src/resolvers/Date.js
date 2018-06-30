const { GraphQLScalarType } = require('graphql')

// Scalar definiton
exports.Date = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'The `Date` scalar type represent an ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) formated date.',
    parseValue(value) {
      return value
    },
    serialize(value) {
      return value
    },
    // Don't know what to do here :'(
    parseLiteral() {
      return null
    },
  }),
}
