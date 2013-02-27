/**
 * @description MinerJS Game Engine Class
 * @class
 */
MinerJS.GameEngine = function() {
    /**
     * @private
     * @type {string}
     * @const
     * @description Current MinerJS version
     */
    var _version  = 'alpha';
    /**
     * @private
     * @type {number}
     * @const
     * @description Gameloop speed in milliseconds
     */
    var _speed    = 1000;
    /**
     * @private
     * @type {object}
     * @description Gameloop interval
     */
    var _gameLoop = null;
    /**
     * @private
     * @type {number}
     * @description Ticks since engine start
     */
    var _ticks    = 0;
    /**
     * @private
     * @type {object}
     * @description Instance of a miner
     */
    var _miner    = null;
    /**
     * @private
     * @type {object}
     * @description Scripts Helper with basic wrapped helper functions
     */
    var _Helper   = null;
    /**
     * @private
     * @type {object}
     * @description Graphic Engine
     */
    var _GraphicEngine = null;
    /**
     * @private
     * @type {object}
     * @description Safer usage of this pointer
     */
    var _that = this;
    /**
     * @description Initiate the game engine and makes it ready to start
     * @public
     * @return {undefined}
     */
    _that.init = function() {
        _miner = new MinerJS.Miner();
        _miner.init(this);
        _Helper = new Scripts.Helper();
        _initGraphicEngine();
    }    
    /**
     * @description Starts the game engine
     * @public
     * @return {undefined}
     */
    _that.start = function() {
        _gameLoop = setInterval(_update, _speed);
    }
    /**
     * @description Pauses the game engine
     * @public
     * @return {undefined}
     */
    _that.pause = function() {
        clearInterval(_gameLoop);
    }
    /**
     * @description Stops & Resets the game engine
     * @public
     * @return {undefined}
     */
    _that.stop = function() {    
        clearInterval(_gameLoop);
        _gameLoop = null;
        _reset();
    }
    /**
     * @description Sends an interaction to the miner
     * @public
     * @param {string} action Action to perform
     * @return {undefined}
     */
    _that.interact = function(action) {
        _miner.interaction(action);
    }
    /**
     * @description Render function wrapper
     * @private
     * @param {string}  screenId  Id of the object to render into
     * @param {string}  content   Content to render
     * @param {boolean} overwrite Overwrite existing content?
     * @return {undefined}
     */
    _that.renderToScreen = function(screenId, content, overwrite) {
        _renderToScreen(screenId, content, overwrite);
    }

    _that.renderImageToScreen = function(image) {
        _GraphicEngine.createImage(image);
    }

    /**
     * @description Updates the gameloop
     * @private
     * @return {undefined}
     */
    function _update() {
        
        var screen    = 'MinerJS-Mainframe';
        var content   = new Array();
        var overwrite = false;
        
        content.push('- - - MinerJS (ver. ' + _version + ') - - -<br />');
        content.push('Ticks  : ' + _ticks + '<br />');
        content.push('Speed  : ' + _getSpeed() + '<br />');
        content.push('RunTime: ' + _calculateRunTime() + '<br />');
        
        content.push('- - - - - - - - - -<br />');
        
        content.push(_miner.getName() + ':<br />');
        content.push('Mind  : ' + _miner.getMind() + '<br />');
        content.push('State : ' + _miner.getState() + '<br />');
        content.push('Health: ' + _miner.getHealth() + '<br />');
        content.push('Gold  : ' + _miner.getGold() + '<br />');
        content.push('Power : ' + _miner.getPower() + '<br />');      
        
        _renderToScreen(screen, '', true);
        
        for(var i=0; i<content.length; i++) {
            _renderToScreen(screen, content[i], overwrite);
        }
        
        _miner.update();
        _GraphicEngine.render();
        
        _ticks++;
    }
    /**
     * @function
     * @private
     * @description Returns the current game engines speed
     * @return {string}
     */
    function _getSpeed() {
        return '~' + Math.floor(1000 / _speed) + ' ticks per second';
    }
    /**
     * @function
     * @private
     * @description Prints a message to the console
     * @param {string} message Message to print
     * @return {undefined}
     */
    function _debug(message) {
        console.log('MinerJS: ' + message);
    }
    /**
     * @description Returns the runtime as a formatted string
     * @private
     * @return {string}
     */
    function _calculateRunTime() {
        var runTime = _ticks * _speed / 1000;
    
        var hours = Math.floor(runTime / 3600);
        hours = (hours < 10) ? '0' + hours : hours;
        runTime = runTime - hours * 3600;       
        
        var minutes = Math.floor(runTime / 60);
        minutes = (minutes < 10) ? '0' + minutes : minutes;
        runTime = runTime - minutes * 60;
        
        var seconds = Math.floor(runTime);                      
        seconds = (seconds < 10) ? '0' + seconds : seconds;
        
        return hours + 'h ' + minutes + 'm ' + seconds + 's';
    }
    /**
     * @description Render function wrapper
     * @private
     * @param {string}  screenId  Id of the object to render into
     * @param {string}  content   Content to render
     * @param {boolean} overwrite Overwrite existing content?
     * @return {undefined}
     */
    function _renderToScreen(screenId, content, overwrite) {
        var object = _Helper.getById(screenId);
        _Helper.renderToScreen(screenId, content, overwrite);
    }
    /**
     * @function
     * @private
     * @description Resets the game engine
     * @return {undefined}
     */
    function _reset() {
        _miner.reset();
        _ticks = 0;
        _update();
    }
    /**
     * @function
     * @private
     * @descriptions Initiates the MinerJS Graphic Engine
     * @return {undefined}
     */
    function _initGraphicEngine() {
        _GraphicEngine = new MinerJS.GraphicEngine();
        _GraphicEngine.setScreen('MinerJS-Canvas-GameClient');
        _GraphicEngine.init();
        // Actions
        var action = {
            start : _that.start,
            pause : _that.pause,
            stop  : _that.stop,
			poke  : function() { _that.interact('poke') },
			feed  : function() { _that.interact('feed') }
        }
        // Stat
        _GraphicEngine.createRectangle(30, 15,   0,   0, 'rgba(  0,   0,   0, 1)', 'Start', action.start);
        _GraphicEngine.createRectangle(40, 15,  40,   0, 'rgba(  0,   0,   0, 1)', 'Pause', action.pause);
        _GraphicEngine.createRectangle(30, 15,  90,   0, 'rgba(  0,   0,   0, 1)', 'Stop',  action.stop);
		_GraphicEngine.createRectangle(30, 15, 130,   0, 'rgba(  0,   0,   0, 1)', 'Poke',  action.poke);
		_GraphicEngine.createRectangle(30, 15, 170,   0, 'rgba(  0,   0,   0, 1)', 'Feed',  action.feed);
     }                        
}