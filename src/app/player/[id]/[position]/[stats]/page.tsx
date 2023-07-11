import { PlayerInfo, getPlayerInfo, getPlayerPositionData } from "@/app/api/player";
import StatisticLayout from "../../StatisticLayout";
import PlayerStatistic from "../../PlayerStatistic";
import { getPositionAbbreviation } from "@/app/utils/defaults";

export default async function Page({ params }: { params: { id: string, position: string, stats: string } }) {
    const playerInfo = await getPlayerInfo(params.id);
    if (playerInfo == null) {
        return (
            <div>
                <h1>Player not found</h1>
            </div>
        )
    }
    const playerData = await getPlayerPositionData(params.id, getPositionAbbreviation(params.position), params.stats);

    switch (params.stats) {
        case "shooting": return getShootingStats(playerInfo, playerData, params.position);
        case "playmaking": return getPlaymakingStats(playerInfo, playerData, params.position);
        case "possession": return getPossessionStats(playerInfo, playerData, params.position);
        case "passing": return getPassingStats(playerInfo, playerData, params.position);
        case "defending": return getDefendingStats(playerInfo, playerData, params.position);
        case "overall": return getOverallGoalkeeperStats(playerInfo, playerData);
        case "shot-stopping": return getShotStoppingStats(playerInfo, playerData);
        case "distribution": return getDistributionStats(playerInfo, playerData);
        case "sweeping": return getSweepingStats(playerInfo, playerData);
    }
}

function getShootingStats(playerInfo: PlayerInfo, playerData: any, position: string) {
    return (
        <StatisticLayout info={playerInfo} data={playerData} position={position}>
            <PlayerStatistic id={playerInfo.id} position={position} statType="shooting" stat="shooting_tendency" label="SHOOTING TENDENCY" value={playerData.shooting_tendency}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="shooting" stat="shooting_threat" label="SHOOTING THREAT" value={playerData.shooting_threat}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="shooting" stat="shooting_chances" label="SHOOTING CHANCES" value={playerData.shooting_chances}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="shooting" stat="shooting_consistency" label="SHOOTING CONSISTENCY" value={playerData.shooting_consistency}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="shooting" stat="shooting_clinicality" label="SHOOTING CLINICALITY" value={playerData.shooting_clinicality}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="shooting" stat="shooting_distance" label="SHOOTING DISTANCE" value={playerData.shooting_distance}/>
        </StatisticLayout>
    )
}

function getPlaymakingStats(playerInfo: PlayerInfo, playerData: any, position: string) {
    return (
        <StatisticLayout info={playerInfo} data={playerData} position={position}>
            <PlayerStatistic id={playerInfo.id} position={position} statType="playmaking" stat="shot_creating_actions" label="SHOT CREATING ACTIONS" value={playerData.shot_creating_actions}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="playmaking" stat="shot_creating_tendency" label="SHOT CREATING TENDENCY" value={playerData.shot_creating_tendency}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="playmaking" stat="shot_creating_passes" label="SHOT CREATING PASSES" value={playerData.shot_creating_passes}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="playmaking" stat="shot_creating_dribbles" label="SHOT CREATING DRIBBLES" value={playerData.shot_creating_dribbles}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="playmaking" stat="shot_creating_setpieces" label="SHOT CREATING SET-PIECES" value={playerData.shot_creating_setpieces}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="playmaking" stat="shot_creating_defensive_actions" label="SHOT CREATING DEFENSIVE ACTIONS" value={playerData.shot_creating_defensive_actions}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="playmaking" stat="goal_creating_actions" label="GOAL CREATING ACTIONS" value={playerData.goal_creating_actions}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="playmaking" stat="goal_creating_tendency" label="GOAL CREATING TENDENCY" value={playerData.goal_creating_tendency}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="playmaking" stat="goal_creating_passes" label="GOAL CREATING PASSES" value={playerData.goal_creating_passes}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="playmaking" stat="goal_creating_dribbles" label="GOAL CREATING DRIBBLES" value={playerData.goal_creating_dribbles}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="playmaking" stat="goal_creating_setpieces" label="GOAL CREATING SET-PIECES" value={playerData.goal_creating_setpieces}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="playmaking" stat="goal_creating_defensive_actions" label="GOAL CREATING DEFENSIVE ACTIONS" value={playerData.goal_creating_defensive_actions}/>
        </StatisticLayout>
    )
}

