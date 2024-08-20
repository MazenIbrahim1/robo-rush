import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import RandUtils from "../../Wolfie2D/Utils/RandUtils";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import CanvasNode from "../../Wolfie2D/Nodes/CanvasNode";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Timer from "../../Wolfie2D/Timing/Timer";
import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";

import PlayerController, { PlayerAnimations, PlayerStates } from "../Player/PlayerController";

import { Robo_RushEvents } from "../Robo_Rush_Events";
import MainMenu from "./MainMenu";
import Input from "../../Wolfie2D/Input/Input";
import { Robo_RushControls } from "../controls";

export const Level1Layers = {
	PRIMARY: "PRIMARY",
	BACKGROUND: "BACKGROUND", 
	UI: "UI"
} as const;

export default class Level1 extends Scene{
    // The key and path to the player's spritesheet json data
    public static PLAYER_KEY: string = "PAKMA";
    public static PLAYER_PATH = "assets/sprites/PAKMA.json";
    // The key and path to the background sprite
	public static BACKGROUND_KEY = "BACKGROUND";
    public static BACKGROUND_PATH = "assets/images/Level1Background.png";

    public static TILEMAP_KEY = "TILEMAP";
    public static TILEMAP_PATH = "assets/tilemaps/level1tilemap.json";
    public static TILEMAP_SCALE= new Vec2(2,2);

    //PAKMA
    private player: AnimatedSprite;

    private bg1: Sprite; //backgrounds
    private bg2: Sprite;


    private healthLabel: Label; //word
    private healthBar: Label; //fillinf
    private healthBarBorder: Label; //border

    private chargeLabel: Label; //word
    private chargeBar: Label; //filling
    private chargeBarBorder: Label; //border

    private progressLabel: Label; //word
    private progressBar: Label; //filling
    private progressBarBorder: Label; //border


    public override loadScene(){
        this.load.spritesheet(Level1.PLAYER_KEY, Level1.PLAYER_PATH);
        this.load.image(Level1.BACKGROUND_KEY, Level1.BACKGROUND_PATH);
        //this.load.tilemap(Level1.TILEMAP_KEY, Level1.TILEMAP_PATH);
    }

    public override startScene(): void {
        

        this.addLayer(Level1Layers.BACKGROUND,0)
        this.initBackground();
       // this.initTileMap();


        this.addLayer(Level1Layers.PRIMARY,10);
        this.initPlayer();
        this.initUI();

        this.receiver.subscribe(Robo_RushEvents.LEVEL_START);
        this.receiver.subscribe(Robo_RushEvents.LEVEL_END);
        this.receiver.subscribe(Robo_RushEvents.HEALTH_CHANGE);
        this.receiver.subscribe(Robo_RushEvents.PLAYER_DEAD);
        this.receiver.subscribe(Robo_RushEvents.LASER_ATTACK);
        this.receiver.subscribe(Robo_RushEvents.PLAYER_OBSTACLE_COLLISION);
        this.receiver.subscribe(Robo_RushEvents.WEAPON_CHARGE_CHANGE);
        this.receiver.subscribe(Robo_RushEvents.PROGRESS_CHANGE);
        this.receiver.subscribe(Robo_RushEvents.DEAD);
        this.receiver.subscribe(Robo_RushEvents.ESC);
    }
    
    public override updateScene(deltaT: number): void {
        while (this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }

        this.moveBackgrounds(deltaT);
    }

    public override unloadScene(): void {
        
    }

    protected handleEvent(event: GameEvent){
        switch(event.type){
            case Robo_RushEvents.LEVEL_START:{
                break;
            }
            case Robo_RushEvents.LEVEL_END:{
                break;
            }
            case Robo_RushEvents.HEALTH_CHANGE:{
                break;
            }
            case Robo_RushEvents.PLAYER_DEAD:{
                break;
            }
            case Robo_RushEvents.LASER_ATTACK:{
                break;
            }
            case Robo_RushEvents.PLAYER_OBSTACLE_COLLISION:{
                break;
            }
            case Robo_RushEvents.WEAPON_CHARGE_CHANGE:{
                break;
            }
            case Robo_RushEvents.PROGRESS_CHANGE:{
                break;
            }
            case Robo_RushEvents.DEAD:{
                break;
            }
            case Robo_RushEvents.W_PRESSED: {
                this.handleWPressedEvent();
                break;
            }
            case Robo_RushEvents.ESC:{
                this.sceneManager.changeToScene(MainMenu, {});
				break;
            }
        }
    }

