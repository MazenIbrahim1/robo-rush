import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import HW3Level, { HW3Layers } from "./Level";
import MainMenu from "./MainMenu";

import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Level1 from "./Level1";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import HW3Level5 from "./Level5";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { HW3PhysicsGroups } from "../HW3PhysicsGroups";
import { HW3Events } from "../HW3Events";
import MonkeyController from "../Monkey/MonkeyController";
import FinalScene from "./FinalScene";


export default class Level6 extends HW3Level {

    public static readonly PLAYER_SPAWN = new Vec2(32, 300);
    public static readonly PLAYER_SPRITE_KEY = "PLAYER_SPRITE_KEY";
    public static readonly PLAYER_SPRITE_PATH = "assets/spritesheets/Pakma.json";

    public static readonly MONKEY_SPRITE_KEY = "MONKEY_SPRITE_KEY";
    public static readonly MONKEY_SPRITE_PATH = "assets/spritesheets/MonkeyMinion.json";

    public static readonly BACKGROUND_KEY = "BACKGROUND_KEY";
    public static readonly BACKGROUND_PATH = "assets/images/Screenshot 2023-04-24 002502.png";

    public static readonly TILEMAP_KEY = "LEVEL1";
    public static readonly TILEMAP_PATH = "assets/tilemaps/level6final.json";
    public static readonly TILEMAP_SCALE = new Vec2(1, 1);
    public static readonly DESTRUCTIBLE_LAYER_KEY = "Destructable";
    public static readonly WALLS_LAYER_KEY = "Main";
    public static readonly BACKGROUND_LAYER_KEY = "Background";

    public static readonly LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
    public static readonly LEVEL_MUSIC_PATH = "assets/music/LabLevelMusic.mp3";

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
        this.tilemapKey = Level6.TILEMAP_KEY;
        this.backgroundKey = Level6.BACKGROUND_KEY;
        this.tilemapScale = Level6.TILEMAP_SCALE;
        this.destructibleLayerKey = Level6.DESTRUCTIBLE_LAYER_KEY;
        this.wallsLayerKey = Level6.WALLS_LAYER_KEY;
        this.backgroundLayerKey = Level6.BACKGROUND_LAYER_KEY;

        // Set the key for the player's sprite
        this.playerSpriteKey = Level6.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = Level6.PLAYER_SPAWN;

        this.onRope1 = new Vec2(7800, 385);
        this.onRope2 = new Vec2(15000, 385);

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
        this.load.tilemap(this.tilemapKey, Level6.TILEMAP_PATH);
        this.load.image(this.backgroundKey, Level6.BACKGROUND_PATH);
        // Load in the player's sprite
        this.load.spritesheet(this.playerSpriteKey, Level6.PLAYER_SPRITE_PATH);
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
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: Level1.LEVEL_MUSIC_KEY});
        this.load.keepSpritesheet(this.playerSpriteKey);
        this.load.keepImage(this.backgroundKey);
        this.load.keepAudio(this.levelMusicKey);
        this.load.keepAudio(this.jumpAudioKey);
        this.load.keepAudio(this.deadAudioKey);
        this.load.keepAudio(this.takingDamageAudioKey);
        super.unloadScene();
    }

    public startScene(): void {
        super.startScene();
        // Set the next level to be Level2
        this.nextLevel = MainMenu;
    }

    protected initializeViewport(): void {
        super.initializeViewport();
        
    }
}