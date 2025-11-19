import { Wall } from './entities';
import { LEVELS } from './levels';

export class LevelLoader {
    constructor(engine) {
        this.engine = engine;
        this.currentLevelIndex = 0;
    }

    loadLevel(index) {
        if (index >= LEVELS.length) {
            console.log("ALL LEVELS COMPLETED!");
            // Loop back to 0 or show victory screen
            index = 0;
        }

        this.currentLevelIndex = index;
        const levelData = LEVELS[index];

        // Clear existing
        this.engine.walls = [];
        this.engine.sonar.pulses = [];

        // Load Walls
        levelData.walls.forEach(w => {
            this.engine.walls.push(new Wall(w.x, w.y, w.w, w.h, w.freq));
        });

        // Set Player Start
        this.engine.player.x = levelData.start.x;
        this.engine.player.y = levelData.start.y;

        // Set Exit Zone (Stored in engine for collision check)
        this.engine.exitZone = levelData.exit;

        console.log(`Loaded Level ${levelData.id}: ${levelData.name}`);
    }

    nextLevel() {
        this.loadLevel(this.currentLevelIndex + 1);
    }

    resetLevel() {
        this.loadLevel(this.currentLevelIndex);
    }
}
