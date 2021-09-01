let message:string = "hi there";

const regexSymbolWithCombiningMarks = /(<%= allExceptCombiningMarks %>)(<%= combiningMarks %>+)/g;
const regexSurrogatePair = /([\uD800-\uDBFF])([\uDC00-\uDFFF])/g;

class SpellBackwards extends HTMLElement {
    connectedCallback() {
		document.addEventListener('DOMContentLoaded', () => {
			// this.foo();
			this.input = document.getElementById("sb-input");
			this.output = document.getElementById("sb-output");
			console.log(this.input);
			console.log(this.output);
			console.log(this.input.innerText);
			this.render();
		});
    }
    render() {
        // console.log("render");
        // console.log(this.reverse(message));
		// console.log(this.reverse(this.input.innerText));
		// this.output.innerText = "um, hi?";
		this.output.innerText = this.reverse(this.input.innerText);
    }
	input: HTMLElement;
	output: HTMLElement;

    // reverse() is copied verbatim from the MIT-Licensed https://github.com/mathiasbynens/esrever/blob/master/src/esrever.js#L20
    // TODO: Add copyright notice & MIT license for this code in particular; perhaps break into its own file/module
    reverse(string) {
		// Step 1: deal with combining marks and astral symbols (surrogate pairs)
		string = string
			// Swap symbols with their combining marks so the combining marks go first
			.replace(regexSymbolWithCombiningMarks, function($0, $1, $2) {
				// Reverse the combining marks so they will end up in the same order
				// later on (after another round of reversing)
				return this.reverse($2) + $1;
			})
			// Swap high and low surrogates so the low surrogates go first
			.replace(regexSurrogatePair, '$2$1');
		// Step 2: reverse the code units in the string
		var result = [];
		var index = string.length;
		while (index--) {
			result.push(string.charAt(index));
		}
		return result.join('');
	}
}

window.customElements.define('spell-backwards', SpellBackwards);
