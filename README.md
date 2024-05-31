# Northcoders News API

## Background
NC-News is a news sharing platform, where users can comment and vote on the news that means the most to them.

This repo is the backend of the service. The API, and a list of available endpoints, is available at https://nc-news-w53u.onrender.com/api

## Pre-requisites
You need at least following module versions for this project:
- Node: v22.0.0
- Node-postgres: v8.7.3

## Getting started
### Running locally
You can clone this repo using the following command:
```
https://github.com/liampjh34/be-nc-news.git
```

Install all dependencies, including dev dependencies, using the following command:
```
npm install
```

### Set up your databases
Set up the test and development databases by running the following command:
```
npm run setup-dbs
```

### Seeding the database
The test files seed the test database before each test.

To seed the dev database, you need to run the following query:
```
npm run seed
```

### Hidden files
This repo has the following files in the .gitignore:
- .env.test
- .env.development

These files declare the environment variables for the test and dev databases. You will need to create your own PG_DATABASE variables to run this project.

### Running tests
Run your tests locally with the following command:
```
npm test
```

--- 
Happy coding! 😊

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
