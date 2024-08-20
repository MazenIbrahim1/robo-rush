import CanvasNodeFactory from "../../Wolfie2D/Scene/Factories/CanvasNodeFactory";
import HW3AnimatedSprite from "../Nodes/HW3AnimatedSprite";
import HW3Level from "../Scenes/Level";

/**
 * An extension of Wolfie2ds CanvasNodeFactory.
 */
export default class HW3CanvasNodeFactory extends CanvasNodeFactory {

    protected scene: HW3Level;
    
    public init(scene: HW3Level): void { super.init(scene); }

    public addAnimatedSprite = (key: string, layerName: string): HW3AnimatedSprite => {
        let layer = this.scene.getLayer(layerName);
		let spritesheet = this.resourceManager.getSpritesheet(key);
		let instance = new HW3AnimatedSprite(spritesheet);

		// Add instance fo scene
		instance.setScene(this.scene);
		instance.id = this.scene.generateId();
		
		if(!(this.scene.isParallaxLayer(layerName) || this.scene.isUILayer(layerName))){
			this.scene.getSceneGraph().addNode(instance);
		}

		// Add instance to layer
		layer.addNode(instance);

		return instance;
    }
}