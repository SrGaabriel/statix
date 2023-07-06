import { getApi } from "./api";

export interface Player {
    id: string;
    name: string;
    club: string;
    club_elo: number;
    nation: string;
    position: string;
}

export async function getPlayer(id: string): Promise<Player | null> {
    const response = await fetch(`${getApi()}/players/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (response.status !== 200) {
        return null;
    }
    return (await response.json()) as Player;
}

export async function getAllPlayers(): Promise<Player[]> {
    const response = await fetch(`${getApi()}/players`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (response.status !== 200) {
        return [];
    }
    return (await response.json()) as Player[];
}

export async function getPlayerSuggestions(name: string): Promise<Player[]> {
    const response = await fetch(`${getApi()}/players?search=${name}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });    
    if (response.status !== 200) {
        return [];
    }
    return (await response.json()) as Player[];
}