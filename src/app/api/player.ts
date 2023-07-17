import { getPositionName } from "../utils/defaults";
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

export interface PlayerRanking {
    ranking: [
        {
            id: string;
            name: string;
            nation: string;
            born: string;
            value: number;
        }
    ]
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

export async function getPlayerPositionData(id: string, position: string, statType: string) {
    const response = await fetch(`${getApi()}/players/${id}/${getPositionName(position)}/${statType}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (response.status !== 200) {
        return null;
    }
    const data = (await response.json());
    return data
}

export async function getPlayerStatRanking(id: string, position: string, statType: string, statistic: string) {
    const response = await fetch(`${getApi()}/players/${id}/${position}/${statType}/${statistic}`, {
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
    return response.json();
}

export const playerSuggestionsFetcher = (name: string): Promise<PlayerSuggestion[]> =>
    fetch(`${getApi()}/players?search=${name}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json())