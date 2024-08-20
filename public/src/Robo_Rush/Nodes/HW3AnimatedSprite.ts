import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import HW3Level from "../Scenes/Level";


export default class HW3AnimatedSprite extends AnimatedSprite {

    protected scene: HW3Level;
    
    public setScene(scene: HW3Level): void { this.scene = scene; }
    public getScene(): HW3Level { return this.scene; }
}