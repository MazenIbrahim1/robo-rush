import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

import Fall from "./PlayerStates/Fall";
import Idle from "./PlayerStates/Idle";
import Jump from "./PlayerStates/Jump";

import Input from "../../Wolfie2D/Input/Input";

import { HW3Controls } from "../HW3Controls";
import HW3AnimatedSprite from "../Nodes/HW3AnimatedSprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { HW3Events } from "../HW3Events";
import Dead from "./PlayerStates/Dead";
import Receiver from "../../Wolfie2D/Events/Receiver";
import Emitter
 from "../../Wolfie2D/Events/Emitter";

 import Timer from "../../Wolfie2D/Timing/Timer";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import DoubleJump from "./PlayerStates/DoubleJump";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import UpsideDown from "./PlayerStates/UpsideDown";
/**
 * Animation keys for the player spritesheet
 */
export const PlayerAnimations = {
    TAKING_DAMAGE: "TAKING_DAMAGE",
    IDLE: "IDLE",
    WALK: "WALK",
    JUMP: "JUMP",
    UPSIDE_DOWN: "UPSIDE_DOWN",
    DOUBLE_JUMP: "DOUBLE_JUMP",
    FALL: "FALL",
    DYING: "DYING",
    DEAD: "DEAD"
} as const

/**
 * Tween animations the player can player.
 */
export const PlayerTweens = {
    DEATH: "DEATH"
} as const

/**
 * Keys for the states the PlayerController can be in.
 */
export const PlayerStates = {
    IDLE: "IDLE",
    RUN: "RUN",
	JUMP: "JUMP",
    UPSIDE_DOWN: "UPSIDE_DOWN",
    DOUBLE_JUMP: "DOUBLE_JUMP",
    FALL: "FALL",
    DEAD: "DEAD",
} as const

/**
 * The controller that controls the player.
 */
export default class PlayerController extends StateMachineAI {
    public readonly MAX_SPEED: number = 8000;
    public readonly MIN_SPEED: number = 1000;

    /** Health and max health for the player */
    protected _health: number;
    protected _maxHealth: number;

    protected _charge: number;
    protected _maxCharge: number;

    protected progress: number;
    protected maxProg: number;

    //timer for invincibility
    protected invincibleTimer: Timer;
    protected laserTimer: Timer;

    protected receiver: Receiver;
	protected emitter: Emitter;

    /** The players game node */
    protected owner: HW3AnimatedSprite;

    protected _velocity: Vec2;
	protected _speed: number;

    protected tilemap: OrthogonalTilemap;

    protected onRope1: Vec2;
    protected onRope2: Vec2;

    
    public initializeAI(owner: HW3AnimatedSprite, options: Record<string, any>){

        
        this.owner = owner;

        this.receiver = new Receiver();
		this.emitter = new Emitter();

        //this.laserTimer = new Timer(10000,this.handleLaserTimerEnd, false);
        this.invincibleTimer = new Timer(1000);
        this.receiver.subscribe(HW3Events.COLLISION_DESTRUCTABLE);
        this.receiver.subscribe(HW3Events.PLAYER_MONKEY_COLLISION);
        this.receiver.subscribe(HW3Events.MOVE_DOWN);
        this.receiver.subscribe(HW3Events.FALL_MAP);

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
        this.speed = 800;
        this.velocity = Vec2.ZERO;

        this.health = 10;
        this.maxHealth = 10;
        
        /*
        this.charge= 0;
        this.maxCharge= 3;
        */

        this.progress = 0;
        this.maxProg = 100;

        // Add the different states the player can be in to the PlayerController 
		this.addState(PlayerStates.IDLE, new Idle(this, this.owner));
        this.addState(PlayerStates.JUMP, new Jump(this, this.owner));
        this.addState(PlayerStates.DOUBLE_JUMP, new DoubleJump(this, this.owner));
        this.addState(PlayerStates.FALL, new Fall(this, this.owner));
        this.addState(PlayerStates.DEAD, new Dead(this, this.owner));
        this.addState(PlayerStates.UPSIDE_DOWN, new UpsideDown(this, this.owner));
        
        // Start the player in the Idle state
        this.initialize(PlayerStates.IDLE);
    }

    /** 
	 * Get the inputs from the keyboard, or Vec2.Zero if nothing is being pressed
	 */
    public get inputDir(): Vec2 {
        let direction = Vec2.ZERO;
		//direction.x = (Input.isPressed(HW3Controls.MOVE_LEFT) ? -1 : 0) + (Input.isPressed(HW3Controls.MOVE_RIGHT) ? 1 : 0);
		direction.y = (Input.isJustPressed(HW3Controls.JUMP) ? -1 : 0);
		return direction;
    }
    /** 
     * Gets the direction of the mouse from the player's position as a Vec2
     */
    public get faceDir(): Vec2 { return this.owner.position.dirTo(Input.getGlobalMousePosition()); }

