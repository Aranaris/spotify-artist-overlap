# Project Overview

This project is intended to enable a user to login to their spotify account and identify additional artist recommendations based on spotify's analysis on related artists. 

Current spotify app features only show related artists for single artists, but I figured it'd be more interesting/useful to be able to input multiple artists that a user likes and see if those artists have overlapping related artists to provide a better success rate for discovering different artists.

This is a fairly simple algorithm, and based on a cursory review of the api documentation should be doable with the available endpoints. Spotify does not provide additional insight as to how the related artists are determined, so expansion of this application will be limited to what data I am able to retrieve.

## Programming Goals

As this project is to further my development learning, I will outline specific focuses/features that I would like to implement:

### Tools
- Next.js
- MongoDB
- 3rd Party APIs (Spotify)

### Authorization
- Social Single Sign-on (Spotify Login)
- Authorization Code flow with JWT
- Client Credentials


## Project Setup

This involves interactions with multiple 3rd party clients, so env variables and configurations in those applications will be needed in order to effectively run this:

### Spotify
- Go through [Spotify's Documentation](https://developer.spotify.com/documentation/web-api) to setup an app
- .env variables for Client ID and Client Secret

### MongoDB
- the mongoDB connection requires a URL with your credentials

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
