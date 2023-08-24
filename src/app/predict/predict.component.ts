import { Component, OnInit, Inject } from '@angular/core';
//import { PREDICTION_SERVICE_CLIENT_TOKEN } from '../generative-ai-vertex/vertex.module';
import { TEXT_SERVICE_CLIENT_TOKEN } from '../generative-ai-palm/palm.module';
import { TextServiceClient } from '../generative-ai-palm/v1beta2/text.service';

@Component({
  selector: 'app-root',
  templateUrl: './predict.component.html',
  styleUrls: ['./predict.component.scss']
})
export class PredictComponent implements OnInit {
  title = 'vertex-ai-palm2-angular';

  constructor(
    @Inject(TEXT_SERVICE_CLIENT_TOKEN) public client: TextServiceClient
  ) { }

  async ngOnInit(): Promise<void> {
    const response = await this.client.generateText("What is the largest number with a name?");
    console.log(response?.candidates?.[0].output);
  }
}
