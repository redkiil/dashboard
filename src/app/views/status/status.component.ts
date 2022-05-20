
import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation} from '@angular/core';
import { ChartConfiguration, ChartData, ChartType,Chart } from 'chart.js'
import { BaseChartDirective } from 'ng2-charts';
import { EquipmentApiService } from 'src/app/services/equipment-api.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  @ViewChildren(BaseChartDirective) charts?: QueryList<BaseChartDirective>
  pressaotext? : string
  speedtext?: string
  endcolor?: string
  time?: number
  speed?: number
  timer?: number
  //SPEED CHART
  constructor(private api: EquipmentApiService) { }
  public speedChartData: ChartData<'doughnut'>={
    labels: undefined,
    datasets:[
      { data: [ 50,50 ],backgroundColor: ['#FF0000','#C2C0BC']},
    ]
  }
  public speedChartOptions: any ={
    circumference: 180,
    rotation:-90,
    cutout:'90%',
    aspectRatio:1,
    responsive:true,
    
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
    cutout:'90%',
    aspectRatio:1,
    responsive:true,
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
        data: [ 25, 22, 23, 26, 30, 31, 35],
        label: undefined,
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgb(0, 192, 0)',
        pointBackgroundColor: 'rgba(0,159,255,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(0,0,177,0.8)',
        fill: true,
      },{
        data: [ 90, 85, 84, 88, 86, 90, 100 ],
        label: undefined,
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgb(255, 0, 0)',
        pointBackgroundColor: 'rgba(0,159,255,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(0,0,177,0.8)',
        fill: true,
      }
    ]
  }
  public historyChartOptions: any = {
    responsive:true,
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
    },onResize: this.chartResizing
  };
  equipment: string = "";
  chartResizing($chart: Chart) {
    $chart.options.aspectRatio = Math.round($chart.ctx.canvas.parentElement!.offsetWidth / 250)
    let hr = new Date();
    $chart.data.labels = [hr.getHours()-6,hr.getHours()-5,hr.getHours()-4,
      hr.getHours()-3,hr.getHours()-2, hr.getHours()-1, hr.getHours()]
  }
  public historyChartType: ChartType = 'line';
  ngOnInit(): void {
    Chart.register({
      id: 'my-plugin',
      afterDraw: (chart: Chart) => {
          if(chart.canvas.id=='pressao'){
            chart.ctx.save()
            const psivalue: any = chart.getDatasetMeta(0)
            const cx: number = chart.chartArea.width / 2;
            const cy: number = chart.getDatasetMeta(0).data[0].y;
            const angle:number = Math.PI + (1 / 100 * psivalue._dataset.psiValue * Math.PI)
            chart.ctx.translate(cx, cy)
            chart.ctx.rotate(angle)
            chart.ctx.beginPath()
            chart.ctx.moveTo(0, -2)
            chart.ctx.lineTo(cx, 0)
            chart.ctx.lineTo(0, 2)
            chart.ctx.fillStyle = '#444'
            chart.ctx.fill();

            chart.ctx.translate(-cx, -cy)
            chart.ctx.beginPath()
            chart.ctx.arc(cx,cy,5,0,10)
            chart.ctx.fill()
            chart.ctx.restore();
            console.dir(chart)
            console.dir(chart.ctx)
            console.dir(chart.ctx.canvas)
          }
      },
  });
  this.timer = window.setInterval(()=>{
    this.api.getEquipment(4200).subscribe((e)=>{
      this.pressaotext = e.pression?.toString()
      this.speedtext = e.speed?.toString()
      this.psiChartData.datasets[0].psiValue = e.pression
      this.speedChartData.datasets[0].data = [e.speed!,(100-e.speed!)]
      this.endcolor = e.engaged ? '#FF0000' : '#00FF00'
      this.time = Date.now()
      this.charts?.forEach((child)=>{
        child.chart?.update()
      })
    })
  }, 3000)
  }
  ngOnDestroy(): void{
    clearInterval(this.timer)
  }
}