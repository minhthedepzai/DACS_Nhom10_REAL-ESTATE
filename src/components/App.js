import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Spinner from './components/Spinner';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Search from './components/Search';
import PropertyType from './components/PropertyType';
import About from './components/About';
import PropertyList from './components/PropertyList';
import CallToAction from './components/CallToAction';
import Team from './components/Team';
import Testimonial from './components/Testimonial';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import Contact from './components/Contact';
import PropertyDetail from './components/property/PropertyDetail';
import FavoriteProperties from './components/property/FavoriteProperties';
import Profile from './components/user/Profile';
import NotFound from './components/NotFound';

// CSS import
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mô phỏng loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="container-xxl bg-white p-0">
        {/* Hiển thị spinner khi loading */}
        {loading && <Spinner />}

        {/* Navbar - Hiển thị trên tất cả các trang */}
        <Navbar />

        <Switch>
          {/* Trang chủ */}
          <Route exact path="/">
            <Header />
            <Search />
            <PropertyType />
            <About />
            <PropertyList />
            <CallToAction />
            <Team />
            <Testimonial />
          </Route>

          {/* Các trang khác */}
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/property/:id" component={PropertyDetail} />
          <Route path="/favorites" component={FavoriteProperties} />
          <Route path="/profile" component={Profile} />
          <Route path="*" component={NotFound} />
        </Switch>

        {/* Footer */}
        <Footer />
        
        {/* Back to Top */}
        <BackToTop />
      </div>
    </Router>
  );
}

export default App;