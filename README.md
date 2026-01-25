# Movie recommendation  website using Sveltekit and SQLite

This website interacts with The Movie Database (TMDB) API, in order to keep track of a user's watched movies, and provide personalised recommendations.

I made this site because I am a huge enjoyer of movies, and often struggle to keep track of what films I've seen, and find new ones to watch.

## User accounts

In order to keep track of each user's watched movies, I implemented a login system using Lucia authentication, which allowed me to let user's create accounts, and then use those accounts to access their database of watched movies. For the database I used SQLite to create a database of users, including tables for watched movies.

## Movie recommendation 

## Backend

I'm hosting this site on github pages for free, so I needed to host the backend seperately. To do this I used Render to host my backup, and