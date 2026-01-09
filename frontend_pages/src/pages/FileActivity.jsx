import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import NavbarWithFileActivity from '../components/NavbarWithFileActivity';

function FileActivity() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQrFor, setShowQrFor] = useState(null);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const response = await fetch('http://localhost:5000/api/file-activity', {
          credentials: 'include',
        });
        const data = await response.json();
        if (data.success) {
          setActivity(data.activity);
        } else {
          setError(data.message || 'Failed to fetch file activity');
        }
      } catch (err) {
        setError('Error fetching file activity');
      } finally {
        setLoading(false);
      }
    }
    fetchActivity();
  }, []);

  if (loading) {
    return <div className="p-4">Loading file activity...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  if (activity.length === 0) {
    return <div className="p-4">No file activity found.</div>;
  }

  return (
    <>
      <NavbarWithFileActivity />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-sky-900 via-cyan-900 to-sky-900 relative overflow-auto px-8 py-8 text-white" style={{minHeight: '100vh', width: '100vw', position: 'absolute', left: 0}}>
        {/* IPFS Nodes Background */}
        <div className="absolute inset-0 z-0 overflow-auto">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="glow" r="1">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0f0e17" stopOpacity="0" />
              </radialGradient>
            </defs>
            {[...Array(40)].map((_, i) => (
              <circle
                key={i}
                cx={Math.random() * 100 + "%"}
                cy={Math.random() * 100 + "%"}
                r="3"
                fill="url(#glow)"
                className="animate-pulse"
              />
            ))}
          </svg>
        </div>
        <motion.div
          className="z-10 w-full max-w-full sm:max-w-md px-4 sm:px-6 md:px-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center">File Activity</h2>
          <ul className="list-disc list-inside space-y-2">
            {activity.map(({ cid, qr_code, upload_time }) => (
              <li key={cid} className="border p-4 rounded shadow-sm bg-gray-900 bg-opacity-50">
              <div className="flex flex-col space-y-2 max-w-full break-words overflow-hidden">
                <p><strong>CID:</strong> {cid}</p>
                <p><strong>Uploaded:</strong> {new Date(upload_time).toLocaleString()}</p>
                <button
                  className="w-max px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white"
                  onClick={() => setShowQrFor(showQrFor === cid ? null : cid)}
                >
                  {showQrFor === cid ? 'Hide QR Code' : 'Show QR Code'}
                </button>
                {showQrFor === cid && (
                  <img
                    src={`data:image/png;base64,${qr_code}`}
                    alt={`QR code for ${cid}`}
                    className="w-24 h-24"
                  />
                )}
              </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </>
  );
}

export default FileActivity;
