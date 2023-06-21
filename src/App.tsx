import { Routes, Route } from 'react-router-dom';
import {
  BookmarkPage,
  ErrorPage,
  ExplorePage,
  HomePage,
  LikedPostsPage,
  LoginPage,
  ProfilePage,
  SharedLayout,
  SignupPage,
  SinglePostPage,
} from './pages';
import { ProtectedRoute } from './components';
import jwt_decode from 'jwt-decode';
const { email, _id } = jwt_decode(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndpbEBnbWFpbC5jb20iLCJfaWQiOiI2NDkxOWIxNTc4YWFkOTk4OTI1OGYxOGEiLCJpYXQiOjE2ODczMzIwMDcsImV4cCI6MTY4NzU5MTIwN30.p8cIgAj6DU1mbZv7bsWavaiL5JrtoCwBFUK6d_MvaUg'
);

console.log({ email, _id });

const App = () => {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <SharedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />

        <Route path='explore' element={<ExplorePage />} />

        <Route path='bookmark' element={<BookmarkPage />} />

        <Route path='liked' element={<LikedPostsPage />} />

        <Route path='/profile/:profileId' element={<ProfilePage />} />

        <Route path='/post/:postId' element={<SinglePostPage />} />
      </Route>

      <Route path='/login' element={<LoginPage />} />

      <Route path='/signup' element={<SignupPage />} />

      <Route path='*' element={<ErrorPage />} />
    </Routes>
  );
};

export default App;
