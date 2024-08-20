import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";

import RandUtils from "../../Wolfie2D/Utils/RandUtils";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Level1 from "./Level1";
import Level2 from "./Level2";
import Level3 from "./Level3";
import Level4 from "./Level4";
import Level5 from "./Level5";
import Level6 from "./Level6";


// Layers in the main menu
const MainMenuLayer = {
	MAIN_MENU: "MAIN_MENU",
	CONTROLS: "CONTROLS",
	ABOUT: "ABOUT",
	LEVEL_SELECT: "LEVEL_SELECT",
	BACKGROUND:"BACKGROUND",
} as const;

// Events triggered in the main menu
const MainMenuEvent = {
	PLAY_GAME: "PLAY_GAME",
	CONTROLS: "CONTROLS",
	ABOUT: "ABOUT",
	MENU: "MENU",
	LEVEL_SELECT: "LEVEL_SELECT",
    LEVEL1: "LEVEL1",
	LEVEL2: "LEVEL2",
	LEVEL3: "LEVEL3",
	LEVEL4: "LEVEL4",
    LEVEL5: "LEVEL5",
    LEVEL6: "LEVEL6",
} as const;

export default class MainMenu extends Scene {

	public static BACKGROUND_KEY = "BACKGROUND";
    public static BACKGROUND_PATH = "assets/images/BackgroundMenu.png";
    private bg: Sprite;

	// Layers, for multiple main menu screens
	private mainMenu: Layer;
	private controls: Layer;
	private about: Layer;
	private levels: Layer;

	public override loadScene(): void {
        this.load.image(MainMenu.BACKGROUND_KEY, MainMenu.BACKGROUND_PATH);
    }

