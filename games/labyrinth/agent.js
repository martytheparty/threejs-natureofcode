let getAgent = () => {

    const agent = {
        game: {},
        moves: ['l', 'ul', 'u', 'ur', 'r', 'dl', 'd', 'dr'],
        finished: false,
        subscribers: [],
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
            const gamesString = ls.getItem('games');
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
            console.log('win');
        },
        loseHandler: () => {
            console.log('lose');
        },
        play: () => {
            let move = agent.getMove(agent.moves);
            console.log('do you want to play a game? ' + move);
            agent.subscribers.forEach(
                (callback) => {
                    callback(move);
                }
            );
            setTimeout(() => {
                agent.play();
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
