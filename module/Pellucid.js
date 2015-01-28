/**
 * @module Pellucid
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Pellucid
 * @version $Id$
 */
(function main($window, $document) {

    "use strict";

    /**
     * @constant ELEMENT_NAME
     * @type {String}
     */
    var ELEMENT_NAME = 'pellucid-container';

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
         * @property frameElement
         * @type {HTMLElement|null}
         */
        frameElement: null,

        /**
         * @method applyParentStyles
         * @param frameElement {HTMLElement}
         * @return {void}
         */
        applyParentStyles: function applyParentStyles(frameElement) {

            frameElement = $document.querySelector('html');
            frameElement.style.height = (parseInt(this.computedParentValue('height'))) + 'px';
            frameElement.style.width  = (parseInt(this.computedParentValue('width'))) + 'px';
            frameElement.style.filter = 'blur(2px)';
            frameElement.style.mozFilter = 'blur(2px)';
            frameElement.style.webkitFilter = 'blur(2px)';
            frameElement.style.overflow = 'hidden';
            frameElement.style.pointerEvents = 'none';
            frameElement.style.position = 'absolute';

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
         * @return {void}
         */
        frameElementJustify: function frameElementJustify(rootElement, frameElement) {

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
            var elementTop    = computedStyle('top');
            var elementLeft   = computedStyle('left');
            contentWindow.scrollTo(parseInt(elementLeft), parseInt(elementTop));

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
            //frameElement.style.webkitFilter = 'blur(5px)';
            frameElement.style.overflow = 'hidden';
            frameElement.style.pointerEvents = 'none';
            frameElement.style.position = 'absolute';

            /**
             * @method onmessage
             * @param event {Object}
             * @return {void}
             */
            $window.onmessage = function onMessage(event) {
                frameElement.style.height = event.data.height;
                frameElement.style.width  = event.data.width;
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

            $window.onresize = function onResize() {

                var computedStyle = $window.getComputedStyle(bodyElement);

                // Emit the event to the frame element listener.
                frameElement.contentWindow.postMessage({
                    height: computedStyle.getPropertyValue('height'),
                    width: computedStyle.getPropertyValue('width')
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

                var pellucid        = new PellucidElement();
                var frameElement    = pellucid.createFrameElement(this);
                var contentElements = pellucid.removeContentNodes(this);

                // Create the markup for the container.
                var backgroundElement = pellucid.createStructureElement(this, 'background');
                var contentElement    = pellucid.createStructureElement(this, 'content');

                // Attach all of the content elements back into the content element.
                pellucid.reattachContentElements(contentElement, contentElements);

                // Append the frame to the background element, and then style it.
                pellucid.addFrameElement(frameElement, backgroundElement);
                pellucid.styleFrameElement(frameElement);

                if (pellucid.isParent(frameElement)) {

                    // Listen for when we need to re-render.
                    pellucid.addRenderListener(this, frameElement);

                }

                var draggie = new Draggabilly(this, {
                    // options...
                });

                draggie.on('dragMove', function() {
                    pellucid.frameElementJustify(this, frameElement);
                }.bind(this));

            }

        }

    });

    /**
     * @property PellucidContainer
     * @type {Object}
     */
    $document.registerElement(ELEMENT_NAME, {
        prototype: prototype,
        extends: 'section'
    });

})(window, window.document);