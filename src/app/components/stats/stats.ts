import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Supabase } from '../../services/supabase';
import { FormatNamePipe } from '../../pipes/format-name-pipe';

interface GameStat {
  game: string,
  user_email: string;
  win?: number;
  score?: number;
  level?: number;
  time?: number;
}

@Component({
  selector: 'app-stats',
  imports: [CommonModule, FormatNamePipe],
  templateUrl: './stats.html',
  styleUrl: './stats.css'
})
export class Stats implements OnInit {
  private supabase = inject(Supabase);
  stats = signal<any[]>([]);
  loading = signal(true);

  ahorcado: GameStat[] = [];
  mayormenor: GameStat[] = [];
  preguntados: GameStat[] = [];
  simon: GameStat[] = [];

  constructor() {}

  async ngOnInit() {
    await this.supabase.loadTable('stats', this.stats);

    this.groupByGame('ahorcado', this.ahorcado);
    this.groupByGame('mayormenor', this.mayormenor);
    this.groupByGame('preguntados', this.preguntados);
    this.groupByGame('simon', this.simon);

    this.loading.set(false);
  }

  groupByGame(gameName: string, gameStats: GameStat[])  {
    this.stats().forEach(stat => {
      if (stat.game === gameName) {
        let exists = gameStats.filter((player) => player.user_email === stat.user_email);
        if (exists.length > 0) {
          for (let player of exists) {
            player.win = this.getBestWins(player);
            player.score = this.getBestValue(player, stat, 'score');
            player.level = this.getBestValue(player, stat, 'level');
            player.time = this.getBestTime(player, stat);
          }
        } else {
          gameStats.push(stat);
        }
      }
    });
  }

  getBestFiveWins(): GameStat[] {
    return this.ahorcado.sort((a, b) => {
        const wins = (b.win ?? 0) - (a.win ?? 0);
        if (wins !== 0) return wins;
        return (a.time ?? Infinity) - (b.time ?? Infinity);
      }).slice(0, 5);
  }

  getBestFive<T extends keyof GameStat>(gameStats: GameStat[], key: T): GameStat[] {
    return gameStats.sort((a, b) => ((b[key] as number) - (a[key] as number))).slice(0, 5);
  }

  private getBestTime(player: GameStat, stat: any) {
    if (player.game === 'ahorcado') {
      return ( (stat.time ?? 0) < (player.time ?? 0) ) ? stat.time : player.time;
    }
    return player.time;
  }

  private getBestWins(player: GameStat) {
    return (player.win ?? 1) + 1;
  }

  private getBestValue<T extends keyof GameStat>(player: GameStat, stat: any, key: T) {
    return (stat[key] > (player[key] ?? 0)) ? stat[key] : player[key];
  }
}
