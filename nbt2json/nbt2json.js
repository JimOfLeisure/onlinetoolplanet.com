(async () => {
    console.log("Hi");
    class ConvertNbt extends HTMLElement {
        connectedCallback() {
            console.log('connected callback');
        }
        render() {
            console.log("render");
        }
    }
    window.customElements.define('convert-nbt', ConvertNbt);
})()
