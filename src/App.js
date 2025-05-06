// App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import ScrollToTop from './components/client/ScrollToTop';
import DefaultLayout from './components/client/DefaultLayout';
import { ToastProvider } from './components/client/common/Toast';
import PropertyForm from './components/client/PropertyForm';
import ManagementRedirect from './components/client/ManagementRedirect';
import AppAdmin from './AppAdmin';

const MainComponent = lazy(() => import('./components/client/MainComponent'));
const Login = lazy(() => import('./components/client/auth/Login'));
const Register = lazy(() => import('./components/client/auth/Register'));
const ForgotPassword = lazy(() => import('./components/client/auth/ForgotPassword'));
const Profile = lazy(() => import('./components/client/user/Profile'));
const PropertyDetail = lazy(() => import('./components/client/PropertyDetail'));
const PropertyList = lazy(() => import('./components/client/PropertyList.jsx'));
const PropertyEnter = lazy(() => import('./components/client/PropertyEnter.jsx'));
const FavoriteProperties = lazy(() => import('./components/client/property/FavoriteProperties'));
const ReportForm = lazy(() => import('./components/client/ReportForm.jsx'));
const PropertieReview = lazy(() => import('./components/client/PropertyReviews.jsx'));
const Agent = lazy(() => import('./components/client/Agent'));
const About = lazy(() => import('./components/client/About'));
const NotFound = lazy(() => import('./components/client/NotFound'));
const MarketStats = lazy(() => import('./components/client/market/MarketStats'));

const LoadingComponent = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
);

function App() {
    return (
        <ToastProvider position="top-right">
            <ScrollToTop />
            <div className="App">
                <Suspense fallback={<LoadingComponent />}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />

                        <Route path="/onwer/dang-tin" element={<DefaultLayout><PropertyForm /></DefaultLayout>} />

                        <Route path="/ho-so" element={<DefaultLayout><Profile /></DefaultLayout>} />
                        <Route path="/properties/:id" element={<DefaultLayout><PropertyDetail /></DefaultLayout>} />
                        <Route path="/property/:id" element={<DefaultLayout><PropertyDetail /></DefaultLayout>} />
                        <Route path="/properties" element={<DefaultLayout><PropertyList /></DefaultLayout>} />
                        <Route path="/properties-enter" element={<DefaultLayout><PropertyEnter /></DefaultLayout>} />
                        <Route path="/properties-review" element={<DefaultLayout><PropertieReview /></DefaultLayout>} />
                        <Route path="/property-list" element={<DefaultLayout><PropertyList /></DefaultLayout>} />
                        <Route path="/favorites" element={<DefaultLayout><FavoriteProperties /></DefaultLayout>} />
                        <Route path="/report" element={<DefaultLayout><ReportForm /></DefaultLayout>} />
                        <Route path="/property-agent" element={<DefaultLayout><Agent /></DefaultLayout>} />
                        <Route path="/about" element={<DefaultLayout><About /></DefaultLayout>} />
                        <Route path="/market-stats" element={<DefaultLayout><MarketStats /></DefaultLayout>} />
                        <Route path="/services" element={<DefaultLayout><NotFound /></DefaultLayout>} />
                        <Route path="/contact" element={<DefaultLayout><NotFound /></DefaultLayout>} />
                        <Route exact path="/" element={<DefaultLayout><MainComponent /></DefaultLayout>} />

                        <Route path="/management" element={<ManagementRedirect />} />
                        <Route path="/admin/*" element={<AppAdmin />} />
                        <Route path="*" element={<DefaultLayout><NotFound /></DefaultLayout>} />
                    </Routes>
                </Suspense>
            </div>
        </ToastProvider>
    );
}

export default App;
