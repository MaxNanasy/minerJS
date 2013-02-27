/* 
 * @class
 * @description HTML 5 Canvas Context2D Wrapper
 */
MinerJS.HTML5.Context2D = function() {
	/**
	 * @description Safer usage of this pointer
	 * @type {Object}
	 * @private
	**/
    var _this = this;
	/**
	 * @description Position of context
	 * @type {Object}
	 * @private
	**/
    var _position = {};
	/**
	 * @description Color
	 * @type {string}
	 * @private
	**/
    var _color = '';
	/**
	 * @description Set position for conext
	 * @public
	 * @param {Object} Position Object with Position information (Position.x, Position.y)
	 * @return {undefined}
	**/
	_this.setPosition = function(Position) {
		_position.x = (typeof Position.x != 'undefined' && Position.x != null) ? Position.x : _position.x;
		_position.y = (typeof Position.y != 'undefined' && Position.y != null) ? Position.y : _position.y;
	}
	/**
	 * @description Get position of context
	 * @public
	 * @return {Object}
	**/
	_this.getPosition = function() {
		return _position;
	}
	/**
	 * @description Set color for conext
	 * @public
	 * @param {string} Color Format: 'rgba(r, g, b, a)'
	 * @return {undefined}
	**/
	_this.setColor = function(Color) {
		_color = (typeof Color != 'undefined' && Color != null) ? Color : '';
	}
	/**
	 * @description Get color of context
	 * @public
	 * @return {string}
	**/
	_this.getColor = function() {
		return _color;
	}
	/**
	 * @description ~ctor
	 * @private
	 * @return {undefined}
	**/
	function _ctor() {
		// Prepare variables
		_position = { x : null, y : null };
	}
	// Run ~ctor
	_ctor();
}