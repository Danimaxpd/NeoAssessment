import axios from "axios";
import { Job } from "../../../common/enums/job.enum";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
});

export interface Character {
  id: string;
  name: string;
  job: Job;
  health: number;
  attack: number;
  defense: number;
  strength: number;
  dexterity: number;
  intelligence: number;
  attackModifier: number;
  speedModifier: number;
  currentHp: number;
}

export interface BattleResult {
  winner: Character;
  loser: Character;
  battleLog: string[];
}

export const apiService = {
  // Health check
  checkHealth: async () => {
    const response = await api.get("/");
    return response.data;
  },

  // Characters
  getAllCharacters: async (): Promise<Character[]> => {
    const response = await api.get("/characters");
    return response.data;
  },

  getCharacter: async (id: string): Promise<Character> => {
    const response = await api.get(`/characters/${id}`);
    return response.data;
  },

  createCharacter: async (data: {
    name: string;
    job: Character["job"];
  }): Promise<Character> => {
    const response = await api.post("/characters", data);
    return response.data;
  },

  deleteCharacter: async (id: string) => {
    await api.delete(`/characters/${id}`);
  },

  // Battles
  simulateBattle: async (
    character1Id: string,
    character2Id: string
  ): Promise<BattleResult> => {
    const response = await api.post("/battles", {
      character1Id,
      character2Id,
    });
    return response.data;
  },
};
