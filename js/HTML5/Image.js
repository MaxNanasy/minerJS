MinerJS.HTML5.Image = function() {
    var _this = this;
    var _src  = '';
    var _x    = 0;
    var _y    = 0;
    var _w    = 50;
    var _h    = 50;

    _this.init = function(x, y, src) {
        _x   = x
        _y   = y;
        _src = src;
    }

    _this.draw = function(screen) {
        var img = new Image();
        img.src = _src;
        img.onload = function() {
            var helper   = new Scripts.Helper();
            var canvas   = helper.getById(screen);
            var context  = canvas.getContext("2d");

            context.drawImage(img, _x, _y);
        }
    }

    _this.setPosition = function(coords) {
        _x = coords.x;
        _y = coords.y;
    }

    _this.action = function() {
        console.log('.');
    }

    _this.getPosition = function() {
        return {
            x : _x,
            y : _y
        }
    }

    _this.getSize = function() {
        return {
            w : _w,
            w : _h
        }
    }
}