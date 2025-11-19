export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.speed = 150;
        this.color = '#ffffff';
    }

    update(dt, engine) {
        const { keys, mouse } = engine.input;

        // Movement (WASD / Arrows)
        let dx = 0;
        let dy = 0;
        if (keys['KeyW'] || keys['ArrowUp']) dy -= 1;
        if (keys['KeyS'] || keys['ArrowDown']) dy += 1;
        if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1;
        if (keys['KeyD'] || keys['ArrowRight']) dx += 1;

        // Normalize diagonal movement
        if (dx !== 0 || dy !== 0) {
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len;
            dy /= len;
        }

        // Virtual Joystick
        if (engine.input.joystick && (engine.input.joystick.x !== 0 || engine.input.joystick.y !== 0)) {
            dx = engine.input.joystick.x;
            dy = engine.input.joystick.y;
        }

        this.x += dx * this.speed * dt;
        this.y += dy * this.speed * dt;

        // Bounds checking
        this.x = Math.max(this.radius, Math.min(engine.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(engine.height - this.radius, this.y));
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

export class Wall {
    constructor(x, y, w, h, frequency) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.frequency = frequency; // 'RED', 'GREEN', 'BLUE', 'ALL'
        this.visibleTimer = 0;
    }

    update(dt) {
        if (this.visibleTimer > 0) {
            this.visibleTimer -= dt;
        }
    }

    // Called when a pulse hits this wall
    reveal() {
        this.visibleTimer = 1.0; // Reveal for 1 second
    }

    draw(ctx) {
        if (this.visibleTimer <= 0) return; // Invisible if not lit

        let color = '255, 255, 255';
        let hex = '#ffffff';
        if (this.frequency === 'RED') { color = '255, 50, 50'; hex = '#ff3232'; }
        if (this.frequency === 'GREEN') { color = '50, 255, 50'; hex = '#32ff32'; }
        if (this.frequency === 'BLUE') { color = '50, 50, 255'; hex = '#3232ff'; }

        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = hex;

        ctx.fillStyle = `rgba(${color}, ${this.visibleTimer * 0.5})`;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        ctx.strokeStyle = `rgba(${color}, ${this.visibleTimer})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.restore();
    }
}
