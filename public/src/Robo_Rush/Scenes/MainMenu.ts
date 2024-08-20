
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import { HW3Controls } from "../HW3Controls";
import Level1 from "./Level1";
import Level2 from "./Level2";
import Level3 from "./Level3";
import Level4 from "./Level4";
import Level5 from "./Level5";
import Level6 from "./Level6";


// Layers for the main menu scene
export const MenuLayers = {
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
	LOCKED: "LOCKED",
} as const;

export default class MainMenu extends Scene {

    public static readonly MUSIC_KEY = "MAIN_MENU_MUSIC";
    public static readonly MUSIC_PATH = "assets/music/roborushMainMusic.wav";

    public static BACKGROUND_KEY = "BACKGROUND";
    public static BACKGROUND_PATH = "assets/images/BackgroundMenu.png";
    private bg: Sprite;

	public static levelcounter = 1;
	// Layers, for multiple main menu screens
	private mainMenu: Layer;
	private controls: Layer;
	private about: Layer;
	private levels: Layer;

    public loadScene(): void {
        // Load the menu song
        this.load.audio(MainMenu.MUSIC_KEY, MainMenu.MUSIC_PATH);
        this.load.image(MainMenu.BACKGROUND_KEY, MainMenu.BACKGROUND_PATH);
    }

    public startScene(): void {
		this.viewport.setZoomLevel(1);
        const center = this.viewport.getCenter();

		this.addLayer(MenuLayers.BACKGROUND, 0);
        this.bg = this.add.sprite(MainMenu.BACKGROUND_KEY, MenuLayers.BACKGROUND);
        this.bg.position.copy(center);

		this.bg.scale.set(2.75,2.75);

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        // Main menu screen
		this.mainMenu = this.addUILayer(MenuLayers.MAIN_MENU);

		// Controls screen
		this.controls = this.addUILayer(MenuLayers.CONTROLS);
		this.controls.setHidden(true);
		// About screen

		this.about = this.addUILayer(MenuLayers.ABOUT);
		this.about.setHidden(true);

		this.levels = this.addUILayer(MenuLayers.LEVEL_SELECT);
		this.levels.setHidden(true);

		// Add play button, and give it an event to emit on press
		const play = this.add.uiElement(
			UIElementType.BUTTON,
			MenuLayers.MAIN_MENU,
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
			MenuLayers.MAIN_MENU,
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
			MenuLayers.MAIN_MENU,
			{ position: new Vec2(center.x, center.y + 150), text: "Help" }
		);
		about.size.set(300, 100);
		about.borderWidth = 2;
		about.borderColor = Color.WHITE;
		about.backgroundColor = Color.BLACK;
		about.onClickEventId = MainMenuEvent.ABOUT;

		const levels = this.add.uiElement(
			UIElementType.BUTTON,
			MenuLayers.MAIN_MENU,
			{ position: new Vec2(center.x, center.y), text: "Levels" }
		);

		levels.size.set(300, 100);
		levels.borderWidth = 2;
		levels.borderColor = Color.WHITE;
		levels.backgroundColor = Color.BLACK;
		levels.onClickEventId = MainMenuEvent.LEVEL_SELECT;

       

		this.levelButton("1", center.x, center.y - 300, MainMenuEvent.PLAY_GAME);
		MainMenu.levelcounter >= 2 ? this.levelButton("2", center.x, center.y - 200, MainMenuEvent.LEVEL2) : this.levelButton("LOCKED", center.x, center.y - 200, MainMenuEvent.LOCKED);
		MainMenu.levelcounter >= 3 ? this.levelButton("3", center.x, center.y - 100, MainMenuEvent.LEVEL3) : this.levelButton("LOCKED", center.x, center.y - 100, MainMenuEvent.LOCKED);
		MainMenu.levelcounter >= 4 ? this.levelButton("4", center.x, center.y - 0, MainMenuEvent.LEVEL4) : this.levelButton("LOCKED", center.x, center.y - 0, MainMenuEvent.LOCKED);
		MainMenu.levelcounter >= 5 ? this.levelButton("5", center.x, center.y + 100, MainMenuEvent.LEVEL5) : this.levelButton("LOCKED", center.x, center.y + 100, MainMenuEvent.LOCKED);
		MainMenu.levelcounter >= 6 ? this.levelButton("6", center.x, center.y + 200, MainMenuEvent.LEVEL6) : this.levelButton("LOCKED", center.x, center.y + 200, MainMenuEvent.LOCKED);


		const levelsBack = this.add.uiElement(
			UIElementType.BUTTON,
			MenuLayers.LEVEL_SELECT,
			{ position: new Vec2(center.x, center.y + 350), text: "Back" }
		);
		levelsBack.size.set(300, 100);
		levelsBack.borderWidth = 2;
		levelsBack.borderColor = Color.WHITE;
		levelsBack.backgroundColor = Color.BLACK;
		levelsBack.onClickEventId = MainMenuEvent.MENU;

        

		// controls menu
        const controlBox = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.CONTROLS, {position: new Vec2(center.x, center.y), text: ""});
        controlBox.size.set(700, 360);
        controlBox.borderWidth = 2;
        controlBox.borderColor = Color.GREEN;
        controlBox.backgroundColor = Color.WHITE;
        controlBox.textColor = Color.BLACK;

