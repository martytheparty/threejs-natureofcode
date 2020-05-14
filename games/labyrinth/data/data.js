let historyTable = document.querySelector('history-table');
let gameTable = document.querySelector('games-table');
let healthiestTable = document.querySelector('healthiest-table');
const button = document.querySelector('#update-button');


const draw = () => {
    let historyInput = document.getElementById("history");
    let queueInput = document.getElementById("pQueue");
    let gameResults = document.getElementById("game");

    button.onclick = () => {
        historyInput = document.getElementById("history");
        queueInput = document.getElementById("pQueue");
        gameResults = document.getElementById("game");
        healthiestTable.setQueueName(queueInput.value);
    }

    const drawHistory = (data) => {
        historyTable.draw(data);
    }
    
    const gameHistory = (data) => {
        gameTable.draw(data);
    }

    const drawHealthiest = (data) => {
        healthiestTable.draw(data);
    }

    const data = document.getElementById('data');
    data.innerHTML = '';
    
    for (var i = 0; i < localStorage.length; i++){

        if (localStorage.key(i) === historyInput.value) {
            let historyData = JSON.parse(localStorage.getItem(localStorage.key(i)));
            drawHistory(historyData);
            drawHealthiest(historyData);
        }

        if (localStorage.key(i) === gameResults.value) {
            let gameData = JSON.parse(localStorage.getItem(localStorage.key(i)));
            gameHistory(gameData);
        }
    
        let p = document.createElement('p');
        let title = document.createElement('div');
    
        data.appendChild(p);
        data.appendChild(title);
        title.innerHTML = 'key: '+ localStorage.key(i);
    
        let content = document.createElement('div');
        content.innerHTML = localStorage.getItem(localStorage.key(i));
    }

}

draw();

window.addEventListener('storage', () => {
    draw();
  });


 