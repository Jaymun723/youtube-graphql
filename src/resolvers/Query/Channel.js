const { URL } = require('url')

const fetch = require('node-fetch')
const { UserInputError, AuthenticationError } = require('apollo-server')

const { getSelections, uniqueArray } = require('../../utils')

/*
 * A youtube request take a parameters named part.
 * For optimization the server query oly what he needs.
 * The contants named like '...Field' got the selections field's name for a part specific parameters
 */

const idField = ['id']
const snippetField = ['title', 'description', 'customUrl', 'publishedAt', 'thumbnails']
const statisticsField = ['viewCount', 'commentCount', 'subscriberCount', 'hiddenSubscriberCount', 'videoCount']
const topicDetailsField = ['topicCategories']
const statusField = ['privacyStatus']

// This functions returns the part paramaters
// Ex: got these fields id,title,description,subscriberCount
//     returns 'id,snippet,statistics'
const getPartRequest = (info, name) => {
  const selections = getSelections(info, name)
  const partList = selections.map((selection) => {
    if (snippetField.includes(selection)) {
      return 'snippet'
    } else if (statisticsField.includes(selection)) {
      return 'statistics'
    } else if (topicDetailsField.includes(selection)) {
      return 'topicDetails'
    } else if (idField.includes(selection)) {
      return 'id'
    } else if (statusField.includes(selection)) {
      return 'status'
    }
  })
  const part = uniqueArray(partList)
  return part.join(',')
}

const getApikey = (context) => {
  if (!context.req.headers.authorization) {
    throw new AuthenticationError('You must provide a youtube api key with this format `Bearer <API KEY>`.')
  }
  let key = context.req.headers.authorization.split(/\s+/g)
  if (key[0] !== 'Bearer') {
    throw new AuthenticationError('You must provide a youtube api key with this format `Bearer <API KEY>`.')
  }
  key.shift()
  if (key.length === 0) {
    throw new AuthenticationError('No youtube api key.')
  }
  return key[0]
}

exports.channel = async (parent, args, context, info) => {
  // If the two args are set (id and username) we use id
  const argsUsed = args.id ? 'id' : args.username ? 'username' : 'none'

  if (argsUsed === 'none') {
    throw new UserInputError('Neither id or username provided', {
      invalidArgs: ['id', 'username'],
    })
  }

  let key = getApikey(context)
  const part = getPartRequest(info, 'channel')

  // Url to build the request
  let reqUrl = new URL('https://www.googleapis.com/youtube/v3/channels')
  reqUrl.searchParams.append('key', key)
  reqUrl.searchParams.append('part', part)

  if (args.id) {
    reqUrl.searchParams.append('id', args.id)
  } else if (args.username) {
    reqUrl.searchParams.append('forUsername', args.username)
  }

  // Fetch the api
  const res = await fetch(reqUrl.toString())
  const data = await res.json()

  if (data.error && data.error.errors.length !== 0) {
    throw new AuthenticationError('There was a problem with the youtube api key.')
  }

  if (data.pageInfo.totalResults === 0) {
    throw new UserInputError(`Nothing was found for this ${argsUsed}.`, {
      invalidArgs: [argsUsed],
    })
  }

  let result = {}

  const item = data.items[0]

  if (part.match(/id/)) {
    result.id = item.id
  }
  if (part.match(/snippet/)) {
    let snippet = item.snippet
    result.title = snippet.title
    result.description = snippet.description
    result.customUrl = snippet.customUrl
    result.publishedAt = snippet.publishedAt
    result.thumbnails = []
    for (const name in snippet.thumbnails) {
      result.thumbnails.push({
        name,
        url: snippet.thumbnails[name].url,
        width: snippet.thumbnails[name].width,
        height: snippet.thumbnails[name].height,
      })
    }
  }
  if (part.match(/statistics/)) {
    let statistics = item.statistics
    result.viewCount = statistics.viewCount
    result.commentCount = statistics.commentCount
    result.subscriberCount = statistics.subscriberCount
    result.hiddenSubscriberCount = statistics.hiddenSubscriberCount
    result.videoCount = statistics.videoCount
  }
  if (part.match(/topicDetails/)) {
    result.topicCategories = item.topicDetails.topicCategories
  }
  if (part.match(/status/)) {
    result.privacyStatus = item.status.privacyStatus
  }

  return result
}
