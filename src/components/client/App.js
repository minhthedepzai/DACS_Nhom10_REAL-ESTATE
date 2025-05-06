import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import Spinner from './components/Spinner';
// import Navbar from './components/Navbar';

// import Header from './components/Header';
// import Search from './components/Search';
// import PropertyType from './components/PropertyType';
// import About from './components/About';
// import PropertyList from './components/PropertyList.jsx';
// import CallToAction from './components/CallToAction';
// import Team from './components/Team';
// import Testimonial from './components/Testimonial';
// import Footer from './components/Footer';
// import BackToTop from './components/BackToTop';
// import Contact from './components/Contact';
// import PropertyDetail from './components/property/PropertyDetail';
// import FavoriteProperties from './components/property/FavoriteProperties';
// import Profile from './components/user/Profile';
// import NotFound from './components/NotFound';
// import MarketStats from './components/market/MarketStats';

import Spinner from '../../components/client/Spinner';
import Navbar from '../../components/client/Navbar';
import Header from '../../components/client/Header';
import Search from '../../components/client/Search';
import PropertyType from '../../components/client/PropertyType';
import About from '../../components/client/About';
import PropertyList from '../../components/client/PropertyList';
import CallToAction from '../../components/client/CallToAction';
import Team from '../../components/client/Team';
import Testimonial from '../../components/client/Testimonial';
import Footer from '../../components/client/Footer';
import BackToTop from '../../components/client/BackToTop';
import Contact from '../../components/client/Contact';
import PropertyDetail from '../../components/client/property/PropertyDetail';
import FavoriteProperties from '../../components/client/property/FavoriteProperties';
import Profile from '../../components/client/user/Profile';
import NotFound from '../../components/client/NotFound';
import MarketStats from '../../components/client/market/MarketStats';

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
          <Route path="/ho-so" component={Profile} />
          <Route path="/market-stats" component={MarketStats} />
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