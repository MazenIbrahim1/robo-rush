import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import Scene from "../../Wolfie2D/Scene/Scene";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import PlayerController, { PlayerAnimations, PlayerTweens } from "../Player/PlayerController";

import { HW3Events } from "../HW3Events";
import { HW3PhysicsGroups } from "../HW3PhysicsGroups";
import HW3FactoryManager from "../Factory/HW3FactoryManager";
import MainMenu from "./MainMenu";
import Particle from "../../Wolfie2D/Nodes/Graphics/Particle";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import { HW3Controls } from "../HW3Controls";
import Level1 from "./Level1";
import Level2 from "./Level2";
import Level3 from "./Level3";
import Level4 from "./Level4";
import Level5 from "./Level5";
import Level6 from "./Level6";

export const HW3Layers = {
    PRIMARY: "PRIMARY",
    BACKGROUND: "BACKGROUND",
    UI: "UI"
} as const;

export type HW3Layer = typeof HW3Layers[keyof typeof HW3Layers]

export default abstract class HW3Level extends Scene {

    
    public add: HW3FactoryManager;

    protected playerSpriteKey: string;
    protected player: AnimatedSprite;
    protected playerSpawn: Vec2;

    private healthLabel: Label;
	private healthBar: Label;
	private healthBarBg: Label;

    private chargeLabel: Label; //word
    private chargeBar: Label; //filling
    private chargeBarBg: Label; //border

    private progressLabel: Label; //word
    private progressBar: Label; //filling
    private progressBarBg: Label; //border

    protected onRope1: Vec2;
    protected onRope2: Vec2;

    /** The end of level stuff */

    protected levelEndPosition: Vec2;
    protected levelEndHalfSize: Vec2;

    protected levelEndArea: Rect;
    protected nextLevel: new (...args: any) => Scene;
    protected levelEndTimer: Timer;
    protected levelEndLabel: Label;

    protected levelTransitionTimer: Timer;
    protected levelTransitionScreen: Rect;

    protected tilemapKey: string; 
    protected destructibleLayerKey: string; 
    protected wallsLayerKey: string; 
    protected backgroundLayerKey :string;
    protected backgroundKey:string; 

   
    protected tilemapScale: Vec2;
    protected destructable: OrthogonalTilemap;
    protected walls: OrthogonalTilemap;
    protected background: OrthogonalTilemap;

