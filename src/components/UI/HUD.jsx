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
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'auto',
            pointerEvents: 'none',
            zIndex: 50,
            display: 'flex',
            gap: '20px',
            alignItems: 'flex-start'
        }}>
            {/* Combined Status Bar */}
            <div className="holo-panel" style={{
                padding: '10px 30px',
                borderRadius: '30px',
                border: '2px solid ' + currentColor,
                display: 'flex',
                alignItems: 'center',
                gap: '30px',
                background: `linear-gradient(180deg, rgba(0,0,0,0.8), ${currentColor}22)`,
                boxShadow: `0 0 20px ${currentColor}44`
            }}>
                {/* Sector Info */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span className="holo-text" style={{ fontSize: '0.6rem', opacity: 0.8, color: '#fff' }}>SECTOR</span>
                    <span className="holo-text" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>
                        {String(level + 1).padStart(2, '0')}
                    </span>
                </div>

                {/* Divider */}
                <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.2)' }} />

                {/* Frequency Info */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span className="holo-text" style={{ fontSize: '0.6rem', opacity: 0.8, color: currentColor }}>FREQUENCY</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: currentColor,
                            boxShadow: `0 0 10px ${currentColor}`,
                            animation: 'pulse-glow 1s infinite'
                        }} />
                        <span className="holo-text" style={{
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            color: currentColor,
                            textShadow: `0 0 10px ${currentColor}`
                        }}>
                            {frequency}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HUD;
