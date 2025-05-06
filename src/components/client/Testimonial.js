import React from 'react';
import OwlCarousel from 'react-owl-carousel';

const Testimonial = () => {
  const testimonials = [
    {
      id: 1,
      content: "Tempor stet labore dolor clita stet diam amet ipsum dolor duo ipsum rebum stet dolor amet diam stet. Est stet ea lorem amet est kasd kasd erat eos",
      image: "testimonial-1.jpg",
      name: "Client Name",
      profession: "Profession"
    },
    {
      id: 2,
      content: "Tempor stet labore dolor clita stet diam amet ipsum dolor duo ipsum rebum stet dolor amet diam stet. Est stet ea lorem amet est kasd kasd erat eos",
      image: "testimonial-2.jpg",
      name: "Client Name",
      profession: "Profession"
    },
    {
      id: 3,
      content: "Tempor stet labore dolor clita stet diam amet ipsum dolor duo ipsum rebum stet dolor amet diam stet. Est stet ea lorem amet est kasd kasd erat eos",
      image: "testimonial-3.jpg",
      name: "Client Name",
      profession: "Profession"
    }
  ];

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
          <h1 className="mb-3">Our Clients Say!</h1>
          <p>Eirmod sed ipsum dolor sit rebum labore magna erat. Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam justo sed rebum vero dolor duo.</p>
        </div>
        <OwlCarousel className="owl-carousel testimonial-carousel wow fadeInUp" data-wow-delay="0.1s" loop margin={10} nav items={3} responsive={{0:{items:1}, 768:{items:2}, 992:{items:3}}}>
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-item bg-light rounded p-3">
              <div className="bg-white border rounded p-4">
                <p>{testimonial.content}</p>
                <div className="d-flex align-items-center">
                  <img className="img-fluid flex-shrink-0 rounded" src={`img/${testimonial.image}`} style={{ width: '45px', height: '45px' }} alt={testimonial.name} />
                  <div className="ps-3">
                    <h6 className="fw-bold mb-1">{testimonial.name}</h6>
                    <small>{testimonial.profession}</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </OwlCarousel>
      </div>
    </div>
  );
};

export default Testimonial;