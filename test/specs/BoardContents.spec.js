
const _ = require('lodash'),
      BoardContents = require('../../src/app/core/BoardContents');


function generateRandom(turnsTaken) {
    let turns = _.shuffle(_.range(0, 63)),
        result = _.map(turns, t => 0);

    if(turnsTaken > 32) {
        turnsTaken = 32;
    }
    let player = 1,
        i = 0;
    while(turnsTaken > 0) {
        result[turns[i]] = player;
        turnsTaken -= 1;
        i += 1;
        player = -player;
    }

    return result;
}

function createBoard(positions) {
    let result = new BoardContents();
    positions.forEach((player, idx) => {
        if(player) {
            result = result.setPlayerAt(idx, player);
        }
    });
    return result;
}


function checkBoard(board, positions) {
    for(let i = 0; i < 63; i += 1) {
        let player = board.getPlayerAt(i);
        if(positions[i] !== player) {
            return false;
        }
    }
    return true;
}

describe('BoardContents', function() {
    describe('an empty board', function() {
        let board = new BoardContents();
        it('has occupied square count of zero', function() {
            expect(board.getOccupiedSquareCount()).to.equal(0);
        });
        it('all squares return player 0', function() {
            for(let i = 0; i < 64; i += 1) {
                expect(board.getPlayerAt(i)).to.equal(0);
            }
        });
    });

    describe('a randomly generated board', function() {
        it('getPlayerAt returns value of setPlayerAt', function() {
            for(let i = 0; i < 32; i += 1) {
                let positions = generateRandom(i),
                    board = createBoard(positions),
                    matches = checkBoard(board, positions);

                if(!matches) {
                    console.error(board.getDebugString());
                    console.error(positions);
                }

                expect(matches).to.be.ok;
            }
        });

        it('serializes and deserializes correctly', function() {
            for(let i = 0; i < 32; i += 1) {
                let positions = generateRandom(i),
                    board = createBoard(positions),
                    s1 = board.getDebugString(),
                    board2 = BoardContents.readFromString(s1),
                    s2 = board2.getDebugString();

                expect(s1).to.equal(s2);
            }
        });
    });

});
