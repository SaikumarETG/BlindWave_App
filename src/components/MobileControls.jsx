import React, { useEffect, useRef, useState } from 'react';

const MobileControls = ({ onMove, onAction, onSwitchFreq }) => {
    const joystickRef = useRef(null);
    const [touchId, setTouchId] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleStart = (e) => {
        e.preventDefault();
        const touch = e.changedTouches[0];
        setTouchId(touch.identifier);
    };

    const handleMove = (e) => {
        e.preventDefault();
        if (touchId === null) return;

        const touch = Array.from(e.changedTouches).find(t => t.identifier === touchId);
        if (!touch) return;

        const rect = joystickRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let dx = touch.clientX - centerX;
        let dy = touch.clientY - centerY;

        const maxRadius = 40;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > maxRadius) {
            dx = (dx / distance) * maxRadius;
            dy = (dy / distance) * maxRadius;
        }

        setPosition({ x: dx, y: dy });
        onMove(dx / maxRadius, dy / maxRadius);
    };

    const handleEnd = (e) => {
        e.preventDefault();
        const touch = Array.from(e.changedTouches).find(t => t.identifier === touchId);
        if (!touch) return;

        setTouchId(null);
        setPosition({ x: 0, y: 0 });
        onMove(0, 0);
    };

    return (
        <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '100%',
            height: '180px',
            pointerEvents: 'none',
            zIndex: 50,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            padding: '20px 40px',
            boxSizing: 'border-box',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
        }}>
            {/* Holo Joystick */}
            <div
                ref={joystickRef}
                style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    border: '2px solid rgba(0, 255, 255, 0.3)',
                    background: 'rgba(0, 255, 255, 0.05)',
                    boxShadow: '0 0 15px rgba(0, 255, 255, 0.1)',
                    pointerEvents: 'auto',
                    position: 'relative',
                    marginBottom: '20px'
                }}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
            >
                {/* Inner Stick */}
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(0, 255, 255, 0.5)',
                    boxShadow: '0 0 15px rgba(0, 255, 255, 0.8)',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
                    border: '2px solid #fff'
                }} />
            </div>

            {/* Holo Action Cluster */}
            <div style={{ display: 'flex', gap: '25px', pointerEvents: 'auto', alignItems: 'flex-end', marginBottom: '20px' }}>
                {/* Frequency Arc */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <button onClick={() => onSwitchFreq('RED')} style={holoBtnStyle('#ff3232')}>R</button>
                    <button onClick={() => onSwitchFreq('GREEN')} style={holoBtnStyle('#32ff32')}>G</button>
                    <button onClick={() => onSwitchFreq('BLUE')} style={holoBtnStyle('#3232ff')}>B</button>
                </div>

                {/* Big Ping Button */}
                <button
                    onTouchStart={(e) => { e.preventDefault(); onAction(true); }}
                    onTouchEnd={(e) => { e.preventDefault(); onAction(false); }}
                    style={{
                        width: '90px',
                        height: '90px',
                        borderRadius: '50%',
                        background: 'rgba(0, 255, 255, 0.1)',
                        border: '2px solid rgba(0, 255, 255, 0.5)',
                        color: '#0ff',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        boxShadow: '0 0 20px rgba(0, 255, 255, 0.2), inset 0 0 20px rgba(0, 255, 255, 0.1)',
                        textShadow: '0 0 5px #0ff',
                        letterSpacing: '2px',
                        backdropFilter: 'blur(5px)'
                    }}
                >
                    PING
                </button>
            </div>
        </div>
    );
};

const holoBtnStyle = (color) => ({
    width: '45px',
    height: '45px',
    borderRadius: '10px', // Hexagon-ish shape
    background: 'rgba(0, 0, 0, 0.3)',
    border: `1px solid ${color}`,
    color: color,
    fontWeight: 'bold',
    boxShadow: `0 0 10px ${color}40`, // 40 is hex opacity
    fontSize: '14px',
    backdropFilter: 'blur(2px)',
    transform: 'skewX(-10deg)' // Sci-fi tilt
});

export default MobileControls;
