export class Marcador {
    constructor(
        public _id:string,
        public name:string,
        public state:string,
        public geometry:[],
        public ica_dates:[],
        public co2:number,
        public no2:number,
        public o3:number,
        public h2s:number,
        public so2:number,
        public pm15:number,
        public pm10:number
    ){
    }
}