import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation} from '@angular/core';
import { ChartConfiguration, ChartData, ChartType,Chart } from 'chart.js'
import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective> | undefined;
  pressaotext : string | undefined;
  //SPEED CHART
  public speedChartData: ChartData<'doughnut'>={
    labels: undefined,
    datasets:[
      { data: [ 100,0 ],backgroundColor: ['#FF0000','#C2C0BC']},
    ],
    
  }
  public speedChartOptions: any ={
    circumference: 180,
    rotation:-90,
    cutout: '120',
    aspectRatio:1,
    responsive: true,
    events: [],
    hover:{
      mode: undefined
    }

  }
  public speedChartType: ChartType = 'doughnut';
  //PRESSION CHART
  public psiChartData: any ={
    labels: undefined,
    datasets:[
      { data: [ 60,30,10 ],backgroundColor: ['#16c722','#fbff00','#ff0000'],psiValue:0 },
    ],
    
  }
  public psiChartOptions: any ={
    circumference: 180,
    rotation:-90,
    cutout: '140',
    aspectRatio:1,
    responsive: true,
    events: [],
    hover:{
      mode: undefined
    }

  }
  public psiChartType: ChartType = 'doughnut';
  //HISTORIC
  public historyChartData: ChartConfiguration['data']={
    labels: [ '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00' ],
    datasets:[
      {
        data: [ 65, 59, 80, 81, 56, 55, 40 ],
        label: undefined,
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: false,
      }
    ]
  }
  public historyChartOptions: any = {
    aspectRatio:3,
    elements: {
      line: {
        
      }
    },
    scales: {
    },

    plugins: {
      legend: { display: false },
      annotation: {
      }
    }
  };
  public historyChartType: ChartType = 'line';
  constructor() { }

  ngOnInit(): void {
    Chart.register({
      id: 'my-plugin',
      afterDraw: (chart: Chart) => {
          if(chart.canvas.id=='pressao'){
            chart.ctx.save()
            const psivalue: any = chart.getDatasetMeta(0);
            console.log(psivalue._dataset.psiValue);
            const cx: number = chart.chartArea.width / 2;
            const cy: number = chart.getDatasetMeta(0).data[0].y;
            //console.log(chart.getDatasetMeta(0));
            const offsetTop:number = chart.ctx.canvas.offsetTop;
            const height:number = chart.chartArea.height;
            const angle:number = Math.PI + (1 / 100 * psivalue._dataset.psiValue * Math.PI)

            chart.ctx.translate(cx, cy)
            chart.ctx.rotate(angle)
            chart.ctx.beginPath()
            chart.ctx.moveTo(0, -2)
            chart.ctx.lineTo(150, 0)
            chart.ctx.lineTo(0, 2)
            chart.ctx.fillStyle = '#444'
            chart.ctx.fill();

            chart.ctx.translate(-cx, -cy)
            chart.ctx.beginPath()
            chart.ctx.arc(cx,cy,5,0,10)
            chart.ctx.fill()
            chart.ctx.restore();
          }
      },
  });
  setInterval(()=>{
    const tt: number = this.psiChartData.datasets[0].psiValue = getRandomArbitrary(0,100);
    this.pressaotext = tt.toFixed(0)

    this.charts?.forEach((child)=>{
      child.chart?.update()

      console.log(child.chart?.chartArea.height)
    })

  }, 3000)
  }
}
function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
