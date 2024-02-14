import { Component } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { FileConversionService } from '../file-conversion.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';
import { KatexOptions, MermaidAPI } from 'ngx-markdown';
import { ClipboardButtonComponent } from '../clipboard-button/clipboard-button.component';

@Component({
  selector: 'app-visual',
  templateUrl: './visual.component.html',
  styleUrls: ['./visual.component.scss']
})
export class VisualComponent {
  readonly clipboardButton = ClipboardButtonComponent;
  katexOptions: KatexOptions = {
    displayMode: true,
    throwOnError: false
  };
  public mermaidOptions: MermaidAPI.Config = {
    fontFamily: `"Source Code Pro", verdana, arial, sans-serif`,
    logLevel: MermaidAPI.LogLevel.Info,
    theme: MermaidAPI.Theme.Default,
    themeCSS: `
        path.arrowMarkerPath { fill: #1d262f; stroke:#1d262f; } 
        .node rect { fill: white; stroke:#1d262f; }
        .flowchart-link { stroke: #1d262f; fill: none; }
        .entityBox { fill: white; stroke:#1d262f; }
        .nodeLabel { color: #1d262f; }
        .node polygon { fill: white; stroke:#1d262f; }
        .actor { fill: white; stroke:#1d262f; }
        text.actor>tspan { color: #1d262f; fill:#1d262f; }
        .actor-man circle, line { color: #1d262f; fill:white; stroke:#1d262f; }
      `,
  };

  selectedImage = 'assets/baked_goods_1.jpeg'; // Default image
  prompt = '';
  generatedRecipe = '';

  constructor(
    public http: HttpClient,
    private fileConversionService: FileConversionService
  ) {}

  async generateRecipe() {
    this.generatedRecipe = `Generating...`;

    try {
      let imageBase64 = await this.fileConversionService
        .convertToBase64(this.selectedImage);

      // Check for successful conversion to Base64
      if (typeof imageBase64 !== 'string') {
        console.error('Image conversion to Base64 failed.');
        return;
      }

      // Gemini Client
      const genAI = new GoogleGenerativeAI(environment.API_KEY);
      const generationConfig = {
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
        ],
        maxOutputTokens: 100,
      };
      const model = genAI.getGenerativeModel({
        model: 'gemini-pro-vision',
        ...generationConfig,
      });

      let prompt = [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64,
          },
        },
        {
          text: this.prompt,
        },
      ];

      const result = await model.generateContent(prompt);
      const response = await result.response;
      this.generatedRecipe = response.text();
      console.log(response.candidates?.[0].content.parts[0].text);
      console.log(response);
    } catch (error) {
      this.generatedRecipe = 'There was an error. Wait for a moment and try again with a different prompt.';
      console.log(error);
    }
  }
}

window.document.addEventListener('copy', function (event) {
  const selection = window.getSelection();
  if (selection?.isCollapsed) {
    return;  // default action OK
  }
  const fragment = selection?.getRangeAt(0).cloneContents();
  const katexs = fragment?.querySelectorAll('.katex');
  if (katexs?.length === 0) {
    return;  // default action OK
  }
  katexs?.forEach(function (element) {
    const texSource = element.querySelector('annotation');
    if (texSource) {
      element.replaceWith(texSource);
      texSource.innerHTML = '$' + texSource.innerHTML + '$';
    }
  });
  fragment?.querySelectorAll('.katex-display annotation').forEach(function (element) {
    element.innerHTML = '$' + element.innerHTML + '$';
  })
  event?.clipboardData?.setData('text/plain', fragment?.textContent || "");
  event?.clipboardData?.setData('text/html', selection?.getRangeAt(0).cloneContents().textContent || "");
  event.preventDefault();
})
