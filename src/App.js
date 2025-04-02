import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

// Sử dụng React.lazy để tải các component theo nhu cầu
const MainComponent = lazy(() => import('./components/MainComponent'));
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const ForgotPassword = lazy(() => import('./components/auth/ForgotPassword'));
const Profile = lazy(() => import('./components/user/Profile'));
const PropertyDetail = lazy(() => import('./components/property/PropertyDetail'));
const FavoriteProperties = lazy(() => import('./components/property/FavoriteProperties'));
const Agent = lazy(() => import('./components/Agent'));
const About = lazy(() => import('./components/About'));

// Component loading để hiển thị trong quá trình tải
const LoadingComponent = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Suspense fallback={<LoadingComponent />}>
          <Switch>
            <Route path="/login" component={Login} exact />
            <Route path="/register" component={Register} exact />
            <Route path="/forgot-password" component={ForgotPassword} exact />
            <Route path="/profile" component={Profile} exact />
            <Route path="/property/:id" component={PropertyDetail} exact />
            <Route path="/favorites" component={FavoriteProperties} exact />
            <Route path="/property-agent" component={Agent} exact />
            <Route path="/about" component={About} exact />
            <Route path="/" component={MainComponent} />
          </Switch>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
