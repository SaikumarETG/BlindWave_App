import React, { useEffect, useRef } from 'react';

const BackgroundParticles = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticles = () => {
            const particleCount = 30;
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 50 + 20,
                    color: getRandomColor(),
                    phase: Math.random() * Math.PI * 2
                });
            }
        };

        const getRandomColor = () => {
            const colors = [
                'rgba(255, 50, 50, 0.6)',  // Red - Higher Opacity
                'rgba(50, 255, 50, 0.6)',  // Green - Higher Opacity
                'rgba(50, 50, 255, 0.6)',  // Blue - Higher Opacity
                'rgba(0, 255, 255, 0.5)'   // Cyan - Higher Opacity
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Dark background base
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Global Glow
            ctx.shadowBlur = 20;
            ctx.globalCompositeOperation = 'screen'; // Make them blend brightly

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.phase += 0.01;

                // Pulse size
                const currentRadius = p.radius + Math.sin(p.phase) * 10;

                // Wrap around screen
                if (p.x < -50) p.x = canvas.width + 50;
                if (p.x > canvas.width + 50) p.x = -50;
                if (p.y < -50) p.y = canvas.height + 50;
                if (p.y > canvas.height + 50) p.y = -50;

                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(0, currentRadius), 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.shadowColor = p.color; // Glow matches color
                ctx.fill();
            });

            ctx.shadowBlur = 0; // Reset
            ctx.globalCompositeOperation = 'source-over';

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize();
        createParticles();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0, // Behind everything
                filter: 'blur(10px)' // Reduced blur for clarity
            }}
        />
    );
};

export default BackgroundParticles;
