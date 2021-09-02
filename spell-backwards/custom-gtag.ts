// import * as gtag from "gtag.js";
import "gtag.js";

// Measure click engagement with app in global site tag analytics
// Pass it the custom tag name, and it will send click events on those elements
//   includes the first class name in the event details
export function measureClicks(customTagName: string) {
    Array.from(document.getElementsByTagName(customTagName))
        .forEach(e => {
            e.addEventListener('click',
                (ee) => {
                    if (typeof gtag != 'undefined') {
                        gtag('event', customTagName, { 'event_category': 'engagement', 'event_label': (ee.target as Element).tagName + '.' + (ee.target as Element).classList.item(0) } )
                    }
                }
            );
        });
}

// Count input box changes estimating characters typed
// Grabs *all* instances of that input tag type
    export function measureInputs(appName: string, inputTagName: string = 'textarea') {
    let inputChanges = 0;
    let inputTimerId:number = null;
    const inputChangeDelaySecs: number = 3;
    Array.from(document.getElementsByTagName(inputTagName))
        .forEach(e => {
            e.addEventListener('input', () => {
                    inputChanges++;
                    if (inputTimerId == null) {
                        inputTimerId = window.setTimeout(pushChangeCount, inputChangeDelaySecs * 1000);
                    }
                }
            );
        });
    let pushChangeCount = () : void => {
        console.log(inputChanges);
        if (typeof gtag != 'undefined') {
            gtag('event', `${appName}-inputs`, { 'event_category': 'engagement', 'event_label': 'input-count', value: inputChanges } )
        }
        inputChanges = 0;
        inputTimerId = null;
    }
}