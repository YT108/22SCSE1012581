import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortenedUrls, setShortenedUrls] = useState(() => JSON.parse(localStorage.getItem('shortenedUrls')) || []);
  const [loading, setLoading] = useState(false);

  const logMiddleware = (type, message, data) => {
    const log = { type, message, data, time: new Date().toLocaleString() };
    console.log(log);
    const logs = JSON.parse(localStorage.getItem('logs')) || [];
    logs.push(log);
    localStorage.setItem('logs', JSON.stringify(logs));
  };

  const prependHttpsIfMissing = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      return 'https://' + url;
    }
    return url;
  };

  const shortenUrl = async () => {
    if (!longUrl.trim()) {
      alert('Please enter a URL');
      return;
    }

    const preparedUrl = prependHttpsIfMissing(longUrl.trim());
    setLoading(true);
    logMiddleware('API_REQUEST', 'Sending URL to backend CleanURI API', { preparedUrl });

    try {
      const response = await fetch('http://localhost:5000/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: preparedUrl })
      });
      const data = await response.json();
      logMiddleware('API_RESPONSE', 'Received response from backend CleanURI API', data);

      if (data.result_url) {
        const newUrl = { longUrl: preparedUrl, shortUrl: data.result_url };
        const updatedUrls = [newUrl, ...shortenedUrls];
        setShortenedUrls(updatedUrls);
        localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
        setLongUrl('');
        alert('URL shortened successfully!');
      } else {
        alert(`Error shortening URL: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to shorten URL. Check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
      logMiddleware('ACTION', 'Copied URL to clipboard', { text });
    } catch (err) {
      alert('Failed to copy.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-fixed bg-center bg-cover relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative max-w-lg w-full bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-8 transform hover:scale-[1.02] transition duration-500">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-white drop-shadow-lg animate-pulse">
          🚀 React URL Shortener
        </h1>

        <input
          type="text"
          placeholder="Paste your long URL here..."
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className="border border-gray-300 rounded-lg w-full p-3 mb-4 focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
        />

        <button
          onClick={shortenUrl}
          disabled={loading}
          className={`w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold p-3 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300 ${
            loading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>

        <Link to="/history">
          <button className="w-full mt-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold p-3 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300">
            📜 View History
          </button>
        </Link>

        {shortenedUrls.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-3 text-center text-white">✨ Recently Shortened Links</h2>
            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-2">
              {shortenedUrls.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur rounded-lg p-4 shadow-md hover:shadow-xl hover:scale-[1.01] transition duration-300"
                >
                  <p className="text-sm text-gray-700 break-words">
                    <span className="font-semibold">Original:</span> {item.longUrl}
                  </p>
                  <a
                    href={item.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline break-words hover:text-indigo-800"
                  >
                    {item.shortUrl}
                  </a>
                  <button
                    onClick={() => copyToClipboard(item.shortUrl)}
                    className="mt-2 bg-indigo-100 hover:bg-indigo-200 p-2 rounded transition text-sm font-medium"
                  >
                    📋 Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}