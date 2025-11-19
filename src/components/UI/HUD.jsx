import React from 'react';

const HUD = ({ level, frequency }) => {
    const getFreqColor = (freq) => {
        if (freq === 'RED') return '#ff3232';
        if (freq === 'GREEN') return '#32ff32';
        if (freq === 'BLUE') return '#3232ff';
        return '#0ff';
    };

    const currentColor = getFreqColor(frequency);

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 50,
            padding: '20px',
            boxSizing: 'border-box',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
        }}>
            {/* Top Left: Frequency System */}
            <div className="holo-panel" style={{
                padding: '15px 25px',
                borderRadius: '0 0 20px 0', // Cut corner style
                borderLeft: 'none',
                borderTop: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                minWidth: '150px'
            }}>
                <span className="holo-text" style={{ fontSize: '0.7rem', opacity: 0.7 }}>Signal Frequency</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: currentColor,
                        boxShadow: `0 0 10px ${currentColor}`
                    }} />
                    <span className="holo-text" style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: currentColor,
                        textShadow: `0 0 10px ${currentColor}`
                    }}>
                        {frequency}
                    </span>
                </div>
            </div>

            {/* Top Right: Sector/Level */}
            <div className="holo-panel" style={{
                padding: '15px 25px',
                borderRadius: '0 0 0 20px', // Cut corner style
                borderRight: 'none',
                borderTop: 'none',
                textAlign: 'right'
            }}>
                <span className="holo-text" style={{ fontSize: '0.7rem', opacity: 0.7 }}>Current Sector</span>
                <div className="holo-text" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {String(level + 1).padStart(2, '0')}
                </div>
            </div>
        </div>
    );
};

export default HUD;
