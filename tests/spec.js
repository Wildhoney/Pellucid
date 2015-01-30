(function main($window, $document) {

    describe('Pellucid', function() {

        /**
         * @method createElement
         * @return {Node}
         */
        var createElement = function createElement() {
            var element       = new $window.PellucidElement();
            element.innerHTML = 'Mwah!';
            element.setAttribute('data-pellucid-blur', '10px');
            return $document.body.appendChild(element);
        };

        beforeEach(function beforeEach() {

            // Mock the `isInFrame` method to always return false.
            $window.isInFrame = function mockIsInFrame() {
                return false;
            }

        });

        it('Should be able to register the element and setup the HTML;', function() {

            var element = createElement();

            // Element registration.
            expect(element.nodeName.toLowerCase()).toEqual('section');
            expect(element.getAttribute('is')).toEqual('pellucid-container');
            expect(element.pellucid.options.blur).toEqual('10px');
            expect(element.getAttribute('data-pellucid-blur')).toBeNull();

            // Element markup.
            expect(element.childNodes[0].className).toEqual('background');
            expect(element.childNodes[1].className).toEqual('content');
            expect(element.childNodes[1].innerHTML).toEqual('Mwah!');

        });

        it('Should be able to setup the frame element;', function(done) {

            var element = createElement();
            var frame   = element.querySelector('iframe');

            expect(frame.getAttribute('src')).toEqual($document.URL + '?');
            expect(frame.contentWindow.scrollY).toEqual(0);
            expect(frame.contentWindow.scrollX).toEqual(0);

            frame.onload = function() {

                // Standard top/left move.
                element.style.top = '50px';
                element.style.left = '10px';
                var model = element.pellucid.frameElementJustify(element, frame);
                expect(model.left).toEqual(8);
                expect(model.top).toEqual(8);

                // Using Transform3D which should be added to the previous values.
                element.style.transform = 'translate3d(10px, 20px, 30px)';
                model = element.pellucid.frameElementJustify(element, frame);
                expect(model.left).toEqual(18);
                expect(model.top).toEqual(28);

                done();

            };

        });

    });

})(window, window.document);