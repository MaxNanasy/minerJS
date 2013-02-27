/* 
 * Helper function for often used js functionality
 */
Scripts.Helper = function() {
    /**
     * @description document.getElementById
     * @function
     * @public
     * @param {string} id Object ID
     * @return {Object}
     */
    this.getById = function(id) {
        return document.getElementById(id);
    }
    /**
     * @description document.getElementsByClass
     * @function
     * @public
     * @param {string} className Name of the class
     * @return {array]
     */
    this.getByClass = function(className) {
        return document.getElementsByClassName(className);
    }
    /**
     * @description Removes all classes from an object
     * @function
     * @public
     * @param {string} id Object id
     * @return {undefined}
     */
    this.removeClass = function(id) {
        this.getById(id).className = '';
    }
    /**
     * @description Bind a function to an object in the DOM
     * @function
     * @public
     * @param {string} type      Function type to bind
     * @param {string} id        ID of the object to bind to
     * @param {Object} callback  Function to call
     * @param {Object} parameter Parameter for the function to call
     * @return {undefined}
     */
    this.bind = function(type, id, callback, parameter) {
        var object = this.getById(id);
        parameter = (typeof parameter != 'undefined') ? parameter : {};
        switch(type) {
            case 'click':
                object.onclick = function(parameter) {
                    callback(parameter);
                }
                break;
        }
    }
    /**
     * @description Unbind a function from an object in the DOM
     * @function
     * @public
     * @param {string} id   ID of the object where to unbind from
     * @param {string} type Type of functionality to unbind
     * @return {undefined}
     */
    this.unbind = function(id, type) {
        var object = this.getById(id);
        switch(type) {
            case 'click':
                object.onclick = undefined;
        }
    }
    /**
     * @description Renders content into a screen
     * @function
     * @public
     * @param {string}  screenId  Id in the DOM
     * @param {string}  content   Content to render
     * @param {boolean} overwrite Overwrite existing content
     * @return {undefined}
     */
    this.renderToScreen = function(screenId, content, overwrite) {
        overwrite = (typeof overwrite == 'undefined') ? true : overwrite;
        var object = this.getById(screenId);
        if(overwrite) {
            object.innerHTML = content;
        } else {
            object.innerHTML += content;
        }
    }
    /**
     * @description Return coordinates for given id
     * @function
     * @public
     * @param {string} id ID of the object
     * @return {object}
     */
    this.getPositionForObjectWithId = function(id) {
        var el = this.getById(id);
        
        var _x = 0;
        var _y = 0;
        
        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return { top: _y, left: _x };
    }
    /**
     * @function
     * @public
     * @description Adds object as member this[obj.key] = obj.value ...
     * @param {Object} input
     * @param {Object} object
     * @return {Object}
    **/
    this.addToObject = function(input, object) {
        for(var option in input) {            
            if(typeof input[option] === 'object') {
                
                object[option] = {};
                
                for(var subOption in input[option]) {
                    object[option][subOption] = input[option][subOption];
                }
            } else {
                object[option] = input[option];
            }
        }
        
        return object;
    }
}