/**
 * @license
 * MIT License
 * 
 * Copyright (c) 2023
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * @function raterJs
 * @description Membuat elemen rating bintang.
 * @param {string|HTMLElement} selector - Selector atau elemen HTML untuk rating.
 * @param {Object} options - Opsi untuk konfigurasi rating.
 * @param {number} [options.max=5] - Jumlah maksimal bintang.
 * @param {boolean} [options.readOnly=false] - Apakah rating hanya baca.
 * @param {number} [options.rating=0] - Nilai rating awal.
 * @param {number} [options.starSize=16] - Ukuran bintang.
 * @param {number} [options.step=1] - Langkah rating.
 * @param {boolean} [options.reverse=false] - Apakah urutan bintang terbalik.
 * @param {boolean} [options.showToolTip=true] - Apakah menampilkan tooltip.
 * @param {string} [options.disableText="Thank you for your vote!"] - Teks saat rating dinonaktifkan.
 * @param {string} [options.ratingText="{rating}/{maxRating}"] - Teks tooltip rating.
 * @param {Function} [options.onHover] - Callback saat hover.
 * @param {Function} [options.onLeave] - Callback saat leave.
 * @param {Function} [options.rateCallback] - Callback saat rating.
 * @param {string} [options.isBusyText] - Teks saat rating sibuk.
 * @returns {Object} - Modul rating.
 */