function getPossessionStats(playerInfo: PlayerInfo, playerData: any, position: string) {
    return (
        <StatisticLayout info={playerInfo} data={playerData} position={position}>
            <PlayerStatistic id={playerInfo.id} position={position} statType="possession" stat="taking_on_tendency" label="TAKING ON TENDENCY" value={playerData.taking_on_tendency}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="possession" stat="taking_on_ability" label="TAKING ON ABILITY" value={playerData.taking_on_ability}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="possession" stat="taking_on_consistency" label="TAKING ON CONSISTENCY" value={playerData.taking_on_consistency}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="possession" stat="carrying_tendency" label="CARRYING TENDENCY" value={playerData.carrying_tendency}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="possession" stat="progressive_carries" label="PROGRESSIVE CARRIES" value={playerData.progressive_carries}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="possession" stat="carrying_progressiveness" label="CARRYING PROGRESSIVENESS" value={playerData.carrying_progressiveness}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="possession" stat="final_third_carries" label="FINAL THIRD CARRIES" value={playerData.final_third_carries}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="possession" stat="penalty_area_carries" label="PENALTY AREA CARRIES" value={playerData.penalty_area_carries}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="possession" stat="carrying_total_distance" label="CARRYING TOTAL DISTANCE" value={playerData.carrying_total_distance}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="possession" stat="touches_per_90" label="TOUCHES PER 90" value={playerData.touches_per_90}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="possession" stat="received_passes" label="RECEIVED PASSES" value={playerData.received_passes}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="possession" stat="received_progressive_passes" label="RECEIVED PROGRESSIVE PASSES" value={playerData.received_progressive_passes}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="possession" stat="defensive_third_touches" label="DEFENSIVE THIRD TOUCHES" value={playerData.defensive_third_touches}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="possession" stat="mid_third_touches" label="MIDDLE THIRD TOUCHES" value={playerData.mid_third_touches}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="possession" stat="attacking_third_touches" label="ATTACKING THIRD TOUCHES" value={playerData.attacking_third_touches}/>
        </StatisticLayout>
    )
}

function getPassingStats(playerInfo: PlayerInfo, playerData: any, position: string) {
    return (
        <StatisticLayout info={playerInfo} data={playerData} position={position}>
            <PlayerStatistic id={playerInfo.id} position={position} statType="passing" stat="directness" label="DIRECTNESS" value={playerData.directness}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="passing" stat="passes_per_90" label="PASSES PER 90" value={playerData.passes_per_90}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="passing" stat="accuracy" label="ACCURACY" value={playerData.accuracy}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="passing" stat="key_passes" label="KEY PASSES" value={playerData.key_passes}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="passing" stat="progressive_passes" label="PROGRESSIVE PASSES" value={playerData.progressive_passes}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="passing" stat="final_third_passes" label="FINAL THIRD PASSES" value={playerData.final_third_passes}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="passing" stat="short_range_passes" label="SHORT RANGE PASSES" value={playerData.short_range_passes}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="passing" stat="short_range_pass_accuracy" label="SHORT RANGE PASS ACCURACY" value={playerData.short_range_pass_accuracy}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="passing" stat="medium_range_passes" label="MEDIUM RANGE PASSES" value={playerData.medium_range_passes}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="passing" stat="medium_range_pass_accuracy" label="MEDIUM RANGE PASS ACCURACY" value={playerData.medium_range_pass_accuracy}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="passing" stat="long_range_passes" label="LONG RANGE PASSES" value={playerData.long_range_passes}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="passing" stat="long_range_pass_accuracy" label="LONG RANGE PASS ACCURACY" value={playerData.long_range_pass_accuracy}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="passing" stat="expected_assists" label="EXPECTED ASSISTS" value={playerData.expected_assists}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="passing" stat="expected_assisted_shots" label="EXPECTED ASSISTED SHOTS" value={playerData.expected_assisted_shots}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="passing" stat="forwards_clinicality" label="FORWARDS CLINICALITY" value={playerData.forwards_clinicality}/>
        </StatisticLayout>
    )
}

function getDefendingStats(playerInfo: PlayerInfo, playerData: any, position: string) {
    return (
        <StatisticLayout info={playerInfo} data={playerData} position={position}>
            <PlayerStatistic id={playerInfo.id} position={position} statType="defending" stat="challenging_tendency" label="CHALLENGING TENDENCY" value={playerData.challenging_tendency}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="defending" stat="challenging_consistency" label="CHALLENGES CONSISTENCY" value={playerData.challenging_consistency}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="defending" stat="defensive_actions" label="DEFENSIVE ACTIONS" value={playerData.defensive_actions}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="defending" stat="recoveries" label="RECOVERIES" value={playerData.recoveries}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="defending" stat="aerial_prowess" label="AERIAL PROWESS" value={playerData.aerial_prowess}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="defending" stat="aerial_reliability" label="AERIAL RELIABILITY" value={playerData.aerial_reliability}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="defending" stat="clearances" label="CLEARANCES" value={playerData.clearances}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="defending" stat="shots_blocked" label="SHOTS BLOCKED" value={playerData.shots_blocked}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="defending" stat="passes_blocked" label="PASSES BLOCKED" value={playerData.passes_blocked}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="defending" stat="defensive_third_tackles" label="DEFENSIVE THIRD TACKLES" value={playerData.defensive_third_tackles}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="defending" stat="mid_third_tackles" label="MIDDLE THIRD TACKLES" value={playerData.mid_third_tackles}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="defending" stat="attacking_third_tackles" label="ATTACKING THIRD TACKLES" value={playerData.attacking_third_tackles}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="defending" stat="interceptions" label="INTERCEPTIONS" value={playerData.interceptions}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="defending" stat="yellow_cards" label="YELLOW CARDS" value={playerData.yellow_cards}/>
            <PlayerStatistic id={playerInfo.id} position={position} statType="defending" stat="fouling_tendency" label="FOULING TENDENCY" value={playerData.fouling_tendency}/>
        </StatisticLayout>
    )
}

