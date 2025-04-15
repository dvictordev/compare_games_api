import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IFindUniqueGame } from '../interfaces/games.interface';

@Injectable()
export class Api {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('RAWG_API_URL') ?? '';
    this.apiKey = this.configService.get<string>('RAWG_API_KEY') ?? '';
  }

  async getGame({ title }: IFindUniqueGame) {
    const url = `${this.baseUrl}/games?key=${this.apiKey}&search=${title}&search_exact=true$search_precise=true`;

    const { data, statusText } = await axios.get(url);
    return data.results;
  }
}