    public update(deltaT: number): void {
        super.update(deltaT);

        while(this.receiver.hasNextEvent()){
			this.handleEvent(this.receiver.getNextEvent());
		}

    
        // If the player hits the attack button and the weapon system isn't running, restart the system and fire!
        if(Input.isPressed(HW3Controls.MOVE_DOWN) && (this.owner.position.y === 374)) {
            this.changeState(PlayerStates.UPSIDE_DOWN);
        }
        if(Input.isPressed(HW3Controls.MOVE_UP) && (this.owner.position.y === 374)) {
            this.changeState(PlayerStates.IDLE);
            this.emitter.fireEvent(HW3Events.MOVE_UP);
        }

	}

    public handleEvent(event: GameEvent): void {
		switch(event.type) {
            case HW3Events.COLLISION_DESTRUCTABLE: {
                this.handleObstacleCollision();
                break;
            }
            case HW3Events.PLAYER_MONKEY_COLLISION: {
                this.handlePlayerMonkeyCollision();
                break;
            }
            case HW3Events.FALL_MAP: {
                this.handleFallOffMap();
                break;
            }
            // case HW3Events.MOVE_UP: {
            //     this.changeState(PlayerStates.IDLE);
            //     break;
            // }
			default: {
				throw new Error(`Unhandled event of type: ${event.type} caught in PlayerController`);
			}
		}
	}

    protected handleObstacleCollision(): void {
        let scene = this.owner.getScene();
        if (this.invincibleTimer.isStopped())
        {
            this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: scene.getTakingDamageAudioKey(), loop: false, holdReference: false})
            this.health -= 1;
            this.invincibleTimer.start();
            if (this.health === 0) { this.changeState(PlayerStates.DEAD)}
            else {
                this.owner.animation.playIfNotAlready(PlayerAnimations.TAKING_DAMAGE, false, PlayerAnimations.IDLE)
                setTimeout( () => {
                    this.owner.animation.play(PlayerAnimations.IDLE);
                }, 500);
            };
        } 
    }
    
    protected handlePlayerMonkeyCollision(): void {
        let scene = this.owner.getScene();
        if (this.invincibleTimer.isStopped())
        {
            this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: scene.getTakingDamageAudioKey(), loop: false, holdReference: false})
            this.health -= 2;
            this.invincibleTimer.start();
            if (this.health === 0) { this.changeState(PlayerStates.DEAD)}
            else {
                this.owner.animation.playIfNotAlready(PlayerAnimations.TAKING_DAMAGE, false, PlayerAnimations.IDLE)
                setTimeout( () => {
                    this.owner.animation.play(PlayerAnimations.IDLE);
                }, 500);
            };
        } 
        console.log(this.health);
    } 

        protected handleFallOffMap(): void {
            let scene = this.owner.getScene();
        if (this.invincibleTimer.isStopped())
        {
            this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: scene.getTakingDamageAudioKey(), loop: false, holdReference: false})
            this.health -= 10;
            this.invincibleTimer.start();
            this.emitter.fireEvent(HW3Events.PLAYER_DEAD);
        } 
    }
/*
    protected handleLaserTimerEnd = () => {
    if (this.charge < 5)
    {
        this.charge += 1;
    }
    this.emitter.fireEvent(HW3Events.CHARGE_CHANGE, {curchrg: this.charge, maxchrg: this.maxCharge});
    if (this.charge < this.maxCharge) {
        this.laserTimer.start();
    }
}
*/

    public get velocity(): Vec2 { return this._velocity; }
    public set velocity(velocity: Vec2) { this._velocity = velocity; }

    public get speed(): number { return this._speed; }
    public set speed(speed: number) { this._speed = speed; }

    /*
    public get maxCharge(): number { return this._maxCharge; }
    public set maxCharge(maxCharge: number) { this._maxCharge = maxCharge; }

    public get charge(): number { return this._charge; }
    public set charge(charge: number) { 
        this._charge = MathUtils.clamp(charge, 0, this.maxHealth);
        // When the charge changes, fire an event up to the scene.
        this.emitter.fireEvent(HW3Events.CHARGE_CHANGE, {curhp: this.charge, maxhp: this.maxCharge});
    }
    */

    public get maxHealth(): number { return this._maxHealth; }
    public set maxHealth(maxHealth: number) { this._maxHealth = maxHealth; }

    public get health(): number { return this._health; }
    public set health(health: number) { 
        this._health = MathUtils.clamp(health, 0, this.maxHealth);
        // When the health changes, fire an event up to the scene.
        this.emitter.fireEvent(HW3Events.HEALTH_CHANGE, {curhp: this.health, maxhp: this.maxHealth});
        // If the health hit 0, change the state of the player
        if (this.health === 0) { this.changeState(PlayerStates.DEAD); }
    }
}