const { gql } = require('apollo-server')

exports.typeDefs = gql`
  scalar Date

  type Channel {
    id: ID!

    # Snippet
    title: String!
    description: String!
    customUrl: String!
    publishedAt: Date!
    thumbnails: [Thumbnails!]!

    # Statistics
    viewCount: Float!
    commentCount: Float!
    subscriberCount: Float!
    hiddenSubscriberCount: Boolean!
    videoCount: Float!

    # Topic Details
    topicCategories: [String]!

    # Branding Settings
    # keywords: String!

    # Status
    privacyStatus: String!
  }

  type Thumbnails {
    name: String!
    url: String!
    width: Int!
    height: Int!
  }

  type Query {
    channel(id: String, username: String): Channel!
  }
`
