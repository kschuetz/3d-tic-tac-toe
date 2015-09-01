

function moveSort1(moveA, moveB) {
    let result = moveB.balance - moveA.balance;
    if(result === 0) {
        result = moveB.preference - moveA.preference;
    }
    return result;
}

function moveSort2(moveA, moveB) {
    let result = moveA.balance - moveB.balance;
    if(result === 0) {
        result = moveB.preference - moveA.preference;
    }
    return result;
}


function generateMoves2(gameState, squarePrefs, player, pvMove) {
    let moves = [],
        firstMove = null;

    for(let square = 0; square < 64; square += 1) {
        if(gameState.isSquareEmpty(square)) {
            let state = gameState.placePiece(square, player),
                move = {
                    state,
                    square,
                    balance:     state.balance,
                    preference:  squarePrefs[square]
                };
            if(pvMove === square) {
                firstMove = move;
            } else {
                moves.push(move);
            }
        }
    }

    // sort
    let sortFn = player > 0 ? moveSort1 : moveSort2;

    //moves = _.sortBy(moves, sortFn);

    if(firstMove) {
        moves.unshift(firstMove);
    }
    return moves;

}

function generateMoves(gameState, squarePrefs, player, pvMove) {
    let moves = [],
        firstMove = null;

    for(let square = 0; square < 64; square += 1) {
        if(gameState.isSquareEmpty(square)) {
            let state = gameState.placePiece(square, player),
                move = {
                    state,
                    square,
                    balance:     state.balance,
                    value:       player * state.balance,
                    preference:  squarePrefs[square]
                };
            if(pvMove === square) {
                firstMove = move;
            } else {
                moves.push(move);
            }
        }
    }

    let moveCount = moves.length,
        best = Number.NEGATIVE_INFINITY,
        bestIndex = -1;

    for(let i = 0; i < moveCount; i += 1) {
        let move = moves[i];
        if(move.value > best) {
            best = move.value;
            bestIndex = i;
        }
    }

    if(bestIndex >= 0) {
        let move = moves[bestIndex];
        moves.splice(bestIndex, 1);
        moves.unshift(move);
    }

    // sort
    let sortFn = player > 0 ? moveSort1 : moveSort2;

    //moves = _.sortBy(moves, sortFn);

    if(firstMove) {
        moves.unshift(firstMove);
    }
    return moves;

}


function Ply(props) {
    let host = props.host,
        pv = host.pv,
        squarePrefs = host.squarePrefs,
        root = !!props.root,
        left = root || !!props.left;

    this.root = root;
    this.left = left;

    this.player = props.player;
    this.host = host;

    let pvMove = -1;
    if(left) {
        pvMove = pv.getBestMove(props.ply);
    }

    this.depth = props.depth;
    this.gameState = props.gameState;

    this.moves = generateMoves(props.gameState, squarePrefs, this.player, pvMove);
    this.moveCount = this.moves.length;
    this.nextMovePtr = 0;

    if(root) {
        this.alpha = Number.NEGATIVE_INFINITY;
        this.beta = Number.POSITIVE_INFINITY;
        this.parent = host;
        this.ply = 0;
    } else {
        this.alpha = props.alpha;
        this.beta = props.beta;
        this.parent = props.parent;
        this.ply = props.ply;
    }
}


Ply.prototype.process = function() {
    if(this.nextMovePtr >= this.moveCount) {
        return this.parent.answer(this.alpha);
    }

    let move = this.moves[this.nextMovePtr];
    this.lastMove = move.square;
    this.nextMovePtr += 1;

    let newState = move.state;
    if(this.depth <= 0) {
        let value = this.player * newState.balance;
        if(value >= this.beta) {
            this.host.betaCutoffCount += 1;

            return this.parent.answer(this.beta);
        }
        if(value > this.alpha) {
            this.alpha = value;

            this.host.alphaCutoffCount += 1;

            this.host.pv.updateBestMove(this.ply, move.square);
        }

        return this;
    }

    // TODO:  null window search?

    let nextPly = new Ply({
        host:    this.host,
        parent:  this,
        gameState:  newState,

        left:   this.left && this.nextMovePtr === 1,
        depth:  this.depth - 1,
        ply:    this.ply + 1,
        player: -this.player,
        alpha:  -this.beta,
        beta:   -this.alpha
    });

    return nextPly.process();
};

Ply.prototype.answer = function(value) {
    if(value >= this.beta) {
        return this.parent.answer(this.beta);
    }
    if(value > this.alpha) {
        this.alpha = value;

        this.host.alphaCutoffCount += 1;

        this.host.pv.updateBestMove(this.ply, this.lastMove);
    }
    return this;
};

module.exports = Ply;






