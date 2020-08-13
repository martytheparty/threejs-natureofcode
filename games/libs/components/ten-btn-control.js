class Control10B extends HTMLElement {
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
        const template = `
            <table>
                <tr>
                    <td valign="middle"><div id="ten-btn-stop"></div></td>
                    <td valign="middle"><div id="ten-btn-left"></div></td>
                    <td valign="middle"><div id="ten-btn-vert-left"></div></td>
                    <td valign="middle"><div id="ten-btn-vert"></div></td>
                    <td valign="middle"><div id="ten-btn-vert-right"></div></td>
                    <td valign="middle"><div id="ten-btn-right"></div></td>
                    <td valign="middle"><div id="ten-btn-forward"></div></td>
                    </tr>
            </table>                


        `;
        this.ele.innerHTML = template;
        console.log(this.ele.querySelector);

        const stopEle = this.ele.querySelector('#ten-btn-stop');
        stopEle.append(this.createButton('s'));
        const leftEle = this.ele.querySelector('#ten-btn-left');
        leftEle.append(this.createButton('l'));
        const leftVertEle = this.ele.querySelector('#ten-btn-vert-left');
        const br = document.createElement('br');
        leftVertEle.append(this.createButton('ul'));
        leftVertEle.append(br);
        leftVertEle.append(this.createButton('dl'));
        const vertEle = this.ele.querySelector('#ten-btn-vert');
        vertEle.append(this.createButton('u'));
        const br1 = document.createElement('br');
        vertEle.append(br1);
        vertEle.append(this.createButton('d'));
        const rightVertEle = this.ele.querySelector('#ten-btn-vert-right');
        const br2 = document.createElement('br');
        rightVertEle.append(this.createButton('ur'));
        rightVertEle.append(br2);
        rightVertEle.append(this.createButton('dr'));
        const rightEle = this.ele.querySelector('#ten-btn-right');
        rightEle.append(this.createButton('r'));
        const forwardEle = this.ele.querySelector('#ten-btn-forward');
        forwardEle.append(this.createButton('f'));
        
    }

    createButton(label) {
        const button = document.createElement('button');
        const listOfOffsetDownButtons = [];
        const listOfOffsetUpButtons = [];
        button.innerHTML = label;
        button.value = label;
        if (listOfOffsetDownButtons.includes(label)) {
            //button.style.top = '10px';
            button.style.position = 'relative';
        } else if (listOfOffsetUpButtons.includes(label)) {
            //button.style.top = '-10px';
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

        if(this.keys['f']) {
            this.currentState = this.currentState + 'f';
        }

        if(this.keys['s']) {
            this.currentState = this.currentState + 's';
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

customElements.define('control-10button', Control10B);