import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { AudioService } from './audio.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.scss']
})
export class ReadComponent {
  ELEVEN_LABS_VOICE_ID = environment.MY_VOICE_ID;
  ELEVEN_LABS_API_KEY = environment.ELEVEN_LABS_API_KEY;

  constructor(private http: HttpClient, private audio: AudioService) { }

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
    this.audio.setAudioAndPlay(data);
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
