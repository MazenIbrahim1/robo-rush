import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import HW3Level, { HW3Layers } from "./Level";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import HW3Level2 from "./Level2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { HW3PhysicsGroups } from "../HW3PhysicsGroups";
import { HW3Events } from "../HW3Events";
import MonkeyController from "../Monkey/MonkeyController";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Color from "../../Wolfie2D/Utils/Color";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";


export default class Level1 extends HW3Level {

    protected monkeySpriteKey: string;
    protected monkey: AnimatedSprite;
    protected monkey1: Vec2;
    protected monkey2: Vec2;

    public static readonly PLAYER_SPAWN = new Vec2(32, 300);
    public static readonly PLAYER_SPRITE_KEY = "PLAYER_SPRITE_KEY";
    public static readonly PLAYER_SPRITE_PATH = "assets/spritesheets/Pakma.json";

    public static readonly MONKEY_SPRITE_KEY = "MONKEY_SPRITE_KEY";
    public static readonly MONKEY_SPRITE_PATH = "assets/spritesheets/MonkeyMinion.json";

    public static readonly MONKEY_SPAWN1 = new Vec2(13500, 385);
    public static readonly MONKEY_SPAWN2 = new Vec2(14000, 385);

    public static readonly BACKGROUND_KEY = "BACKGROUND_KEY";
    public static readonly BACKGROUND_PATH = "assets/images/Screenshot 2023-04-24 002502.png";

    public static readonly TILEMAP_KEY = "LEVEL1";
    public static readonly TILEMAP_PATH = "assets/tilemaps/level1final.json";
    public static readonly TILEMAP_SCALE = new Vec2(1, 1);
    public static readonly DESTRUCTIBLE_LAYER_KEY = "Destructable";
    public static readonly WALLS_LAYER_KEY = "Main";
    public static readonly BACKGROUND_LAYER_KEY = "Background";

    public static readonly LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
    public static readonly LEVEL_MUSIC_PATH = "assets/music/jungleLevelMusic.mp3";

    public static readonly JUMP_AUDIO_KEY = "PLAYER_JUMP";
    public static readonly JUMP_AUDIO_PATH = "assets/sounds/jump.wav";

    public static readonly DEAD_AUDIO_KEY = "PLAYER_DEATH";
    public static readonly DEAD_AUDIO_PATH = "assets/sounds/player_death.wav";

    public static readonly TAKING_DAMAGE_AUDIO_KEY = "PLAYER_JUMP";
    public static readonly TAKING_DAMAGE_AUDIO_PATH = "assets/sounds/taking_damage.mp3";