function getOverallGoalkeeperStats(playerInfo: PlayerInfo, playerData: any) {
    return (
        <StatisticLayout info={playerInfo} data={playerData} position="goalkeeper">
            <PlayerStatistic id={playerInfo.id} position="goalkeeper" statType="overall" stat="team_defensive_prowess" label="TEAM DEFENSIVE PROWESS" value={playerData.overall.team_defensive_prowess}/>
            <PlayerStatistic id={playerInfo.id} position="goalkeeper" statType="overall" stat="penalty_saving" label="PENALTY SAVING" value={playerData.overall.penalty_saving}/>
            <PlayerStatistic id={playerInfo.id} position="goalkeeper" statType="overall" stat="freekick_saving" label="FREEKICK SAVING" value={playerData.overall.freekick_saving}/>
            <PlayerStatistic id={playerInfo.id} position="goalkeeper" statType="overall" stat="corners_saving" label="CORNER GOALS PREVENTING" value={playerData.overall.corners_saving}/>
            <PlayerStatistic id={playerInfo.id} position="goalkeeper" statType="overall" stat="clean_sheet_consistency" label="CLEAN SHEET CONSISTENCY" value={playerData.overall.clean_sheet_consistency}/>
        </StatisticLayout>
    )
}

function getShotStoppingStats(playerInfo: PlayerInfo, playerData: any) {
    return (
        <StatisticLayout info={playerInfo} data={playerData} position="goalkeeper">
            <PlayerStatistic id={playerInfo.id} position="goalkeeper" statType="shot_stopping" stat="shot_stopping_total" label="TOTAL SHOT-STOPPING ABILITY" value={playerData.shot_stopping.shot_stopping_total}/>
            <PlayerStatistic id={playerInfo.id} position="goalkeeper" statType="shot_stopping" stat="shot_stopping_per_90" label="AVERAGE SHOT-STOPPING ABILITY" value={playerData.shot_stopping.shot_stopping_per_90}/>
            <PlayerStatistic id={playerInfo.id} position="goalkeeper" statType="shot_stopping" stat="shot_quality_faced" label="SHOT QUALITY FACED" value={playerData.shot_stopping.shot_quality_faced}/>
            <PlayerStatistic id={playerInfo.id} position="goalkeeper" statType="shot_stopping" stat="shots_against" label="SHOTS FACED" value={playerData.shot_stopping.shots_against}/>
            <PlayerStatistic id={playerInfo.id} position="goalkeeper" statType="shot_stopping" stat="shots_against_per_90" label="SHOTS FACED PER 90" value={playerData.shot_stopping.shots_against_per_90}/>
        </StatisticLayout>
    )
}

function getDistributionStats(playerInfo: PlayerInfo, playerData: any) {
    return (
        <StatisticLayout info={playerInfo} data={playerData} position="goalkeeper">
            <PlayerStatistic id={playerInfo.id} position="goalkeeper" statType="distribution" stat="total_passes" label="TOTAL PASSES" value={playerData.distribution.total_passes}/>
            <PlayerStatistic id={playerInfo.id} position="goalkeeper" statType="distribution" stat="launching_consistency" label="LAUNCHING ACCURACY" value={playerData.distribution.launching_consistency}/>
            <PlayerStatistic id={playerInfo.id} position="goalkeeper" statType="distribution" stat="passing_distance" label="PASSING DISTANCE" value={playerData.distribution.passing_distance}/>
            <PlayerStatistic id={playerInfo.id} position="goalkeeper" statType="distribution" stat="launching_tendency" label="LAUNCHING TENDENCY" value={playerData.distribution.launching_tendency}/>
            <PlayerStatistic id={playerInfo.id} position="goalkeeper" statType="distribution" stat="goalkicks_launching_tendency" label="GOALKICK LAUNCHING TENDENCY" value={playerData.distribution.goalkicks_launching_tendency}/>
            <PlayerStatistic id={playerInfo.id} position="goalkeeper" statType="distribution" stat="goalkicks_distance" label="GOALKICK DISTANCE" value={playerData.distribution.goalkicks_distance}/>
        </StatisticLayout>
    )
}

function getSweepingStats(playerInfo: PlayerInfo, playerData: any) {
    return (
        <StatisticLayout info={playerInfo} data={playerData} position="goalkeeper">
            <PlayerStatistic id={playerInfo.id} position="goalkeeper" statType="sweeping" stat="crosses_stopping_tendency" label="CROSS CLAIMING TENDENCY" value={playerData.sweeping.crosses_stopping_tendency}/>
            <PlayerStatistic id={playerInfo.id} position="goalkeeper" statType="sweeping" stat="sweeping_actions" label="SWEEPING ACTIONS" value={playerData.sweeping.sweeping_actions}/>
            <PlayerStatistic id={playerInfo.id} position="goalkeeper" statType="sweeping" stat="sweeping_tendency" label="SWEEPING TENDENCY" value={playerData.sweeping.sweeping_tendency}/>
        </StatisticLayout>
    )
}
