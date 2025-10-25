import React from 'react';
import { Link } from 'react-router-dom';

const blogs = [
  { slug: 'historia-chocolate', title: 'Historia del Chocolate', img: '/img/blog1.jfif', excerpt: 'Descubre cómo el cacao pasó de ser un tesoro...' },
  { slug: 'conservar-bombones', title: 'Tips para Conservar Bombones', img: '/img/blog2.jfif', excerpt: 'Consejos prácticos para mantener tus bombones frescos...' }
];

export default function BlogList() {
  return (
    <div>
      <section className="text-center py-5">
        <div className="container">
          <h1 className="section-title">Nuestro Blog</h1>
          <p className="lead">Noticias, curiosidades y consejos sobre nuestros productos 🍬</p>
        </div>
      </section>

      <main className="container my-5">
        <div className="row g-4">
          {blogs.map(b => (
            <div className="col-md-4" key={b.slug}>
              <article className="card h-100 shadow-sm">
                <img src={b.img} className="card-img-top" alt={b.title} />
                <div className="card-body">
                  <h5 className="card-title">{b.title}</h5>
                  <p className="card-text">{b.excerpt}</p>
                  <Link to={`/blog/${b.slug}`} className="btn btn-custom">Leer más</Link>
                </div>
              </article>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}