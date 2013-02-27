var MinerJS = MinerJS || {};
MinerJS.MinerChess = MinerJS.MinerChess || {};

MinerJS.MinerChess.Meeple = function() {
    
    var _self = this;
    
    _self.type;
    
    _self.rank;
    _self.file;
    
    _self.draw = function(board, args) {
        
        var image = new Img(),
            src   = 'meeples/img/' + _self.type + '.png',
            x     = args.x || 0,
            y     = args.y || 0,
            depth = board.meepleDepth;
            
        image.initialize(x, y, depth, src);
        
        board.engine.addObject(image);
    }
}