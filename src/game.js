// require your module, connectmoji
// require any other modules that you need, like clear and readline-sync
const c = require('./connectmoji.js');
const readlineSync = require('readline-sync');
const clear = require('clear');
/*
If OPTIONS_AND_MOVES are 😎,😎💻AABBCC,6,7,4
😎 - PLAYER_VALUE: the value that the player will use for the game
😎💻AABBCC - MOVE_STRING: a string where the first characters represent the values to played on the board, and the remaining characters are alternating column letters that represent moves for those values
6 - NUMBER_ROWS: the number of rows in the board
7 - NUMBER_COLUMNS: the number of columns in the board
4 - NUMBER_CONSECUTIVE: the number of repeated consecutive values needed for a win
*/

if (process.argv[2]){
    let commandlineargs= process.argv[2].split(','); //😎
    let PLAYER_VALUE = commandlineargs[0];
    let COMP_VALUE; 
    let MOVE_STRING = commandlineargs[1];
    let NUMBER_ROWS = commandlineargs[2];
    let NUMBER_COLUMNS = commandlineargs[3];
    let NUMBER_CONSECUTIVE = commandlineargs[4];

    let board=c.generateBoard(NUMBER_ROWS, NUMBER_COLUMNS);
    let gameres= c.autoplay(board, MOVE_STRING, NUMBER_CONSECUTIVE);
    const players = [...MOVE_STRING].slice(0, 2);
    if (MOVE_STRING.startsWith(PLAYER_VALUE)){
        COMP_VALUE=players[1];
    } else{
        COMP_VALUE=players[0];
    }
   
    let starter = readlineSync.question('Press <ENTER> to start game');
    
    if (gameres.winner!==undefined){ //winner decided rigt away
        console.log(c.boardToString(gameres.board));
        console.log(gameres.winner);
    }
    else{
        console.log(c.boardToString(gameres.board));
        while(gameres.winner===undefined && gameres.error!==undefined ){ 
            //winner do not exist.. but no error keep playing the game
            console.log(c.boardToString(gameres.board)); //show board
            //
            //if my turn prompt for the next move , 
              
            
           if(gameres.lastPieceMoved===PLAYER_VALUE){
               console.log("It's user's turn \n");
               let move= readlineSync.question("Enter your move... /n");
           }
           else{ //else randomly generate the computer's next move
               console.log("It's the computer's turn \n");
               console.log("Randomly generating computer's move... \n");

               // autoplay again 


           }

        }
        console.log(c.boardToString(gameres.board));
        //console.log(gameres.winner);
        
    }
}
else{// User Controlled Game Setting

}