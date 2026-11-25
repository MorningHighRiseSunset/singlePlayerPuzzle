// Runtime configuration for the puzzle game
// This file is deployed separately from the main code and can be edited without redeploying

window.RUNTIME_CONFIG = (function () {
    const host = typeof location !== 'undefined' ? location.hostname : '';
    const isLocal = host === 'localhost' || host === '127.0.0.1';
    return {
        // Use this machine's server while developing so lobby disconnects
        // and move broadcasts hit the local process, not production Render.
        SOCKET_SERVER_URL: isLocal ? window.location.origin : 'https://singleplayerpuzzle.onrender.com',
        ENVIRONMENT: isLocal ? 'local' : 'production'
    };
})();
