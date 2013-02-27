/**
 * @class
 * @description Text object for HTML5
 */
MinerJS.HTML5.Text = function(screen, text, position, color) {
    /**
     * @description Safer usage of this poiner
     * @type {Object}
     * @private
     */
    var _this = this;
    /**
     * @description Canvas object to render to
     * @type {Object}
     * @private
     */
    var _screen = null;
    /**
     * @description Text to render
     * @type {string}
     * @private
     */
    var _string = '';
    /**
     * @description Position to render to P.x P.y
     * @type {Object}
     * @private
     */
    var _position = null;
    /**
     * @description Color of the text
     * @type {string}
     * @private
     */
    var _color = '';
    /**
     * @description Draw the text
     * @public
     * @return {undefined}
     */
    _this.draw = function() {
        var context = screen.getContext("2d");
        context.fillStyle = _color;
        context.fillText(_text, _position.x, position.y);
    }
    /**
     * @description ~ctor
     * @private
     * @param {Object} screen   Canvas object to render to
     * @param {string} text     Text to render
     * @param {Object} position Postion to render P.x P.y 
     * @param {string} color    Color for the text rgba(r,g,b,a)
     * @return {undefined}
     */
    var _ctor = function(screen, text, position, color) {
        _screen   = screen;
        _text     = text;
        _position = position;
        _color    = color;
    }
    // Run constrcutor
    _ctor(screen, text, position);
}