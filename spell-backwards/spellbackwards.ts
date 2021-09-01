// Since whole file is an iife, added --format=cjs to esbuild command to not put the iife in an iife
(async () => {
	const regexSymbolWithCombiningMarks = /(<%= allExceptCombiningMarks %>)(<%= combiningMarks %>+)/g;
	const regexSurrogatePair = /([\uD800-\uDBFF])([\uDC00-\uDFFF])/g;

	class SpellBackwards extends HTMLElement {
		connectedCallback() {
			document.addEventListener('DOMContentLoaded', () => {
				this.input = document.getElementById("sb-input") as HTMLTextAreaElement;
				this.output = document.getElementById("sb-output") as HTMLTextAreaElement;
				this.input.addEventListener('input', () => { this.render(); });
				this.render();
			});
		}
		render() {
			this.output.value = this.reverse(this.input.value);
		}
		input: HTMLTextAreaElement;
		output: HTMLTextAreaElement;

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
			let result = [];
			let index = string.length;
			while (index--) {
				result.push(string.charAt(index));
			}
			return result.join('');
		}
	}
	window.customElements.define('spell-backwards', SpellBackwards);
})();