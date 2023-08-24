import { Component, OnInit, Inject } from '@angular/core';
import { PREDICTION_SERVICE_CLIENT_TOKEN } from '../generative-ai-vertex/vertex.module';

@Component({
  selector: 'app-root',
  templateUrl: './predict.component.html',
  styleUrls: ['./predict.component.scss']
})
export class PredictComponent implements OnInit {
  title = 'vertex-ai-palm2-angular';

  constructor(
    @Inject(PREDICTION_SERVICE_CLIENT_TOKEN) public client: any
  ) { }

  async ngOnInit(): Promise<void> {
    const response = await this.client.predict("What is the largest number with a name?");
    console.log(response.predictions[0].content);
  }
}
