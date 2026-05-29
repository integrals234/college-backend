"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Fetch data from the pristine API we just built
    fetch('/api/colleges')
      .then(res => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then(data => {
        setColleges(data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto', color: '#333' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eaeaea', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>College Discovery MVP</h1>
        <span style={{ background: '#0070f3', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold' }}>
          Backend Systems Demo
        </span>
      </div>

      {loading ? (
        <p style={{ marginTop: '2rem', fontSize: '1.2rem', color: '#666' }}>Fetching from SQLite Database...</p>
      ) : error ? (
        <p style={{ marginTop: '2rem', color: 'red' }}>Error connecting to the API. Make sure you seeded the database!</p>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem', marginTop: '2rem' }}>
          {colleges.map((college: any) => (
            <div key={college.id} style={{ border: '1px solid #eaeaea', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', color: '#111', fontSize: '1.5rem' }}>{college.name}</h2>
                <span style={{ fontSize: '1.2rem' }}>⭐ {college.rating}/5</span>
              </div>
              
              <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '1.1rem' }}>📍 {college.location}</p>
              
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.95rem', flexWrap: 'wrap' }}>
                <span style={{ background: '#f5f5f5', padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #ddd' }}>
                  💰 Total Fees: ₹{college.totalFees.toLocaleString()}
                </span>
                <span style={{ background: '#f5f5f5', padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #ddd' }}>
                  🏆 Min Rank: {college.minRank}
                </span>
                <span style={{ background: '#e6f7ff', padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #91d5ff', color: '#0050b3' }}>
                  📈 Avg Pkg: ₹{college.averagePackage?.toLocaleString() || 'N/A'}
                </span>
              </div>

            </div>
          ))}
          
          {colleges.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#f9f9f9', borderRadius: '8px' }}>
              <p>Database is empty. Go to <b>/api/seed</b> to inject data.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}