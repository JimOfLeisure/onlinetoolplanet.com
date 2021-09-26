(async () => {
    console.log("Hi");
    class ConvertNbt extends HTMLElement {
        connectedCallback() {
            console.log('connected callback');
            document.addEventListener('DOMContentLoaded', () => {
                this.nbt2jsonButton = document.getElementById('otp-nbt2json');
                this.json2nbtButton = document.getElementById('otp-json2nbt');
                this.jsonTextArea = document.getElementById('otp-json-text');
                this.json2nbtButton.addEventListener('click', () => { console.log('click');});
                this.nbt2jsonButton.addEventListener('click', () => { console.log('click');});
                this.jsonTextArea.value = "Hi";
            })
        }
        render() {
            console.log("render");
        }
    }
    nbt2jsonButton: HTMLButtonElement;
    json2nbtButton: HTMLButtonElement;
    jsonTextArea: HTMLTextAreaElement;
    window.customElements.define('convert-nbt', ConvertNbt);
})()
