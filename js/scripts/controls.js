/* 
 * Control buttons for MinerJS
 */
Scripts.Controls = function() {
    /**
     * @private
     * @type {Object}
     */
    var _Helper = null;
    /**
     * @private
     * @type {Object}
     */
    var _MinerJS = null;
    /**
     * @function
     * @public
     * @return {undefined}
     */
    this.init = function(miner) {
        _MinerJS = miner;
        _Helper  = new Scripts.Helper();
        this.setupInterfaceControls();
    }
    /**
     * @function
     * @public
     * @return {undefined}
     */
    this.setupInterfaceControls = function() {
    }
}