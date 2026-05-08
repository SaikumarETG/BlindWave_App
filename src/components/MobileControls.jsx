import React, { useRef, useState } from 'react';

const MobileControls = ({ onMove, onAction, onSwitchFreq, frequency }) => {
    const joystickRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [touchId, setTouchId] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    // Helper to calculate and update position
    const updateJoystick = (clientX, clientY) => {
        const rect = joystickRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let dx = clientX - centerX;
        let dy = clientY - centerY;

        const maxRadius = 40;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > maxRadius) {
            dx = (dx / distance) * maxRadius;
            dy = (dy / distance) * maxRadius;
        }

        setPosition({ x: dx, y: dy });
        onMove(dx / maxRadius, dy / maxRadius);
    };

    // Mouse Handlers (Global for drag)
    React.useEffect(() => {
        if (!isDragging) return;

        const handleWindowMouseMove = (e) => {
            e.preventDefault();
            updateJoystick(e.clientX, e.clientY);
        };

        const handleWindowMouseUp = (e) => {
            e.preventDefault();
            setIsDragging(false);
            setPosition({ x: 0, y: 0 });
            onMove(0, 0);
        };

        window.addEventListener('mousemove', handleWindowMouseMove);
        window.addEventListener('mouseup', handleWindowMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleWindowMouseMove);
            window.removeEventListener('mouseup', handleWindowMouseUp);
        };
    }, [isDragging]);

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        updateJoystick(e.clientX, e.clientY);
    };

    // Touch Handlers
    const handleStart = (e) => {
        e.preventDefault();
        const touch = e.changedTouches[0];
        setTouchId(touch.identifier);
        updateJoystick(touch.clientX, touch.clientY);
    };

    const handleMove = (e) => {
        e.preventDefault();
        if (touchId === null) return;
        const touch = Array.from(e.changedTouches).find(t => t.identifier === touchId);
        if (!touch) return;
        updateJoystick(touch.clientX, touch.clientY);
    };

    const handleEnd = (e) => {
        e.preventDefault();
        const touch = Array.from(e.changedTouches).find(t => t.identifier === touchId);
        if (!touch) return;
        setTouchId(null);
        setPosition({ x: 0, y: 0 });
        onMove(0, 0);
    };

    // Helper for button styles
    const getBtnStyle = (freqColor, isSelected) => ({
        width: '50px',
        height: '50px',
        borderRadius: '12px',
        background: isSelected ? `rgba(${freqColor}, 0.5)` : 'rgba(0, 0, 0, 0.6)', // Increased opacity
        border: `2px solid ${isSelected ? `rgb(${freqColor})` : '#555'}`,
        color: isSelected ? '#fff' : '#aaa',
        fontWeight: 'bold',
        boxShadow: isSelected ? `0 0 25px rgb(${freqColor})` : 'none', // Stronger glow
        fontSize: '14px',
        backdropFilter: 'blur(4px)',
        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
    });

    // Helper for PING button color
    const getPingColor = () => {
        if (frequency === 'RED') return { rgb: '255, 50, 50', hex: '#ff3232' };
        if (frequency === 'GREEN') return { rgb: '50, 255, 50', hex: '#32ff32' };
        if (frequency === 'BLUE') return { rgb: '50, 50, 255', hex: '#3232ff' };
        return { rgb: '0, 255, 255', hex: '#0ff' };
    };

    const pingColor = getPingColor();

    return (
        <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '100%',
            height: '200px',
            pointerEvents: 'none',
            zIndex: 100,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            padding: '20px 40px',
            boxSizing: 'border-box',
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)'
        }}>
            {/* Holo Joystick */}
            <div
                ref={joystickRef}
                style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    border: '2px solid rgba(0, 255, 255, 0.5)', // Brighter border
                    background: 'radial-gradient(circle, rgba(0,255,255,0.2) 0%, transparent 70%)', // Brighter background
                    boxShadow: '0 0 30px rgba(0, 255, 255, 0.3)', // Stronger glow
                    pointerEvents: 'auto',
                    position: 'relative',
                    marginBottom: '10px'
                }}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
                onMouseDown={handleMouseDown}
            >
                {/* Crosshairs */}
                <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '2px', background: 'rgba(0,255,255,0.6)' }} />
                <div style={{ position: 'absolute', left: '50%', top: '10%', bottom: '10%', width: '2px', background: 'rgba(0,255,255,0.6)' }} />

                {/* Thumb Stick */}
                <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'rgba(0, 255, 255, 0.8)', // Much brighter thumbstick
                    boxShadow: '0 0 25px rgba(0, 255, 255, 0.8), inset 0 0 10px rgba(255,255,255,0.8)', // Intense glow
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
                    border: '2px solid #fff',
                    backdropFilter: 'blur(2px)'
                }} />
            </div>

            {/* Action Cluster */}
            <div style={{ display: 'flex', gap: '30px', pointerEvents: 'auto', alignItems: 'flex-end', marginBottom: '10px' }}>
                {/* Frequency Switcher */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <button onClick={() => onSwitchFreq('RED')} style={getBtnStyle('255, 50, 50', frequency === 'RED')}>R</button>
                    <button onClick={() => onSwitchFreq('GREEN')} style={getBtnStyle('50, 255, 50', frequency === 'GREEN')}>G</button>
                    <button onClick={() => onSwitchFreq('BLUE')} style={getBtnStyle('50, 50, 255', frequency === 'BLUE')}>B</button>
                </div>

                {/* SONAR PING Button */}
                <button
                    onMouseDown={(e) => { e.preventDefault(); onAction(true); }}
                    onMouseUp={(e) => { e.preventDefault(); onAction(false); }}
                    onMouseLeave={(e) => { e.preventDefault(); onAction(false); }}
                    onTouchStart={(e) => { e.preventDefault(); onAction(true); }}
                    onTouchEnd={(e) => { e.preventDefault(); onAction(false); }}
                    style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, rgba(${pingColor.rgb}, 0.4) 0%, rgba(0,0,0,0.6) 100%)`, // Brighter background
                        border: `3px solid rgba(${pingColor.rgb}, 0.8)`, // Thicker, brighter border
                        color: pingColor.hex,
                        fontSize: '20px', // Larger text
                        fontWeight: 'bold',
                        boxShadow: `0 0 50px rgba(${pingColor.rgb}, 0.5), inset 0 0 30px rgba(${pingColor.rgb}, 0.3)`, // Massive glow
                        textShadow: `0 0 15px ${pingColor.hex}`,
                        letterSpacing: '2px',
                        backdropFilter: 'blur(5px)',
                        userSelect: 'none',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease'
                    }}
                >
                    PING
                    {/* Radar Sweep Effect */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '100%',
                        height: '100%',
                        background: `conic-gradient(from 0deg, transparent 0deg, rgba(${pingColor.rgb}, 0.6) 360deg)`, // Brighter sweep
                        transformOrigin: '0 0',
                        animation: 'radar-sweep 2s linear infinite',
                        borderRadius: '50%',
                        opacity: 0.5,
                        pointerEvents: 'none'
                    }} />
                </button>
            </div>

            <style>{`
                @keyframes radar-sweep {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default MobileControls;
