export class SoundService {
  
  private static audio;
  private static audio2;

  static preLoad() {
    SoundService.audio = new Audio();
    SoundService.audio.src = '../assets/completetask_0.mp3';
    SoundService.audio.load();

    SoundService.audio2 = new Audio();
    SoundService.audio2.src = '../assets/gmae.wav';
    SoundService.audio2.load();
  }


  static play() {
    if (!SoundService.audio) {
      SoundService.audio = new Audio();
      SoundService.audio.src = '../assets/completetask_0.mp3';

      SoundService.audio.load();
    }
    SoundService.audio.pause();
    SoundService.audio.currentTime = 0;
    SoundService.audio.play();
  }

  static play2() {
    if (!SoundService.audio2) {
      SoundService.audio2 = new Audio();
      SoundService.audio2.src = '../assets/gmae.wav';

      SoundService.audio2.load();
    }
    SoundService.audio2.pause();
    SoundService.audio2.currentTime = 0;
    SoundService.audio2.play();
  }

}
