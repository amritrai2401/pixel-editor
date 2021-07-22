class Events {
    /** Used to programmatically create an input event
     * 
     * @param {*} keyCode KeyCode of the key to press
     * @param {*} ctrl Is ctrl pressed?
     * @param {*} alt Is alt pressed?
     * @param {*} shift Is shift pressed?
     */
    static simulateInput(keyCode, ctrl, alt, shift) {
        // I just copy pasted this from stack overflow lol please have mercy
        let keyboardEvent = document.createEvent("KeyboardEvent");
        let initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";

        keyboardEvent[initMethod](
        "keydown", // event type: keydown, keyup, keypress
        true,      // bubbles
        true,      // cancelable
        window,    // view: should be window
        ctrl,     // ctrlKey
        alt,     // altKey
        shift,     // shiftKey
        false,     // metaKey
        keyCode,        // keyCode: unsigned long - the virtual key code, else 0
        keyCode       // charCode: unsigned long - the Unicode character associated with the depressed key, else 0
        );
        document.dispatchEvent(keyboardEvent);
    }

    /** Simulates a mouse event (https://stackoverflow.com/questions/6157929/how-to-simulate-a-mouse-click-using-javascript)
     * 
     * @param {*} element The element that triggered the event
     * @param {*} eventName The name of the event
     * @returns 
     */
    static simulateMouseEvent (element, eventName)
    {
        function extend(destination, source) {
            for (let property in source)
            destination[property] = source[property];
            return destination;
        }
    
        let eventMatchers = {
            'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
            'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
        }
        let defaultOptions = {
            pointerX: 0,
            pointerY: 0,
            button: 0,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            bubbles: true,
            cancelable: true
        }

        let options = extend(defaultOptions, arguments[2] || {});
        let oEvent, eventType = null;

        for (let name in eventMatchers)
            if (eventMatchers[name].test(eventName)) { eventType = name; break; }

        if (!eventType)
            throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

        if (document.createEvent) {
            oEvent = document.createEvent(eventType);
            if (eventType == 'HTMLEvents')
            {
                oEvent.initEvent(eventName, options.bubbles, options.cancelable);
            }
            else
            {
                oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
                options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
                options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
            }
            element.dispatchEvent(oEvent);
        }
        else {
            options.clientX = options.pointerX;
            options.clientY = options.pointerY;
            var evt = document.createEventObject();
            oEvent = extend(evt, options);
            element.fireEvent('on' + eventName, oEvent);
        }
        return element;
    }
    
    static on(event, elementId, functionCallback, ...args) {
        //if element provided is string, get the actual element
        const element = Util.getElement(elementId);

        element.addEventListener(event,
        function (e) {
            functionCallback(...args, e);
        });
    }

    static onChildren(event, parentElement, functionCallback, ...args) {
        parentElement = Util.getElement(parentElement);
        const children = parentElement.children;
        
        //loop through children and add onClick listener
        for (var i = 0; i < children.length; i++) {
            on(event, children[i], functionCallback, ...args);
        }
    }
}