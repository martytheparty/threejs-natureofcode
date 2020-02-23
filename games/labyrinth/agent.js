let getAgent = () => {

    const agent = {
        replayValues: [],
        replayIndex: 0,
        game: { moves: [], win: false },
        moves: ['l', 'ul', 'u', 'ur', 'r', 'dl', 'd', 'dr'],
        finished: false,
        subscribers: [],
        getWinningGames: () => {
            const ls = window.localStorage;
            let gameString = ls.getItem('games');
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
            let gameString = ls.getItem('games');
            if (gameString === null || typeof gameString === 'undefined') gameString = "[]";
            let games = JSON.parse(gameString);
            if (!games.length) {
                games = [];
            }
            games.push(agent.game);
            const str = JSON.stringify(games);
            ls.setItem('games', str);

        },
        getGames: () => {
            const ls = window.localStorage;
            return [];
        },
        getMove: (moves) => {            
            const randomPosition = Math.floor(Math.random()*(moves.length - 1))
            return moves[randomPosition];
        },
        winHandler: () => {
            agent.game.win = true;
            agent.game.count = agent.getCount();
            if (replayValues.length === 0) {
                agent.saveGame();
            }
            console.log(agent);
            //alert('win');
            console.log('win');
        },
        loseHandler: () => {
            console.log('lose');
        },
        getCount: () => {
            const ls = window.localStorage;
            let gameCount = ls.getItem('count');
            if (gameCount === null || typeof gameCount === 'undefined') gameCount = "0";
            return gameCount
        },
        incrementCount: () => {
            const ls = window.localStorage;
            let gameCount = agent.getCount();
            gameCount++;
            ls.setItem('count', gameCount);

        },
        play: (first) => {
            if (first) agent.incrementCount();
            let move = agent.getMove(agent.moves);
            agent.game.moves.push(move);
            // console.log('do you want to play a game? ' + move);
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
        }
    }
    return agent;

}
