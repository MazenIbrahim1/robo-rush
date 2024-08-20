import Input from "../../../Wolfie2D/Input/Input";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import { HW3Controls } from "../../HW3Controls";
import { PlayerAnimations, PlayerStates } from "../PlayerController";
import PlayerState from "./PlayerState";
import Idle from "./Idle";
import { HW3Events } from "../../HW3Events";

export default class Fall extends PlayerState {

    onEnter(options: Record<string, any>): void {
        this.owner.animation.play(PlayerAnimations.FALL);
        // If we're falling, the vertical velocity should be >= 0
        this.parent.velocity.y = 0;
    }
    
    update(deltaT: number): void {
        this.parent.health -= 0;
        
        if (this.owner.position.y > 1100)
            {
                this.emitter.fireEvent(HW3Events.FALL_MAP);
            }
        // If the player hits the ground, start idling and check if we should take damage
        if (this.owner.onGround) {
            this.finished(PlayerStates.IDLE);
        } 
        // Checks if the player presses jump and double jump is available
        else if (Input.isJustPressed(HW3Controls.JUMP) && Idle.djAvailable == true) {
            Idle.djAvailable = false;
            this.finished(PlayerStates.DOUBLE_JUMP);
        }
        // Otherwise, keep moving
        else {
            // Update the vertical velocity of the player
            this.parent.velocity.y += this.gravity*deltaT;
            // Move the player
            this.owner.move(this.parent.velocity.scaled(deltaT));
        }

    }

    onExit(): Record<string, any> {
        return {};
    }
}