(function() {
    window.raterJs = function(selector, options) {
        // Private fields
        let showToolTip = true;

        if (typeof selector === "string") {
            options.element = document.querySelector(selector);
        } else if (selector instanceof HTMLElement) {
            options.element = selector;
        } else {
            throw new Error("Invalid selector or element");
        }

        if (typeof options.showToolTip !== "undefined") {
            showToolTip = !!options.showToolTip;
        }

        if (typeof options.step !== "undefined") {
            if (options.step <= 0 || options.step > 1) {
                throw new Error("step must be a number between 0 and 1");
            }
        }

        let elem = options.element;
        let reverse = options.reverse;
        let stars = options.max || 5;
        let starSize = options.starSize || 16;
        let step = options.step || 1;
        let onHover = options.onHover;
        let onLeave = options.onLeave;
        let rating = null;
        let myRating;
        elem.classList.add("star-rating");
        let div = document.createElement("div");
        div.classList.add("star-value");
        if(reverse) {
            div.classList.add("rtl");
        }
        div.style.backgroundSize = starSize + "px";
        elem.appendChild(div);
        elem.style.width = starSize * stars + "px";
        elem.style.height = starSize + "px";
        elem.style.backgroundSize = starSize + "px";
        let callback = options.rateCallback;
        let disabled = !!options.readOnly;
        let disableText;
        let isRating = false;
        let isBusyText = options.isBusyText;
        let currentRating;
        let ratingText;

        if (typeof options.disableText !== "undefined") {
            disableText = options.disableText;
        } else {
            disableText = "Thank you for your vote!";
        }

        if (typeof options.ratingText !== "undefined") {
            ratingText = options.ratingText;
        } else {
            ratingText = "{rating}/{maxRating}";
        }

        if (options.rating) {
            setRating(options.rating);
        } else {
            var dataRating = elem.dataset.rating;

            if (dataRating) {
                setRating(+dataRating);
            }
        }

        if (!rating) {
            elem.querySelector(".star-value").style.width = "0px";
        }

        if (disabled) {
            disable();
        }

        // Private methods
        function onMouseMove(e) {
            onMove(e, false);
        }

        function onMove(e, isTouch) {
            if (disabled === true || isRating === true) {
                return;
            }

            let xCoor = null;
            let percent;
            let width = elem.offsetWidth;
            let parentOffset = elem.getBoundingClientRect();

            if (reverse) {
                if(isTouch) {
                    xCoor = e.changedTouches[0].pageX - parentOffset.left;
                } else {
                    xCoor = e.pageX - window.scrollX - parentOffset.left;
                }

                let relXRtl = width - xCoor;
                let valueForDivision = width / 100;

                percent = relXRtl / valueForDivision;
            } else {
                if(isTouch) {
                    xCoor = e.changedTouches[0].pageX - parentOffset.left;
                } else {
                    xCoor = e.offsetX;
                }

                percent = xCoor / width * 100;
            }

            if (percent < 101) {
                if (step === 1) {
                    currentRating = Math.ceil((percent / 100) * stars);
                } else {
                    let rat = (percent / 100) * stars;
                    for (let i = 0; ; i += step) {
                        if (i >= rat) {
                            currentRating = i;
                            break;
                        }
                    }
                }

                if(currentRating > stars) {
                    currentRating = stars;
                }

                elem.querySelector(".star-value").style.width = currentRating / stars * 100 + "%";

                if (showToolTip) {
                    let toolTip = ratingText.replace("{rating}", currentRating);
                    toolTip = toolTip.replace("{maxRating}", stars);
                    elem.setAttribute("title", toolTip);
                }

                if (typeof onHover === "function") {
                    onHover(currentRating, rating);
                }
            }
        }

        function onStarOut(e) {
            if (!rating) {
                elem.querySelector(".star-value").style.width = "0%";
                elem.removeAttribute("data-rating");
            } else {
                elem.querySelector(".star-value").style.width = rating / stars * 100 + "%";
                elem.setAttribute("data-rating", rating);
            }

            if (typeof onLeave === "function") {
                onLeave(currentRating, rating);
            }
        }

        function onStarClick(e) {
            if (disabled === true) {
                return;
            }

            if (isRating === true) {
                return;
            }

            if (typeof callback !== "undefined") {
                isRating = true;
                myRating = currentRating;

                if (typeof isBusyText === "undefined") {
                    elem.removeAttribute("title");
                } else {
                    elem.setAttribute("title", isBusyText);
                }

                elem.classList.add("is-busy");
                callback.call(this, myRating, function() {
                    if (disabled === false) {
                        elem.removeAttribute("title");
                    }

                    isRating = false;
                    elem.classList.remove("is-busy");
                });
            }
        }

        function disable() {
            disabled = true;
            elem.classList.add("disabled");

            if (showToolTip && !!disableText) {
                let toolTip = disableText.replace("{rating}", !!rating ? rating : 0);
                toolTip = toolTip.replace("{maxRating}", stars);
                elem.setAttribute("title", toolTip);
            } else {
                elem.removeAttribute("title");
            }
        }

        function enable() {
            disabled = false;
            elem.removeAttribute("title");
            elem.classList.remove("disabled");
        }

        function setRating(value) {
            if (typeof value === "undefined") {
                throw new Error("Value not set.");
            }

            if (value === null) {
                throw new Error("Value cannot be null.");
            }

            if (typeof value !== "number") {
                throw new Error("Value must be a number.");
            }

            if (value < 0 || value > stars) {
                throw new Error("Value too high. Please set a rating of " + stars + " or below.");
            }

            rating = value;
            elem.querySelector(".star-value").style.width = value / stars * 100 + "%";
            elem.setAttribute("data-rating", value);
        }

        function getRating() {
            return rating;
        }

        function clear() {
            rating = null;
            elem.querySelector(".star-value").style.width = "0px";
            elem.removeAttribute("title");
        }

        function dispose() {
            elem.removeEventListener("mousemove", onMouseMove);
            elem.removeEventListener("mouseleave", onStarOut);
            elem.removeEventListener("click", onStarClick);
            elem.removeEventListener("touchmove", handleMove, false);
            elem.removeEventListener("touchstart", handleStart, false);
            elem.removeEventListener("touchend", handleEnd, false);
            elem.removeEventListener("touchcancel", handleCancel, false);
        }

        elem.addEventListener("mousemove", onMouseMove);
        elem.addEventListener("mouseleave", onStarOut);

        let module =  {
            setRating: setRating,
            getRating: getRating,
            disable: disable,
            enable: enable,
            clear: clear,
            dispose: dispose,
            get element() {
                return elem;
            }
        };

        function handleMove(e) {
            e.preventDefault();
            onMove(e, true);
        }

        function handleStart(e) {
            e.preventDefault();
            onMove(e, true);
        }

        function handleEnd(evt) {
            evt.preventDefault();
            onMove(evt, true);
            onStarClick.call(module);
        }

        function handleCancel(e) {
            e.preventDefault();
            onStarOut(e);
        }

        elem.addEventListener("click", onStarClick.bind(module));
        elem.addEventListener("touchmove", handleMove, false);
        elem.addEventListener("touchstart", handleStart, false);
        elem.addEventListener("touchend", handleEnd, false);
        elem.addEventListener("touchcancel", handleCancel, false);

        return module;
    };
})();