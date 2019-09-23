/*
  Basic.js, version 1.1a
  Copyright 2006-2010, Dean Edwards
  License: http://www.opensource.org/licenses/mit-license.php
*/

let Basic = function () {
    // dummy
};

Basic.extend = function (_instance, _static) { // subclass
    let extend = Basic.prototype.extend;

    // build the prototype
    Basic._prototyping = true;
    let proto = new this;
    extend.call(proto, _instance);
    proto.base = function () {
        // call this method from any other method to invoke that method's ancestor
    };
    delete Basic._prototyping;

    // create the wrapper for the constructor function
    //let constructor = proto.constructor.valueOf(); //-dean
    let constructor = proto.constructor;
    let klass = proto.constructor = function () {
        if (!Basic._prototyping) {
            if (this._constructing || this.constructor === klass) { // instantiation
                this._constructing = true;
                constructor.apply(this, arguments);
                delete this._constructing;
            } else if (arguments[0] != null) { // casting
                return (arguments[0].extend || extend).call(arguments[0], proto);
            }
        }
    };

    // build the class interface
    klass.ancestor = this;
    klass.extend = this.extend;
    klass.forEach = this.forEach;
    klass.implement = this.implement;
    klass.prototype = proto;
    klass.toString = this.toString;
    klass.valueOf = function (type) {
        //return (type == "object") ? klass : constructor; //-dean
        return (type === "object") ? klass : constructor.valueOf();
    };
    extend.call(klass, _static);
    // class initialisation
    if (typeof klass.init === "function") {
        klass.init();
    }
    return klass;
};

Basic.prototype = {
    extend: function (source, value) {
        if (arguments.length > 1) { // extending with a name/value pair
            let ancestor = this[source];
            if (ancestor && (typeof value === "function") && // overriding a method?
                // the valueOf() comparison is to avoid circular references
                (!ancestor.valueOf || ancestor.valueOf() !== value.valueOf()) &&
                /\bbase\b/.test(value)) {
                // get the underlying method
                let method = value.valueOf();
                // override
                value = function () {
                    let previous = this.base || Basic.prototype.base;
                    this.base = ancestor;
                    let returnValue = method.apply(this, arguments);
                    this.base = previous;
                    return returnValue;
                };
                // point to the underlying method
                value.valueOf = function (type) {
                    return (type === "object") ? value : method;
                };
                value.toString = Basic.toString;
            }
            this[source] = value;
        } else if (source) { // extending with an object literal
            let extend = Basic.prototype.extend;
            // if this object has a customised extend method then use it
            if (!Basic._prototyping && typeof this !== "function") {
                extend = this.extend || extend;
            }
            let proto = {toSource: null};
            // do the "toString" and other methods manually
            let hidden = ["constructor", "toString", "valueOf"];
            // if we are prototyping then include the constructor
            let i = Basic._prototyping ? 0 : 1;
            while (key = hidden[i++]) {
                if (source[key] !== proto[key]) {
                    extend.call(this, key, source[key]);

                }
            }
            // copy each of the source object's properties to this object
            for (let key in source) {
                if (!proto[key]) extend.call(this, key, source[key]);
            }
        }
        return this;
    }
};

// initialise
Basic = Basic.extend({
    constructor: function () {
        this.extend(arguments[0]);
    }
}, {
    ancestor: Object,
    version: "1.1",

    forEach: function (object, block, context) {
        for (let key in object) {
            if (this.prototype[key] === undefined) {
                block.call(context, object[key], key, object);
            }
        }
    },

    implement: function () {
        for (let i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === "function") {
                // if it's a function, call it
                arguments[i](this.prototype);
            } else {
                // add the interface using the extend method
                this.prototype.extend(arguments[i]);
            }
        }
        return this;
    },

    toString: function () {
        return String(this.valueOf());
    }
});