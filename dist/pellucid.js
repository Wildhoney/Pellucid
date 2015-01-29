/**
 * @module Pellucid
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Pellucid
 */
(function main($window, $document) {

    "use strict";

    /**
     * @constant ELEMENT_NAME
     * @type {String}
     */
    var ELEMENT_NAME = 'pellucid-container';

    /**
     * @constant EVENT_LIST
     * @type {Object}
     */
    var EVENT_LIST = {
        WIDTH_HEIGHT: 'width-height',
        OFFSET_TOP: 'offset-top',
        OFFSET_LEFT: 'offset-left',
        OFFSET_RESET: 'offset-reset'
    };

    /**
     * @property PellucidElement
     * @constructor
     */
    var PellucidElement = function PellucidElement() {};

    /**
     * @property prototype
     * @type {Object}
     */
    PellucidElement.prototype = {

        /**
         * @property options
         * @type {Object}
         */
        options: {
            blur: '5px'
        },

        /**
         * @method setOptions
         * @param rootElement {HTMLElement}
         * @return {void}
         */
        setOptions: function setOptions(rootElement) {

            for (var attributeName in rootElement.attributes) {

                if (rootElement.attributes.hasOwnProperty(attributeName)) {

                    var attribute = rootElement.attributes[attributeName];

                    if (attribute.name) {

                        // Remove any data attributes.
                        var name = attribute.name.toLowerCase().replace(/^data-/i, '');
                        var nameMatch = new RegExp('^pellucid-', 'i');

                        if (name.match(nameMatch)) {

                            // Remove the "pellucid" attribute from the name if it exists.
                            name = name.replace(nameMatch, '');
                            this.options[name] = attribute.value;

                            // Remove the attributes from the root element.
                            rootElement.removeAttribute('pellucid-' + name);
                            rootElement.removeAttribute('data-pellucid-' + name);

                        }

                    }

                }

            }

        },

        /**
         * @method removeAllContainers
         * @return {void}
         */
        removeAllContainers: function removeAllContainers() {

            var containers = $document.querySelectorAll('section[is="' + ELEMENT_NAME + '"]');

            // Iteratively remove all containers.
            for (var index = 0, maxLen = containers.length; index < maxLen; index++) {
                containers[index].remove();
            }

        },

        /**
         * @method computedParentValue
         * @param propertyName {String}
         * @return {String}
         */
        computedParentValue: function computedParentValue(propertyName) {
            var htmlElement   = $window.parent.document.querySelector('html');
            var computedStyle = $window.getComputedStyle(htmlElement);
            return computedStyle.getPropertyValue(propertyName);
        },

        /**
         * @method createFrameElement
         * @param rootElement {HTMLElement}
         * @return {HTMLElement}
         */
        createFrameElement: function createFrameElement(rootElement) {

            var frameElement = $document.createElement('iframe');
            frameElement.className = 'pellucid';
            frameElement.src = $document.URL;

            /**
             * @method onload
             * @type {function(this:PellucidElement)}
             */
            frameElement.onload = function() {
                this.frameElementJustify(rootElement, frameElement);
            }.bind(this);

            return frameElement;

        },

        /**
         * @method frameElementJustify
         * @param rootElement {HTMLElement}
         * @param frameElement {HTMLElement}
         * @return {Object}
         */
        frameElementJustify: function frameElementJustify(rootElement, frameElement) {

            if (!frameElement) {

                // Find the frame element if it hasn't been passed in.
                frameElement = rootElement.querySelector('iframe.pellucid');

            }

            /**
             * @method computedStyle
             * @param which {String}
             * @return {Number}
             */
            var computedStyle = function computedStyle(which) {

                var value = $window.getComputedStyle(rootElement)[which];

                if (rootElement.style.transform) {

                    var match = String(rootElement.style.transform).match(/(?:((?:\-)?\d+)px)/g);
                    var index = (which === 'top') ? 1 : 0;
                    value     = parseInt(value) + parseInt(match[index]);

                }

                return value;

            };

            var contentWindow = frameElement.contentWindow;
            var elementTop    = isNaN(parseInt(computedStyle('top'))) ? 0 : parseInt(computedStyle('top'));
            var elementLeft   = isNaN(parseInt(computedStyle('left'))) ? 0 : parseInt(computedStyle('left'));

            // Adjust the frame's scroll offsets.
            this.computeFrameOffsets(rootElement, frameElement, elementTop, elementLeft);
            contentWindow.scrollTo(elementLeft, elementTop);

            return { left: elementLeft, top: elementTop };

        },

        /**
         * @method computeFrameOffsets
         * @param rootElement {HTMLElement}
         * @param frameElement {HTMLElement}
         * @param positionTop {Number}
         * @param positionLeft {Number}
         * @return {void}
         */
        computeFrameOffsets: function computeFrameOffsets(rootElement, frameElement, positionTop, positionLeft) {

            var rootElementWidth = parseInt($window.getComputedStyle(rootElement).getPropertyValue('width'));
            var viewportWidth    = $window.innerWidth;

            /**
             * @method emitEvent
             * @param eventName {String}
             * @param metaData {Object}
             * @return {void}
             */
            var emitEvent = function emitEvent(eventName, metaData) {

                // Emit the event to the frame element listener.
                frameElement.contentWindow.postMessage({

                    name: eventName,
                    params: metaData

                }, '*');

            };

            // Emit the event to reset all offset computations.
            emitEvent(EVENT_LIST.OFFSET_RESET);

            if (positionLeft < 0) {

                // Element is situated to the left of the viewport.
                emitEvent(EVENT_LIST.OFFSET_LEFT, {
                    offsetLeft: Math.abs(positionLeft)
                });

            }

            if ((rootElementWidth + positionLeft) > viewportWidth) {

                // Element is situated to the right of the viewport.
                emitEvent(EVENT_LIST.OFFSET_LEFT, {
                    offsetLeft: -Math.abs(positionLeft)
                });

            }

        },

        /**
         * @method createStructureElement
         * @param rootElement {HTMLElement}
         * @param className {String}
         * @return {HTMLElement}
         */
        createStructureElement: function createStructureElement(rootElement, className) {

            var divElement = $document.createElement('div');
            divElement.className      = className;
            divElement.style.width    = '100%';
            divElement.style.height   = '100%';
            divElement.style.position = 'absolute';
            divElement.style.top      = 0;
            divElement.style.left     = 0;

            rootElement.appendChild(divElement);
            return divElement;

        },

        /**
         * @method addFrameElement
         * @param frameElement {HTMLElement}
         * @param backgroundElement {HTMLElement}
         * @return {HTMLElement}
         */
        addFrameElement: function addFrameElement(frameElement, backgroundElement) {
            backgroundElement.appendChild(frameElement);
        },

        /**
         * @method isParent
         * @param frameElement {HTMLElement}
         * @returns {Boolean}
         */
        isParent: function isParent(frameElement) {
            return !!frameElement.contentWindow;
        },

        /**
         * Responsible for determining which method should be used to style the frame element, depending on whether
         * it's a parent or a child.
         *
         * @method styleFrameElement
         * @param frameElement {HTMLElement}
         * @return {void}
         */
        styleFrameElement: function styleFrameElement(frameElement) {

            if (this.isParent(frameElement)) {
                this.styleParentFrameElement(frameElement);
                return;
            }

            this.styleChildFrameElement(frameElement);
            this.removeAllContainers();

        },

        /**
         * @method styleChildFrameElement
         * @param frameElement {HTMLElement}
         * @return {void}
         */
        styleChildFrameElement: function styleChildFrameElement(frameElement) {

            frameElement = $document.querySelector('html');
            frameElement.style.height = (parseInt(this.computedParentValue('height'))) + 'px';
            frameElement.style.width  = (parseInt(this.computedParentValue('width'))) + 'px';
            frameElement.style.overflow = 'hidden';
            frameElement.style.pointerEvents = 'none';
            frameElement.style.position = 'absolute';

            // Apply the filter blur styles!
            frameElement.style.filter = 'blur(' + this.options.blur + ')';
            frameElement.style.oFilter = 'blur(' + this.options.blur + ')';
            frameElement.style.mozFilter = 'blur(' + this.options.blur + ')';
            frameElement.style.webkitFilter = 'blur(' + this.options.blur + ')';

            /**
             * @method onmessage
             * @param event {Object}
             * @return {void}
             */
            $window.onmessage = function onMessage(event) {

                switch (event.data.name) {

                    case (EVENT_LIST.WIDTH_HEIGHT):
                        frameElement.style.height = event.data.params.height;
                        frameElement.style.width  = event.data.params.width;
                        break;

                    case (EVENT_LIST.OFFSET_LEFT):
                        frameElement.style.marginLeft = event.data.params.offsetLeft + 'px';
                        break;

                    case (EVENT_LIST.OFFSET_RESET):
                        frameElement.style.marginLeft = 0;
                        frameElement.style.marginTop  = 0;
                        break;

                }
            };

        },

        /**
         * @method styleParentFrameElement
         * @param frameElement {HTMLElement}
         * @return {void}
         */
        styleParentFrameElement: function styleParentFrameElement(frameElement) {

            var contentWindow    = frameElement.contentWindow;
            var htmlFrameElement = contentWindow.document.querySelector('html');

            htmlFrameElement.style.width  = '100%';
            htmlFrameElement.style.height = '100%';

        },

        /**
         * @method addRenderListener
         * @param rootElement {HTMLElement}
         * @param frameElement {HTMLElement}
         * @return {void}
         */
        addRenderListener: function addRenderListener(rootElement, frameElement) {

            var bodyElement = $document.querySelector('body');

            /**
             * @property onresize
             * @type {function(this:PellucidElement)|*}
             */
            $window.onresize = function onResize() {

                var computedStyle = $window.getComputedStyle(bodyElement);

                // Emit the event to the frame element listener.
                frameElement.contentWindow.postMessage({

                    name: EVENT_LIST.WIDTH_HEIGHT,
                    params: {
                        width: computedStyle.getPropertyValue('width'),
                        height: computedStyle.getPropertyValue('height')
                    }

                }, '*');

            }.bind(this);

        },

        /**
         * @method removeContentNodes
         * @param rootElement {HTMLElement}
         * @return {Array}
         */
        removeContentNodes: function removeContentNodes(rootElement) {

            var elementCollection = [];

            for (var index = 0, maxLen = rootElement.childNodes.length; index < maxLen; index++) {
                var element = rootElement.childNodes[index];
                elementCollection.push(element);
            }

            elementCollection.forEach(function forEach(element) {
                element.remove();
            });

            return elementCollection;

        },

        /**
         * @method reattachContentElements
         * @param contentElement {HTMLElement}
         * @param contentElements {Array}
         * @return {void}
         */
        reattachContentElements: function reattachContentElements(contentElement, contentElements) {

            contentElements.forEach(function forEach(element) {
                contentElement.appendChild(element);
            });

        }

    };

    /**
     * @property prototype
     * @type {HTMLElement}
     */
    var prototype = Object.create(HTMLDivElement.prototype, {

        /**
         * @property attachedCallback
         * @type {Object}
         */
        attachedCallback: {

            /**
             * @method value
             * @return {void}
             */
            value: function value() {

                this.pellucid = new PellucidElement();
                this.pellucid.setOptions(this);

                var frameElement    = this.pellucid.createFrameElement(this);
                var contentElements = this.pellucid.removeContentNodes(this);

                // Create the markup for the container.
                var backgroundElement = this.pellucid.createStructureElement(this, 'background');
                var contentElement    = this.pellucid.createStructureElement(this, 'content');

                // Attach all of the content elements back into the content element.
                this.pellucid.reattachContentElements(contentElement, contentElements);

                // Append the frame to the background element, and then style it.
                this.pellucid.addFrameElement(frameElement, backgroundElement);
                this.pellucid.styleFrameElement(frameElement);

                if (this.pellucid.isParent(frameElement)) {

                    // Listen for when we need to re-render.
                    this.pellucid.addRenderListener(this, frameElement);

                }

            }

        }

    });

    /**
     * @property PellucidContainer
     * @type {Object}
     */
    $window.PellucidElement = $document.registerElement(ELEMENT_NAME, {
        prototype: prototype,
        extends: 'section'
    });

})(window, window.document);