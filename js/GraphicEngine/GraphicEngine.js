var WIDTH  = 0;
var HEIGHT = 1;
var XPOS   = 2;
var YPOS   = 3;
var COLOR  = 4;

MinerJS.GraphicEngine = function() {
    var _screen   = null;
    var _Helper   = null;
    var _objects  = new Array();
    var _rendered = new Array();
    var _pipeline = new Array();

    this.init = function() {
        _Helper = new Scripts.Helper();

         var canvas = _Helper.getById(_screen);

        canvas.addEventListener('click', function(event) {
            var cp = _Helper.getPositionForObjectWithId(_screen);

            var click = {
                x : event.pageX - cp.left,
                y : event.pageY - cp.top
            }

            console.log('Clicked: ' + click.x + ' ' + click.y);

            for(var i=0; i<_pipeline.length; i++) {
                var object = _pipeline[i];

                switch(object.type) {
                    case 'rectangle':
                        if(click.x >= object.xpos && click.x <= (object.xpos + object.width) &&
                           click.y >= object.ypos && click.y <= (object.ypos + object.height)) {
                            object.action();
                        }
                        break;
                }
            }
        });
    }
    this.setScreen = function(screenID) {
        _screen = screenID;
    }
    this.render = function() {        
        var canvas  = _Helper.getById(_screen);

        // clean screen
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for(var i=0; i<_pipeline.length; i++) {

            var object = _pipeline[i];

            switch(object.type) {
                case 'rectangle':
                    object = _getRectangle(object);
                    break;
                case 'image':
                    object = object.image;
                    break;
            }

            object.draw(_screen);
        }
    }
    this.createRectangle = function(width, height, xpos, ypos, color, name, action) {
        var p = {
            width  : width,
            height : height,
            xpos   : xpos,
            ypos   : ypos,
            color  : color,
            name   : name,
            action : action,
            type   : 'rectangle'
        }
        
        _pipeline.push(p);
    }

    this.createImage = function(image) {
        _pipeline.push({
            image : image,
            type  : 'image'
        });
    }

    this.debug = function(message) {
        console.log('MinerJS: GraphicEngine: ' + message);
    }
    
    function _getRectangle(parameter) {
        return new MinerJS.HTML5.Rectangle({
            position : {
                x : parameter.xpos,
                y : parameter.ypos
            },
            size     : {
                w : parameter.width,
                h : parameter.height
            },
            color    : parameter.color,
            name     : parameter.name,
            action   : parameter.action
        });
    }
}