import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal, signal } from '@angular/core';
import { Supabase } from '../../services/supabase';

interface GameStat {
  user_email: string;
  wins?: number;
  score?: number;
  level?: number;
  time?: number;
}

interface GameStats {
  ahorcado: GameStat[];
  mayormenor: GameStat[];
  preguntados: GameStat[];
  simon: GameStat[];
}

@Component({
  selector: 'app-stats',
  imports: [CommonModule],
  templateUrl: './stats.html',
  styleUrl: './stats.css'
})
export class Stats implements OnInit {
  stats: GameStats = { ahorcado: [], mayormenor: [], preguntados: [], simon: [] };
  items = signal<any[]>([]);

  constructor(private supabase: Supabase) {}

  async ngOnInit() {
    await this.supabase.loadTable('stats', this.items); // 👈 nombre de tu tabla
    this.stats = this.getGameStats(this.items());
  }

  private getGameStats(rawData: any[]): GameStats {
      const stats: GameStats = { ahorcado: [], mayormenor: [], preguntados: [], simon: [] };
      const grouped: Record<string, any[]> = { ahorcado: [], mayormenor: [], preguntados: [], simon: [] };

      rawData.forEach(row => {
        if (grouped[row.game]) grouped[row.game].push(row);
      });

      Object.keys(grouped).forEach(game => {
        const gameData = grouped[game];
        const playerStats: Record<string, GameStat> = {};

        gameData.forEach(stat => {
          if (!playerStats[stat.user_email]) {
            playerStats[stat.user_email] = {
              user_email: stat.user_email,
              wins: 0,
              score: 0,
              level: 0,
              time: 0
            };
          }

          if (game === 'ahorcado' && stat.win) {
            playerStats[stat.user_email].wins!++;
            if (stat.time < playerStats[stat.user_email].time!) {
              playerStats[stat.user_email].time = stat.time;
            }
          } else if (game === 'mayormenor' || game === 'preguntados') {
            if (stat.score > playerStats[stat.user_email].score!) {
              playerStats[stat.user_email].score = stat.score;
              playerStats[stat.user_email].time = stat.time;
            }
          } else if (game === 'simon') {
            if (stat.level > playerStats[stat.user_email].level!) {
              playerStats[stat.user_email].level = stat.level;
              playerStats[stat.user_email].time = stat.time;
            }
          }
        });

        stats[game as keyof GameStats] = Object.values(playerStats).sort((a, b) => {
          if (game === 'ahorcado') {
            return (b.wins ?? 0) - (a.wins ?? 0) || (a.time ?? 0) - (b.time ?? 0);
          } else if (game === 'mayormenor' || game === 'preguntados') {
            return (b.score ?? 0) - (a.score ?? 0) || (a.time ?? 0) - (b.time ?? 0);
          } else if (game === 'simon') {
            return (b.level ?? 0) - (a.level ?? 0) || (a.time ?? 0) - (b.time ?? 0);
          }
          return 0;
        });
      });

      return stats;
    }
}
