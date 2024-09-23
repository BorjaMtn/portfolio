document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const message = document.getElementById('message');
    const resetButton = document.getElementById('reset-button');
    const volverAtrasButton = document.getElementById('volver-atras'); // Botón de volver atrás
    const modeSelection = document.getElementById('mode-selection');
    const playerVsPlayerBtn = document.getElementById('player-vs-player');
    const playerVsCpuBtn = document.getElementById('player-vs-cpu');
    const cpuDifficultySelect = document.getElementById('cpu-difficulty');
    const nameInput = document.getElementById('name-input');
    const player1NameInput = document.getElementById('player1-name');
    const player2NameInput = document.getElementById('player2-name');
    const startGameBtn = document.getElementById('start-game-btn');
    const player2NameContainer = document.getElementById('player2-name-container');
    const modal = document.getElementById('game-modal'); // Modal del juego
    const closeButton = document.querySelector('.close-button'); // Botón "X" del modal

    let player1Name = "Jugador 1";
    let player2Name = "Jugador 2";
    let currentPlayer = 'X';
    let boardState = Array(9).fill(null);
    let isGameActive = true;
    let isPlayerVsCpu = false;
    let cpuDifficulty = 'easy'; 

    function checkWin(player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        return winPatterns.some(pattern => 
            pattern.every(index => boardState[index] === player)
        );
    }

    function celebrateWin() {
        confetti({
            particleCount: 1000,
            spread: 700,
            origin: { y: 0.6 }
        });
    }

    function handleClick(event) {
        const index = event.target.dataset.index;
        if (boardState[index] || !isGameActive) return;

        boardState[index] = currentPlayer;
        event.target.textContent = currentPlayer;

        if (checkWin(currentPlayer)) {
            message.textContent = `¡${currentPlayer === 'X' ? player1Name : player2Name} gana!`;
            celebrateWin();
            isGameActive = false;
            return;
        }

        if (boardState.every(cell => cell)) {
            message.textContent = '¡Empate!';
            isGameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        message.textContent = `Turno de ${currentPlayer === 'X' ? player1Name : player2Name}`;

        if (isPlayerVsCpu && currentPlayer === 'O') {
            setTimeout(() => cpuMove(cpuDifficulty), 500); 
        }
    }

    function cpuMove(difficulty) {
        let move;
        if (difficulty === 'easy') {
            move = getRandomMove();
        } else if (difficulty === 'medium') {
            move = getMediumMove();
        } else if (difficulty === 'hard') {
            move = getOptimalMove();
        }

        if (move !== undefined) {
            boardState[move] = 'O';
            cells[move].textContent = 'O';

            if (checkWin('O')) {
                message.textContent = `¡CPU (O) gana!`;
                celebrateWin();
                isGameActive = false;
                return;
            }

            if (boardState.every(cell => cell)) {
                message.textContent = '¡Empate!';
                isGameActive = false;
                return;
            }

            currentPlayer = 'X';
            message.textContent = `Turno de ${player1Name}`;
        }
    }

    function getRandomMove() {
        const availableMoves = boardState.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    function getMediumMove() {
        const winningMove = findWinningMove('O');
        if (winningMove !== null) return winningMove;

        const blockingMove = findWinningMove('X');
        if (blockingMove !== null) return blockingMove;

        return getRandomMove();
    }

    function getOptimalMove() {
        function minimax(board, depth, isMaximizing) {
            const scores = {
                'O': 10,
                'X': -10,
                'tie': 0
            };

            if (checkWin('O')) return scores['O'] - depth;
            if (checkWin('X')) return scores['X'] + depth;
            if (board.every(cell => cell !== null)) return scores['tie'];

            const availableMoves = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
            const scoresList = [];

            for (const move of availableMoves) {
                board[move] = isMaximizing ? 'O' : 'X';
                scoresList.push(minimax(board, depth + 1, !isMaximizing));
                board[move] = null;
            }

            return isMaximizing ? Math.max(...scoresList) : Math.min(...scoresList);
        }

        return findBestMove();
    }

    function findWinningMove(player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (boardState[a] === player && boardState[b] === player && boardState[c] === null) {
                return c;
            }
            if (boardState[a] === player && boardState[c] === player && boardState[b] === null) {
                return b;
            }
            if (boardState[b] === player && boardState[c] === player && boardState[a] === null) {
                return a;
            }
        }
        return null;
    }

    function resetGame() {
        boardState = Array(9).fill(null);
        isGameActive = true;
        currentPlayer = 'X';
        message.textContent = `Turno de ${player1Name}`;
        cells.forEach(cell => cell.textContent = '');
    }

    function selectMode(event) {
        if (event.target === playerVsPlayerBtn) {
            isPlayerVsCpu = false;
            player2NameContainer.classList.remove('hidden');
        } else if (event.target === playerVsCpuBtn) {
            isPlayerVsCpu = true;
            player2NameContainer.classList.add('hidden');
            player2NameInput.value = "CPU";
        }
        modeSelection.classList.add('hidden');
        nameInput.classList.remove('hidden');
    }

    function startGame() {
        player1Name = player1NameInput.value || "Jugador 1";
        player2Name = isPlayerVsCpu ? "CPU" : (player2NameInput.value || "Jugador 2");
        message.textContent = `Turno de ${player1Name}`;
        nameInput.classList.add('hidden');
        board.classList.remove('hidden');
        document.getElementById('status').classList.remove('hidden');
    }

    function volverAtras() {
        // Restaurar estado inicial
        boardState = Array(9).fill(null);
        isGameActive = true;
        currentPlayer = 'X';
        cells.forEach(cell => cell.textContent = '');
        message.textContent = '';

        // Ocultar elementos del juego y mostrar el menú de selección
        board.classList.add('hidden');
        document.getElementById('status').classList.add('hidden');
        nameInput.classList.add('hidden');
        modeSelection.classList.remove('hidden');
    }

    // Función para cerrar el modal y volver al menú
    function closeModal() {
        modal.classList.add('hidden');
        volverAtras();
    }

    cells.forEach(cell => cell.addEventListener('click', handleClick));
    resetButton.addEventListener('click', resetGame);
    volverAtrasButton.addEventListener('click', volverAtras); // Asignar funcionalidad al botón de volver atrás
    playerVsPlayerBtn.addEventListener('click', selectMode);
    playerVsCpuBtn.addEventListener('click', selectMode);
    startGameBtn.addEventListener('click', startGame);
    
    // Detectar cierre del modal y ejecutar volverAtras
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
});
