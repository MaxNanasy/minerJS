/* 
 * @class
 * @description HTML 5 Canvas Context2D Rectangle Wrapper
 */
MinerJS.HTML5.Rectangle = function(parameter) {
    /**
	 * @description MinerJS.HTML5.Context2D Object
	 * @type {Object}
	 * @private
	**/
	_context2D = null;
    
    
    
    _x = 0; // Context2D
    _y = 0; // Context2D
    _w = 0; // Rectangle
    _h = 0; // Rectangle
    _c = null;  // Context2D  
    _n = '';
    _a = null;
    _map = new Array();
    _that = this;
    
    function _ctor(parameter) {
		// Create new context and set context related information
		_context2D = new MinerJS.HTML5.Context2D();
		_context2D.setPosition(parameter.position);
		_context2D.setColor(parameter.color);
		
       
        _that.setSize(parameter.size.w, parameter.size.h);
        
        _that.setName(parameter.name);
        _that.setAction(parameter.action);
        _createMap();
    }
    function _createMap() {
        
		var position = _context2D.getPosition();
		
        var y = position.y;
        
        for(var i=0; i<_h; i++) {
            
            var x = position.x;
            
            for(var j=0; j<_w; j++) {
                if(typeof _map[x] == 'undefined') {
                    _map[x] = new Array();
                }
                _map[x][y] = true;
                x++;
            }
            y++;
        }
    }
    
    _that.getMap = function() {
        return _map;
    }
    
    _that.isCoordOf = function(x, y) {
         var isCoord = false;
         
         if(typeof _map[x] != 'undefined') {
             if(typeof _map[x][y] != 'undefined') {
                 isCoord = true;
             }
         }
         
         return isCoord;
    }
    
	_that.getContext2D = function() {
		return _context2D;
	}
    
    _that.setSize = function(w, h) {
        _w = w;
        _h = h;
    }
    
  
    _that.setName = function(n) {
        _n = n;
    }
    _that.setAction = function(a) {
        _a = a;
    }
    
   
    _that.getSize = function() {
        return {
            w : _w,
            h : _h
        }
    }
   
    _that.getName = function() {
        return _n;
    }  
    
    _that.action = function() {
        _a();
    }
	_that.draw = function(screen) {
            var helper   = new Scripts.Helper();
            var canvas   = helper.getById(screen);
            var object   = canvas.getContext("2d");
            var position = _context2D.getPosition();
            object.fillStyle = _context2D.getColor();
            object.fillRect(position.x, position.y, _w, _h);

            if(_n != '') {
                    object.fillStyle = 'rgba(255, 255, 255, 1)';
                    object.fillText(_n, position.x + 5, position.y + 10); // Do not why but the +10 is need
            }
	}
      
    _ctor(parameter);
}