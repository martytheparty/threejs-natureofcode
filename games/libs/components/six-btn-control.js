class Control6B extends HTMLElement {
    ele = document.createElement('div');
    subscribers = [];
    currentState = '';
    buttons = {};

    constructor() {
        super();
        this.ele.style.textAlign = 'center';
        this.createUi();
    }

    createUi() {
        this.ele.append(this.createButton('l'));
        this.ele.append(this.createButton('ul'));
        this.ele.append(this.createButton('u'));
        this.ele.append(this.createButton('ur'));
        this.ele.append(this.createButton('r'));
        const br = document.createElement('br');
        this.ele.append(br);
        this.ele.append(this.createButton('dl'));
        this.ele.append(this.createButton('d'));
        this.ele.append(this.createButton('dr'));
    }

    createButton(label) {
        const button = document.createElement('button');
        const listOfOffsetDownButtons = ['l','r','d'];
        const listOfOffsetUpButtons = ['u'];
        button.innerHTML = label;
        button.value = label;
        if (listOfOffsetDownButtons.includes(label)) {
            button.style.top = '10px';
            button.style.position = 'relative';
        } else if (listOfOffsetUpButtons.includes(label)) {
            button.style.top = '-10px';
            button.style.position = 'relative';
        } else  {
            button.style.position = 'relative';
        }
        button.onclick = this.publish;
        this.buttons[label] = button;
        return button;
    }

    connectedCallback() {
        this.appendChild(this.ele);
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }



    publish = (event) => {

        if (event.target.value === this.currentState) {
            this.currentState = '';
            this.buttons[event.target.value].style.color = '#000000';
        } else {
            if (this.buttons[this.currentState]) {
                this.buttons[this.currentState].style.color = '#000000';
            }

            this.currentState = event.target.value;
            this.buttons[this.currentState].style.color = '#FF0000';
        }
        
        this.subscribers.forEach(
            (subscriber) => {
                subscriber(this.currentState);
            }
        );
    }

}

customElements.define('control-6button', Control6B);