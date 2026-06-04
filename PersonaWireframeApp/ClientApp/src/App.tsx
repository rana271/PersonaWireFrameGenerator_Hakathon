import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import axios from 'axios';

interface LayoutBlock {
  id: string;
  type: string;
  variant: string;
  desc: string;
  props: Record<string, any>;
  fields: Array<Record<string, any>>;
}

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [layout, setLayout] = useState<LayoutBlock[]>([]);
  const [hubConnection, setHubConnection] = useState<signalR.HubConnection | null>(null);
  const [status, setStatus] = useState('Disconnected');

  useEffect(() => {
    // Establishing real-time persistent channel setup to .NET service hub backend
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/wireframehub')
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        setStatus('Connected to Real-Time Broker');
        setHubConnection(connection);
      })
      .catch(err => setStatus(`Connection Error: ${err}`));

    // Register active layout incremental streaming consumer logic
    connection.on('ReceiveLayoutBlock', (newBlock: LayoutBlock) => {
      setLayout(prevLayout => [...prevLayout, newBlock]);
    });

    connection.on('GenerationCompleted', (msg: string) => {
      setStatus(msg);
    });

    return () => {
      connection.stop();
    };
  }, []);

  const triggerUiGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hubConnection || !hubConnection.connectionId) {
      alert('SignalR stream interface has not handshake completed yet.');
      return;
    }

    setLayout([]); // Flush dynamic canvas clean for incoming layout configuration frames
    setStatus('Generating layout interfaces...');

    try {
      await axios.post(`http://localhost:5000/api/wireframe/generate?connectionId=${hubConnection.connectionId}&prompt=${encodeURIComponent(prompt)}`);
    } catch (err) {
      setStatus('Failed to dispatch generation task execution.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', background: '#f5f5f7', minHeight: '100vh' }}>
      <header style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #e0e0e0' }}>
        <h2>Persona Builder Workspace</h2>
        <p style={{ color: '#666' }}>Engine Runtime State: <strong>{status}</strong></p>
      </header>

      {/* Generation Prompt Input Control Frame */}
      <form onSubmit={triggerUiGeneration} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., hey AI pls create KYC Form Layout to onboard Bank new Customer"
          style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: '6px', background: '#0071e3', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Generate Wireframe
        </button>
      </form>

      {/* Dynamic Structural Canvas Preview Area Render Box */}
      <main style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h3>Render Canvas Area</h3>
        {layout.length === 0 && <p style={{ color: '#999' }}>No structural layouts drawn yet. Enter your generation execution prompt above.</p>}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
          {layout.map((block) => (
            <div key={block.id} style={{ border: `2px dashed ${block.variant === 'primary' ? '#0071e3' : '#ccc'}`, padding: '1rem', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', fontWeight: 'bold' }}>
                Component Block: {block.type} [{block.variant}]
              </div>
              <h4>{block.props?.sectionHeader || block.desc}</h4>
              
              {block.fields && block.fields.length > 0 && (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {block.fields.map((field, idx) => (
                    <label key={idx} style={{ display: 'block', fontWeight: '500' }}>
                      {field.label}:
                      <input type={field.type} disabled style={{ display: 'block', width: '100%', marginTop: '0.25rem', padding: '0.4rem' }} />
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}