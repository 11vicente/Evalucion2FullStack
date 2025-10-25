import React from 'react';
import { useParams, Link } from 'react-router-dom';

const blogMap = {
  'historia-chocolate': {
    title: 'La Historia del Chocolate',
    img: '/img/blog1.jfif',
    content: [
      'El chocolate tiene sus raíces en las antiguas civilizaciones mesoamericanas...',
      'Con la llegada de los españoles a América en el siglo XVI, el cacao fue llevado a Europa...'
    ]
  },
  'conservar-bombones': {
    title: 'Tips para Conservar Bombones',
    img: '/img/blog2.jfif',
    content: [
      'Los bombones son una de las delicias más delicadas de la repostería...',
      'Guárdalos en un lugar fresco y seco, lejos de la humedad.'
    ]
  }
};

export default function BlogDetail() {
  const { slug } = useParams();
  const post = blogMap[slug];

  if (!post) return <div>Entrada no encontrada. <Link to="/blog">Volver al blog</Link></div>;

  return (
    <main className="container my-5">
      <h1 className="section-title mb-4">{post.title}</h1>
      <img src={post.img} alt={post.title} className="img-fluid rounded mb-4 shadow-sm" />
      {post.content.map((p, i) => <p key={i}>{p}</p>)}
      <Link to="/blog" className="btn btn-custom mt-3">⬅ Volver al Blog</Link>
    </main>
  );
}