
import { getDefaultStatForPosition, getPositionNameById } from "@/app/utils/naming";
import { PlayerInfo, getPlayerInfo, getPlayerPositionData } from "@/app/api/player";
import PlayerStatisticView from "./PlayerStatisticView";
import { getDictionary } from "../../dictionary/dictionaries";

export default async function Page({ params }: { params: {id: string, lang: string} }) {
    const dictionary = await getDictionary(params.lang);
    const playerInfo: PlayerInfo | null = await getPlayerInfo(params.id);
    if (playerInfo == null) {
        return <h1>{dictionary.player.not_found}</h1>
    }
    const league = playerInfo.league;
    const position = getPositionNameById(playerInfo.position);
    const statisticType = getDefaultStatForPosition(playerInfo.position);

    return (
        <PlayerStatisticView dictionary={dictionary} playerInfo={playerInfo} league={league} position={position} statisticType={statisticType}/>
    )
}