import { getApi } from "./api";

export interface PlayerInfo {
    id: string,
    name: string,
    club: string,
    age: number,
    born: number,
    nationality: string,
    position: string,
}

export interface PlayerSuggestion {
    id: string;
    name: string;
    club: string;
    club_elo: number;
    nationality: string;
    position: string;
}

export function getPositionName(positionAbbreviation: string): string {
    switch (positionAbbreviation) {
        case "GK": return "goalkeeper"; break;
        case "DF": return "defender"; break;
        case "MF": return "midfielder"; break;
        case "FW": return "forward"; break;
    }
    throw new Error("Invalid position");
}

export async function getPlayerInfo(id: string): Promise<PlayerInfo | null> {
    const response = await fetch(`${getApi()}/players/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (response.status !== 200) {
        return null;
    }
    return (await response.json()).player as PlayerInfo;
}

export async function getPlayerPositionData(id: string, position: string) {
    const response = await fetch(`${getApi()}/players/${id}/${getPositionName(position)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (response.status !== 200) {
        return null;
    }
    const data = (await response.json());
    console.log(data);
    return data
}

export async function getAllPlayers(): Promise<PlayerSuggestion[]> {
    const response = await fetch(`${getApi()}/players`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (response.status !== 200) {
        return [];
    }
    return (await response.json()) as PlayerSuggestion[];
}

export async function getPlayerSuggestions(name: string): Promise<PlayerSuggestion[]> {
    const response = await fetch(`${getApi()}/players?search=${name}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });    
    if (response.status !== 200) {
        return [];
    }
    return (await response.json()) as PlayerSuggestion[];
}