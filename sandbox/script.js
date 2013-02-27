var Engine = function() {

    var _rendered,
    _pipeline,
    _idCounter,
    _selected,
    // Enums
    e = {
        // canvas.getContext('2d').getImageData(x, y, w, h).data
        R : 0, // RED
        G : 1, // GREEN
        B : 2, // BLUE
        A : 3, // APLHA
    }; 

    this.initialize = function() {
        _rendered  = [];
        _pipeline  = [];
        _idCounter = 0;
        _selected  = null;
        
        var canvas = _getCanvas();
        var helper = new Scripts.Helper();
        
        canvas.width  = 500;
        canvas.height = 500;
        
        canvas.addEventListener('click', function(event) {
            var cp = helper.getPositionForObjectWithId('gameScreen');

            var click = {
                x : event.pageX - cp.left,
                y : event.pageY - cp.top
            };
            
            // Check current clicked pixel color
            var pixel = canvas.getContext('2d').getImageData(click.x, click.y, 1, 1).data;
            helper.getById('stats_selectedColor').style.backgroundColor = 'rgba('+pixel[e.R]+','+pixel[e.G]+','+pixel[e.B]+','+pixel[e.A]+')';
            
            var clickables = [];
            
            /*
             * Currently disabled due to a depth calculation error.
             */
            // Only if clicked pixels alhpa value is higher 0            
            //if(pixel[e.A] > 0) {
            for(var i=0; i<_rendered.length; i++) {
                var object = _rendered[i];

                var obj = {
                    pos : {
                        x : object.getPosition().x,
                        y : object.getPosition().y
                    },
                    size : {
                        w : object.getSize().w,
                        h : object.getSize().h
                    }
                };

                if(click.x >= obj.pos.x && click.x <= Number(obj.pos.x + obj.size.w) &&
                    click.y >= obj.pos.y && click.y <= Number(obj.pos.y + obj.size.h)) {
                    clickables.push(object);
                }
            }
            //}APLHA
                
            clickables.sort(function(obj_a, obj_b) {
                return obj_a.getIndex() - obj_b.getIndex();
            });
            
            // Unselect if possible
            if(_selected !== null) {
                _paintSelectionBorder(_selected, null);
            }
            
            // Check for selection
            if(clickables.length > 0) {                
                _selected = clickables[clickables.length - 1];
                
                _paintSelectionBorder(_selected, 'black');
                
                if(typeof _selected.action === 'function') {
                    _selected.action();
                }
            } else {
                _selected = null;
            }
        });
    };
    
    this.getCanvasSize = function() {
        return {
            w : _getCanvas().width,
            h : _getCanvas().height
        }
    }

    this.addObject = function(object, render) {
        render = render || false;
        object.id = _idCounter;
        _pipeline.push(object);
        _idCounter++;
        
        if(render === true) {
            this.render();
        }
        
        return _idCounter - 1;
    };
    
    this.render = function() {

        for(var i=0; i<_rendered.length; i++) {
            _pipeline.unshift(_rendered[i]);
        }

        _pipeline.sort(function(obj_a, obj_b){
            return obj_a.getIndex() - obj_b.getIndex();
        });

        _rendered = [];

        var context = _getContext();

        context.clearRect(0, 0, screen.width, screen.height);

        for(i=0; i<_pipeline.length; i++) {
            _pipeline[i].draw(context);
            _rendered.push(_pipeline[i]);
        }
        
        _updateStats();
        
        _pipeline = [];
    };
    
    function _updateStats() {
        document.getElementById('stats_renderedObjects').innerText = _rendered.length;
    }
    
    function _getCanvas() {
        return document.getElementById('gameScreen');
    }
    
    function _getContext() {
        return _getCanvas().getContext('2d');
    }
    
    function _paintSelectionBorder(object, color, borderS) {
        
        var borderSize  = (typeof borderS === 'undefined') ? 1 : borderS,
            borderColor = (color === null) ? 'white' : color,
            context     = _getContext(),
            x           = object.getPosition().x,
            y           = object.getPosition().y,
            w           = object.getSize().w,
            h           = object.getSize().h;
        
        // Calculate border
        var border = {
            // Upper left corner
            start : {
                x : x - borderSize, 
                y : y - borderSize
            },
            // Upper right corner
            urc : {
                x : x + w + borderSize,
                y : y - borderSize
            },
            // Lower right corner
            lrc : {
                x : x + w + borderSize,
                y : y + h + borderSize
            },
            // Lower left corner
            llc : {
                x : x - borderSize,
                y : y + h + borderSize
            }
        };
        
        context.lineWidth   = borderSize;
        context.strokeStyle = borderColor;
        
        context.beginPath();
        context.moveTo(border.start.x, border.start.y);
        context.lineTo(border.urc.x, border.urc.y);
        context.lineTo(border.lrc.x, border.lrc.y);
        context.lineTo(border.llc.x, border.llc.y);
        context.closePath();
        context.stroke();
    }
};

