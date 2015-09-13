/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Kevin Schuetz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const
    _ = require('lodash'),
    Immutable = require('Immutable'),
    GameState = require('./GameState'),
    MetaGameState = require('./MetaGameState'),
    phaseCodes = require('./phaseCodes');



function Game(props) {
    this.player1 = props.player1;
    this.player2 = props.player2;
    this.onStateChange = props.onStateChange;
    this.metaState = props.metaState || new MetaGameState();
}


function sendStateChange(game, metaState) {
    game.metaState = metaState;
    if(game.onStateChange) {
        game.onStateChange(metaState);
    }
}

let runCurrentTurn;

function evaluateCurrentTurn(game, metaState) {
    let state = metaState.gameState;

    if(state.gameOver) {
        metaState = metaState.set('phase', phaseCodes.GAME_OVER);
        sendStateChange(game, metaState);
        return;
    }

    // go to next turn
    metaState = metaState.flipPlayerTurn();
    setTimeout(() => {
        game.metaState = metaState;
        runCurrentTurn(game);
    });
}

runCurrentTurn = function(game) {
    let metaState = game.metaState,
        playerTurn = metaState.playerTurn,
        playerToMove = playerTurn > 0 ? game.player1 : game.player2;
    if(playerToMove && playerToMove.isComputerPlayer) {

        metaState = metaState.set('phase', phaseCodes.THINKING);
        sendStateChange(game, metaState);

        let gameState = metaState.gameState,
            nextMove = playerToMove.makeMove(gameState, playerTurn);

        if(nextMove.interrupt) {
            game._interrupt = nextMove.interrupt;
        } else {
            game._interrupt = null;
        }

        nextMove.result.then(resp => {
            let newGameState = gameState.placePiece(resp.square, playerTurn);
            metaState = metaState.set('lastMove', resp.square).set('gameState', newGameState);

            setTimeout(() => evaluateCurrentTurn(game, metaState));
        });


    } else {
        // human

        metaState = metaState.set('phase', phaseCodes.WAITING_FOR_HUMAN);
        sendStateChange(game, metaState);

    }

};

Game.prototype.start = function() {
    let metaState = this.metaState;
    if(metaState.isGameStarted) {
        return;
    }
    runCurrentTurn(this);
};


Game.prototype.interrupt = function() {
    if(this._interrupt) {
        this._interrupt();
    }
};

Game.prototype.submitMove = function(square) {
    let game = this,
        metaState = this.metaState;
    if(!metaState.isWaitingForHuman) {
        return;
    }
    let gameState = metaState.gameState;
    if(!gameState.isLegalMove(square)) {
        return;
    }

    let playerTurn = metaState.playerTurn,
        newGameState = gameState.placePiece(square, playerTurn);
    metaState = metaState.set('lastMove', square).set('gameState', newGameState);

    setTimeout(() => evaluateCurrentTurn(game, metaState));
};

module.exports = Game;