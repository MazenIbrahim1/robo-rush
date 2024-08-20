import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Idle from "./MonkeyStates.ts/Idle";

import PlayerController from "../Player/PlayerController";
import Input from "../../Wolfie2D/Input/Input";

import { HW3Controls } from "../HW3Controls";
import HW3AnimatedSprite from "../Nodes/HW3AnimatedSprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { HW3Events } from "../HW3Events";

import Timer from "../../Wolfie2D/Timing/Timer";
import Dead from "../Player/PlayerStates/Dead";

/**
 * Animation keys for the player spritesheet
 */
export const MonkeyAnimations = {
    IDLE: "IDLE",
    DEAD: "DEAD",
} as const

/**
 * Keys for the states the PlayerController can be in.
 */
export const MonkeyStates = {
    IDLE: "IDLE",
    DEAD: "DEAD",
} as const

/**
 * The controller that controls the player.
 */
export default class MonkeyController extends StateMachineAI {
    public readonly MAX_SPEED: number = 100;
    public readonly MIN_SPEED: number = 100;

    /** The players game node */
    protected owner: HW3AnimatedSprite;

    protected _velocity: Vec2;
	protected _speed: number;

    protected tilemap: OrthogonalTilemap;

    protected player: HW3AnimatedSprite;
    protected health: number;
    protected maxHealth: number;

    protected walkFlag: boolean;

    
    public initializeAI(owner: HW3AnimatedSprite, options: Record<string, any>){
        this.owner = owner;

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
        this.speed = this.MIN_SPEED;
        this.velocity = Vec2.ZERO;
        this.player = options.player;

		this.addState(MonkeyStates.IDLE, new Idle(this, this.owner));
        //this.addState(MonkeyStates.DEAD, new Dead(, this.owner));
        this.initialize(MonkeyStates.IDLE);
    }

    
    public get inputDir(): Vec2 {
        let direction = Vec2.ZERO;
		return direction;
    }
    
    public update(deltaT: number): void {
		super.update(deltaT);
        
        if(this.owner.collisionShape.overlaps(this.player.collisionShape)){
            this.handlePlayerMonkeyCollision();   
        }
        
	}

    public handlePlayerMonkeyCollision(): void {
        //this.changeState(MonkeyStates.DEAD);
        //this.owner.animation.play(MonkeyAnimations.DEAD);
        this.owner.visible = false;
        this.emitter.fireEvent(HW3Events.PLAYER_MONKEY_COLLISION);
    }
   
    public get velocity(): Vec2 { return this._velocity; }
    public set velocity(velocity: Vec2) { this._velocity = velocity; }

    public get speed(): number { return this._speed; }
    public set speed(speed: number) { this._speed = speed; }

  
}