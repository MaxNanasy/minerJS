var MinerJS = MinerJS || {};
MinerJS.MinerChess = MinerJS.MinerChess || {};

MinerJS.MinerChess.Board = function() {
    
    var _self = this,
        _helper,
        _fields,
        _rankMap,
        _fieldMap,
        _meeples;    
    
    // PRIVATE
    
    function _prepareFields() {
        
        _fields = {};
        
        for(var file=8; file>0; file--) {
            
            for(var rank=8; rank>0; rank--) {
                
                var index  = sFile + '' + rank,
                    sFile  = _fileMap[file],
                    field  = new MinerJS.MinerChess.Field(),
                    meeple = _getMeepleForStartPosition(rank, sFile);
                    
                field.initialize({
                    meeple : meeple,
                    rank   : rank,
                    file   : sFile,
                    index  : sFile + '' + rank
                });
                
                _fields[index] = field;
            }
        }
    }
    
    function _getMeepleForStartPosition(rank, file) {
        var meeple = null;
        
        if(_fieldMap[file][rank] !== null) {   
            meeple = new MinerJS.MinerChess.Meeple();
            meeple.type = _fieldMap[file][rank];
            meeple.rank = rank;
            meeple.file = file;
        }
            
        return meeple;
    }
    
    // PRIVATE - DRAW Functions
    function __draw_Border() {
        var border = new Line();
        
        var coords = [
            { // Upper Right
                x : Number(_self.start.x + _self.dimension.files * _self.field.size),
                y : Number(_self.start.y)
            },
            { // Lower Right
                x : Number(_self.start.x + _self.dimension.files * _self.field.size),
                y : Number(_self.start.y + _self.dimension.ranks * _self.field.size)
            },
            { // Lower Left
                x : Number(_self.start.x),
                y : Number(_self.start.y + _self.dimension.ranks * _self.field.size)
            }
        ];
        
        border.setParameter({x:_self.start.x, y:_self.start.y}, coords, _self.fieldDepth, _self.color.border, _self.color.boderSize);
        
        _self.engine.addObject(border);
    }
    function __draw_Fields() {
        for(var index in _fields) {
            _fields[index].draw(_self);
        }
    }
    function __draw_Background() {
        var background = new Rect();
        
        background.setParameter(0, 0, _self.engine.getCanvasSize().w, _self.engine.getCanvasSize().h, 'brown', 0);
        
        _self.engine.addObject(background);
    }
    
    // PUBLIC
    _self.initialize = function(boardSettings) {
        
        _helper   = new Scripts.Helper();
        
        _meeples  = ['king', 'queen', 'rook', 'knight', 'bishop', 'pawn'];
        _fileMap  = {1:'A',2:'B',3:'C',4:'D',5:'E',6:'F',7:'G',8:'H'};
        _fieldMap = {
            A:{1:'white_rook',  2:'white_pawn',3:null,4:null,5:null,6:null,7:'black_pawn',8:'black_rook'},
            B:{1:'white_knight',2:'white_pawn',3:null,4:null,5:null,6:null,7:'black_pawn',8:'black_knight'},
            C:{1:'white_bishop',2:'white_pawn',3:null,4:null,5:null,6:null,7:'black_pawn',8:'black_bishop'},
            D:{1:'white_king',  2:'white_pawn',3:null,4:null,5:null,6:null,7:'black_pawn',8:'black_king'},
            E:{1:'white_queen', 2:'white_pawn',3:null,4:null,5:null,6:null,7:'black_pawn',8:'black_queen'},
            F:{1:'white_bishop',2:'white_pawn',3:null,4:null,5:null,6:null,7:'black_pawn',8:'black_bishop'},
            G:{1:'white_knight',2:'white_pawn',3:null,4:null,5:null,6:null,7:'black_pawn',8:'black_knight'},
            H:{1:'white_rook',  2:'white_pawn',3:null,4:null,5:null,6:null,7:'black_pawn',8:'black_rook'}
        };
        
        _self = _helper.addToObject(boardSettings, _self);
        
        _self.dimension['length'] = Number(_self.field.size * _self.dimension.ranks);
        
        _prepareFields();
    }
    
    _self.draw = function() {        
        __draw_Background();
        __draw_Border();
        __draw_Fields();
        
        _self.engine.render();
    }
    
    _self.getFields = function(index) {
        
        var request = [];
        
        if(typeof index == 'undefined') {
            request = _fields;
        } else {
            request = (typeof _fields[index] != 'undefined') ? [_fields[index]] : [];
        }
        
        return request;
    }
    
    _self.printBoardStatus = function() {
        
        var log     = '';
        var newLine = '\n';
        
        for(var index in _fields) {
            var f  = _fields[index];
            var mt = (f.meeple === null) ? '' : f.meeple.type;
            
            log += index + ': ' + mt + newLine;
        }
        
        console.log(log);
    }
    
    _self.getNumberForFile = function(fileString) {        
        for(var index in _fileMap) { 
            
            if(_fileMap[index] === fileString) {
                return index;
            }
        }
        
        return null;
    }
    
    _self.getFieldColor = function() {
        
    }
};