    /** Sound and music */
    protected levelMusicKey: string;
    protected jumpAudioKey: string;
    protected deadAudioKey: string;
    protected takingDamageAudioKey: string;
    protected tileDestroyedAudioKey: string;

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, {...options, physics: {
            groupNames: [
                HW3PhysicsGroups.GROUND, 
                HW3PhysicsGroups.PLAYER, 
                HW3PhysicsGroups.PLAYER_WEAPON, 
                HW3PhysicsGroups.DESTRUCTABLE
            ],
            collisions:
            [
                [0, 1, 1, 0],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [0, 1, 1, 0],
            ]
        }});
        this.add = new HW3FactoryManager(this, this.tilemaps);
    }

    public startScene(): void {
        
        this.initLayers();
        this.initializeTilemap();
        this.initializePlayer(this.playerSpriteKey);
        this.initializeViewport();
        this.subscribeToEvents();
        this.initializeUI();
        this.initializeLevelEnds();
    
        this.levelTransitionTimer = new Timer(500);
        this.levelEndTimer = new Timer(3000, () => {
            MainMenu.levelcounter +=1;
            this.levelTransitionScreen.tweens.play("fadeIn");
        });

        Input.disableInput();

        this.levelTransitionScreen.tweens.play("fadeOut");
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: this.levelMusicKey, loop: true, holdReference: true});
    }

    public updateScene(deltaT: number) {
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        this.handleProgressBar();
        if(Input.isPressed(HW3Controls.ESC)) {
            this.emitter.fireEvent(GameEventType.STOP_SOUND);
            this.unloadScene();
            this.sceneManager.changeToScene(MainMenu);
        }
        if(Input.isPressed(HW3Controls.CHEAT1)) {
            this.sceneManager.changeToScene(Level1);
        } 
        if(Input.isPressed(HW3Controls.MOVE_DOWN) && (this.onRope1.x >= this.player.position.x && this.onRope2.x <= this.player.position.x)) {
            this.emitter.fireEvent(HW3Events.UPSIDE_DOWN);
            this.player.position.y = 490;
            this.player.animation.play(PlayerAnimations.UPSIDE_DOWN);
        }
        console.log(this.onRope1.x);
    }

    protected handleEvent(event: GameEvent): void {
        switch (event.type) {
            case HW3Events.PLAYER_ENTERED_LEVEL_END: {
                this.handleEnteredLevelEnd();
                break;
            }
            // When the level starts, reenable user input
            case HW3Events.LEVEL_START: {
                Input.enableInput();
                break;
            }
            // When the level ends, change the scene to the next level
            case HW3Events.LEVEL_END: {
                this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: this.levelMusicKey});
                this.sceneManager.changeToScene(this.nextLevel);
                break;
            }
            case HW3Events.HEALTH_CHANGE: {
                console.log(event.data.get("curhp"));
                this.handleHealthChange(event.data.get("curhp"), event.data.get("maxhp"));
                break;
            }
            case HW3Events.PLAYER_DEAD: {
                this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: this.deadAudioKey, loop: false, holdReference: false});
                this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: this.levelMusicKey});
                this.unloadScene();
                this.sceneManager.changeToScene(MainMenu);
                break;
            }
            case HW3Events.PROGRESS_BAR: {
                this.handleProgressBar();
                break;
            }
            case HW3Events.UPSIDE_DOWN: {
                this.player.position.y = 490;
                this.player.animation.play(PlayerAnimations.UPSIDE_DOWN);
                break;
            }
            case HW3Events.MOVE_UP: {
                if((HW3Controls.MOVE_DOWN) && (this.onRope1.x >= this.player.position.x && this.onRope2.x <= this.player.position.x)) {
                    this.player.position.y = 385;
                    this.player.animation.play(PlayerAnimations.IDLE);
                }
                break;
            }
            // case HW3Events.CHARGE_CHANGE: {
            //     this.handleChargeChange(event.data.get("curcharge"), event.data.get("maxcharge"));
            // }
            // Default: Throw an error! No unhandled events allowed.
            default: {
                throw new Error(`Unhandled event caught in scene with type ${event.type}`)
            }
        }
    }

    /* Handlers for the different events the scene is subscribed to */

    /**
     * Handles progress bar change
     */
    protected handleProgressBar(): void {
            if (1000 - (this.player.position.x * 1000) /15750 > 0)
            {
                this.progressBar.size.x = 1000 - (this.player.position.x * 1000) / 15750;
            }
	}


    protected handleChargeChange(currentCharge: number, maxCharge: number): void {
		let unit = this.chargeBarBg.size.x / maxCharge;
        
		this.chargeBar.size.set(this.chargeBarBg.size.x - unit * (maxCharge - currentCharge), this.chargeBarBg.size.y);
		this.chargeBar.position.set(this.chargeBarBg.position.x - (unit / 2 / this.getViewScale()) * (maxCharge - currentCharge), this.chargeBarBg.position.y);

	}

    

    protected handleEnteredLevelEnd(): void {
        // If the timer hasn't run yet, start the end level animation
        if (!this.levelEndTimer.hasRun() && this.levelEndTimer.isStopped()) {
            this.levelEndTimer.start();
            this.levelEndLabel.tweens.play("slideIn");
        }
    }

    protected handleHealthChange(currentHealth: number, maxHealth: number): void {
        console.log("this is current health: " + currentHealth);
		let unit = this.healthBarBg.size.x / maxHealth;
        
		this.healthBar.size.set(this.healthBarBg.size.x - unit * (maxHealth - currentHealth), this.healthBarBg.size.y);
		this.healthBar.position.set(this.healthBarBg.position.x - (unit / 2 / this.getViewScale()) * (maxHealth - currentHealth), this.healthBarBg.position.y);

		this.healthBar.backgroundColor = currentHealth < maxHealth * 1/4 ? Color.RED: currentHealth < maxHealth * 3/4 ? Color.YELLOW : Color.GREEN;
	}

    
    protected initLayers(): void {
        this.addLayer(HW3Layers.BACKGROUND,-1);
        this.addUILayer(HW3Layers.UI);
        this.addLayer(HW3Layers.PRIMARY,2);
    }
    
    protected initializeTilemap(): void {
        if (this.tilemapKey === undefined || this.tilemapScale === undefined) {
            throw new Error("Cannot add the homework 4 tilemap unless the tilemap key and scale are set.");
        }
        
        this.add.tilemap(this.tilemapKey, this.tilemapScale);

        if (this.destructibleLayerKey === undefined || this.wallsLayerKey === undefined || this.backgroundLayerKey ===undefined) {
            throw new Error("Make sure the keys for the destuctible layer and wall layer are both set");
        }

        this.walls = this.getTilemap(this.wallsLayerKey) as OrthogonalTilemap;
        this.destructable = this.getTilemap(this.destructibleLayerKey) as OrthogonalTilemap;
        this.background = this.getTilemap(this.backgroundKey) as OrthogonalTilemap;

        this.destructable.addPhysics();
        this.destructable.setGroup(HW3PhysicsGroups.DESTRUCTABLE);
        this.destructable.setTrigger(HW3PhysicsGroups.PLAYER, HW3Events.COLLISION_DESTRUCTABLE, "");
        //VERY IMPORTANT SETS THE COLLLSION FOR PLAYER INTO THE OBSTACLES
    }

    protected subscribeToEvents(): void {
        this.receiver.subscribe(HW3Events.PLAYER_ENTERED_LEVEL_END);
        this.receiver.subscribe(HW3Events.LEVEL_START);
        this.receiver.subscribe(HW3Events.LEVEL_END);
        this.receiver.subscribe(HW3Events.HEALTH_CHANGE);
        this.receiver.subscribe(HW3Events.PLAYER_DEAD);
        this.receiver.subscribe(HW3Events.PROGRESS_BAR);
        this.receiver.subscribe(HW3Events.UPSIDE_DOWN);
        this.receiver.subscribe(HW3Events.MOVE_UP);
        this.receiver.subscribe(HW3Events.ON_ROPE);
    }
    
    protected initializeUI(): void {

        // HP Label
		this.healthLabel = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(65, 50), text: "HP "});
		this.healthLabel.size.set(350, 30);
		this.healthLabel.fontSize = 24;
		this.healthLabel.font = "Courier";
        this.healthLabel.setTextColor(Color.WHITE);

        // HealthBar
		this.healthBar = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(180, 50), text: ""});
		this.healthBar.size = new Vec2(350, 25);
		this.healthBar.backgroundColor = Color.YELLOW;

        // HealthBar Border
		this.healthBarBg = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(180, 50), text: ""});
		this.healthBarBg.size = new Vec2(350, 25);
		this.healthBarBg.borderColor = Color.BLACK;

         // Charge Label
		// this.chargeLabel = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(150, 50), text: "CHARGE    "});
		// this.chargeLabel.size.set(300, 30);
		// this.chargeLabel.fontSize = 24;
		// this.chargeLabel.font = "Courier";
        // this.chargeLabel.setTextColor(Color.WHITE);

        // // ChargeBar
		// this.chargeBar = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(250, 50), text: ""});
		// this.chargeBar.size = new Vec2(300, 25);
		// this.chargeBar.backgroundColor = Color.BLUE;

        // // ChargeBar Border
		// this.chargeBarBg = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(250, 50), text: ""});
		// this.chargeBarBg.size = new Vec2(300, 25);
		// this.chargeBarBg.borderColor = Color.BLACK;

         // Progress Label
		this.progressLabel = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(350, 455), text: "PROGRESS"});
		this.progressLabel.size.set(300, 30);
		this.progressLabel.fontSize = 24;
		this.progressLabel.font = "Courier";
        this.progressLabel.setTextColor(Color.WHITE);

        // ProgressBar
		this.progressBar = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(350, 440), text: ""});
		this.progressBar.size = new Vec2(1000, 25);
		this.progressBar.backgroundColor = Color.YELLOW;

        // ProgressBar Border
		this.progressBarBg = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(350, 440), text: ""});
		this.progressBarBg.size = new Vec2(1000, 25);
		this.progressBarBg.borderColor = Color.BLACK;



        // End of level label (start off screen)
        this.levelEndLabel = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, { position: new Vec2(-400, 100), text: "Level Complete" });
        this.levelEndLabel.size.set(1200, 60);
        this.levelEndLabel.borderRadius = 0;
        this.levelEndLabel.backgroundColor = new Color(34, 32, 52);
        this.levelEndLabel.textColor = Color.WHITE;
        this.levelEndLabel.fontSize = 48;
        this.levelEndLabel.font = "PixelSimple";

        this.levelEndLabel.tweens.add("slideIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.posX,
                    start: -400,
                    end: 350,
                    ease: EaseFunctionType.OUT_SINE
                }
            ]
        });

        this.levelTransitionScreen = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.UI, { position: new Vec2(300, 200), size: new Vec2(600, 400) });
        this.levelTransitionScreen.color = new Color(34, 32, 52);
        this.levelTransitionScreen.alpha = 1;

        this.levelTransitionScreen.tweens.add("fadeIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 0,
                    end: 1,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: HW3Events.LEVEL_END
        });

        this.levelTransitionScreen.tweens.add("fadeOut", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: HW3Events.LEVEL_START
        });
    }
    
    

    protected initializePlayer(key: string): void {
        if (this.playerSpawn === undefined) {
            throw new Error("Player spawn must be set before initializing the player!");
        }

        this.player = this.add.animatedSprite(key, HW3Layers.PRIMARY);
        this.player.scale.set(1,1);
        this.player.position.copy(this.playerSpawn);

        // Give the player physics and setup collision groups and triggers for the player
        this.player.addPhysics(new AABB(this.player.position.clone(), this.player.boundary.getHalfSize().clone()));
        this.player.setGroup(HW3PhysicsGroups.PLAYER);

        // Give the player it's AI
        this.player.addAI(PlayerController, { 
            tilemap: "Destructable" 
        });
    }

    protected initializeViewport(): void {
        if (this.player === undefined) {
            throw new Error("Player must be initialized before setting the viewport to folow the player");
        }
        this.viewport.follow(this.player);
        this.viewport.setZoomLevel(1.7);
        this.viewport.setBounds(1, 1, 15500, 640);
    }
    protected initializeLevelEnds(): void {
        if (!this.layers.has(HW3Layers.PRIMARY)) {
            throw new Error("Can't initialize the level ends until the primary layer has been added to the scene!");
        }
        
        this.levelEndArea = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.PRIMARY, { position: this.levelEndPosition, size: this.levelEndHalfSize });
        console.log(this.levelEndPosition.x);
        this.levelEndArea.addPhysics(undefined, undefined, false, true);
        this.levelEndArea.setTrigger(HW3PhysicsGroups.PLAYER, HW3Events.PLAYER_ENTERED_LEVEL_END, "");
        this.levelEndArea.color = new Color(255, 0, 255, .20);
        
    }
    

    // Get the key of the player's jump audio file
    public getDeadAudioKey(): string {
        return this.deadAudioKey;
    }

    public getJumpAudioKey(): string {
        return this.jumpAudioKey;
    }

    public getTakingDamageAudioKey(): string {
        return this.takingDamageAudioKey;
    }
    
    public unloadScene(): void {
        this.viewport.setZoomLevel(1);
    }
}