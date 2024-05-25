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

## 5. Adding User Logout

1.  in `MainNavigation.js`, add a new `logout` navigation link
2.  the button should trigger an `action` that deletes the token
    1. add a new `Logout.js` pages in the `pages` folder
    2. inside of it define an `action` that clears the `localStorage` & gets rid of the `token`
3.  in `App.js`, register a new `logout` route
4.  in `MainNavigation.js`, send a request to this route by submitting a `<Form>` that targets this route

## 6. Updating the UI Based on Auth Status

1. update the UI based on the existence of the `token`
   1. make the `token` easily available in your entire app (on all your routes basically)
   2. the information whether the `token` is available or not should be automatically updated so that the UI automatically updates
2. to do so, you could use the `useContext` hook
3. but, leverage React Router for doing that
   1. in `App.js`, in the root route, add a `loader` that takes a look at `localStorage` & extract the `token` from it
   2. React Router will reevaluate that, if we, for example, logout & update all the pages that use that `loader` data
   3. in `util/auth.js`, add the `tokenLoader` function & call `getAuthToken()` inside of it & return its result
   4. in order to use the data from that `tokenLoader` & easily get access to it, assign an `id` with a value of `root` to that route
   5. in `MainNavigation.js`, use the `useRouteLoaderData` hook to get the `token` by targetting the `root` id
   6. conditionally show that `Authentication` link if the `token` doesn't exist (so when the user is not logged in)
   7. show the `Logout` link only when the `token` (so when the user is logged in)
   8. in `EventsNavigation.js`, use the same approach as in `MainNavigation.js` & show the `New Event` link if there is a `token`
   9. in `EventItem.js`, do the same to conditionally show the `Edit` & `Delete` menu

## 7. Adding Route Protection

1. the user can still access a specific page that needs a token directly in the URL, like `/events/new`
2. in `App.js`, protect the `edit` & `new` routes so that there will not be accessible unless the user is logged in
   1. in `util/auth.js`, add a `checkAuthLoader` function that checks if there is a `token` & if not redirects the user away
   2. in `App.js`, use this `checkAuthLoader` to protect all these routes that need protection

## 8. Adding Automatic Logout

1. in `Root.js`, use `useEffect()` to set a timer whenever the `RootLayout` is rendered which happens when this application starts
2. use `useLoaderData()` to get the `token`
3. use this `token` as a dependency for `useEffect` so that this effect function runs whenever the `token` changes
4. set a timer that expires after 1 hour & that then triggers that logout action (basically sends a request to that `logout` route)
5. for that, use the `useSubmit()` hook to programmatically submit that `logout` form from `MainNavigation.js`

## 9. Managing the Token Expiration

1. in `Authentication.js`, where you store the token, store the expiration time with help of `Date()` et `setHours()`
2. in `util/auth.js`, update the `getAuthToken()` function to take a look at this `expiration` date & find out if the token expired with help of a new `getTokenDuration()` function
3. in `Root.js`, trigger the `logout` action, if the token duration expired
4. if the token is not expired, set the timeout duration at the remaining lifetime of the token
5. in `Logout.js`, remove the `expiration` from the `localStorage`
