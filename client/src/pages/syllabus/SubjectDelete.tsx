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

function SubjectDelete() {
  const { id } = useParams<RouteParams>();
  const [subject, setSubject] = useState<Subject | null>(null);

  useEffect(() => {
    axios.get(`/api/subjects/${id}/`)
      .then(response => setSubject(response.data))
      .catch(error => console.log(error));
  }, [id]);

  const handleDelete = () => {
    axios.delete(`/api/subjects/${id}/`)
      .then(() => {
        // Implementar lógica para mostrar un mensaje de éxito o redirigir al usuario
      })
      .catch(error => console.log(error));
  };

  if (!subject) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Eliminar Materia</h1>
      <p>¿Estás seguro de que deseas eliminar la materia <strong>{subject.name}</strong>?</p>
      <button onClick={handleDelete}>Eliminar</button>
      <Link to={`/detail/${id}`}>Cancelar</Link>
    </div>
  );
}

export default SubjectDelete;
