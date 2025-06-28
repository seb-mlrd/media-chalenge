'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { v4 as uuidv4 } from 'uuid';

export default function TestStorage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);
  const { user } = useAuth();

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const listBuckets = async () => {
    try {
      addLog('Listing buckets...');
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        addLog(`Error listing buckets: ${error.message}`);
      } else {
        addLog(`Found ${data.length} buckets: ${data.map(b => b.name).join(', ')}`);
      }
    } catch (err) {
      addLog(`Exception: ${err.message}`);
    }
  };

  const testUploadSimple = async () => {
    if (!file) {
      addLog('No file selected');
      return;
    }
    
    setUploading(true);
    try {
      const fileName = `test_${uuidv4()}.${file.name.split('.').pop()}`;
      addLog(`Uploading file "${fileName}" to root of media bucket...`);
      
      const { data, error } = await supabase.storage
        .from('media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (error) {
        addLog(`Upload failed: ${error.message}`);
        setResult({ success: false, error });
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(fileName);
          
        addLog(`Upload successful! Public URL: ${publicUrl}`);
        setResult({ success: true, url: publicUrl });
      }
    } catch (err) {
      addLog(`Exception: ${err.message}`);
      setResult({ success: false, error: err });
    } finally {
      setUploading(false);
    }
  };

  const testUploadWithFolder = async () => {
    if (!file || !user?.user_id) {
      addLog(!file ? 'No file selected' : 'User not authenticated');
      return;
    }
    
    setUploading(true);
    try {
      const fileName = `${user.user_id}/${uuidv4()}.${file.name.split('.').pop()}`;
      addLog(`Uploading file to "${fileName}" (with user folder)...`);
      
      const { data, error } = await supabase.storage
        .from('media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (error) {
        addLog(`Upload with folder failed: ${error.message}`);
        setResult({ success: false, error });
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(fileName);
          
        addLog(`Upload with folder successful! Public URL: ${publicUrl}`);
        setResult({ success: true, url: publicUrl });
      }
    } catch (err) {
      addLog(`Exception: ${err.message}`);
      setResult({ success: false, error: err });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Test Supabase Storage</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>User Info</h2>
        {user ? (
          <div>
            <p>User ID: <code>{user.user_id}</code></p>
            <p>Profile ID: <code>{user.id}</code></p>
            <p>Email: {user.email}</p>
          </div>
        ) : (
          <p>Not authenticated</p>
        )}
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>Upload Test</h2>
        <input 
          type="file"
          onChange={handleFileChange}
          style={{ marginBottom: '1rem', display: 'block' }}
          disabled={uploading}
        />
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button 
            onClick={testUploadSimple}
            disabled={!file || uploading}
            style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
          >
            Test Simple Upload
          </button>
          
          <button 
            onClick={testUploadWithFolder}
            disabled={!file || uploading || !user}
            style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
          >
            Test Upload with User Folder
          </button>
          
          <button 
            onClick={listBuckets}
            style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
          >
            List Buckets
          </button>
        </div>
        
        {result && (
          <div style={{ 
            padding: '1rem', 
            border: `1px solid ${result.success ? 'green' : 'red'}`,
            borderRadius: '4px',
            marginBottom: '1rem',
            backgroundColor: result.success ? '#f0fff4' : '#fff5f5'
          }}>
            <h3>{result.success ? 'Success!' : 'Failed!'}</h3>
            {result.success ? (
              <div>
                <p>File uploaded successfully</p>
                <img 
                  src={result.url} 
                  alt="Uploaded file" 
                  style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '1rem' }}
                />
              </div>
            ) : (
              <pre>{JSON.stringify(result.error, null, 2)}</pre>
            )}
          </div>
        )}
      </div>
      
      <div>
        <h2>Logs</h2>
        <div style={{ 
          height: '300px', 
          overflow: 'auto', 
          backgroundColor: '#f0f0f0', 
          padding: '1rem',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          borderRadius: '4px'
        }}>
          {logs.length === 0 ? (
            <p style={{ color: '#666' }}>No logs yet...</p>
          ) : (
            logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
