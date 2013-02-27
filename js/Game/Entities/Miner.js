var MINER_STATES = {
    IDLE     : 'idle',
    WORKING  : 'working',
    SLEEPING : 'sleeping',
    POKED    : 'poked',
    DEAD     : 'dead'
}
var MINER_MIND = {
    IDLE     : 'What a nice day!',
    WORKING  : 'I live to work',
    SLEEPING : 'Zzz Zzz Zzz',
    POKED    : 'Stop poking me!',
    DEAD     : 'R.I.P.'
}

MinerJS.Miner = function() {
    
    var _minGold    = 0;
    var _minPower   = 0;
    var _maxPower   = 10;
    var _maxHealth  = 100;
    var _digHealth  = 5;
    var _digPower   = 1;
    var _digGold    = 1;
    var _feedCost   = 1;
    var _feedHealth = 5;    
    var _powerRegeneration  = 2;
    var _healthRegeneration = 5;

    var _model    = '/img/game/miner/miner.png';
    var _image    = null;
    var _position = {
        x : 0,
        y : 40
    };
    var _stepSize = 10;

    var _name     = '';
    var _state    = ''; 
    var _gold     = 0;
    var _power    = 0;
    var _mind     = '';
    var _health   = 0;
    
    var _Engine = null;
 
    this.init = function(MinerJS_GameEngine) {
        _Engine = MinerJS_GameEngine;
        this.reset();
    }
    this.reset = function() {
        _state    = MINER_STATES.IDLE;
        _name     = 'Peet';
        _power    = _maxPower;
        _health   = _maxHealth;
        _gold     = _minGold;
        _mind     = MINER_MIND.IDLE;
        _image    = new MinerJS.HTML5.Image();
        _image.init(_position.x, _position.y, _model);
    }
    this.setName = function(name) {
        _name = name;
    }
    this.getName = function() {
        return _name;
    }
    this.getState = function() {
        return _state;
    }
    this.getGold = function() {
        return _gold;
    }
    this.getPower = function() {
        return _power;
    }
    this.setPower = function(power) {
        _power = power;
    }
    this.getMaxPower = function() {
        return _maxPower;
    }
    this.setMaxPower = function(power) {
        _maxPower = power;
    }
    this.getMind = function() {
        return _mind;
    }
    this.getHealth = function() {
        return _health;
    }
    this.setHealth = function(newHealth) {
        _health = newHealth;
    }
    this.update = function() {
        
        _checkDeath();
        
        if(_power > _minPower && _state == MINER_STATES.IDLE 
                      || _state == MINER_STATES.WORKING
                      || _state == MINER_STATES.POKED) {
            _state = MINER_STATES.WORKING;
            _mind  = MINER_MIND.WORKING;
            
            _dig();
        }
        if(_state == MINER_STATES.SLEEPING) {
            _state = MINER_STATES.SLEEPING;
            _mind  = MINER_MIND.SLEEPING;
            
            _sleep();
            
            if(_power == _maxPower) {
                _state = MINER_STATES.IDLE;
                _mind  = MINER_MIND.IDLE;
            }
        }
        if(_power == _minPower && _state == MINER_STATES.WORKING) {
            _state = MINER_STATES.SLEEPING;
            _mind  = MINER_MIND.SLEEPING;
        }

        _calculatePosition();
        _image.setPosition(_position);
        _Engine.renderImageToScreen(_image);
    }   
    this.interaction = function(interaction) {

        if(_state == MINER_STATES.DEAD) {
            _Engine.renderToScreen('MinerJS-Feedback', 'I am dead...<br />', false);

            return;
        }

        switch(interaction) {
            case 'feed':_feed();break;
            case 'poke':_poke();break;
        }
    }
       
    
    function _dig() {
        _power  -= _digPower;
        _gold   += _digGold;
        _health -= _digHealth;
    }
    function _sleep() {
        _power  += _powerRegeneration;
        _health += _healthRegeneration;
    }
    function _checkDeath() {
        if(_health <= 0) {
            _state = MINER_STATES.DEAD;
            _mind  = MINER_MIND.DEAD;
        }
    }
    function _poke() {
        _state = MINER_STATES.POKED;
        _mind  = MINER_MIND.POKED;
        
        var feedback = 'You poked ' + _name + '<br />';
        _Engine.renderToScreen('MinerJS-Feedback', feedback, false);
    }
    function _feed() {
        
        var feedback = '';
        
        if(_gold >= _feedCost) {
            _gold   -= _feedCost;
            _health += _feedHealth;
            feedback = 'You spend ' + _feedCost + ' gold to gain ' + _feedHealth + ' health';
        } else {
            feedback = 'You dont have enough money to feed ' + _name;
        }
        
        _Engine.renderToScreen('MinerJS-Feedback', feedback + '<br />', false);
    }

    function _calculatePosition() {

        _position.x += _stepSize;

        if(_position.x > 100) {
            _stepSize = -10;
        }
        if(_position.x == 0) {
            _stepSize = 10;
        }
    }
}