	public override startScene() {
		const center = this.viewport.getCenter();

		this.addLayer(MainMenuLayer.BACKGROUND, 0);
        this.bg = this.add.sprite(MainMenu.BACKGROUND_KEY, MainMenuLayer.BACKGROUND);
        this.bg.position.copy(center);

		this.bg.scale.set(2.75,2.75);

		// Main menu screen
		this.mainMenu = this.addUILayer(MainMenuLayer.MAIN_MENU);

		// Controls screen
		this.controls = this.addUILayer(MainMenuLayer.CONTROLS);
		this.controls.setHidden(true);
		// About screen

		this.about = this.addUILayer(MainMenuLayer.ABOUT);
		this.about.setHidden(true);

		this.levels = this.addUILayer(MainMenuLayer.LEVEL_SELECT);
		this.levels.setHidden(true);

		// Add play button, and give it an event to emit on press
		const play = this.add.uiElement(
			UIElementType.BUTTON,
			MainMenuLayer.MAIN_MENU,
			{ position: new Vec2(center.x, center.y - 150), text: "Play" }
		);
		play.size.set(300, 100);
		play.borderWidth = 2;
		play.borderColor = Color.WHITE;
		play.backgroundColor = Color.BLACK;
		play.onClickEventId = MainMenuEvent.PLAY_GAME;

		// Add controls button
		const controls = this.add.uiElement(
			UIElementType.BUTTON,
			MainMenuLayer.MAIN_MENU,
			{ position: new Vec2(center.x, center.y + 300), text: "Controls" }
		);
		controls.size.set(300, 100);
		controls.borderWidth = 2;
		controls.borderColor = Color.WHITE;
		controls.backgroundColor = Color.BLACK;
		controls.onClickEventId = MainMenuEvent.CONTROLS;

		// Add event button
		const about = this.add.uiElement(
			UIElementType.BUTTON,
			MainMenuLayer.MAIN_MENU,
			{ position: new Vec2(center.x, center.y + 150), text: "About" }
		);
		about.size.set(300, 100);
		about.borderWidth = 2;
		about.borderColor = Color.WHITE;
		about.backgroundColor = Color.BLACK;
		about.onClickEventId = MainMenuEvent.ABOUT;

		const levels = this.add.uiElement(
			UIElementType.BUTTON,
			MainMenuLayer.MAIN_MENU,
			{ position: new Vec2(center.x, center.y), text: "Levels" }
		);

		levels.size.set(300, 100);
		levels.borderWidth = 2;
		levels.borderColor = Color.WHITE;
		levels.backgroundColor = Color.BLACK;
		levels.onClickEventId = MainMenuEvent.LEVEL_SELECT;

		this.levelButton(1, center.x, center.y - 300, MainMenuEvent.PLAY_GAME);
		this.levelButton(2, center.x, center.y - 200, MainMenuEvent.LEVEL2);
		this.levelButton(3, center.x, center.y - 100, MainMenuEvent.LEVEL3);
		this.levelButton(4, center.x, center.y, MainMenuEvent.LEVEL4);
		this.levelButton(5, center.x, center.y + 100, MainMenuEvent.LEVEL4);
		this.levelButton(6, center.x, center.y + 200, MainMenuEvent.LEVEL4);

		const levelsBack = this.add.uiElement(
			UIElementType.BUTTON,
			MainMenuLayer.LEVEL_SELECT,
			{ position: new Vec2(center.x, center.y + 350), text: "Back" }
		);
		levelsBack.size.set(300, 100);
		levelsBack.borderWidth = 2;
		levelsBack.borderColor = Color.WHITE;
		levelsBack.backgroundColor = Color.BLACK;
		levelsBack.onClickEventId = MainMenuEvent.MENU;

		const header = <Label>this.add.uiElement(
			UIElementType.LABEL,
			MainMenuLayer.CONTROLS,
			{
				position: new Vec2(center.x, center.y - 250),
				text: "Controls",
			}
		);
		header.textColor = Color.BLUE;

		const ws = <Label>this.add.uiElement(
			UIElementType.LABEL,
			MainMenuLayer.CONTROLS,
			{
				position: new Vec2(center.x, center.y - 50),
				text: "-Press W to Jump; Press W W to double Jump",
			}
		);
		ws.textColor = Color.BLUE;
		const ad = <Label>this.add.uiElement(
			UIElementType.LABEL,
			MainMenuLayer.CONTROLS,
			{
				position: new Vec2(center.x, center.y),
				text: "-Press E to fire charged laser",
			}
		);
		ad.textColor = Color.BLUE;
		const click = <Label>this.add.uiElement(
			UIElementType.LABEL,
			MainMenuLayer.CONTROLS,
			{
				position: new Vec2(center.x, center.y + 50),
				text: "-Press S to move down the rope",
			}
		);
		click.textColor = Color.BLUE;
		const shift = <Label>this.add.uiElement(
			UIElementType.LABEL,
			MainMenuLayer.CONTROLS,
			{
				position: new Vec2(center.x, center.y + 100),
				text: "-Press W to move back up",
			}
		);
		shift.textColor = Color.BLUE;

		const back = this.add.uiElement(
			UIElementType.BUTTON,
			MainMenuLayer.CONTROLS,
			{ position: new Vec2(center.x, center.y + 250), text: "Back" }
		);
		back.size.set(300, 100);
		back.borderWidth = 2;
		back.borderColor = Color.WHITE;
		back.backgroundColor = Color.BLACK;
		back.onClickEventId = MainMenuEvent.MENU;

		const aboutHeader = <Label>this.add.uiElement(
			UIElementType.LABEL,
			MainMenuLayer.ABOUT,
			{
				position: new Vec2(center.x, center.y - 250),
				text: "About",
			}
		);
		aboutHeader.textColor = Color.MAGENTA;

		const text1 =
			"This game was made by Jamyang Pomsar and Mazen Ibrahim";
		const text2 =
			"using the Wolfie2D game engine, a TypeScript game engine created by";
		const text3 = "Joe Weaver and Richard McKenna.";

		const line1 = <Label>this.add.uiElement(
			UIElementType.LABEL,
			MainMenuLayer.ABOUT,
			{
				position: new Vec2(center.x, center.y - 50),
				text: text1,
			}
		);
		const line2 = <Label>this.add.uiElement(
			UIElementType.LABEL,
			MainMenuLayer.ABOUT,
			{
				position: new Vec2(center.x, center.y),
				text: text2,
			}
		);
		const line3 = <Label>this.add.uiElement(
			UIElementType.LABEL,
			MainMenuLayer.ABOUT,
			{
				position: new Vec2(center.x, center.y + 50),
				text: text3,
			}
		);

		line1.textColor = Color.MAGENTA;
		line2.textColor = Color.MAGENTA;
		line3.textColor = Color.MAGENTA;

		const aboutBack = this.add.uiElement(
			UIElementType.BUTTON,
			MainMenuLayer.ABOUT,
			{ position: new Vec2(center.x, center.y + 250), text: "Back" }
		);
		aboutBack.size.set(200, 50);
		aboutBack.borderWidth = 2;
		aboutBack.borderColor = Color.WHITE;
		aboutBack.backgroundColor = Color.TRANSPARENT;
		aboutBack.onClickEventId = MainMenuEvent.MENU;

		// Subscribe to the button events
		this.receiver.subscribe(MainMenuEvent.PLAY_GAME);
		this.receiver.subscribe(MainMenuEvent.CONTROLS);
		this.receiver.subscribe(MainMenuEvent.ABOUT);
		this.receiver.subscribe(MainMenuEvent.MENU);
		this.receiver.subscribe(MainMenuEvent.LEVEL_SELECT);
		this.receiver.subscribe(MainMenuEvent.LEVEL1);
        this.receiver.subscribe(MainMenuEvent.LEVEL2);
		this.receiver.subscribe(MainMenuEvent.LEVEL3);
		this.receiver.subscribe(MainMenuEvent.LEVEL4);
        this.receiver.subscribe(MainMenuEvent.LEVEL5);
        this.receiver.subscribe(MainMenuEvent.LEVEL6);
	}

