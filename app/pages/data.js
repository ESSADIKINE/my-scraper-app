import { useEffect, useState } from 'react';

export default function Data() {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/businesses');
      const data = await response.json();
      setBusinesses(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Scraped Data</h1>
      <ul>
        {businesses.map((business, index) => (
          <li key={index}>
            <strong>{business.name}</strong> - {business.address} - {business.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}