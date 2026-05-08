import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../game/Engine';
import MobileControls from './MobileControls';
import MainMenu from './UI/MainMenu';
import HUD from './UI/HUD';
import BackgroundParticles from './UI/BackgroundParticles';

const GameCanvas = () => {
    const canvasRef = useRef(null);
    const engineRef = useRef(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameState, setGameState] = useState({
        level: 0,
        frequency: 'RED'
    });

    useEffect(() => {
        if (!canvasRef.current) return;

        try {
            // Initialize Engine
            engineRef.current = new GameEngine(canvasRef.current, {
                onGameOver: () => console.log("Game Over"),
            });

            // Hook into engine update to sync state for UI
            const originalUpdate = engineRef.current.update.bind(engineRef.current);
            engineRef.current.update = (dt) => {
                originalUpdate(dt);
                // Sync state
                setGameState({
                    level: engineRef.current.loader.currentLevelIndex,
                    frequency: engineRef.current.currentFrequency
                });
            };
        } catch (e) {
            console.error("Engine Init Failed", e);
        }

        // Handle Resize
        const handleResize = () => {
            if (engineRef.current) {
                engineRef.current.resize(window.innerWidth, window.innerHeight);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial resize

        return () => {
            if (engineRef.current) engineRef.current.stop();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleStartGame = () => {
        setGameStarted(true);
        if (engineRef.current) {
            engineRef.current.start();
        }
    };

    // Mobile Handlers
    const handleJoystick = (x, y) => {
        if (engineRef.current && gameStarted) {
            engineRef.current.input.joystick = { x, y };
        }
    };

    const handleAction = (pressed) => {
        if (engineRef.current && gameStarted) {
            engineRef.current.input.keys['Space'] = pressed;
        }
    };

    const handleSwitchFreq = (freq) => {
        if (engineRef.current && gameStarted) {
            engineRef.current.currentFrequency = freq;
            // Manually trigger sound to ensure feedback
            if (engineRef.current.audio) {
                engineRef.current.audio.playSwitch();
            }
        }
    };

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', background: 'black' }}>
            <div className="scanlines"></div>
            <div className="vignette"></div>

            {!gameStarted && <BackgroundParticles />}
            {!gameStarted && <MainMenu onStart={handleStartGame} />}

            {gameStarted && <HUD level={gameState.level} frequency={gameState.frequency} />}

            <canvas
                ref={canvasRef}
                style={{ display: 'block', width: '100%', height: '100%', position: 'relative', zIndex: 10 }}
            />

            {gameStarted && (
                <MobileControls
                    onMove={handleJoystick}
                    onAction={handleAction}
                    onSwitchFreq={handleSwitchFreq}
                    frequency={gameState.frequency}
                />
            )}
        </div>
    );
};

export default GameCanvas;
