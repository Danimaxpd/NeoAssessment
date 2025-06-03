import axios, { AxiosError } from "axios";
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

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string; error: string }>;
    const statusCode = axiosError.response?.status;
    const message = axiosError.response?.data?.message || axiosError.message;

    throw new ApiError(message, statusCode);
  }
  throw new ApiError("An unexpected error occurred");
};

export const apiService = {
  // Health check
  checkHealth: async () => {
    try {
      const response = await api.get("/");
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Characters
  getAllCharacters: async (): Promise<Character[]> => {
    try {
      const response = await api.get("/characters");
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getCharacter: async (id: string): Promise<Character> => {
    try {
      const response = await api.get(`/characters/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  createCharacter: async (data: {
    name: string;
    job: Character["job"];
  }): Promise<Character> => {
    try {
      const response = await api.post("/characters", data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteCharacter: async (id: string) => {
    try {
      await api.delete(`/characters/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },

  // Battles
  simulateBattle: async (
    character1Id: string,
    character2Id: string
  ): Promise<BattleResult> => {
    try {
      const response = await api.post("/battles", {
        character1Id,
        character2Id,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};
