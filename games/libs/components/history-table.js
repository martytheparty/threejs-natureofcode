class HistoryTable extends HTMLElement {
    ele = document.createElement('div');
    subscribers = [];
    currentState = '';
    data = [];

    constructor() {
        super();
        this.draw([]);
    }

    draw(data) {
        this.data = data;
        this.ele.innerHTML = '';
        let heading = document.createElement('h2');
        this.ele.appendChild(heading);
        heading.innerHTML = `${data.length}  generations`;

        

        if (data && data.length) {
            for(let i = 0; i < data.length; i++) {
                let generation = data[i];
                let subheading = document.createElement('h3');
                subheading.innerHTML = `Generation ${i}  ${generation.length} samples`;
                this.ele.append(subheading);
                generation.forEach(
                    (sample) => {
                        let row = document.createElement('div');
                        row.innerHTML = sample.result + ' ' + JSON.stringify(sample.moves);
                        this.ele.append(row);
                    }
                );

            }
        }
    }

    connectedCallback() {
        this.appendChild(this.ele);
    }

}

customElements.define('history-table', HistoryTable);