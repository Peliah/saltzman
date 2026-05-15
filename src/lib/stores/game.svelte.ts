/** Bug Squash: rounds completed; unlocks hire-me panel */
export const game = $state({
	roundsWon: 0,
	hireUnlocked: false
});

export function registerRoundWin() {
	game.roundsWon += 1;
	if (game.roundsWon >= 3) game.hireUnlocked = true;
}
