(async () => {
    const maxEvidence = 3;
    const impossibleClass = 'impossible';
    const errorClass = "error";

    const evidence = [
        {
            name: 'EMF Level 5'
        },
        {
            name: 'Spirit Box'
        },
        {
            name: 'Fingerprints'
        },
        {
            name: 'Ghost Orb'
        },
        {
            name: 'Ghost Writing'
        },
        {
            name: 'Freezing Temps'
        },
        {
            name: 'D.O.T.S. Projector'
        },
    ]

    const ghostTypes = [
        {
            name: 'Spirit',
            evidence: [0, 1, 4]
        },
        {
            name: 'Wraith',
            evidence: [0, 1, 6]
        },
        {
            name: 'Phantom',
            evidence: [1, 2, 6]
        },
        {
            name: 'Poltergeist',
            evidence: [1, 2, 4]
        },
        {
            name: 'Banshee',
            evidence: [2, 3, 6]
        },
        {
            name: 'Jinn',
            evidence: [0, 5, 2]
        },
        {
            name: 'Mare',
            evidence: [1, 4, 3]
        },
        {
            name: 'Revenant',
            evidence: [5, 4, 3]
        },
        {
            name: 'Shade',
            evidence: [0, 5, 4]
        },
        {
            name: 'Demon',
            evidence: [5, 4, 2]
        },
        {
            name: 'Yurei',
            evidence: [5, 3, 6]
        },
        {
            name: 'Oni',
            evidence: [0, 5, 6]
        },
        {
            name: 'Hantu',
            evidence: [5, 3, 2]
        },
        {
            name: 'Yokai',
            evidence: [1, 3, 6]
        },
        {
            name: 'Goryo',
            evidence: [0,2,6]
        },
        {
            name: 'Myling',
            evidence: [0,4,2]
        },
        {
            name: 'Onryo',
            evidence: [1,3,5]
        },
        {
            name: 'The Twins',
            evidence: [0,1,5]
        },
        {
            name: 'Obake',
            evidence: [0,2,3]
        },
        {
            name: 'Raiju',
            evidence: [0,3,6]
        },
        {
            name: 'The Mimic',
            evidence: [1,2,5]
        },
    ]

    class PhasmoHelpoer extends HTMLElement {
            connectedCallback() {
            // TODO: apparently failing to find query result does not trigger 'or' alternative
            this.evidenceDiv = this.querySelector('div:nth-of-type(1)') || document.createElement('div');
            this.ghostsDiv = this.querySelector('div:nth-of-type(2)') || document.createElement('div');

            // FIXME: this code is from before WebComponent refactor, need to ensure code can handle
            //  whether or not interior elements are already defined.
            // if (!this.evidenceDiv.isConnnected) { app.appendChild(this.evidenceDiv) };
            // if (!this.ghostsDiv.isConnnected) { app.appendChild(this.ghostsDiv) };

            ghostTypes.forEach((e, i) => {
                e.possible = true;
                e.div = this.ghostsDiv.querySelector(`div:nth-of-type(${i+1})`)
                if (e.div === null) {
                    e.div = document.createElement('div');
                    const myLabel = document.createTextNode(e.name);
                    e.div.appendChild(myLabel)
                    this.ghostsDiv.appendChild(e.div);
                }
            })
    
            const evidenceList = this.evidenceDiv.querySelector('ul') || document.createElement('ul');
            if (!evidenceList.isConnected) { this.evidenceDiv.appendChild(evidenceList); };
    
            evidence.forEach((e, i) => {
                const idName = e.name.toLowerCase().replace(/ /, '-');
                e.possible = true;
                e.item = evidenceList.querySelector(`li:nth-of-type(${i+1})`) || document.createElement('li');
                e.checkbox = e.item.querySelector('input') || document.createElement('input');
                e.checkbox.type = 'checkbox';
                e.checkbox.id = idName;
                if (!e.checkbox.isConnected) { e.item.appendChild(e.checkbox); };
                const myLabel = e.item.querySelector('label') || document.createElement('label');
                myLabel.innerText = e.name;
                myLabel.htmlFor = idName;
                console.log(idName, myLabel);
                if (!myLabel.isConnected) { e.item.appendChild(myLabel); };
                if (!e.item.isConnected) { evidenceList.appendChild(e.item); };
            })
    
            this.evidenceDiv.addEventListener('click', this.render);    
        }

        render(e) {
            const checkCount = evidence.reduce((a, e) => e.checkbox.checked ? a+1 : a, 0);
            ghostTypes.forEach(e => {
                e.div.classList.remove(errorClass)
            });
            evidence.forEach(e => {
                e.item.classList.remove(errorClass)
            });    if (checkCount == 0) {
                // clear all formats
                ghostTypes.forEach(e => e.div.classList.remove(impossibleClass));
            } else if (checkCount > maxEvidence) {
                console.error('input error')
                ghostTypes.forEach(e => {
                    e.div.classList.remove(impossibleClass)
                    e.div.classList.add(errorClass)
                });
                evidence.forEach(e => {
                    e.item.classList.remove(impossibleClass)
                    e.item.classList.add(errorClass)
                });
            } else {
                // process
                evidence.forEach(e => e.possible = false);
                ghostTypes.forEach(e => {
                    e.possible = e.evidence.reduce((a, e) => evidence[e].checkbox.checked ? a+1 : a, 0) == checkCount;
                    if (e.possible) {
                        e.div.classList.remove(impossibleClass);
                        e.evidence.forEach(e => evidence[e].possible = true);
                    } else {
                        e.div.classList.add(impossibleClass);
                    }
                });
                evidence.forEach(e => {
                    if (e.possible) {
                        e.item.classList.remove(impossibleClass);
                    } else {
                        e.item.classList.add(impossibleClass);
                    }
                });
            }
        }
    }

    document.addEventListener("DOMContentLoaded", function() {
        window.customElements.define('phasmo-helper', PhasmoHelpoer)
    });
})();