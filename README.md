# Authentication

## User Signup & Login

- How Authentication Works in React Apps
- Implementing User Authentication
- Adding Authentication Persistence & Auto-Logout

# Steps

## 0. Project Setup & Route Setup

1. run `cd backend/` & `npm install` & `npm start`
2. run `cd frontend/` & `npm install` & `npm start`
3. set a way to go to the `Authentication.js` page for a `/auth` route
   1. in `App.js`, add a new route definition for this `auth` route
   2. in `MainNavigation.js`, add an entry to the main navigation to navigate to the authentication page

## 1. Working with Query Parameters

1. leverage query parameters in `AuthForm.js`
   1. get rid of the state
   2. replace the button with a `<Link>` & add to it the `to` attribute set to `?mode` & a value based on the currently selected mode
   3. manage your `mode` with query parameters & access the currently set query parameter with the `useSearchParams` hook
2. update `MainNavigation.js` so that when we click `Authentication` we load this login form by default
