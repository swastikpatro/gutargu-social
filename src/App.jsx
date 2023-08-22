import { SignupPage, ErrorPage, LoginPage } from './pages';
import { Loader, ProtectedRoute } from './components';
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const HomePage = lazy(() => import('./pages/HomePage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const BookmarkPage = lazy(() => import('./pages/BookmarkPage'));
const LikedPostsPage = lazy(() => import('./pages/LikedPostsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SinglePostPage = lazy(() => import('./pages/SinglePostPage'));
const SharedLayout = lazy(() => import('./pages/SharedLayout'));

const outletRoutes = [
  { path: '/', element: <HomePage /> },
  { path: 'explore', element: <ExplorePage /> },
  { path: 'bookmark', element: <BookmarkPage /> },
  { path: 'liked', element: <LikedPostsPage /> },
  { path: '/profile/:profileId', element: <ProfilePage /> },
  { path: '/post/:postId', element: <SinglePostPage /> },
];

const App = () => {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <SharedLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        {outletRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<Suspense fallback={<Loader />}>{element}</Suspense>}
          />
        ))}
      </Route>

      <Route path='/login' element={<LoginPage />} />

      <Route path='/signup' element={<SignupPage />} />

      <Route path='*' element={<ErrorPage />} />
    </Routes>
  );
};

export default App;