	public override updateScene() {
		while (this.receiver.hasNextEvent()) {
			this.handleEvent(this.receiver.getNextEvent());
		}
	}

	protected handleEvent(event: GameEvent): void {
		switch (event.type) {
			case MainMenuEvent.PLAY_GAME: {
				this.sceneManager.changeToScene(Level1, {});
				break;
			}
            case MainMenuEvent.LEVEL1: {
				this.sceneManager.changeToScene(Level1, {});
				break;
			}
			case MainMenuEvent.LEVEL2: {
				this.sceneManager.changeToScene(Level2, {});
				break;
			}
			case MainMenuEvent.LEVEL3: {
				this.sceneManager.changeToScene(Level3, {});
				break;
			}
			case MainMenuEvent.LEVEL4: {
				this.sceneManager.changeToScene(Level4, {});
				break;
			}
            case MainMenuEvent.LEVEL5: {
				this.sceneManager.changeToScene(Level5, {});
				break;
			}
            case MainMenuEvent.LEVEL6: {
				this.sceneManager.changeToScene(Level6, {});
				break;
			}
			case MainMenuEvent.CONTROLS: {
				this.controls.setHidden(false);
				this.mainMenu.setHidden(true);
				break;
			}
			case MainMenuEvent.ABOUT: {
				this.about.setHidden(false);
				this.mainMenu.setHidden(true);
				break;
			}
			case MainMenuEvent.MENU: {
				this.mainMenu.setHidden(false);
				this.controls.setHidden(true);
				this.about.setHidden(true);
				this.levels.setHidden(true);
				break;
			}
			case MainMenuEvent.LEVEL_SELECT: {
				this.levels.setHidden(false);
				this.mainMenu.setHidden(true);
				break;
			}
			default: {
				throw new Error(`Unhandled event caught in MainMenu: "${event.type}"`);
			}
		}
	}

	private levelButton(n: number, x: number, y: number, event: string) {
		const button = this.add.uiElement(
			UIElementType.BUTTON,
			MainMenuLayer.LEVEL_SELECT,
			{ position: new Vec2(x, y), text: n.toString() }
		);
		button.size.set(250, 75);
		button.borderWidth = 2;
		button.borderColor = Color.WHITE;
		button.backgroundColor = Color.RED;
		button.onClickEventId = event;
	}
}