        const t1 = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.CONTROLS, {position: new Vec2(center.x, center.y - 100), text: "-Press Space to Jump"});
        t1.textColor = Color.BLACK;
        const t2 = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.CONTROLS, {position: new Vec2(center.x, center.y - 50), text: "-Press Space Twice to double Jump"});
        t2.textColor = Color.BLACK;
        const t3 = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.CONTROLS, {position: new Vec2(center.x, center.y + 0), text: "-Press S to move down the rope"});
        t3.textColor = Color.BLACK
        const t4 = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.CONTROLS, {position: new Vec2(center.x, center.y + 50), text: "-Press W to move back up the rope"});
        t4.textColor = Color.BLACK;
        const t5 = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.CONTROLS, {position: new Vec2(center.x, center.y + 100), text: "-Press Escape to Go Back to Main Menu"});
        t5.textColor = Color.BLACK;

		const back = this.add.uiElement(
			UIElementType.BUTTON,
			MenuLayers.CONTROLS,
			{ position: new Vec2(center.x, center.y + 250), text: "Back" }
		);
		back.size.set(300, 100);
		back.borderWidth = 2;
		back.borderColor = Color.WHITE;
		back.backgroundColor = Color.BLACK;
		back.onClickEventId = MainMenuEvent.MENU;

        back.onClick = () => {
            this.mainMenu.setHidden(false);
			this.controls.setHidden(true);
			this.about.setHidden(true);
			this.levels.setHidden(true);
        }

		const helpBox = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.ABOUT, {position: new Vec2(center.x, center.y - 15), text: ""});
        helpBox.size.set(1100, 600);
        helpBox.borderWidth = 2;
        helpBox.borderColor = Color.GREEN;     
		helpBox.backgroundColor = Color.WHITE;
        helpBox.textColor = Color.BLACK;

		const text0 = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.ABOUT, {position: new Vec2(center.x, center.y - 220), text: "The laboratories of the master evil scientist Doctor HEHE have been found"});
        text0.textColor = Color.BLACK;
		const text9 = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.ABOUT, {position: new Vec2(center.x, center.y - 170), text: "in the Mazonian jungle by government satellites. In response, his twin"});
        text9.textColor = Color.BLACK;
		const text6 = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.ABOUT, {position: new Vec2(center.x, center.y - 120), text: "brother, Doctor SIGMA, has launched his secret project, an all-terrain"});
        text6.textColor = Color.BLACK;
		const text8 = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.ABOUT, {position: new Vec2(center.x, center.y - 70), text: "cybernetic android named PAKMA, in order to search the jungle and capture"});
        text8.textColor = Color.BLACK;
		const text5 = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.ABOUT, {position: new Vec2(center.x, center.y - 20), text: "Doctor HEHE. PAKMA enters the jungle on the hunt for Doctor HEHE."});
        text5.textColor = Color.BLACK;
		const text7 = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.ABOUT, {position: new Vec2(center.x, center.y + 30), text: "However, Doctor HEHE has surprises that lay in front of our robotic hero."});
        text7.textColor = Color.BLACK;


        const text1 = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.ABOUT, {position: new Vec2(center.x, center.y + 120), text: "This game was made by Jamyang Ponsar, Mazen Ibrahim, and Henry Chen"});
        text1.textColor = Color.BLACK;
        const text2 = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.ABOUT, {position: new Vec2(center.x, center.y + 170), text: "using the Wolfie2D game engine, a TypeScript game engine created by"});
        text2.textColor = Color.BLACK;
        const text3 = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.ABOUT, {position: new Vec2(center.x, center.y + 220), text: "Joe Weaver and Richard McKenna."});
        text3.textColor = Color.BLACK	/*
        const wasd = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.CONTROLS, {position: new Vec2(center.x, center.y + 50), text: "-Press W to move back up the rope"});
        wasd.textColor = Color.BLACK;
        const esc = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.CONTROLS, {position: new Vec2(center.x, center.y + 100), text: "-Press Escape to Pause"});
        esc.textColor = Color.BLACK;
		*/
		const aboutHeader = <Label>this.add.uiElement(UIElementType.LABEL,MenuLayers.ABOUT,{position: new Vec2(center.x, center.y - 270),text: "BackStory",});

		aboutHeader.textColor = Color.BLACK;

		/*
		const text1 =
			"This game was made by Jamyang Ponsar, Mazen Ibrahim, and Henry Chen";
		const text2 =
			"using the Wolfie2D game engine, a TypeScript game engine created by";
		const text3 = "Joe Weaver and Richard McKenna.";

		const line1 = <Label>this.add.uiElement(
			UIElementType.LABEL,
			MenuLayers.ABOUT,
			{
				position: new Vec2(center.x, center.y - 50),
				text: text1,
			}
		);
		line1.backgroundColor = Color.BLACK;
		const line2 = <Label>this.add.uiElement(
			UIElementType.LABEL,
			MenuLayers.ABOUT,
			{
				position: new Vec2(center.x, center.y),
				text: text2,
			}
		);
		line2.backgroundColor = Color.BLACK;
		const line3 = <Label>this.add.uiElement(
			UIElementType.LABEL,
			MenuLayers.ABOUT,
			{
				position: new Vec2(center.x, center.y + 50),
				text: text3,
			}
		);
		line3.backgroundColor = Color.BLACK;

		line1.textColor = Color.WHITE;
		line2.textColor = Color.WHITE;
		line3.textColor = Color.WHITE;
		*/

		const aboutBack = this.add.uiElement(
			UIElementType.BUTTON,
			MenuLayers.ABOUT,
			{ position: new Vec2(center.x, center.y + 300), text: "Back" }
		);
		aboutBack.size.set(200, 50);
		aboutBack.borderWidth = 2;
		aboutBack.borderColor = Color.WHITE;
		aboutBack.backgroundColor = Color.BLACK;
		aboutBack.onClickEventId = MainMenuEvent.MENU;
        aboutBack.onClick = () => {
            this.levels.setHidden(true);
            this.controls.setHidden(true);
            this.about.setHidden(true);
			this.mainMenu.setHidden(false);
        }

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


        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: MainMenu.MUSIC_KEY, loop: true, holdReference: true});
    }
    

    public updateScene(): void {
        while (this.receiver.hasNextEvent()) {
			this.handleEvent(this.receiver.getNextEvent());
		}
		if(Input.isPressed(HW3Controls.CHEAT2)) {
			MainMenu.levelcounter = 6;
			this.sceneManager.changeToScene(MainMenu);
		}
    }

    public unloadScene(): void {
        //stop music
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: MainMenu.MUSIC_KEY});
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

    private levelButton(n: string, x: number, y: number, event: string) {
		const button = this.add.uiElement(
			UIElementType.BUTTON,
			MenuLayers.LEVEL_SELECT,
			{ position: new Vec2(x, y), text: n }
		);
		button.size.set(250, 75);
		button.borderWidth = 2;
		button.borderColor = Color.WHITE;
		button.backgroundColor = Color.RED;
		button.onClickEventId = event;
	}
}

