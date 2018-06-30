# Youtube GraphQl

> A graphql wrapper around the youtube api v3.

This little project is a graphql endpoint to query youtube data with just what you need. See it live at https://youtube-graphql.now.sh/.

## Getting Started

First you need to have a youtube api key. See [there](https://developers.google.com/youtube/v3/getting-started) to get one.

Go to https://youtube-graphql.now.sh/ or see [Run localy](#run-localy) to get a working playgroung.

Each request need this api key. To provide this key just add an Authorization header with the Bearer scope.

With the playground it's easy, at the bottom click on the HTTP HEADERS text and write something like this:

```json
{
  "Authorizaton": "Bearer <your api key>"
}
```

Then you can write your request. Exemple:

```graphql
query SeePewdiPie {
  channel(username: "PewDiePie") {
    id
    title
    subscriberCount
  }
}
```

Thats it's ! To see what you can query explore the documentation by cliking on the schema button (located on the right of the screen).

## Run localy

> You will need [nodejs](https://nodejs.org) installed on your machine.

Clone this repository, run `npm install` or `yarn` to install dependencies.

Run `npm start` or `yarn start` to start the server.

Run `npm run dev` or `yarn dev` to start the in development mode.

## Other stuff

Everything is welcome, feel free to make PRs or Issues to fix typos (I know I made a lot), add feature, or everything else !

> I'm french so be kind with my english :'(
