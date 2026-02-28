/**
 * Tile Rack Integrity Checker
 * Monitors and ensures player rack never exceeds 7 tiles
 */

class TileRackChecker {
    constructor() {
        this.game = null;
        this.checkInterval = null;
        this.violations = [];
        this.maxRackSize = 7;
        this.isEnabled = true;
    }

    // Initialize the checker when game is available
    initialize(game) {
        this.game = game;
        console.log('🔍 Tile Rack Integrity Checker Initialized');
        this.startMonitoring();
    }

    // Start continuous monitoring
    startMonitoring() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }

        this.checkInterval = setInterval(() => {
            this.performIntegrityCheck();
        }, 1000); // Check every second

        // Also check immediately
        setTimeout(() => this.performIntegrityCheck(), 100);
    }

    // Stop monitoring
    stopMonitoring() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
        console.log('🛑 Tile Rack Integrity Checker Stopped');
    }

    // Main integrity check
    performIntegrityCheck() {
        if (!this.game || !this.isEnabled) return;

        const rackSize = this.game.playerRack ? this.game.playerRack.length : 0;
        const placedTiles = this.game.placedTiles ? this.game.placedTiles.length : 0;

        // Log current state
        console.log(`🎯 Rack Check: ${rackSize} tiles, ${placedTiles} placed`);

        // Check for violations
        this.checkForViolations(rackSize, placedTiles);

        // Auto-fix violations
        if (this.violations.length > 0) {
            this.autoFixViolations();
        }
    }

    // Check for specific violations
    checkForViolations(rackSize, placedTiles) {
        this.violations = [];

        // Violation 1: Too many tiles in rack
        if (rackSize > this.maxRackSize) {
            this.violations.push({
                type: 'RACK_OVERFLOW',
                severity: 'CRITICAL',
                message: `Player has ${rackSize} tiles (max: ${this.maxRackSize})`,
                details: {
                    rackSize,
                    maxAllowed: this.maxRackSize,
                    excess: rackSize - this.maxRackSize
                }
            });
        }

        // Violation 2: Duplicate tiles in rack
        const tileLetters = this.game.playerRack.map(t => t ? t.letter : 'EMPTY');
        const letterCounts = {};
        tileLetters.forEach(letter => {
            if (letter && letter !== 'EMPTY') {
                letterCounts[letter] = (letterCounts[letter] || 0) + 1;
            }
        });

        Object.keys(letterCounts).forEach(letter => {
            if (letterCounts[letter] > 1) {
                this.violations.push({
                    type: 'DUPLICATE_TILES',
                    severity: 'HIGH',
                    message: `Duplicate tile "${letter}" found ${letterCounts[letter]} times`,
                    details: {
                        letter,
                        count: letterCounts[letter]
                    }
                });
            }
        });

        // Violation 3: Invalid tile objects
        this.game.playerRack.forEach((tile, index) => {
            if (!tile || typeof tile !== 'object') {
                this.violations.push({
                    type: 'INVALID_TILE_OBJECT',
                    severity: 'HIGH',
                    message: `Invalid tile at index ${index}`,
                    details: { index, tile }
                });
            }
        });

        // Violation 4: Wild tile integrity
        const wildTiles = this.game.playerRack.filter(t => t && (t.letter === '*' || t.originalLetter === '*'));
        wildTiles.forEach((tile, index) => {
            const actualIndex = this.game.playerRack.indexOf(tile);
            if (actualIndex !== index) {
                this.violations.push({
                    type: 'WILD_TILE_INTEGRITY',
                    severity: 'MEDIUM',
                    message: `Wild tile integrity issue at index ${actualIndex}`,
                    details: { tile, expectedIndex: index, actualIndex }
                });
            }
        });

        // Report violations
        if (this.violations.length > 0) {
            console.error('🚨 TILE RACK VIOLATIONS DETECTED:');
            this.violations.forEach(v => {
                console.error(`  [${v.severity}] ${v.type}: ${v.message}`);
                if (v.details) {
                    Object.keys(v.details).forEach(key => {
                        console.error(`    ${key}: ${v.details[key]}`);
                    });
                }
            });
        }
    }

    // Auto-fix detected violations
    autoFixViolations() {
        this.violations.forEach(violation => {
            switch (violation.type) {
                case 'RACK_OVERFLOW':
                    this.fixRackOverflow(violation);
                    break;
                case 'DUPLICATE_TILES':
                    this.fixDuplicateTiles(violation);
                    break;
                case 'INVALID_TILE_OBJECT':
                    this.fixInvalidTileObjects(violation);
                    break;
                case 'WILD_TILE_INTEGRITY':
                    this.fixWildTileIntegrity(violation);
                    break;
            }
        });

        // Clear violations after fixing
        this.violations = [];
    }

    // Fix rack overflow
    fixRackOverflow(violation) {
        console.log(`🔧 Fixing rack overflow: removing ${violation.details.excess} excess tiles`);
        
        // Remove excess tiles from the end
        for (let i = 0; i < violation.details.excess; i++) {
            if (this.game.playerRack.length > 0) {
                const removedTile = this.game.playerRack.pop();
                console.log(`  Removed tile: ${removedTile ? removedTile.letter : 'NULL'}`);
            }
        }
        
        this.game.renderRack();
        console.log(`✅ Rack overflow fixed. New rack size: ${this.game.playerRack.length}`);
    }

    // Fix duplicate tiles
    fixDuplicateTiles(violation) {
        console.log(`🔧 Fixing duplicate tiles: removing duplicate "${violation.details.letter}"`);
        
        // Remove duplicates, keeping only one of each
        const tilesToKeep = [];
        this.game.playerRack.forEach((tile, index) => {
            if (tile && tile.letter === violation.details.letter) {
                tilesToKeep.push(tile);
            }
        });
        
        // Replace rack with deduplicated tiles
        this.game.playerRack = tilesToKeep;
        this.game.renderRack();
        console.log(`✅ Duplicate tiles fixed. New rack size: ${this.game.playerRack.length}`);
    }

    // Fix invalid tile objects
    fixInvalidTileObjects(violation) {
        console.log(`🔧 Fixing invalid tile object at index ${violation.details.index}`);
        
        // Remove invalid tile
        if (this.game.playerRack[violation.details.index] !== undefined) {
            const removedTile = this.game.playerRack.splice(violation.details.index, 1);
            console.log(`  Removed invalid tile: ${removedTile ? 'object' : 'undefined'}`);
        }
        
        this.game.renderRack();
        console.log(`✅ Invalid tile objects fixed. New rack size: ${this.game.playerRack.length}`);
    }

    // Fix wild tile integrity
    fixWildTileIntegrity(violation) {
        console.log(`🔧 Fixing wild tile integrity issue at index ${violation.details.actualIndex}`);
        
        // Wild tiles should always have these properties
        const expectedWildTile = {
            letter: '*',
            value: 0,
            isBlank: true,
            originalLetter: '*'
        };
        
        if (this.game.playerRack[violation.details.actualIndex]) {
            // Fix the wild tile properties
            this.game.playerRack[violation.details.actualIndex] = {
                ...this.game.playerRack[violation.details.actualIndex],
                ...expectedWildTile,
                id: this.game.playerRack[violation.details.actualIndex].id || `wild_${Date.now()}`
            };
            
            console.log(`  Fixed wild tile at index ${violation.details.actualIndex}`);
        }
        
        this.game.renderRack();
        console.log(`✅ Wild tile integrity fixed. Rack size: ${this.game.playerRack.length}`);
    }

    // Get current rack state
    getRackState() {
        if (!this.game) return null;
        
        return {
            size: this.game.playerRack ? this.game.playerRack.length : 0,
            tiles: this.game.playerRack ? [...this.game.playerRack] : [],
            violations: [...this.violations],
            isValid: this.violations.length === 0,
            placedTiles: this.game.placedTiles ? this.game.placedTiles.length : 0
        };
    }

    // Generate integrity report
    generateReport() {
        const state = this.getRackState();
        
        console.log('\n📊 TILE RACK INTEGRITY REPORT');
        console.log('='.repeat(50));
        console.log(`Rack Size: ${state.size}/${this.maxRackSize}`);
        console.log(`Placed Tiles: ${state.placedTiles}`);
        console.log(`Status: ${state.isValid ? '✅ VALID' : '❌ VIOLATIONS'}`);
        
        if (state.violations.length > 0) {
            console.log('\nViolations:');
            state.violations.forEach((v, i) => {
                console.log(`${i + 1}. [${v.severity}] ${v.type}: ${v.message}`);
            });
        }
        
        console.log('='.repeat(50));
        
        return state;
    }

    // Enable/disable monitoring
    setEnabled(enabled) {
        this.isEnabled = enabled;
        if (enabled) {
            this.startMonitoring();
        } else {
            this.stopMonitoring();
        }
    }
}

// Auto-initialize when game loads
window.addEventListener('DOMContentLoaded', () => {
    // Wait for game to initialize
    setTimeout(() => {
        if (window.game) {
            window.tileRackChecker = new TileRackChecker();
            window.tileRackChecker.initialize(window.game);
            
            // Add global controls
            window.checkTileRack = () => window.tileRackChecker.generateReport();
            window.fixTileRack = () => window.tileRackChecker.autoFixViolations();
            window.toggleRackMonitoring = (enabled) => window.tileRackChecker.setEnabled(enabled);
            
            console.log('🎮 Tile Rack Checker loaded! Use checkTileRack(), fixTileRack(), toggleRackMonitoring()');
        }
    }, 2000);
});
