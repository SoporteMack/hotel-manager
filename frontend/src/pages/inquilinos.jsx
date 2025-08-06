import { useEffect, useState } from 'react';
import API from '../services/api';

export default function Inquilinos() {
  const [data, setData] = useState([]);

  /*useEffect(() => {
    API.get('/inquilinos')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);*/

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Inquilinos</h1>
      <ul>
        a
      </ul>
    </div>
  );
}
