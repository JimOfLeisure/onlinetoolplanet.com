import {measureClicks, measureInputs} from './custom-gtag.js';

const regexSymbolWithCombiningMarks = /(<%= allExceptCombiningMarks %>)(<%= combiningMarks %>+)/g;
const regexSurrogatePair = /([\uD800-\uDBFF])([\uDC00-\uDFFF])/g;

class SpellBackwards extends HTMLElement {
	connectedCallback() {
		document.addEventListener('DOMContentLoaded', () => {
            this.input = this.querySelector('textarea:nth-of-type(1)') as HTMLTextAreaElement;
            this.output = this.querySelector('textarea:nth-of-type(2)') as HTMLTextAreaElement;
            this.clearButton = this.querySelector('button:nth-of-type(1)') as HTMLButtonElement;
            this.copyButton = this.querySelector('button:nth-of-type(2)') as HTMLButtonElement;
			this.input.addEventListener('input', () => { this.render(); });
			this.clearButton.addEventListener('click', () => { this.input.value = ''; this.render() });
			this.copyButton.addEventListener('click', () => { navigator.clipboard.writeText(this.output.value); });
			this.render();
		});
	}
	render() {
		this.output.value = this.reverse(this.input.value);
	}
	input: HTMLTextAreaElement;
	output: HTMLTextAreaElement;
	clearButton: HTMLButtonElement;
	copyButton: HTMLButtonElement;

	reverse(string) {
		return reverse(string);
	}
}
// Not sure if this async iife actually unblocks anything, but probably doesn't hurt
(async () => {
	document.addEventListener('DOMContentLoaded', () => {
		measureClicks('spell-backwards');
		measureInputs('spell-backwards');
	});
	window.customElements.define('spell-backwards', SpellBackwards);
})();

// NOTE: The following code is from  https://github.com/mathiasbynens/esrever/blob/master/src/esrever.js#L20
//  and covered under the following license.

/*
Copyright Mathias Bynens <https://mathiasbynens.be/>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function reverse(string) {
	// Step 1: deal with combining marks and astral symbols (surrogate pairs)
	string = string
		// Swap symbols with their combining marks so the combining marks go first
		.replace(regexSymbolWithCombiningMarks, function($0, $1, $2) {
			// Reverse the combining marks so they will end up in the same order
			// later on (after another round of reversing)
			return reverse($2) + $1;
		})
		// Swap high and low surrogates so the low surrogates go first
		.replace(regexSurrogatePair, '$2$1');
	// Step 2: reverse the code units in the string
	let result = [];
	let index = string.length;
	while (index--) {
		result.push(string.charAt(index));
	}
	return result.join('');
}
