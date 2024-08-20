/* #################### IMPORTS #################### */
// Import from Wolfie2D or your own files here
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";

/* #################### CLASS DEFINITION #################### */

export const SplashScreenLayers = {
	LOGO: "LOGO",
    LOGO2: "LOGO2",
};

export default class SplashScreen extends Scene {
	private background: Sprite;
	public static LOGO_KEY = "LOGO";
	public static LOGO_PATH = "assets/images/splashScreen.png";

	/* ########## BUILT-IN FUNCTIONS ########## */
	// The following are built-in abstract Scene functions you are meant to extend.
	// They represent the lifecycle of a Scene, and thus allow you to load and start your scene

	// loadScene() is where you should load initial assets needed for your scene.
	// it is called strictly before startScene, so you are assured all assets will be loaded before
	// the scene begins
	loadScene(): void {
		this.load.image(SplashScreen.LOGO_KEY, SplashScreen.LOGO_PATH);
	}

	// startScene() is where you should build any game objects you wish to have in your scene,
	// or where you should initialize any other things you will need in your scene
	// Once again, this occurs strictly after loadScene(), so anything you loaded there will be available
	startScene(): void {
		this.receiver.subscribe("go");

		const center = this.viewport.getCenter();

		this.addLayer(SplashScreenLayers.LOGO, 0);

		this.background = this.add.sprite(SplashScreen.LOGO_KEY, SplashScreenLayers.LOGO);
		this.background.scale.set(1.15, 1.15);
		this.background.position.copy(this.viewport.getCenter());
	}

	// updateScene() is where you can handle any frame by frame updates to your scene.
	// For the most part, GameNode logic can be abstracted to AI, but there may be
	// things you want to control for the whole scene, like player score.
	// The argument to updateScene is the time step of the update frame
	updateScene(deltaT: number): void {
		if (Input.isMousePressed()) {
			this.sceneManager.changeToScene(MainMenu);
		}
	}
}
