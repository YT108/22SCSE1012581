import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function History() {
  const [shortenedUrls, setShortenedUrls] = useState([]);

  useEffect(() => {
    const storedUrls = JSON.parse(localStorage.getItem('shortenedUrls')) || [];
    setShortenedUrls(storedUrls);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">📜 URL Shortener History</h1>

        {shortenedUrls.length === 0 ? (
          <p className="text-center text-gray-500">No URLs have been shortened yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {shortenedUrls.map((item, index) => (
              <div key={index} className="bg-gray-50 border rounded p-3 shadow-sm hover:shadow transition">
                <p className="text-sm text-gray-700 break-all">🔗 <span className="font-medium">Original:</span> {item.longUrl}</p>
                <a
                  href={item.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  {item.shortUrl}
                </a>
              </div>
            ))}
          </div>
        )}

        <Link to="/">
          <button className="mt-4 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
            ← Back to Shortener
          </button>
        </Link>
      </div>
    </div>
  );
}
