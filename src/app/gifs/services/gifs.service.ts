import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private apiKey      : string = 'OAQceIke6UIPBM9ktXQyXlZpxYdOH7EI'
  private _historial  : string[] = []
  private servicioUrl : string = 'https://api.giphy.com/v1/gifs'
  public resultados   : Gif[] = []
  
  get historial() {
    return [...this._historial]
  }

  constructor( private http:HttpClient){

    //Una linea:
    this._historial = JSON.parse(localStorage.getItem('historial')!) || []
    this.resultados =  JSON.parse(localStorage.getItem('resultados')!) || []

    //simple pero mas largo
    // if( localStorage.getItem('historial')){
    //   this._historial = JSON.parse( localStorage.getItem('historial')! ); 
    // }

  }

  buscarGifs(query: string = ''){
    query = query.trim().toLowerCase();
    if( !this._historial.includes( query ) ) {
      this._historial.unshift( query )
      this._historial = this._historial.splice(0 , 10);
      localStorage.setItem('historial',JSON.stringify( this._historial ) )
    }
    const params = new HttpParams()
      .set('api_key' ,this.apiKey)
      .set('limit','9')
      .set('q', query);


    this.http.get<SearchGifsResponse>(`${ this.servicioUrl }/search`, { params })
      .subscribe( ( response ) =>{
        this.resultados = response.data
        localStorage.setItem('resultados',JSON.stringify( response.data ) )
      })
  }
}
