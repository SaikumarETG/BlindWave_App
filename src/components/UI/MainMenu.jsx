import React from 'react';

const MainMenu = ({ onStart }) => {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(2px)'
        }}>
            <h1 className="animate-pulse" style={{
                fontSize: '4rem',
                color: '#fff',
                textShadow: '0 0 20px #0ff',
                marginBottom: '2rem',
                textAlign: 'center',
                letterSpacing: '5px'
            }}>
                BLIND<br />WAVE
            </h1>

            <button
                onClick={onStart}
                className="glass-panel animate-float"
                style={{
                    padding: '1.5rem 4rem',
                    fontSize: '2rem',
                    color: '#fff',
                    cursor: 'pointer',
                    borderRadius: '50px',
                    border: '2px solid #0ff',
                    background: 'rgba(0, 255, 255, 0.1)',
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                    e.target.style.background = 'rgba(0, 255, 255, 0.3)';
                    e.target.style.boxShadow = '0 0 30px #0ff';
                }}
                onMouseOut={(e) => {
                    e.target.style.background = 'rgba(0, 255, 255, 0.1)';
                    e.target.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
                }}
            >
                Initialize
            </button>

            <div style={{ marginTop: '3rem', color: '#888', textAlign: 'center' }}>
                <p>USE HEADPHONES FOR BEST EXPERIENCE</p>
                <p style={{ fontSize: '0.8rem', marginTop: '1rem' }}>v1.0.0 // FREQUENCY EDITION</p>
            </div>
        </div>
    );
};

export default MainMenu;
