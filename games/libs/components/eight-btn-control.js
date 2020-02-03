class Control8B extends HTMLElement {
    ele = document.createElement('div');
    subscribers = [];
    currentState = '';
    buttons = {};
    keys = {};

    constructor() {
        super();
        this.ele.style.textAlign = 'center';
        this.createUi();
        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup', this.keyupHandler);
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
        button.onclick = this.clickHandler;
        this.buttons[label] = button;
        return button;
    }

    connectedCallback() {
        this.appendChild(this.ele);
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    clearState = () => {
        this.currentState = '';
        for (let prop in this.buttons) {
            this.buttons[prop].style.color = '#000000'; 
        }       
    }

    updateState = () => {

        for (let prop in this.buttons) {
            this.buttons[prop].style.color = '#000000'; 
        }

        if (this.currentState === '') {
            this.clearState();
        } else {
            if (this.buttons[this.currentState]) {
                this.buttons[this.currentState].style.color = '#FF0000';
            } else {
                this.clearState();
            }
        }
    }

    aiHandler = (move) => {
        this.currentState = move;
        this.updateState();
        this.publish();
    }

    clickHandler = (event) => {
        if (this.currentState === event.target.value) {
            this.currentState = "";
        } else {
            this.currentState = event.target.value;
        }

        this.updateState();
        this.publish();
    }

    keydownHandler = (event) => {
        this.keys[event.key] = true;
        this.keyStateChange();
    }

    keyupHandler = (event) => {
        this.keys[event.key] = false;
        this.keyStateChange();
    }

    keyStateChange = () => {
        this.currentState = '';
        if(this.keys['ArrowUp']) {
            this.currentState = this.currentState + 'u';
        }

        if(this.keys['ArrowDown']) {
            this.currentState = this.currentState + 'd';
        }

        if(this.keys['ArrowLeft']) {
            this.currentState = this.currentState + 'l';
        }

        if(this.keys['ArrowRight']) {
            this.currentState = this.currentState + 'r';
        }

        this.updateState();
        this.publish();
    }

    publish = () => {
        
        this.subscribers.forEach(
            (subscriber) => {
                subscriber(this.currentState);
            }
        );
    }

}

customElements.define('control-8button', Control8B);