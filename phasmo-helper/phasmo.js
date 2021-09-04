(async () => {
    const maxEvidence = 3;
    const impossibleClass = 'impossible';
    const errorClass = "error";

    const evidence = [
        {
            name: 'EMF Level 5'
        },
        {
            name: 'Freezing Temps'
        },
        {
            name: 'Spirit Box'
        },
        {
            name: 'Ghost Writing'
        },
        {
            name: 'Ghost Orb'
        },
        {
            name: 'Fingerprints'
        },
        {
            name: 'DOTS'
        },
    ]

    const ghostTypes = [
        {
            name: 'Spirit',
            evidence: [0, 2, 3]
        },
        {
            name: 'Wraith',
            evidence: [0, 2, 6]
        },
        {
            name: 'Phantom',
            evidence: [2, 5, 6]
        },
        {
            name: 'Poltergeist',
            evidence: [2, 3, 5]
        },
        {
            name: 'Banshee',
            evidence: [4, 5, 6]
        },
        {
            name: 'Jinn',
            evidence: [0, 1, 5]
        },
        {
            name: 'Mare',
            evidence: [2, 3, 4]
        },
        {
            name: 'Revenant',
            evidence: [1, 3, 4]
        },
        {
            name: 'Shade',
            evidence: [0, 1, 3]
        },
        {
            name: 'Demon',
            evidence: [1, 3, 5]
        },
        {
            name: 'Yurei',
            evidence: [1, 4, 6]
        },
        {
            name: 'Oni',
            evidence: [0, 1, 6]
        },
        {
            name: 'Yokai',
            evidence: [2, 4, 6]
        },
        {
            name: 'Hantu',
            evidence: [1, 4, 5]
        },
        {
            name: 'Goryo',
            evidence: [0,5,6]
        },
        {
            name: 'Myling',
            evidence: [0,3,5]
        },
    ]

    const evidenceDiv = document.createElement('div');
    const ghostsDiv = document.createElement('div');

    function phasmoInit() {
        ghostTypes.forEach(e => {
            e.possible = true;
            e.div = document.createElement('div');
            const myLabel = document.createTextNode(e.name);
            e.div.appendChild(myLabel)
            ghostsDiv.appendChild(e.div);
        })

        const evidenceList = document.createElement('ul');
        evidenceDiv.appendChild(evidenceList);

        evidence.forEach(e => {
            e.possible = true;
            e.checkbox = document.createElement('input');
            e.checkbox.type = 'checkbox';
            e.item = document.createElement('li');
            e.item.appendChild(e.checkbox);
            const myLabel = document.createTextNode(e.name);
            e.item.appendChild(myLabel)
            evidenceList.appendChild(e.item);
        })

        evidenceDiv.addEventListener('click', phasmoUpdate);

    }

    function phasmoUpdate(e) {
        const checkCount = evidence.reduce((a, e) => e.checkbox.checked ? a+1 : a, 0);
        ghostTypes.forEach(e => {
            e.div.classList.remove(errorClass)
        });
        evidence.forEach(e => {
            e.item.classList.remove(errorClass)
        });    if (checkCount == 0) {
            // clear all formsts
            ghostTypes.forEach(e => e.div.classList.remove(impossibleClass));
            evidence.forEach(e => e.item.classList.remove(impossibleClass));
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

    phasmoInit();

    document.addEventListener("DOMContentLoaded", function() {
        const app = document.getElementById('phasmo');
        app.appendChild(evidenceDiv);
        app.appendChild(ghostsDiv);
    });
})();