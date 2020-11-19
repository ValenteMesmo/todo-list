import { isDevMode } from '@angular/core';
import { REPOSITORY_NAME } from './Navigation';

export class SoundService {
  
  private static audio;
  private static audio2;
  private static BASE_FILE_PATH = ()=> isDevMode() ? '' : `${REPOSITORY_NAME}/`;

  static preLoad() {
    SoundService.audio = new Audio();
    SoundService.audio.src = `./${this.BASE_FILE_PATH()}assets/completetask_0.mp3`;
    SoundService.audio.load();

    SoundService.audio2 = new Audio();
    SoundService.audio2.src = `./${this.BASE_FILE_PATH()}assets/gmae.wav`;
    SoundService.audio2.load();
  }


  static play() {
    if (!SoundService.audio) {
      SoundService.audio = new Audio();
      SoundService.audio.src = `./${this.BASE_FILE_PATH()}assets/completetask_0.mp3`;

      SoundService.audio.load();
    }
    SoundService.audio.pause();
    SoundService.audio.currentTime = 0;
    SoundService.audio.play();
  }

  static play2() {
    if (!SoundService.audio2) {
      SoundService.audio2 = new Audio();
      SoundService.audio2.src = `./${this.BASE_FILE_PATH()}assets/gmae.wav`;

      SoundService.audio2.load();
    }
    SoundService.audio2.pause();
    SoundService.audio2.currentTime = 0;
    SoundService.audio2.play();
  }

}
