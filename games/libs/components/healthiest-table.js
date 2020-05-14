class HealthiestTable extends HTMLElement {
    ls = window.localStorage;
    ele = document.createElement('div');
    subscribers = [];
    currentState = '';
    data = [];
    healthiest = [];
    winners = [];
    subHeading = document.createElement('h3');
    queuedGames = document.createElement('div');
    pq = [];
    queueName = "pQueue3";
    eventListener;

    constructor() {
        super();
        this.draw([]);
        this.eventListener = window.addEventListener('storage', this.watchLocalStorage.bind(this));
    }

    setQueueName(queueName) {
        alert(queueName);
        this.queueName = queueName;
        this.watchLocalStorage();
        this.draw();
    }

    watchLocalStorage() {
        console.log('LOCAL STORAGE CHANGE ' + this.queueName);
        const playQueue = this.ls.getItem(this.queueName);
        if (playQueue) {
            this.pq = JSON.parse(playQueue);
            this.subHeading.innerHTML = `${this.pq.length} Queued Games (${this.queueName})`;
            this.queuedGames.innerHTML = `${JSON.stringify(this.pq)}`;

            if(this.pq.length === 0 ) {
                this.updateQueue(this.healthiest);
            }
        }


    }

    updateQueue(data) {
        data.forEach(
            (game, i) => {
                let half = game.moves/2;
                for (let j = 0; j < half; j++) {
                    game.moves.pop();
                }
                console.log('moves' + i,game);
            }
        );
        for(let i = 0; i < 10; i++) {
            data.push({
                count: "",
                moves: [],
               win: false 
            });
        }
        console.log('data', data);
        const playQueue = JSON.stringify(data);
        this.ls.setItem(this.queueName, playQueue);
    }

    draw(data) {
       // console.log('data', data);
        this.healthiest = [];
        let history = [];
        this.data = data;
        this.ele.innerHTML = '';
        let winHeading = document.createElement('h2');
        winHeading.innerHTML = 'Winners';
        this.ele.appendChild(winHeading);
        let winners = document.createElement('div');
        this.ele.appendChild(winners);
        let heading = document.createElement('h2');
        this.ele.appendChild(heading);
        let recordCount = 0;
        if (data) {
            data.forEach(
                (records) => {
                    recordCount = recordCount + records.length;
                }
            );
        }

        heading.innerHTML = `10 healthiest of ${recordCount} `;
        
        //this.subHeading.innerHTML = `queued ${1+1}`;
        this.ele.appendChild(this.subHeading);
        this.ele.appendChild(this.queuedGames);

        let button = document.createElement('button');
        button.innerHTML = 'Add To Queue';
        this.ele.append(button);
        button.onclick = () => {
            this.updateQueue(this.healthiest);
        };

        let longest = 0;

        

        if (data && data.length) {
            this.winners = [];
             for(let i = 0; i < data.length; i++) {
                 let generation = data[i];
                 for(let j = 0; j < generation.length; j++) {
                    let game = generation[j]; 
                    if (longest < game.moves.length) {
                        longest = game.moves.length;
                    }

                    if (game.result === 'win') {
                        this.winners.push(game);
                        winners.innerHTML = winners.innerHTML + "<br>" + JSON.stringify(game);
                    }
                    this.healthiest.push(game);
                 }
             }
        }

        winHeading.innerHTML = `${this.winners.length} ${winHeading.innerHTML}`;
        

        this.subheading = document.createElement('h3');
        this.subheading.innerHTML = `Healthiest ${longest}`;
        this.ele.append(this.subheading);

        this.healthiest.sort(
            (game1, game2) => {
                //console.log(game.moves.length);
             return (game2.moves.length - game1.moves.length);   
            }
        );

        let final = [];
        if (this.healthiest.length > 10) {
            final.push(this.healthiest[0]);
            final.push(this.healthiest[1]);
            final.push(this.healthiest[2]);
            final.push(this.healthiest[3]);
            final.push(this.healthiest[4]);
            final.push(this.healthiest[5]);
            final.push(this.healthiest[6]);
            final.push(this.healthiest[7]);
            final.push(this.healthiest[8]);
            final.push(this.healthiest[9]);
            this.healthiest = final;
        } else {
            this.healthiest = [];
        }

        this.healthiest.forEach(
            (game) => {
                //console.log(game);
                let row = document.createElement('div');
                row.innerHTML = game.result + ' - ' + JSON.stringify(game.moves);
                this.ele.append(row);
            }
        );

    }

    connectedCallback() {
        this.appendChild(this.ele);
    }

}

customElements.define('healthiest-table', HealthiestTable);