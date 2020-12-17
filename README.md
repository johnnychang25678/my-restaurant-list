# Restaurant List
A simple CRUD web application build with `node.js`. 
- web server: `express`
- view engine: `handlebars`
- database: `mongodb` with `mongoose` as ODM


## Features
- Create: User is able to create new restaurant to the list.
- Read: User is able to click on the picture to see restaurant information.
- Update: User is able to edit restaurant information.
- Delete: User is able to delete restaurant from the list.
- Search: User is able to search with restaurant name or restaurant category.

![image](https://github.com/johnnychang25678/my-restaurant-list/blob/master/screencapture-localhost-3000-2020-12-17-21_32_36.png)

## Quick Start
1. Install server depenencies
```
npm install
```
2. Write seed data to database
```
npm run seed
```
3. Run server with nodemon
```
npm run dev
```
4. Browse with browser
```
http://localhost:3000
```