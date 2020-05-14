class GamesTable extends HTMLElement {
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
        heading.innerHTML = `${data.length} attemps`;

        

        if (data && data.length) {
            for(let i = (data.length - 1); i > 0; i--) {
                let subheading = document.createElement('div');
                subheading.innerHTML = JSON.stringify(data[i]);
                this.ele.append(subheading);
            }
        }
    }

    connectedCallback() {
        this.appendChild(this.ele);
    }

}

customElements.define('games-table', GamesTable);