    protected initPlayer(){
        this.player = this.add.animatedSprite(Level1.PLAYER_KEY, Level1Layers.PRIMARY);

        this.player.position.set(this.viewport.getOrigin().x+100, this.viewport.getView().y + 200);
        this.player.scale.set(3,3);

        let playerCollider = new AABB(Vec2.ZERO, this.player.sizeWithZoom);
        this.player.setCollisionShape(playerCollider);

        this.player.addAI(PlayerController);
    }

    protected initTileMap(){
        this.add.tilemap(Level1.TILEMAP_KEY, Level1.TILEMAP_SCALE)
    }

    protected initUI():void{
        this.addUILayer(Level1Layers.UI);
        UIElementType.LABEL,
        this.healthBarBorder = <Label>this.add.uiElement(UIElementType.LABEL, Level1Layers.UI, {position:new Vec2(300,75), text:""});
        this.healthBarBorder.size.set(510,40);
        this.healthBarBorder.backgroundColor = Color.BLACK;

        this.healthLabel = <Label>this.add.uiElement(UIElementType.LABEL, Level1Layers.UI, {position:new Vec2(200,75), text:"HP   "});
        this.healthLabel.size.set(300,30);
        this.healthLabel.fontSize = 24;
        this.healthLabel.font = "Courier";

        this.healthBar = <Label>this.add.uiElement(UIElementType.LABEL, Level1Layers.UI, {position:new Vec2(300,75), text:""});
        this.healthBar.size.set(500,30);
        this.healthBar.backgroundColor = Color.RED;
        
        this.chargeBarBorder = <Label>this.add.uiElement(UIElementType.LABEL, Level1Layers.UI, {position:new Vec2(200,125), text:""});
        this.chargeBarBorder.size.set(310,40);
        this.chargeBarBorder.backgroundColor = Color.BLACK;

        this.chargeLabel = <Label>this.add.uiElement(UIElementType.LABEL, Level1Layers.UI, {position:new Vec2(100,125), text:"CHARGE"});
        this.chargeLabel.size.set(300,30);
        this.chargeLabel.fontSize = 24;
        this.chargeLabel.font = "Courier";

        this.chargeBar = <Label>this.add.uiElement(UIElementType.LABEL, Level1Layers.UI, {position:new Vec2(200,125), text:""});
        this.chargeBar.size.set(300,30);
        this.chargeBar.backgroundColor = Color.BLUE;

        this.progressBarBorder = <Label>this.add.uiElement(UIElementType.LABEL, Level1Layers.UI, {position:new Vec2(750,850), text:""});
        this.progressBarBorder.size.set(1010,40);
        this.progressBarBorder.backgroundColor = Color.BLACK;

        this.progressLabel = <Label>this.add.uiElement(UIElementType.LABEL, Level1Layers.UI, {position:new Vec2(750,850), text:"LEVEL PROGRESS "});
        this.progressLabel.size.set(1000,30);
        this.progressLabel.fontSize = 24;
        this.progressLabel.font = "Courier";

        this.progressBar = <Label>this.add.uiElement(UIElementType.LABEL, Level1Layers.UI, {position:new Vec2(750,850), text:""});
        this.progressBar.size.set(1000,30);
        this.progressBar.backgroundColor = Color.GREEN;
    }


    protected initBackground(): void {
        this.bg1 = this.add.sprite(Level1.BACKGROUND_KEY, Level1Layers.BACKGROUND);
        this.bg1.scale.set(2.0,2.0);
        this.bg1.position.copy(this.viewport.getCenter());

        this.bg2 = this.add.sprite(Level1.BACKGROUND_KEY, Level1Layers.BACKGROUND);
        this.bg2.scale.set(2.0,2.0);
        this.bg2.position = this.bg1.position.clone();
        this.bg2.position.add(this.bg1.sizeWithZoom.scale(2,0));

    }

    protected handleWPressedEvent(): void {
        this.player._velocity.y = -200;
        this.player.animation.playIfNotAlready(PlayerAnimations.JUMP, true, PlayerAnimations.RUNNING);
    }

    protected moveBackgrounds(deltaT: number): void {
		let move = new Vec2(100, 0);
		this.bg1.position.sub(move.clone().scaled(deltaT));
		this.bg2.position.sub(move.clone().scaled(deltaT));

		let edgePos = this.viewport.getCenter().clone().add(this.bg1.sizeWithZoom.clone().scale(-2, 0));

		if (this.bg1.position.x <= edgePos.x){
			this.bg1.position = this.viewport.getCenter().clone().add(this.bg1.sizeWithZoom.clone().scale(2, 0))
		}
		if (this.bg2.position.x <= edgePos.x){
			this.bg2.position = this.viewport.getCenter().clone().add(this.bg2.sizeWithZoom.clone().scale(2, 0))
		}
	}
}