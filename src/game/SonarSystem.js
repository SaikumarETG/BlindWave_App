export class SonarSystem {
    constructor() {
        this.pulses = [];
    }

    spawnPulse(x, y, frequency) {
        // frequency: 'RED', 'GREEN', 'BLUE'
        this.pulses.push({
            x, y,
            radius: 0,
            maxRadius: 300,
            speed: 200, // pixels per second
            frequency,
            life: 1.0 // Opacity/Life
        });
    }

    update(dt) {
        this.pulses.forEach(p => {
            p.radius += p.speed * dt;
            p.life -= dt * 0.5; // Fade out
        });

        // Remove dead pulses
        this.pulses = this.pulses.filter(p => p.life > 0);
    }

    draw(ctx) {
        ctx.save();
        this.pulses.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

            let color = '255, 255, 255';
            let hex = '#ffffff';
            if (p.frequency === 'RED') { color = '255, 50, 50'; hex = '#ff3232'; }
            if (p.frequency === 'GREEN') { color = '50, 255, 50'; hex = '#32ff32'; }
            if (p.frequency === 'BLUE') { color = '50, 50, 255'; hex = '#3232ff'; }

            ctx.shadowBlur = 15;
            ctx.shadowColor = hex;
            ctx.strokeStyle = `rgba(${color}, ${p.life})`;
            ctx.lineWidth = 3;
            ctx.stroke();
        });
        ctx.restore();
    }
}
