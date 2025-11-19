import { SonarSystem } from './SonarSystem';
import { Player, Wall } from './entities';
import { LevelLoader } from './LevelLoader';
import { AudioManager } from './Audio';

export class GameEngine {
    constructor(canvas, callbacks) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.callbacks = callbacks;

        this.width = canvas.width;
        this.height = canvas.height;

        this.isRunning = false;
        this.lastTime = 0;

        // Game Systems
        this.audio = new AudioManager();
        this.sonar = new SonarSystem();
        this.player = new Player(100, 100);
        this.walls = [];
        this.exitZone = null; // Set by loader

        this.loader = new LevelLoader(this);

        // Game State
        this.currentFrequency = 'RED'; // RED, GREEN, BLUE

        // Input State
        this.input = {
            keys: {},
            mouse: { x: 0, y: 0, down: false, clicked: false },
            joystick: { x: 0, y: 0 }
        };

        this.bindEvents();
        this.loader.loadLevel(0);
    }

    bindEvents() {
        window.addEventListener('keydown', (e) => this.input.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.input.keys[e.code] = false);

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.input.mouse.x = e.clientX - rect.left;
            this.input.mouse.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mousedown', () => {
            this.input.mouse.down = true;
            this.input.mouse.clicked = true;
        });
        this.canvas.addEventListener('mouseup', () => this.input.mouse.down = false);

        // Touch
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.input.mouse.x = touch.clientX - rect.left;
            this.input.mouse.y = touch.clientY - rect.top;
            this.input.mouse.down = true;
            this.input.mouse.clicked = true;
        }, { passive: false });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.input.mouse.down = false;
        });
    }

    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.audio.startAmbience(); // Start drone
        requestAnimationFrame(this.loop.bind(this));
    }

    stop() {
        this.isRunning = false;
    }

    loop(timestamp) {
        if (!this.isRunning) return;

        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        // Reset one-frame inputs
        this.input.mouse.clicked = false;

        requestAnimationFrame(this.loop.bind(this));
    }

    update(dt) {
        // Frequency Switching
        let prevFreq = this.currentFrequency;
        if (this.input.keys['Digit1']) this.currentFrequency = 'RED';
        if (this.input.keys['Digit2']) this.currentFrequency = 'GREEN';
        if (this.input.keys['Digit3']) this.currentFrequency = 'BLUE';

        if (prevFreq !== this.currentFrequency) {
            this.audio.playSwitch();
        }

        // Spawn Pulse
        if (this.input.keys['Space'] || this.input.mouse.clicked) {
            this.sonar.spawnPulse(this.player.x, this.player.y, this.currentFrequency);
            this.audio.playPing(this.currentFrequency);
            this.input.keys['Space'] = false;
        }

        // Update Entities
        this.player.update(dt, this);
        this.sonar.update(dt);
        this.walls.forEach(w => w.update(dt));

        // Check Pulse vs Wall Collisions
        this.sonar.pulses.forEach(pulse => {
            this.walls.forEach(wall => {
                if (wall.frequency === 'ALL' || wall.frequency === pulse.frequency) {
                    if (this.checkCircleRect(pulse.x, pulse.y, pulse.radius, wall)) {
                        wall.reveal();
                    }
                }
            });
        });

        // Check Player vs Wall Collisions (Game Over)
        this.walls.forEach(wall => {
            if (this.checkCircleRect(this.player.x, this.player.y, this.player.radius, wall)) {
                this.audio.playCrash();
                this.loader.resetLevel(); // Simple reset on death
                console.log("CRASH!");
            }
        });

        // Check Exit
        if (this.exitZone && this.checkCircleRect(this.player.x, this.player.y, this.player.radius, this.exitZone)) {
            this.audio.playPing('ALL'); // Victory ping
            this.loader.nextLevel();
        }
    }

    checkCircleRect(cx, cy, cr, rect) {
        const distX = Math.abs(cx - rect.x - rect.w / 2);
        const distY = Math.abs(cy - rect.y - rect.h / 2);

        if (distX > (rect.w / 2 + cr)) return false;
        if (distY > (rect.h / 2 + cr)) return false;

        if (distX <= (rect.w / 2)) return true;
        if (distY <= (rect.h / 2)) return true;

        const dx = distX - rect.w / 2;
        const dy = distY - rect.h / 2;
        return (dx * dx + dy * dy <= (cr * cr));
    }

    draw() {
        // Clear screen
        this.drawBackground();

        // Draw Exit Zone
        if (this.exitZone) {
            this.ctx.save();
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.strokeRect(this.exitZone.x, this.exitZone.y, this.exitZone.w, this.exitZone.h);
            this.ctx.restore();
        }

        // Draw Walls (Only if lit)
        this.walls.forEach(w => w.draw(this.ctx));

        // Draw Pulses
        this.sonar.draw(this.ctx);

        // Draw Player
        this.player.draw(this.ctx);

        // Draw UI (Frequency Indicator)
        this.drawUI();
    }

    drawBackground() {
        // Dark Void Base
        this.ctx.fillStyle = '#050505';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Cyber Grid
        this.ctx.save();
        this.ctx.lineWidth = 1;

        const gridSize = 50;
        const time = performance.now() / 2000; // Slow pulse
        // Boosted opacity: 0.1 to 0.2 (was 0.02 to 0.05)
        const pulse = (Math.sin(time) + 1) / 2 * 0.1 + 0.1;

        this.ctx.strokeStyle = `rgba(0, 255, 255, ${pulse})`;

        // Vertical lines
        for (let x = 0; x <= this.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= this.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }

        // Floating Dust
        const t = performance.now() / 1000;
        this.ctx.fillStyle = `rgba(0, 255, 255, ${pulse * 0.5})`;
        for (let i = 0; i < 20; i++) {
            const x = (Math.sin(i * 132.1 + t * 0.1) * 0.5 + 0.5) * this.width;
            const y = (Math.cos(i * 45.7 + t * 0.15) * 0.5 + 0.5) * this.height;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 1, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    drawUI() {
        // UI is now handled by React Overlay
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
    }
}
