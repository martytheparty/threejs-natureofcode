let getAgent = () => {

    const agent = {
        localStorageGameName: 'games2',
        localStorageHistory: 'history2',
        localStorageCount: 'count2',
        localStorageResults: 'gameResults2',
        localStorageQueue: "pQueue2",
        playQueue: [],
        replayValues: [],
        replayIndex: 0,
        game: { moves: [], win: false },
        moves: ['l', 'ul', 'u', 'ur', 'r', 'dl', 'd', 'dr'],
        finished: false,
        subscribers: [],
        history: undefined,
        setHistory: () => {
            if (!Array.isArray(agent.history)) {
                const ls = window.localStorage;
                let historyString = ls.getItem(agent.localStorageHistory);
                let history = JSON.parse(historyString) || [];
                agent.history = history;
            }
        },
        getWinningGames: () => {
            const ls = window.localStorage;
            let gameString = ls.getItem(localStorage);
            if (gameString === null || typeof gameString === 'undefined') gameString = "[]";
            let games = JSON.parse(gameString);
            games.count = agent.getCount();
            return games;
        },
        addGame: () => {
            agent.game = {}
        },
        addMove: (direction) => {
            agent.game.moves.push(direction);
        },
        addResult: (result) => {
            agent.game.result = result;
        },
        saveGame: () => {
            const ls = window.localStorage;
            let gameString = ls.getItem(agent.localStorageGameName);
            if (gameString === null || typeof gameString === 'undefined') gameString = "[]";
            let games = JSON.parse(gameString);
            if (!games.length) {
                games = [];
            }
            games.push(agent.game);
            const str = JSON.stringify(games);
            ls.setItem(agent.localStorageGameName, str);

        },
        getGames: () => {
            const ls = window.localStorage;
            return [];
        },
        getMove: (moves) => {      
            let nextPosition = Math.floor(Math.random()*(moves.length - 1))
            let move = moves[nextPosition];

            if (agent.playQueue.length > 0) {
                move = agent.playQueue.shift();
            }

            agent.setHistory();
            return move;
        },
        winHandler: () => {
            agent.game.win = true;
            agent.game.count = agent.getCount();
            if (agent.replayValues.length === 0) {
                agent.saveGame(); 
            }
            agent.saveHistory(true);
        },
        loseHandler: () => {
            agent.saveHistory(false);
        },
        getCount: () => {
            const ls = window.localStorage;
            let gameCount = ls.getItem(agent.localStorageCount);
            if (gameCount === null || typeof gameCount === 'undefined') gameCount = "0";

            let gameString = ls.getItem(agent.localStorageResults);
            let games = JSON.parse(gameString) || [];

            let totalHealth = 0;
            let highest = 0;
            let lowest = 1000;
            let sorted = [];
            let topTen = [];

            games.forEach(
                (game) => {
                    //console.log('health',game.moves.length);
                    totalHealth = totalHealth + game.moves.length;
                    if (highest < game.moves.length) highest = game.moves.length; 
                    if (lowest > game.moves.length) lowest = game.moves.length;                    
                    sorted.push(game.moves); 
                }
            );
            sorted.sort(
                (moves1, moves2) => {
                    if(moves1.length < moves2.length) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
            );


            sorted.forEach(
                (moves, count) => {
                    if (count < 10) {
                        topTen.push(moves);
                    }
                }
            );

            // console.log('************************');
            // console.log('games played: ', games.length);
            // console.log('total health: ', totalHealth);
            // console.log('average health: ', totalHealth/ games.length);
            // console.log('highest', highest);
            // console.log('lowest', lowest);
            // console.log('top ten', topTen);
            // console.table(topTen);
            // console.log('************************');

            //const ls = window.localStorage;
            // let gameData = ls.getItem('games2Generation');
            //gameData


            return gameCount
        },
        incrementCount: () => {
            const ls = window.localStorage;
            let gameCount = agent.getCount();
            gameCount++;
            ls.setItem(agent.localStorageCount, gameCount);

        },
        play: (first) => {


            if (first) {
                const ls = window.localStorage;
                const queue = ls.getItem(agent.localStorageQueue);
                //console.log(queue);
                if (queue && queue.length > 0) {
                    const queueList = JSON.parse(queue);
                    if (queueList.length > 0) {
                        const game = queueList.shift();
                        ls.setItem(agent.localStorageQueue,JSON.stringify(queueList));
                        //console.log('queue item', queueList[0]);
                        agent.playQueue = game.moves;
                    }

                }
            }            


            agent.replayValues = [];
            if (first && agent.playQueue.length === 0) agent.incrementCount();
            

            
            
            let move = agent.getMove(agent.moves);
            agent.game.moves.push(move);

            agent.subscribers.forEach(
                (callback) => {
                    callback(move);
                }
            );
            setTimeout(() => {
                agent.play();
            }, 2000);
        },
        replay: () => {
            agent.subscribers.forEach(
                (callback) => {
                    callback(agent.replayValues[agent.replayIndex]);
                    agent.replayIndex++;
                }
            );

            setTimeout(() => {
                agent.replay();
            }, 2000);

        },
        register: (callback) => {
            agent.subscribers.push(callback);
        },
        isRunning: () => {
            let cookies = document.cookie.split(';');
            let found = false;
            cookies.forEach(
                (cookie) => {
                    if (
                        cookie.indexOf('agentrunning') >= 0 && 
                        !found && 
                        cookie.indexOf('true') >= 0) {
                        found = true;

                    }
                }
            );
            return found;
//            console.log(document.cookie.split(';'));


        },
        startRunning: () => {
            var d = new Date();
            let days = 10;
            d.setTime(d.getTime() + (days*24*60*60*1000));
            var expires = "expires="+ d.toUTCString();
            document.cookie = "agentrunning=true" + ";" + expires + ";path=/";
        },
        stopRunning: () => {
            var d = new Date();
            let days = 10;
            d.setTime(d.getTime() + (days*24*60*60*1000));
            var expires = "expires="+ d.toUTCString();
            document.cookie = "agentrunning=false" + ";" + expires + ";path=/";
        },
        saveHistory: (win) => {

            let game = { 
                result: win, 
                moves: agent.game.moves 
            };

            const ls = window.localStorage;
            let gameString = ls.getItem(agent.localStorageResults);

            let games = JSON.parse(gameString) || [];

            if (games.length > 20) {
                //alert('Find Healthiest');
                let historyString = ls.getItem(agent.localStorageHistory);
                let history = JSON.parse(historyString) || [];
                history.push(games);
                ls.setItem(agent.localStorageHistory, JSON.stringify(history));

                games = [];

            }

            games.push(game);

            ls.setItem(agent.localStorageResults, JSON.stringify(games));

        }
    }
    return agent;

}
