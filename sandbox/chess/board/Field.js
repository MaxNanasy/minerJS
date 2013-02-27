var MinerJS = MinerJS || {};
MinerJS.MinerChess = MinerJS.MinerChess || {};

MinerJS.MinerChess.Field = function() {
    
    var _self = this,
        _helper;    
    
    function _getColor(board) {
        return (_self.rank % 2 === board.getNumberForFile(_self.file) % 2) ? 'white' : 'black';
    }
    
    this.initialize = function(fieldSettings) {
        _helper = new Scripts.Helper();
        
        _self.meeple = fieldSettings.meeple;
        _self.rank   = fieldSettings.rank;
        _self.file   = fieldSettings.file;
        _self.index  = fieldSettings.index;
        
        _self.engineIndex = null;
    };
    
    this.draw = function(board) {        
        // Prepare field
        var field = new Rect(),
            x     = board.start.x + ((board.dimension.files - board.getNumberForFile(_self.file)) * board.field.size),
            y     = board.start.y + ((board.dimension.ranks - _self.rank) * board.field.size),
            w     = board.field.size,
            h     = board.field.size,
            c     = _getColor(board),
            z     = board.fieldDepth;
        
        field.setParameter(x, y, w, h, c, z);
        
        // Draw field  
        board.engine.addObject(field);
        
        if(_self.meeple !== null) {
            _self.meeple.draw(board, { x : x , y : y });
        }
    };
};