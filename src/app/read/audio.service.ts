import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable()
export class AudioService {
  ELEVEN_LABS_VOICE_ID = environment.ELEVEN_LABS_VOICE_ID;
  ELEVEN_LABS_API_KEY = environment.ELEVEN_LABS_API_KEY;

  public audio: HTMLAudioElement;

  constructor(private http: HttpClient) {
    this.audio = new Audio();
  }

  public setAudioSourceAndPlay(source: string): void {
    this.audio.src = source;
    this.audio.play();
  }

  public setAudioAndPlay(data: ArrayBuffer): void {
    const blob = new Blob([data], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    this.audio.src = url;
    console.log('Started playing: ' + Date.now());
    this.audio.play();
    console.log('Ended playing: ' + Date.now());
  }

  public playTextToSpeech(text: string) {
    this.getAudio(text);
  }

  private getAudio(text: string) {
    const ttsURL = `https://api.elevenlabs.io/v1/text-to-speech/${this.ELEVEN_LABS_VOICE_ID}`;

    const headers = {
      accept: 'audio/mpeg',
      'content-type': 'application/json',
      'xi-api-key': this.ELEVEN_LABS_API_KEY,
    };

    const request = {
      text,
      "model_id": "eleven_multilingual_v2",
      "voice_settings": { //defaults specific to voiceId
        "stability": 0.5,
        "similarity_boost": 0.75,
        "style": 0,
        "use_speaker_boost": true
      }
    };

    console.log('Call made: ' + Date.now());
    this.http
      .post(ttsURL, request, { headers, responseType: 'arraybuffer' })
      .subscribe({
        next: (response: ArrayBuffer) => {
          this.playAudio(response);
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
  }

  private playAudio(data: ArrayBuffer) {
    this.setAudioAndPlay(data);
  }

  public async playStreamAudio(text: string) {
    await this.getStreamAudio(text);
  }

  private async getStreamAudio(text: string) {
    const streamingURL = `https://api.elevenlabs.io/v1/text-to-speech/${this.ELEVEN_LABS_VOICE_ID}/stream?optimize_streaming_latency=3`;

    const headers = {
      'content-type': 'application/json',
      'xi-api-key': this.ELEVEN_LABS_API_KEY,
    };

    console.log('Call made: ' + Date.now());
    const request = {
      text,
      "model_id": "eleven_multilingual_v2",
      "voice_settings": { //defaults specific to voiceId
        "stability": 0.5,
        "similarity_boost": 0.75,
        "style": 0,
        "use_speaker_boost": true
      }
    };
    this.http
      .post(streamingURL, request, { headers, responseType: 'arraybuffer' })
      .subscribe({
        next: (response: ArrayBuffer) => {
          this.playAudioStream(response);
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
  }

  private async playAudioStream(audioData: ArrayBuffer) {
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(audioData);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);

    source.onended = () => {
      console.log('Ended playing: ' + Date.now());
    };

    let startTime = audioContext.currentTime + 0.1;
    console.log('Started playing: ' + startTime);
    source.start(startTime);
  }

}