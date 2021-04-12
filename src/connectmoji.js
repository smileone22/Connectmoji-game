// implement your functions here
// ...don't forget to export functions!
const wcwidth = require('wcwidth');

/*
Creates and returns an object with the three properties(rows,cols,fill)
*/
function generateBoard(rows, cols, fill = null) {
    //single dimensional Array representation of the board
    const sdarr= new Array(rows * cols).fill(fill); 
    const board = {
        data:sdarr,
        rows:rows,
        cols:cols
    };
    return board;
}

/* 
This function translates a row and a column into 
an index in the one dimensional Array stored in the board object's data property
*/
function rowColToIndex(board, row, col) {
    if(row >= board.rows || col>= board.cols){ 
        //checking row and col to calculate the appropriate index
        return null;
    } else{
        return (row* (board.cols)+col);
    }
}


/*
Using the rows, cols and data property of the board object passed in, 
translates a single index in the data Array of the board to the cell's row and column number.
This function returns an object containing two properties, row and col that the index maps to.
*/

function indexToRowCol(board, i){
    const row= Math.floor(i/board.cols);
    const col= i%board.cols;
    const res= {row,col};
    return res;
}

/*
Sets the value of the cell 
at the specified row and column numbers 
on the board (board) object's data Array to the value, letter.

Returns a new board that contains a new data Array 
representing the board where the cell at row and col is set to the value of value
*/
function setCell(board, row, col, value) {
    const newBoard = {
        data: [...board.data], 
        rows: board.rows, 
        cols : board.cols
    };
    newBoard.data[rowColToIndex(newBoard, row, col)] = value;
    return newBoard; 
}
/*


Using the row, column and value properties of every object in the moves Array, 
sets the value of the cells at the specified row and column numbers 
on the board (board) object's data Array.

Returns a new board object with the elements in its data Array set 
to the values specified by the objects in moves
*/

function setCells(board, ...args) {
    let newBoard = {
        data: [...board.data], 
        rows: board.rows, 
        cols: board.cols
    };
    for(let i = 0; i < args.length; i++){
        newBoard = setCell(newBoard, args[i].row, args[i].col, args[i].val);
    }
    return newBoard;
}


/* 
boardToString creates a text drawing representation of the Connectmoji board passed in. 
*/
function boardToString(board){
    let result="";
    let sep ="|";//for creating seperator line that looks like |----+----+----|
    let col_info_row ="|";
    if (board===null){
        return null;
    }
    //create sep line!
    //and col info_row | A  | B  | C  | D  | E  | F  | G  |
    for (let colc=0;colc<board.cols;colc++){
        if (colc===board.cols-1){
            sep+="----|";
            col_info_row+=" "+ String.fromCodePoint(65+colc)+"  |";
        }
        else{
            sep+="----+";
            col_info_row+=" "+ String.fromCodePoint(65+colc)+"  |";
        }

    }
    
    for (let r=0; r<board.rows; r++){
        let arow="|" //start a row  
        for (let c=0; c<board.cols; c++){
            //add col data to a row 
            if ( wcwidth(board.data[rowColToIndex(board,r,c)])==1){
                arow+=" "+board.data[rowColToIndex(board,r,c)]+"  |";
            }
            else if ( wcwidth(board.data[rowColToIndex(board,r,c)])==2){
                arow+=" "+board.data[rowColToIndex(board,r,c)]+" |";
            }
            else if ( wcwidth(board.data[rowColToIndex(board,r,c)])==3){
                arow+=" "+board.data[rowColToIndex(board,r,c)]+" |";
            }
            else if (board.data[rowColToIndex(board,r,c)]==null){
                arow+="    "+"|"; //four spaces 
            }
            else{
                arow+=board.data[rowColToIndex(board,r,c)]+"|";
            } // a col done

        } // a row done
        result+=arow+"\n";
    }
    result+=sep+"\n";
    result+=col_info_row;
    return result;
}

/*
Translates a column letter to a column number. 
The possible letters are uppercase A through Z, 
corresponding values 0 - 25. 
*/
function letterToCol(letter){
    //if letter is not a valid column
    if (letter.length !==1 ){
        return null;
    }
    let res= letter.charCodeAt(0)-65;
    if (res >25 || res<0){
        return null;
    }
    return res;
}

/*

This function finds the next empty cell in the column 
identified by letter in the board object.
Returns null if letter is not a valid column or
if there are no empty cells in the specified column.


*/
function getEmptyRowCol(board, letter, empty=null){
    const colnum= letterToCol(letter);
    if (colnum==null || colnum>=board.cols){
        return null;
    }
    let lrow;
    for (let i = colnum; i< board.data.length; i+=board.cols) {
        if (board.data[i]===empty){
            lrow = i; 
        }else{
            break;
        }
    }
    if (lrow===null ||lrow===undefined ){
        return null;
    }
    else{
        lrow = Math.floor(lrow/board.cols);
        let res= {row:lrow,col: colnum};
        return res;
    }
}

