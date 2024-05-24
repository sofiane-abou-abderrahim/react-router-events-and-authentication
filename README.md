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

## 2. Implementing the Auth Action

1. enable user creation with an `action`
   1. in `Authentication.js`, add an `action` that is triggered when the `Form` in `AuthForm.js` is submitted
   2. get the data from the form with `formData`
   3. send different requests based on the `mode` this form is in with help of `searchParams`
   4. send the request to the backend
   5. handle the response
2. in `App.js`, add this action to the route definitions

## 3. Validating User Input & Outputting Validation Errors

1. in `AuthForm.js`, get the `action` data with the `useActionData` hook
2. your `action` function must return something and not only a `redirect`
3. in our case it returns a `response` in case of 422 or 401 errors in `Authentication.js`
4. output that information to the user in `AuthForm.js`
5. add an indicator that the form was submitted successfully & that we're waiting for the response with the `useNavigation` hook

## 4. Attaching Auth Tokens to Outgoing Requests

1. The login feature already works because the `action` we created in `Authentication.js` send a request based on the selected mode
2. in `Authentication.js`, attach the token we're getting back from the backend to requests to protect resources because now if you try to delete an event, you get an 401 unauthorized error
   1. extract from the backend
   2. store that token in `localStorage` after signing up or loging in
   3. in a new `util` folder, add a new `auth.js` file where you add a helper `getAuthToken` function to get that stored `token` when needed
   4. use that `getAuthToken` function in `EventDetail.js` for deleting events & in `EventForm.js` for adding and editing events
