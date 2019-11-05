class Control2d extends HTMLElement {
    clickCount = 0;
    ele = document.createElement('canvas');
    ctx;
    rect;
    x = 100; 
    y = 100;
    listeners = [];

    constructor() {
      super();
      this.ele.width=200;
      this.ele.height=200;
      this.ctx = this.ele.getContext("2d");
      this.ctx.fillStyle = "#CCC";
      this.ctx.fillRect(0, 0, 200, 200);
      this.ctx.fillStyle = "#000";
      this.ele.addEventListener('click', e => {
        this.clickCount++;
        this.selectPosition(e);
      });
    }
  
    selectPosition(event) {
        this.rect = event.target.getBoundingClientRect();
        this.x = event.x - this.rect.left;
        this.y = event.y - this.rect.top;
        this.draw();

        let currentX = this.x - 100;
        let currentY = -1*(this.y - 100);

        this.listeners.forEach(
            (callback) => {
                callback({currentX, currentY});
            }

        );
    }

    draw() {
        this.ctx.fillStyle = "#CCC";
        this.ctx.fillRect(0, 0, 200, 200);

        this.ctx.beginPath();
        this.ctx.arc(100, 100, 30, 0 ,2*Math.PI, true);
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 3, 0 ,2*Math.PI, true);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    connectedCallback() {
        this.appendChild(this.ele);
        this.draw();
    }

    addOnchangeListener(callback) {
        this.listeners.push(callback);
    }
}

  
  customElements.define('control-2d', Control2d);


