import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Receiver from "../../Wolfie2D/Events/Receiver";
import Input from "../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";


import { Robo_RushControls } from "../controls";
import { Robo_RushEvents } from "../Robo_Rush_Events";

import CanvasNode from "../../Wolfie2D/Nodes/CanvasNode";
import Timer from "../../Wolfie2D/Timing/Timer";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Jump from "./PlayerStates/Jump";
import MainMenu from "../Scenes/MainMenu";

export const PlayerAnimations = {
    RUNNING: "RUNNING",
    JUMP: "JUMP",
    TAKING_DAMAGE: "TAKING_DAMAGE",
    DYING: "DEATH",
    DEAD: "DEAD",
} as const;

/**
 * Tween animations the player can player.
 */
 export const PlayerTweens = {
    DEATH: "DEATH",
} as const;

export const PlayerStates = {
    RUN : "RUN",
    JUMP: "JUMP",
    DOUBLEJUMP:"DOUBLEJUMP",
    FALL: "FALL",
    DEAD: "DEAD"

} as const

export default class PlayerController extends StateMachineAI {
    /** The GameNode that owns this PlayerController AI */
	protected owner: AnimatedSprite;

    public readonly MAX_SPEED: number = 200;
    public readonly MIN_SPEED: number = 100;

    private currentHealth: number;
    private maxHealth: number;
    private minHealth: number;

    private currentProgress: number;
    private minProgress: number;
    private maxProgress: number;

    private laserTimer: Timer;

    protected _velocity: Vec2;
	protected _speed: number;
    
    private currentCharge: number;
    private maxCharge: number;
    private minCharge: number;

    // A receiver and emitter to hook into the event queue
	protected receiver: Receiver;
	protected emitter: Emitter;

    protected tilemap: OrthogonalTilemap;

     /** 
	 * Get the inputs from the keyboard, or Vec2.Zero if nothing is being pressed
	 */
      public get inputDir(): Vec2 {
        let direction = Vec2.ZERO;
		direction.x = this.owner.positionX;
		direction.y = (Input.isJustPressed(Robo_RushControls.JUMP) ? -1 : 0);
		return direction;
    }

    public initializeAI(owner: AnimatedSprite, options: Record<string,any>): void {
		this.owner = owner;

		this.receiver = new Receiver();
		this.emitter = new Emitter();

        this._velocity = Vec2.ZERO;

        //this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
		this.receiver.subscribe(Robo_RushEvents.PLAYER_OBSTACLE_COLLISION);
		this.receiver.subscribe(Robo_RushEvents.LASER_ATTACK);

        // Add the different states the player can be in to the PlayerController 
		//this.addState(PlayerStates.RUN, new Run(this, this.owner));
        //this.addState(PlayerStates.JUMP, new DoubleJump(this, this.owner));
        //this.addState(PlayerStates.FALL, new Fall(this, this.owner));
        //this.addState(PlayerStates.DEAD, new Dead(this, this.owner));
        this.addState(PlayerStates.JUMP, new Jump(this, this.owner));

		this.activate(options);
	}

    public activate(options: Record<string,any>): void {
		// Set the player's current health
        this.currentHealth = 100;

        // Set upper and lower bounds on the player's health
        this.minHealth = 0;
        this.maxHealth = 100;

        // Set upper and lower bounds on the player's air
        this.currentProgress = 0;
        this.minProgress = 0;
        this.maxProgress = 100;

        this.currentCharge = 3;
        this.minCharge = 0;
        this.maxCharge = 3;
 
        
        // Play the running animation by default
		this.owner.animation.play(PlayerAnimations.RUNNING);
	};

    public update(deltaT: number): void {
        // First, handle all events 
		while(this.receiver.hasNextEvent()){
			this.handleEvent(this.receiver.getNextEvent());
		}

        // If the player is out of hp - play the death animation
		if (this.currentHealth <= this.minHealth) { 
            this.owner.animation.playIfNotAlready(PlayerAnimations.DYING, false, Robo_RushEvents.DEAD);
            return;
        }

		// Handle trying to shoot a laser from the submarine
		if (Input.isPressed(Robo_RushControls.ATTACK) && this.currentCharge == 3) {
			this.emitter.fireEvent(Robo_RushEvents.LASER_ATTACK, {src: this.owner.position});
		}

        if (Input.isPressed(Robo_RushControls.JUMP)){
            this.emitter.fireEvent(Robo_RushEvents.W_PRESSED);
            this.owner.animation.playIfNotAlready(PlayerAnimations.JUMP, false, PlayerAnimations.RUNNING);
        }

		let vp = this.owner.getScene().getViewport();

		// Lock the players position 
		this.lockPlayer(this.owner, vp.getCenter(), vp.getHalfSize());
		// Wrap the players position
		this.wrapPlayer(this.owner, vp.getCenter(), vp.getHalfSize());

		// Progress increases a little bit each frame
		this.currentProgress = MathUtils.clamp(this.currentProgress + deltaT, this.minProgress, this.maxProgress);
		this.emitter.fireEvent(Robo_RushEvents.PROGRESS_CHANGE, {curair: this.currentProgress, maxair: this.maxProgress});
	}

    public destroy(): void {
		this.receiver.destroy()
	}

    public handleEvent(event: GameEvent): void {
		switch(event.type) {
			case Robo_RushEvents.PLAYER_OBSTACLE_COLLISION: {
				this.handlePlayerObstacleCollision(event);
				break;
			}
			case Robo_RushEvents.LASER_ATTACK: {
				this.handleShootLaserEvent(event);
				break;
			}
			default: {
				throw new Error(`Unhandled event of type: ${event.type} caught in PlayerController`);
			}
		}
	}

    handlePlayerObstacleCollision(event: GameEvent) {
        this.owner.animation.playIfNotAlready(PlayerAnimations.TAKING_DAMAGE, false, Robo_RushEvents.PLAYER_OBSTACLE_COLLISION);
		this.currentHealth = MathUtils.clamp(this.currentHealth - 1, this.minHealth, this.maxHealth);
		this.emitter.fireEvent(Robo_RushEvents.HEALTH_CHANGE, {curhp: this.currentHealth, maxhp: this.maxHealth});
    }


    protected handleShootLaserEvent(event: GameEvent): void {
		this.laserTimer.reset();
		this.laserTimer.start();
	}


    protected lockPlayer(player: CanvasNode, vpc: Vec2, vphs: Vec2): void {
		if (player.position.x - player.sizeWithZoom.x <= vpc.x - vphs.x) {
			player.position.x = vpc.x - vphs.x + player.sizeWithZoom.x;
		}	
		if (player.position.x + player.sizeWithZoom.x >= vpc.x + vphs.x) {
			player.position.x = vpc.x + vphs.x - player.sizeWithZoom.x;
		}
	}

    protected wrapPlayer(player: CanvasNode, vpc: Vec2, vphs: Vec2): void {
		if (player.position.y < vpc.y - vphs.y) {
			player.position.y = vpc.y + vphs.y;
		} 
		if (player.position.y > vpc.y + vphs.y) {
			player.position.y = vpc.y - vphs.y;
		}
	}

    public get velocity(): Vec2 { return this._velocity; }
    public set velocity(velocity: Vec2) { this._velocity = velocity; }

    public get speed(): number { return this._speed; }
    public set speed(speed: number) { this._speed = speed; }

} 