var Rect = function() {

    var _x, _y, _w, _h, _c, _z;

    this.setParameter = function(x, y, w, h, c, z) {
        _x = Number(x);
        _y = Number(y);
        _w = Number(w);
        _h = Number(h);
        _z = Number(z);
        
        _c = c;
    };

    this.draw = function(screen) {
        
        screen.beginPath();
        screen.rect(_x, _y, _w, _h);
        screen.fillStyle = _c;
        screen.fill();
    }
    
    this.action = function() {
        console.log('You clicked a rectangle with the color: ' + _c);
    }

    this.getIndex = function() {
        return _z;
    }
    
    this.getPosition = function() {
        return {
            x : _x,
            y : _y
        }
    }
    
    this.getSize = function() {
        return {
            w : _w,
            h : _h
        }
    }
}

var Img = function() {
    var _src,
    _x,
    _y,
    _w,
    _h,
    _z;
    
    this.initialize = function(x, y, z, src) {
        _x   = Number(x);
        _y   = Number(y);
        _z   = Number(z);
        _src = src;
        _w   = Number(50);
        _h   = Number(50);
    }
    
    this.action = function() {
        var name = _src.substring(4).replace('.png', '');
        
        console.log('You clicked a ' + name);
    }
    
    this.draw = function(screen) {
        var imageObj = new Image();

        imageObj.src = _src;
        
        imageObj.onload = function() {
            screen.drawImage(imageObj, _x, _y);
        };
    }

    this.getIndex = function() {
        return _z;
    }
    
    this.getPosition = function() {
        return {
            x : _x,
            y : _y
        }
    }
    
    this.getSize = function() {
        return {
            w : _w,
            h : _h
        }
    }
}

var Line = function() {
    var _coords, 
        _start,
        _z,
        _c,
        _b;
    
    this.setParameter = function(start, coords, z, c, b) {
        _start  = start;
        _coords = coords;
        _z   = Number(z);
        _c   = Number(c);
        _b   = Number(b);
    }
    
    this.getPosition = function() {
        return {
            x : _start.x,
            y : _start.y
        }
    }
    
    this.getSize = function() {
        return {
            w : 0,
            h : 0
        }
    }

    this.getIndex = function() {
        return _z;
    }
    
    this.draw = function(screen) {
        screen.lineWidth   = _b;
        screen.strokeStyle = _c;
        
        screen.beginPath();
        screen.moveTo(_start.x, _start.y);
        
        for(var coord in _coords) {
            screen.lineTo(_coords[coord].x, _coords[coord].y);
        }
        
        screen.closePath();
        screen.stroke();
    }
}

var Text = function() {
    
    var _x, _y, _c, _z, _t, _f;
    
    this.getSize = function() {
        return {
            w : Number(Number(_x) * Number(_t.length)),
            h : Number(_f)
        }
    }
    
    this.getText = function() {
        return _t;
    }
    
    this.getIndex = function() {
        return _z;
    };
    
    this.getPosition = function() {
        return {
            x : _x,
            y : _y
        };
    };
    
    this.setParameter = function(x, y, c, z, t, f) {
        _x = x;
        _y = y;
        _c = c;
        _z = z;
        _t = t;
        _f = f || 12;
        
        _y += Number(_f);
    };
    
    this.draw = function(screen) {        
        screen.fillStyle = _c;
        screen.font      = _f + 'px';
        
        screen.fillText(_t, _x, _y);
    };
};

var Hex = function() {
    var _M, _a, _i, _c, _e;
    
    function _calcEdges() {
        var sqrt3 = Math.sqrt(3),
            ri    = (_a / 6) * sqrt3,
            ru    = (_a / 3) * sqrt3,
            edges = {
            X : { A: -0.5,   B: -1, C: -0.5,  D: 0.5,    E: 1, F: 0.5    },
            Y : { A: -ri-ru, B: 0,  C: ri+ru, D: +ri+ru, E: 0, F: -ri-ru }
        };
        
        for(var edge in edges.X) {
            _e[edge]   = _e[edge]   || {};
            _e[edge].x = _e[edge].x || {};
            _e[edge].y = _e[edge].y || {};
            
            _e[edge].x = Math.round(Number(_M.x + _a * edges.X[edge]));
            _e[edge].y = Math.round(Number(_M.y + edges.Y[edge]));
        }
    }
    
    this.setParameter = function(M, a, i, c, e) {
        _M = M || {};
        _a = a || 0;
        _i = i || 0;
        _c = c || '';
        _e = e || {};
    };
    
    this.getPosition = function() {
        return {
            x : _M.x,
            y : _M.y
        };
    };
    
    this.getSize = function() {
        return {
            w : _a,
            h : _a
        };
    };
    
    this.getIndex = function() {
        return _i;
    };
    
    this.draw = function(screen) {        
        _calcEdges();
        
        var L = new Line(),
            A = _e.A,
            coords = _e;
        
        L.setParameter(A, coords, 1, _c, 1);
        L.draw(screen);
    }
};

