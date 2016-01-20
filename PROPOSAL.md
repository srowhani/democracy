## Background

The motivation of this project is to analyze tweets using the Twitter Stream API, filter tweets based off of a given track, being the hashtags used to promote political campaigns of runner up candidates to the United States 2016 elections.

There will be two tables maintained based off of the input stream. `tweets` and `users` are stored in `data/democracy.db`.

Links to the schema of the data received.

https://dev.twitter.com/streaming/overview/request-parameters

https://dev.twitter.com/overview/api/tweets
https://dev.twitter.com/overview/api/users

Most fields however are irrelevant, and therefore will be ignored.

```sql
  sqlite> .schema
  CREATE TABLE tweets( id INTEGER PRIMARY KEY, text TEXT, user_id INTEGER);
  CREATE TABLE users( id INTEGER PRIMARY KEY, screen_name TEXT, profile_image TEXT, location TEXT);
```

This collected data will be used to tally the opinionated tweets about either party. These filtered tweets will be tallied and used to create a topographical visualization of voters in the United States.

I'll begin by breaking down the technologies.

1. Express
  - Will host server, and allow for socket communication (socketio) from server to client to send voter data.
2. Ember
  - Host a single page web app. Not too much use in current state, but allows for modular expansion.
3. d3
  - Used for svg based visualizations. Using a `.json` representation of the United States, and `topojson` library to interpret the object notation.
4. sqlite3
  - Store collected tweets, and users.

The query used to read from the database and provide coherent data is something along the following lines:

`SELECT * FROM tweets join users WHERE tweets.user_id = users.id;`

## Requirement

This project allows for a collection of data that can provide empirical evidence into any topic of interest. The program is designed in a modular way to allow for that. However, my implementation will focus on the elections to provide a distinct example of its usage.

## Due Diligence

Refer to the [following](https://twitter.com/privacy?lang=en).

## Sample Documents

Check out the rest of the repo. I provide instructions into getting started, and what you should expect to see.

[democracy/github](http://github.com/srowhani/democracy).
