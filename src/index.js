const { ApolloServer } = require('apollo-server')

const { typeDefs } = require('./typeDefs')
const resolvers = require('./resolvers')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Get the request object in the context (ex: ctx.req)
  context: (ctx) => ({ req: ctx.req }),
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
