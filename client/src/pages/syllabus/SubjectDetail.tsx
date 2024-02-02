import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

interface Subject {
  id: number;
  name: string;
  code: string;
}

interface RouteParams {
  id: string;
}

function SubjectDetail() {
  const { id } = useParams<RouteParams>();
  const [subject, setSubject] = useState<Subject | null>(null);

  useEffect(() => {
    axios.get(`/api/subjects/${id}/`)
      .then(response => setSubject(response.data))
      .catch(error => console.log(error));
  }, [id]);

  if (!subject) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Detalles de la Materia</h1>
      <p><strong>Nombre:</strong> {subject.name}</p>
      <p><strong>Código:</strong> {subject.code}</p>
      <Link to={`/edit/${id}`}>Editar</Link>
      <Link to="/">Volver a la lista</Link>
    </div>
  );
}

export default SubjectDetail;