/*
Examines the board to see if any valid empty cells exist.
It returns an !Array of letters! representing the columns where the empty cells are.
Ifno valid empty cells, an empty Array is returned.
*/
function getAvailableColumns(board){
    const res=[];
    for (let i=0; i<board.cols;i++){
        let colletter = String.fromCharCode(i+65);
        for (let j=0; j<board.rows;j++){
            const cur = rowColToIndex(board,j,i);
            if (board.data[cur]===null){
                res.push(colletter);
                break;
            }
        }
    }
    return res;
}

/*
Given a row and col number, determine if the value in that cell is repeated 
consecutively horizontally, vertically or diagonally for n or more number of times.
Returns true or false.
*/

function hasConsecutiveValues(board, row, col, n) {
	const target = board.data[rowColToIndex(board, row, col)];
    let h_count =0;
    let v_count =0;
    let d_count1 =0; //diagonal upper left to right down 
    let d_count2 =0; //diagonal down left to upper right 
	for(let i = 0; i < board.cols; i++) { //horizontal
		let current_i = rowColToIndex(board, row, i);
		if (board.data[current_i] === target) {
			h_count+=1;
			if (h_count >=n) {
				return true;
			}
		}
		else {
            h_count=0;
		}
    }
    for (let j=0; j<board.rows ;j++){ //vertical
        let current_i = rowColToIndex(board, j, col);
        if (board.data[current_i] ===target){
            v_count+=1;
            if(v_count>=n){
                return true;
            }
        }
        else{
            v_count=0;
        }
    }
    let cur_r=row;
    let cur_c=col;
    //diagonal upper left to right down 
    while(cur_r >0 && cur_c >0){
        cur_r-=1;
        cur_c-=1;
    }
    while (cur_c<=board.cols-1){
        for (let r =0;r<board.rows;r++){
            if (board.data[rowColToIndex(board,r,cur_c)]===target){
                d_count1++;
                if(d_count1>=n){
                    return true;
                }
            }
            else{
                d_count1=0;
            }
            cur_c++;
        }
    }
    cur_r=row;
    cur_c=col;
    //diagonal upper right to down left 
    while(cur_r >0 && cur_c < board.cols){
        cur_r-=1;
        cur_c+=1;
    }
    while (cur_c>=0){
        for (let r=0;r<board.rows;r++){
            if (board.data[rowColToIndex(board,r,cur_c)]===target){
                d_count2++;
                if(d_count2>=n){
                    return true;
                }
            }
            else{
                d_count1=0;
            }
            cur_c--;
        }
    }
    return false;
}

/*
This function will play out a series of moves automatically. 
The returned result object will have the following properties:
board, pieces, error, and winner
*/
function autoplay(board, s, numConsecutive){
    //const players = [...s].slice(0, 2);
    const s_arr=Array.from(s);
    let p1= s_arr[0]; 
    let p2= s_arr[1]; 

    let winner=undefined; 
    let cur_p;
    let nextplacetoput;
    let res = {
        pieces:[p1,p2]
    };
    let lastPieceMoved = null; 
    let playBoard= {
        data: [...board.data], 
        rows: board.rows, 
        cols: board.cols
    };

    for (let move=2; move<s_arr.length; move++){
        //setting current player
        if (move%2 ===0){
            cur_p=p1;
        }
        else if (move%2!==0){
            cur_p=p2;
        }
        nextplacetoput=getEmptyRowCol(playBoard, s_arr[move]);
        
        if (winner!==undefined){ //there is a winner
            res.board=null;
            res.error={
                num: move-1, 
                val: cur_p, 
                col:s_arr[move]
            };
            res.lastPieceMoved=cur_p;
            return res;
        }

        if (winner===undefined && nextplacetoput===null) { //no winner but invalid move
            res.board=null;
            res.error={
                num: move-1, 
                val: cur_p, 
                col:s_arr[move]
            };
            res.lastPieceMoved=cur_p;
            return res;
        }
        

        playBoard = setCell(playBoard, nextplacetoput.row, nextplacetoput.col, cur_p); //update playboard
        // now see if winner gets decided 
        if (hasConsecutiveValues(playBoard, nextplacetoput.row, nextplacetoput.col, numConsecutive)){
           winner=cur_p;
        }
        res.board=playBoard;
        res.lastPieceMoved=cur_p;
    }
    //for loop finished 
    if (winner === undefined) { //no winners but no invalid move
        return res;
    }
    else{
        res.winner=winner;
    } 
    return res;
}

module.exports = {
    generateBoard : generateBoard,
    rowColToIndex : rowColToIndex,
    indexToRowCol : indexToRowCol,
    setCell : setCell,
    setCells : setCells,
    boardToString : boardToString,
    letterToCol : letterToCol,
    getEmptyRowCol : getEmptyRowCol,
    getAvailableColumns : getAvailableColumns,
    hasConsecutiveValues : hasConsecutiveValues,
    autoplay : autoplay
};
