import { Component } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { getLocaleDateFormat } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';


let apiUrl = 'https://www.alphavantage.co/query?';
let apiKey = '3FKGE3I1MZ2AZYOK';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Stock time series';
  result: any;
  term: any = '';
  timeSeries: any = 'TIME_SERIES_MONTHLY';
  seriesValue = 'Monthly Time Series'
  showdataChart: any = '';
  symbolItem: any = '';
  showChartsData: boolean = false;

  constructor(public http: Http) {

  }

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = [];

  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public items = [
    { title: "Monthly", checked: true },
    { title: "Weekly", checked: false },
    { title: "Daily", checked: false },
  ];
  public barChartData: any[] = [
    { data: [], label: 'Monthly' },
  ];

  updateSelection(item) {
    for(let i = 0 ; i < 3 ; i++){
      this.items[i].checked = false;
    }
    item.checked = true;
    if (item.title == 'Monthly') {
      this.seriesValue = 'Monthly Time Series';
      this.timeSeries = 'TIME_SERIES_MONTHLY';
      this.barChartData[0].label = 'Monthly';

    }
    if (item.title == 'Weekly') {
      this.seriesValue = 'Weekly Time Series';
      this.timeSeries = 'TIME_SERIES_WEEKLY';
      this.barChartData[0].label = 'Weekly';

    }
    if (item.title == 'Daily') {
      this.seriesValue = 'Time Series (Daily)';
      this.timeSeries = 'TIME_SERIES_DAILY';
      this.barChartData[0].label = 'Daily';

    }
    this.showChartData(this.symbolItem);

    console.log(item.checked);
  }


  public chartClicked(e: any): void {
    console.log(e);
  }

  showChart(symbol) {
    this.symbolItem = symbol;
    this.showChartsData = true;
    this.showChartData(this.symbolItem);
  }
  showChartData(symbolItem) {
    return new Promise((resolve, reject) => {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      this.http.get(apiUrl + 'function=' + this.timeSeries + '&symbol=' + symbolItem + '&apikey=' + apiKey)
        .subscribe(res => {
          this.showdataChart = res.json()[this.seriesValue];
          this.barChartLabels = Object.keys(this.showdataChart).slice(0, 12);
          for (let i = 0; i < Object.keys(this.showdataChart).length; i++) {
            this.barChartData[0].data.push(this.showdataChart[this.barChartLabels[i]]['4. close'])
          }
          resolve(res.json());

        }, (err) => {
          reject(err);
          console.log(err);

        });
    });

  }
  public chartHovered(e: any): void {
    console.log(e);
  }

  getdata() {
    return new Promise((resolve, reject) => {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      this.http.get(apiUrl + 'function=SYMBOL_SEARCH&keywords=' + this.term + '&apikey=' + apiKey)
        .subscribe(res => {

          this.result = res.json().bestMatches;
          resolve(this.result);

        }, (err) => {
          reject(err);
          console.log(err);

        });
    });

  }
}

