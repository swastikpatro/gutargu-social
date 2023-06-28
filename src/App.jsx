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
