'use client'

import { PlayerInfo, playerDataFetcher } from "@/app/api/player"
import StatisticLayout from "./StatisticLayout"
import StatisticContext, { reducer } from "./StatisticContext"
import { useReducer } from "react"
import useSWR from "swr"

interface Properties {
    playerInfo: PlayerInfo,
    league: string,
    position: string,
    statisticType: string,
    dictionary: any
}

const PlayerStatisticView: React.FC<Properties> = ({playerInfo, league, position, statisticType, dictionary}) => {
    const [statisticState, statisticDispatcher] = useReducer(reducer, {
        playerInfo,
        league,
        position,
        statisticType,
        dictionary,
        fullView: true,
        ratingMode: true,
        dynamicMode: true
    });
    const dataRequest = useSWR(statisticState.statisticType != 'profile' ? `/api/${playerInfo.id}/${statisticState.position}/${statisticState.league}` : null, () => playerDataFetcher(playerInfo.id, statisticState.position, statisticState.league), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });
    const contextValue = ({ state: statisticState, dispatch: statisticDispatcher });
    if (dataRequest.isLoading) {
        return (
            <StatisticContext.Provider value={contextValue}>
                <StatisticLayout playerData={undefined} isLoading={true}/>
            </StatisticContext.Provider>
        )
    }
    if (statisticState.statisticType != 'profile' && (dataRequest.error || !dataRequest.data)) return <h1>An unexpected error occured.</h1>
    const playerData = dataRequest.data;

    return (
        <StatisticContext.Provider value={contextValue}>
            <StatisticLayout playerData={playerData} isProfile={statisticState.statisticType==='profile'}/>
        </StatisticContext.Provider>
    )
}

export default PlayerStatisticView;