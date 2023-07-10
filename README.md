
# Gutargu - The Social Media App

### A Soical Media app built using React Js, 'Redux toolkit Query' and Chakra UI

  <hr />

</div>

## **How to install and run locally ?**

```
$ git clone https://github.com/swastikpatro/gutargu-social.git
$ cd gutargu/
$ npm install
$ npm run dev
```

## **Live Link :**

[Gutargu-social](https://gutargu-social.vercel.app/)

## **DEMO**

<a href="https://share.vidyard.com/watch/M15gp4CMetZtEbymH5WGca?">
    <p>Gutargu Social</p>
</a>

## **Features -**

- Polling of all posts and all users (after every 12 seconds)

- Home
  - Feed Posts
  - Sort By Date or Trending

- Explore & Trending Posts
- Search Users (debounced)

- Add, Update Post (with images, emoji and gifs (debounced search for gifs))
- Delete Post (Confirmation Modal for delete post)

- Add Comment
- Update Comment (Only one comment can be editted at a time)
- Delete Comment (Update and Delete comment feature are optimistic (no refetching of updated data, manipulation of cache))

- Add, delete bookmark (debounced and optimistic and very performant)

- User Profile Update (with images and avatars)
- Follow / Unfollow user
- Like/ Unlike

- Fully Responsive
- Copy To Clipboard
- Caching all the data from 'get' requests (using redux toolkit query)

- Verification with Razorpay Payment
  - User can write a post or comment with 480 characters (for normal users it is 240 characters)

Authentication:
  - User Signup
  - User Login
  - User Logout



## **Built with -**

- React JS
- Redux toolkit query
- React Router v6
- [Bilal's](https://twitter.com/bilalmansuri2e?t=kG_47DvdFBg7HVx6Bo75aQ&s=09) backend for social media app [link to backend](https://github.com/swastikpatro/Social-Media-App-Backend)
- Chakra UI
- Razorpay payment gateway
