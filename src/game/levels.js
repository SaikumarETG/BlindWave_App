export const LEVELS = [
    {
        id: 1,
        name: "RGB Training",
        start: { x: 100, y: 300 },
        exit: { x: 700, y: 300, w: 50, h: 50 },
        walls: [
            // Outer Box
            { x: 0, y: 0, w: 800, h: 10, freq: 'ALL' },
            { x: 0, y: 590, w: 800, h: 10, freq: 'ALL' },
            { x: 0, y: 0, w: 10, h: 600, freq: 'ALL' },
            { x: 790, y: 0, w: 10, h: 600, freq: 'ALL' },

            // Red Gate
            { x: 200, y: 100, w: 20, h: 400, freq: 'RED' },

            // Green Gate
            { x: 400, y: 100, w: 20, h: 400, freq: 'GREEN' },

            // Blue Gate
            { x: 600, y: 100, w: 20, h: 400, freq: 'BLUE' }
        ]
    },
    {
        id: 2,
        name: "The Spectrum Maze",
        start: { x: 50, y: 50 },
        exit: { x: 750, y: 550, w: 50, h: 50 },
        walls: [
            // Borders
            { x: 0, y: 0, w: 800, h: 10, freq: 'ALL' },
            { x: 0, y: 590, w: 800, h: 10, freq: 'ALL' },
            { x: 0, y: 0, w: 10, h: 600, freq: 'ALL' },
            { x: 790, y: 0, w: 10, h: 600, freq: 'ALL' },

            // Maze Walls
            { x: 100, y: 0, w: 10, h: 400, freq: 'RED' },
            { x: 200, y: 200, w: 10, h: 400, freq: 'BLUE' },
            { x: 300, y: 0, w: 10, h: 300, freq: 'GREEN' },
            { x: 300, y: 400, w: 300, h: 10, freq: 'RED' },
            { x: 500, y: 100, w: 10, h: 300, freq: 'BLUE' },
            { x: 600, y: 200, w: 200, h: 10, freq: 'GREEN' }
        ]
    },
    {
        id: 3,
        name: "Blind Panic",
        start: { x: 400, y: 300 },
        exit: { x: 50, y: 50, w: 50, h: 50 },
        walls: [
            // Borders
            { x: 0, y: 0, w: 800, h: 10, freq: 'ALL' },
            { x: 0, y: 590, w: 800, h: 10, freq: 'ALL' },
            { x: 0, y: 0, w: 10, h: 600, freq: 'ALL' },
            { x: 790, y: 0, w: 10, h: 600, freq: 'ALL' },

            // Scattered Pillars (Hard navigation)
            { x: 200, y: 200, w: 50, h: 50, freq: 'RED' },
            { x: 550, y: 200, w: 50, h: 50, freq: 'GREEN' },
            { x: 200, y: 450, w: 50, h: 50, freq: 'BLUE' },
            { x: 550, y: 450, w: 50, h: 50, freq: 'RED' },

            { x: 350, y: 100, w: 100, h: 20, freq: 'ALL' },
            { x: 350, y: 480, w: 100, h: 20, freq: 'ALL' },
            { x: 100, y: 300, w: 20, h: 100, freq: 'BLUE' },
            { x: 680, y: 300, w: 20, h: 100, freq: 'GREEN' }
        ]
    }
];
