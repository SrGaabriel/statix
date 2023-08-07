import { getApi } from "./api";

export interface PlayerInfo {
    id: string,
    name: string,
    club: string,
    age: number,
    born: number,
    league: string,
    nationality: string,
    position: string,
    base_id: string,
    has_image: boolean
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
            rank: number;
            value: number;
        }
    ]
    total: number;
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

export async function getPlayerPositionData(id: string, league: string, positionName: string) {
    const response = await fetch(`${getApi()}/players/${id}/data?position=${positionName}&league=${league}`, {
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

export async function getPlayerStatRanking(id: string, positionName: string, statType: string, statistic: string) {
    const response = await fetch(`${getApi()}/players/${id}/${statType}/${statistic}?position=${positionName}`, {
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

export const playerInfoFetcher = (id: string): Promise<PlayerInfo> =>
    fetch(`${getApi()}/players/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json()).then(data => data.player)

export const playerDataFetcher = (id: string, position: string, league: string): Promise<any> =>
    fetch(`${getApi()}/players/${id}/data?position=${position}&league=${league}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json())

export const statisticRankFetcher = (id: string, position: string, league: string, statType: string, statistic: string): Promise<PlayerRanking> =>
    fetch(`${getApi()}/players/${id}/${statType}/${statistic}?position=${position}&league=${league}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json())

export const playerSuggestionsFetcher = (name: string): Promise<PlayerSuggestion[]> =>
    fetch(`${getApi()}/players?search=${name}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json())

export const playerProfileFetcher = (id: string, league: string, position: string, mode: string): Promise<any> =>
    fetch(`${getApi()}/players/${id}/profile?position=${position}&league=${league}&type=${mode}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json())

export const playerMultipleProfileFetcher = (firstId: string, secondId: string, thirdId: string | undefined, fourthId: string | undefined, league: string, position: string, mode: string): Promise<any> => {
    let final_url = `${getApi()}/players/compare/${firstId}/${secondId}?position=${position}&league=${league}&type=${mode}`
    if (thirdId !== undefined) {
        final_url = final_url.concat(`&third=${thirdId}`)
        if (fourthId !== undefined) {
            final_url = final_url.concat(`&fourth=${fourthId}`)
        }
    }

    return fetch(final_url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json()).then(data => data.players)
}