import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import { PlayerAnimations, PlayerStates, PlayerTweens } from "../PlayerController";
import Idle from "./Idle";

import PlayerState from "./PlayerState";

export default class DoubleJump extends PlayerState {

    
    public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(PlayerAnimations.DOUBLE_JUMP);
        
        let scene = this.owner.getScene()
        
        // Give the player a burst of upward momentum
        this.parent.velocity.y = -350;  

        // Play the jump sound for the player
		this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: scene.getJumpAudioKey(), loop: false, holdReference: false});
	}

	public update(deltaT: number): void {
        super.update(deltaT);    

        // If the player hit the ground, start idling
        if (this.owner.onGround) {
			this.finished(PlayerStates.IDLE);
		} 
        else if(this.owner.onCeiling || this.parent.velocity.y >= 0){
            this.finished(PlayerStates.FALL);
		}
        else {
            // Update the vertical velocity of the player
            this.parent.velocity.y += this.gravity*deltaT;
            // Move the player
            this.owner.move(this.parent.velocity.scaled(deltaT));
        }
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
    
}