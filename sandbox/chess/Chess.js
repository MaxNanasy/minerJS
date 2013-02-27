var MinerJS = MinerJS || {};

MinerJS.MinerChess = function() {
    var _self;
    var _engine;
    var _board;
    var _gameStats;
    
    function _drawBoard() {       
        
        var flip    = true,
            x       = _board.start.x,
            y       = _board.start.y;
        
        
        // Calculate and create fields for chessboard
        for(var currentRank = 1; currentRank <= _board.dimension.ranks; currentRank++) {
            
            y = _board.start.y + (_board.field.size * currentRank) - _board.field.size;
            
            for(var currentFile = 1; currentFile <= _board.dimension.files; currentFile++) {
                var color = (!flip) ? _board.color.black : _board.color.white;
                var rect  = new Rect();
                
                x = _board.start.x + (_board.field.size * currentFile) - _board.field.size;
                
                rect.setParameter(x, y, _board.field.size, _board.field.size, color, _board.fieldDepth);                
                _engine.addObject(rect);
                
                
                var t = new Text();
                t.setParameter(x, y, (flip) ? _board.color.black : _board.color.white, _board.textDepth, x+''+y, 12);
                _engine.addObject(t);
                
                flip = !flip;
            }
            
            flip = !flip;
        }
        
        // Add chessboard border
        var border = new Line();
        
        var coords = [
            { // Upper Right
                x : Number(_board.start.x + _board.dimension.files * _board.field.size),
                y : Number(_board.start.y)
            },
            { // Lower Right
                x : Number(_board.start.x + _board.dimension.files * _board.field.size),
                y : Number(_board.start.y + _board.dimension.ranks * _board.field.size)
            },
            { // Lower Left
                x : Number(_board.start.x),
                y : Number(_board.start.y + _board.dimension.ranks * _board.field.size)
            }
        ];
        
        border.setParameter({x:_board.start.x, y:_board.start.y}, coords, _board.fieldDepth, _board.color.border, _board.color.boderSize);
        
        _engine.addObject(border);
        
        // Background color
        var background = new Rect();
        
        background.setParameter(0, 0, _engine.getCanvasSize().w, _engine.getCanvasSize().h, 'brown', 0);
        
        _engine.addObject(background);
        
        // Draw
        _engine.render();
    }
    
    function _drawMeeples() {
        var fields = _board.getFields();
        
        for(var index in fields) {
            if(fields[index].meeple != null) {
                var meeple_rendering = new Img();
                var meeple           = fields[index].meeple;
                var rank_pad         = 50;
                var file_pad         = 0;
                
                meeple_rendering.initialize(
                    Number(meeple.file * _board.field.size + file_pad),
                    Number(_board.getNumberForFile(meeple.rank) * _board.field.size + rank_pad),
                    _board.meepleDepth,
                    'meeples/img/' + meeple.type + '.png'
                );
                
                /*
                console.log(
                    'Render Meeple: ' + meeple.type + '\n' +
                    '- Rank : ' + meeple.rank + '\n' +
                    '- File : ' + meeple.file + '\n' +
                    '- Depth: ' + _board.meepleDepth + '\n' +
                    '- PosY : ' + Number(meeple.file * _board.field.size + file_pad) + '\n' +
                    '- PosX : ' + Number(_board.getNumberForFile(meeple.rank) * _board.field.size + rank_pad) + '\n' +
                    'Source : ' + 'meeples/img/' + meeple.type + '.png'
                );
                */
                _engine.addObject(meeple_rendering);
            }
        }
        
        _engine.render();
    }
    
    function _switchPlayer() {
        _gameStats.currentPlayer = (_gameStats.currentPlayer === 'white') ? 'black' : 'white';
    }
    
    return {
        initialize : function() {
            
            var args = arguments[0];
            
            _self   = this;
            _engine = (args.engine === undefined) ? null : args.engine;
            
            if(_engine === null) {
                console.log('Error: No engine found.');
            }
            
            _gameStats = {
                currentPlayer : 'white',                
            }
            
            _board = new MinerJS.MinerChess.Board();
            _board.initialize({
                start       : { x : 50, y : 50 },
                field       : { size : 50 },
                color       : { white : 'white', black : 'black', border : 'red' },
                dimension   : { files : 8, ranks : 8 },
                fieldDepth  : 10,
                meepleDepth : 20,
                textDepth   : 15,
                borderSize  : 1,
                engine      : _engine
            });
            
            _board.draw();
        },
        
        getBoard : function() {
            return _board;
        }
    };
};