    public static readonly LEVEL_END = new AABB(new Vec2(224, 232), new Vec2(24, 16));

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);

        // Set the keys for the different layers of the tilemap
        this.tilemapKey = Level1.TILEMAP_KEY;
        this.backgroundKey = Level1.BACKGROUND_KEY;
        this.tilemapScale = Level1.TILEMAP_SCALE;
        this.destructibleLayerKey = Level1.DESTRUCTIBLE_LAYER_KEY;
        this.wallsLayerKey = Level1.WALLS_LAYER_KEY;
        this.backgroundLayerKey = Level1.BACKGROUND_LAYER_KEY;

        // Set the key for the player's sprite
        this.playerSpriteKey = Level1.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = Level1.PLAYER_SPAWN;

        this.onRope1 = new Vec2(7800, 385);
        this.onRope2 = new Vec2(15000, 385);

        this.monkeySpriteKey = Level1.MONKEY_SPRITE_KEY;
        this.monkey1 = Level1.MONKEY_SPAWN1;
        this.monkey2 = Level1.MONKEY_SPAWN2;

        // Music and sound
        this.levelMusicKey = Level1.LEVEL_MUSIC_KEY
        this.jumpAudioKey = Level1.JUMP_AUDIO_KEY;
        this.deadAudioKey = Level1.DEAD_AUDIO_KEY;
        this.takingDamageAudioKey = Level1.TAKING_DAMAGE_AUDIO_KEY;

        // Level end size and position
        this.levelEndPosition = new Vec2(15750, 400).mult(this.tilemapScale);
        this.levelEndHalfSize = new Vec2(500, 500).mult(this.tilemapScale);
    }

    /**
     * Load in our resources for level 1
     */
    public loadScene(): void {
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, Level1.TILEMAP_PATH);
        this.load.image(this.backgroundKey, Level1.BACKGROUND_PATH);
        // Load in the player's sprite
        this.load.spritesheet(this.playerSpriteKey, Level1.PLAYER_SPRITE_PATH);
        this.load.spritesheet(this.monkeySpriteKey, Level1.MONKEY_SPRITE_PATH);
        // Audio and music
        this.load.audio(this.levelMusicKey, Level1.LEVEL_MUSIC_PATH);
        this.load.audio(this.jumpAudioKey, Level1.JUMP_AUDIO_PATH);
        this.load.audio(this.deadAudioKey, Level1.DEAD_AUDIO_PATH);
        this.load.audio(this.takingDamageAudioKey, Level1.TAKING_DAMAGE_AUDIO_PATH);
    }

    /**
     * Unload resources for level 1 - decide what to keep
     */
    public unloadScene(): void {
        super.unloadScene();
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: Level1.LEVEL_MUSIC_KEY});
        this.load.keepSpritesheet(this.monkeySpriteKey);
        this.load.keepSpritesheet(this.playerSpriteKey);
        this.load.keepImage(this.backgroundKey);
        this.load.keepAudio(this.levelMusicKey);
        this.load.keepAudio(this.jumpAudioKey);
        this.load.keepAudio(this.deadAudioKey);
        this.load.keepAudio(this.takingDamageAudioKey);
    }

    public startScene(): void {
        super.startScene();
        // Set the next level to be Level2
        this.nextLevel = HW3Level2;

        let jumpTutorial = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.PRIMARY, {position: new Vec2(600, 250), text: "Press space to jump."});
        jumpTutorial.size = new Vec2(400, 100);
        jumpTutorial.fontSize = 35;
        jumpTutorial.borderRadius = 380;
        jumpTutorial.backgroundColor = Color.BLACK;
        jumpTutorial.textColor = Color.WHITE;

        let djTutorial = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.PRIMARY, {position: new Vec2(2800, 250), text: "Press space twice to double jump."});
        djTutorial.size = new Vec2(700, 100);
        djTutorial.fontSize = 35;
        djTutorial.borderRadius = 400;
        djTutorial.backgroundColor = Color.BLACK;
        djTutorial.textColor = Color.WHITE;

        let sTutorial = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.PRIMARY, {position: new Vec2(9500, 250), text: "Press s to go upside down on the rope."});
        sTutorial.size = new Vec2(800, 100);
        sTutorial.fontSize = 35;
        sTutorial.borderRadius = 400;
        sTutorial.backgroundColor = Color.BLACK;
        sTutorial.textColor = Color.WHITE;

        let wTutorial = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.PRIMARY, {position: new Vec2(10500, 250), text: "Press w to go back up."});
        wTutorial.size = new Vec2(400, 100);
        wTutorial.fontSize = 35;
        wTutorial.borderRadius = 400;
        wTutorial.backgroundColor = Color.BLACK;
        wTutorial.textColor = Color.WHITE;

        let monkeys = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.PRIMARY, {position: new Vec2(13300, 250), text: "Cyber-Monkeys??!!"});
        monkeys.size = new Vec2(400, 100);
        monkeys.fontSize = 35;
        monkeys.borderRadius = 400;
        monkeys.backgroundColor = Color.BLACK;
        monkeys.textColor = Color.BLUE;

        let endText = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.PRIMARY, {position: new Vec2(15150, 275), text: "Great Work PAKMA! Now Good Luck!"});
        endText.size = new Vec2(800, 100);
        endText.fontSize = 35;
        endText.borderRadius = 400;
        endText.backgroundColor = Color.BLACK;
        endText.textColor = Color.WHITE;

        this.initializeMonkey(this.monkeySpriteKey, this.monkey1);
        this.initializeMonkey(this.monkeySpriteKey, this.monkey2);
    }

    protected initializeMonkey(key: string, spawn: Vec2): void {
        // Add the player to the scene
        this.monkey = this.add.animatedSprite(this.monkeySpriteKey, HW3Layers.PRIMARY);
        this.monkey.scale.set(2,2);
        this.monkey.position.copy(spawn);
        
        // Give the player physics and setup collision groups and triggers for the player
   
        this.monkey.addPhysics(new AABB(this.monkey.position.clone(), this.monkey.boundary.getHalfSize().clone()));
        this.monkey.setGroup(HW3PhysicsGroups.MONKEY);
        this.monkey.setTrigger(HW3PhysicsGroups.PLAYER, HW3Events.PLAYER_MONKEY_COLLISION, null);

        // // Give the player it's AI
        this.monkey.addAI(MonkeyController, { player: this.player, tilemap: "Primary"});
    }

    protected initializeViewport(): void {
        super.initializeViewport();
        
    }

}