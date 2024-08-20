import Game from "./Wolfie2D/Loop/Game";
import SplashScreen from "./Robo-Rush/Scenes/SplashScreen";
import RegistryManager from "./Wolfie2D/Registry/RegistryManager";
import { Robo_RushControls } from "./Robo-Rush/controls";
import MainMenu from "./Robo-Rush/Scenes/MainMenu";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main() {
	// Set up options for our game
	let options = {
		canvasSize: { x: 1500, y: 900 }, // The size of the game
		clearColor: { r: 0.1, g: 0.1, b: 0.1 }, // The color the game clears to
		inputs: [
			{ name: Robo_RushControls.MOVE_UP, keys: ["w"] },
			{ name: Robo_RushControls.MOVE_DOWN, keys: ["s"] },
			{ name: Robo_RushControls.JUMP, keys: ["w", "space"] },
			{ name: Robo_RushControls.ATTACK, keys: ["e"] },
			{ name: Robo_RushControls.ESC, keys: ["esc"] },
		],
		useWebGL: true, // Tell the game we want to use webgl
		showDebug: false, // Whether to show debug messages. You can change this to true if you want
	};

	// Create a game with the options specified
	const game = new Game(options);

	// Start our game
	game.start(SplashScreen, {});
})();