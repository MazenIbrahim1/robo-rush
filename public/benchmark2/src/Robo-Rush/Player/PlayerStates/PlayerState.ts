import State from "../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import PlayerController from "../PlayerController"

export default abstract class PlayerState extends State {
    protected parent: PlayerController;
    protected owner: AnimatedSprite;
    protected gravity: number;

    public constructor(parent: PlayerController, owner:AnimatedSprite){
        super(parent);
        this.owner = owner;
        this.gravity - 500;
    }
    
    public abstract onEnter (options: Record<string, any>):void;

    public handleInput(event: GameEvent): void {
        switch (event.type) {
            default: {
                throw new Error("Unhandled event in Player State");
            }
        }
    }

    public update(deltaT: number): void{

    }

    public abstract onExit(): Record<string, any>;
}