var HexGrid = function() {
    var _M, _a, _i, _c, _g;
    
    function _calcHexGrid() {
        var sqrt3 = Math.sqrt(3),
            tb2   = 1.5, // 3/2 
            ri    = (_a / 6) * sqrt3,
            ru    = (_a / 3) * sqrt3,
            rr    = ri + ru,
            grid  = {
            X : { A: 0,      B: tb2 * _a, C: tb2 * _a,  D: 0,       E: -tb2 * _a, F: -tb2 * _a },
            Y : { A: 2 * rr, B: -rr,      C: rr,        D: 2 * -rr, E: rr,        F: -rr   }
        };
        
        for(var hex in grid.X) {
            _g[hex]   = _g[hex]   || {};
            _g[hex].x = _g[hex].x || {};
            _g[hex].y = _g[hex].y || {};
            
            _g[hex].x = Math.round(Number(_M.x + grid.X[hex]));
            _g[hex].y = Math.round(Number(_M.y + grid.Y[hex]));
        }
        
        _g.M = _M;
    }
    
    this.setParameter = function(M, a, i, c, g) {
        _M = M || {};
        _a = a || 0;
        _i = i || 0;
        _c = c || '';
        _g = g || {};
    };
    
    this.getPosition = function() {
        return {
            x : _M.x,
            y : _M.y
        };
    };
    
    this.getSize = function() {
        return {
            w : _a,
            h : _a
        };
    };
    
    this.getIndex = function() {
        return _i;
    };
    
    this.draw = function(screen) {        
        _calcHexGrid();
        
        for(var hex in _g) {
            var H = new Hex();
            H.setParameter(_g[hex], _a, _i, _c);
            H.draw(screen);
        }
    };
};

var Hexxagon = function() {
    var _M, _a, _i, _c, _p;
    
    function _prepareFields() {
        _p = [
            [0,0,1,0,0],
            [ 0,1,1,0 ],
            [0,1,1,1,0],
            [ 1,1,1,1 ],
            [1,1,1,1,1],
            [ 1,1,1,1 ],
            [1,1,0,1,1],
            [ 1,1,1,1 ],
            [1,1,1,1,1],
            [ 1,0,0,1 ],
            [1,1,1,1,1],
            [ 1,1,1,1 ],
            [1,1,1,1,1],
            [ 1,1,1,1 ],
            [0,1,1,1,0],
            [ 0,1,1,0 ],
            [0,0,1,0,0]
        ];
    }
    
    this.setParameter = function(M, a, i, c) {
        _M = M || {};
        _a = a || 0;
        _i = i || 0;
        _c = c || ''; 
    }
    
    this.draw = function(screen) {
        
        _prepareFields();
        
        var P = {};
        
        P.sqrt3 = Math.sqrt(3);
        P.a     = _a;
        P.ri    = Math.round((P.a / 6) * P.sqrt3);
        P.ru    = Math.round((P.a / 3) * P.sqrt3);
        P.x     = _a;
        P.y     = P.ri + P.ru;
        P.s     = { x : P.x, y : P.y };
        
        P.resetX = function(mod) { 
            this.x = (mod === 1) ? this.s.x : this.s.x + 1.5 * P.a;
        };
        
        P.increaseX = function() {
            this.x += 3 * P.a;
        };
        
        P.increaseY = function() {
            this.y += this.ri + this.ru;
        };
        
        for(var row=0; row<=16; row++) {
            
            for(var field = 0; field < _p[row].length; field++) {
                
                if(_p[row][field] === 1) {
                    var h = new Hex();
                    
                    h.setParameter({x:P.x,y:P.y}, P.a, _i, _c);
                    h.draw(screen);
                }
                
                P.increaseX();
            }
            
            P.increaseY();
            P.resetX(row%2);
        }
    }
    
    this.getPosition = function() {
        return {
            x : _M.x,
            y : _M.y
        };
    };
    
    this.getSize = function() {
        return {
            w : _a,
            h : _a
        };
    };
    
    this.getIndex = function() {
        return _i;
    };
};