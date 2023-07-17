interface AttributeMap {
    [key: string]: [string, string];
}

const attributeMap: AttributeMap = {
    "shooting_tendency": [
        "Standard shooting tendency",
        "The average number of shooting attempts per 90 minutes. It indicates how frequently a player takes shots during a match."
    ],
    "shooting_threat": [
        "Standard shooting threat",
        "The average number of goals scored per shot. It represents the player's efficiency in converting shots into goals."
    ],
    "shooting_chances": [
        "Expected shooting chances",
        "The average expected goals per shot. It measures the quality of shooting opportunities a player creates."
    ],
    "shooting_consistency": [
        "Standard shooting consistency",
        "The percentage of shots that are on target. It reflects the player's accuracy and ability to hit the target with their shots."
    ],
    "shooting_clinicality": [
        "Expected shooting clinicality",
        "The difference between the actual goals scored and the expected goals. It quantifies the player's finishing ability."
    ],
    "shooting_distance": [
        "Standard shooting distance",
        "The average distance of shots taken by a player. It indicates the player's tendency to take shots from different areas of the field."
    ],
    "shot_creating_actions": [
        "Shot creating actions",
        "The number of actions that lead to a shot by a player. It includes passes, dribbles, and other actions that contribute to the creation of shooting opportunities."
    ],
    "shot_creating_tendency": [
        "Shot creating tendency",
        "The average number of shot creating actions per 90 minutes. It indicates how frequently a player generates opportunities for shots."
    ],
    "shot_creating_passes": [
        "Shot creating passes",
        "The number of live-ball passes that lead to a shot by a player. It represents the player's ability to make key passes that set up shooting chances."
    ],
    "shot_creating_setpieces": [
        "Shot creating set-pieces",
        "The number of dead-ball passes that lead to a shot by a player. It includes free-kicks, corners, and other set-piece situations that result in shooting opportunities."
    ],
    "shot_creating_dribbles": [
        "Shot creating dribbles",
        "The number of successful dribbles that lead to a shot by a player. It reflects the player's skill in beating opponents and creating shooting opportunities through dribbling."
    ],
    "shot_creating_defensive_actions": [
        "Shot creating defensive actions",
        "The number of defensive actions that lead to a shot by a player. It includes interceptions, tackles, and other defensive contributions that trigger counter-attacks or attacking opportunities."
    ],
    "goal_creating_actions": [
        "Goal creating actions",
        "The number of actions that lead to a goal by a player. It includes passes, dribbles, and other actions that directly contribute to goal-scoring opportunities."
    ],
    "goal_creating_tendency": [
        "Goal creating tendency",
        "The average number of goal creating actions per 90 minutes. It indicates how frequently a player generates opportunities for goals."
    ],
    "goal_creating_passes": [
        "Goal creating passes",
        "The number of live-ball passes that lead to a goal by a player. It represents the player's ability to make key passes that directly result in goals."
    ],
    "goal_creating_setpieces": [
        "Goal creating set-pieces",
        "The number of dead-ball passes that lead to a goal by a player. It includes free-kicks, corners, and other set-piece situations that directly result in goals."
    ],
    "goal_creating_dribbles": [
        "Goal creating dribbles",
        "The number of successful dribbles that lead to a goal by a player. It reflects the player's skill in beating opponents and creating goal-scoring opportunities through dribbling."
    ],
    "goal_creating_defensive_actions": [
        "Goal creating defensive actions",
        "The number of defensive actions that lead to a goal by a player. It includes interceptions, tackles, and other defensive contributions that directly result in goals."
    ],
    "taking_on_tendency": [
        "Taking on tendency",
        "The average number of take-ons per 90 minutes. It indicates how frequently a player attempts to dribble past opponents."
    ],
    "taking_on_ability": [
        "Taking on ability",
        "The average number of successful take-ons per 90 minutes. It represents the player's skill in successfully beating opponents through dribbling."
    ],
    "taking_on_consistency": [
        "Taking on consistency",
        "The success rate of take-ons attempted by a player. It reflects the player's ability to successfully dribble past opponents."
    ],
    "carrying_tendency": [
        "Carrying tendency",
        "The average number of carries per 90 minutes. It indicates how frequently a player progresses with the ball through carrying."
    ],
    "progressive_carries": [
        "Progressive carries",
        "The number of carries that move the ball towards the opponent's goal. It represents the player's ability to make forward runs with the ball."
    ],
    "carrying_progressiveness": [
        "Carrying progressiveness",
        "The average number of progressive carries per 90 minutes. It indicates how frequently a player makes progressive runs with the ball."
    ],
    "final_third_carries": [
        "Final third carries",
        "The number of carries into the final third per 90 minutes. It represents the player's ability to penetrate the opponent's defensive line with the ball."
    ],
    "penalty_area_carries": [
        "Penalty area carries",
        "The number of carries into the penalty area per 90 minutes. It reflects the player's ability to advance the ball into scoring positions."
    ],
    "carrying_total_distance": [
        "Carrying total distance",
        "The total distance covered by a player while carrying the ball. It indicates the player's overall contribution in ball progression through carrying."
    ],
    "touches_per_90": [
        "Touches per 90",
        "The average number of touches on the ball per 90 minutes. It represents the player's involvement in the game and the frequency of their interactions with the ball."
    ],
    "received_passes": [
        "Received passes",
        "The number of passes received by a player. It reflects the player's positioning and ability to receive and control passes from teammates."
    ],
    "received_progressive_passes": [
        "Received progressive passes",
        "The number of progressive passes received by a player. It indicates the player's involvement in receiving forward passes that advance the team's attacking play."
    ],
    "possession_trustworthiness": [
        "Possession trustworthiness",
        "The number of times a player is dispossessed of the ball. It reflects the player's ability to maintain possession and avoid losing the ball to opponents."
    ],
    "defensive_third_touches": [
        "Defensive third touches",
        "The number of touches on the ball in the defensive third. It represents the player's involvement in defensive build-up and ball circulation from the defensive zone."
    ],
    "mid_third_touches": [
        "Mid third touches",
        "The number of touches on the ball in the middle third. It reflects the player's involvement in the team's build-up and ball circulation in the midfield area."
    ],
    "attacking_third_touches": [
        "Attacking third touches",
        "The number of touches on the ball in the attacking third. It indicates the player's involvement in the team's attacking play and presence in the opponent's defensive zone."
    ],
    "directness": [
        "Directness",
        "The percentage of passes that are played directly towards the target. It reflects the player's tendency to play quick and forward passes rather than sideways or backward passes."
    ],
    "passes_per_90": [
        "Passes per 90",
        "The average number of completed passes per 90 minutes. It represents the player's involvement in the team's passing game and their passing volume."
    ],
    "accuracy": [
        "Passing accuracy",
        "The percentage of total passes completed by a player. It reflects the player's precision and success rate in delivering accurate passes."
    ],
    "key_passes": [
        "Key passes",
        "The number of passes that directly lead to a shot by a teammate. It represents the player's ability to create goal-scoring opportunities through their passing."
    ],
    "progressive_passes": [
        "Progressive passes",
        "The number of passes that move the ball towards the opponent's goal. It indicates the player's ability to make forward and penetrative passes."
    ],
    "final_third_passes": [
        "Final third passes",
        "The number of passes into the final third of the pitch. It reflects the player's ability to deliver passes that reach the attacking zone of the opponent."
    ],
    "short_range_passes": [
        "Short-range passes",
        "The number of short-range passes completed by a player. It represents the player's involvement in short and quick passing combinations."
    ],
    "short_range_pass_accuracy": [
        "Short-range pass accuracy",
        "The percentage of short-range passes completed by a player. It reflects the player's accuracy in short and close-range passing situations."
    ],
    "medium_range_passes": [
        "Medium-range passes",
        "The number of medium-range passes completed by a player. It indicates the player's ability to deliver passes over moderate distances with accuracy."
    ],
    "medium_range_pass_accuracy": [
        "Medium-range pass accuracy",
        "The percentage of medium-range passes completed by a player. It reflects the player's accuracy in delivering passes over moderate distances."
    ],
    "long_range_passes": [
        "Long-range passes",
        "The number of long-range passes completed by a player. It represents the player's ability to deliver accurate passes over long distances."
    ],
    "long_range_pass_accuracy": [
        "Long-range pass accuracy",
        "The percentage of long-range passes completed by a player. It reflects the player's accuracy in delivering passes over long distances."
    ],
    "expected_assists": [
        "Expected assists",
        "The average expected goals assisted by a player. It quantifies the quality of the player's passes that lead to goal-scoring opportunities for teammates."
    ],
    "expected_assisted_shots": [
        "Expected assisted shots",
        "The average expected shots assisted by a player. It represents the quality of the player's passes that directly result in shot attempts by teammates."
    ],
    "forwards_clinicality": [
        "Forwards clinicality",
        "The difference between the actual assists and the expected goals assisted. It quantifies the player's effectiveness in providing assists based on the expected outcomes."
    ],
    "challenging_tendency": [
        "Challenging tendency",
        "The average number of challenges per 90 minutes. It indicates how frequently a player engages in defensive challenges to win back possession."
    ],
    "challenging_consistency": [
        "Challenging consistency",
        "The success rate of challenges attempted by a player. It reflects the player's ability to win duels and successfully regain possession from opponents."
    ],
    "defensive_actions": [
        "Defensive actions",
        "The total number of defensive actions performed by a player. It includes tackles, interceptions, and other defensive contributions."
    ],
    "defensive_third_tackles": [
        "Defensive third tackles",
        "The number of tackles made by a player in the defensive third of the pitch. It indicates the player's defensive involvement in their own territory."
    ],
    "mid_third_tackles": [
        "Mid third tackles",
        "The number of tackles made by a player in the middle third of the pitch. It represents the player's defensive contributions in the midfield area."
    ],
    "attacking_third_tackles": [
        "Attacking third tackles",
        "The number of tackles made by a player in the attacking third of the pitch. It reflects the player's defensive efforts in the opponent's offensive zone."
    ],
    "recoveries": [
        "Recoveries",
        "The number of times a player regains possession of the ball after it was lost by their team. It represents the player's ability to recover the ball and regain control for their team."
    ],
    "aerial_reliability": [
        "Aerial reliability",
        "The average number of aerial duels won by a player per 90 minutes. It reflects the player's reliability in winning aerial duels."
    ],
    "aerial_prowess": [
        "Aerial prowess",
        "The success rate of aerial duels attempted by a player. It indicates the player's ability to win aerial challenges against opponents."
    ],
    "clearances": [
        "Clearances",
        "The number of clearances made by a player. It represents the player's defensive actions in clearing the ball away from the danger zone."
    ],
    "shots_blocked": [
        "Shots blocked",
        "The number of shots blocked by a player. It reflects the player's ability to position themselves well and block shot attempts by opponents."
    ],
    "passes_blocked": [
        "Passes blocked",
        "The number of passes blocked by a player. It indicates the player's ability to read the game and intercept passes from opponents."
    ],
    "interceptions": [
        "Interceptions",
        "The number of interceptions made by a player. It represents the player's ability to read the game, anticipate passes, and intercept them."
    ],
    "yellow_cards": [
        "Yellow cards",
        "The number of yellow cards received by a player. It reflects the player's disciplinary record and the number of cautionary actions taken by the referee."
    ],
    "fouling_tendency": [
        "Fouling tendency",
        "The average number of fouls committed by a player per 90 minutes. It indicates how frequently a player commits fouls during matches."
    ],
    "goals_against_per_90": [
        "Goals against per 90",
        "The average number of goals conceded by a goalkeeper per 90 minutes in ascending order. It reflects the entire team's effectiveness in preventing goals."
    ],
    "penalty_saving": [
        "Penalty saving",
        "The success rate of saving penalty kicks by a goalkeeper. It represents the goalkeeper's ability to stop penalty shots."
    ],
    "freekick_saving": [
        "Free-kick saving",
        "The average number of free-kicks saved by a goalkeeper per 90 minutes. It reflects the goalkeeper's effectiveness in saving free-kick shots."
    ],
    "corners_saving": [
        "Corners saving",
        "The average number of corners saved by a goalkeeper per 90 minutes. It represents the goalkeeper's ability to prevent goals from corner kicks."
    ],
    "clean_sheet_consistency": [
        "Clean sheet consistency",
        "The percentage of matches in which a goalkeeper keeps a clean sheet (concedes no goals). It reflects the goalkeeper's ability to consistently prevent goals."
    ],
    "shot_stopping_total": [
        "Shot stopping total",
        "The difference between the expected goals prevented and the expected goals conceded by a goalkeeper. It quantifies the goalkeeper's overall shot-stopping performance."
    ],
    "shot_stopping_per_90": [
        "Shot stopping per 90",
        "The average expected goals prevented by a goalkeeper per 90 minutes. It represents the goalkeeper's ability to prevent goals based on the expected outcomes."
    ],
    "shot_quality_faced": [
        "Shot quality faced",
        "The average expected goals faced per shot on target by a goalkeeper. It indicates the quality of shots faced by the goalkeeper and their ability to deal with them."
    ],
    "shot_stopping_consistency": [
        "Shot stopping consistency",
        "The difference between the expected goals prevented and the expected goals conceded by a goalkeeper. It quantifies the goalkeeper's consistency in shot-stopping performance."
    ],
    "shots_against": [
        "Shots against",
        "The total number of shots faced by a goalkeeper. It reflects the goalkeeper's involvement in shot-stopping situations and the number of shots they have to deal with."
    ],
    "shots_against_per_90": [
        "Shots against per 90",
        "The average number of shots faced by a goalkeeper per 90 minutes. It represents the goalkeeper's involvement in shot-stopping situations per match."
    ],
    "total_passes": [
        "Total passes",
        "The total number of passes attempted by a goalkeeper. It reflects the goalkeeper's involvement in the team's passing game and their ability to distribute the ball."
    ],
    "passing_distance": [
        "Passing distance",
        "The average length of passes made by a goalkeeper. It represents the goalkeeper's ability to distribute the ball over different distances."
    ],
    "launching_consistency": [
        "Launching consistency",
        "The success rate of long passes made by a goalkeeper. It reflects the goalkeeper's accuracy in launching long passes to initiate attacking plays."
    ],
    "launching_tendency": [
        "Launching tendency",
        "The percentage of passes made by a goalkeeper that are long passes. It indicates the goalkeeper's inclination to play long and direct passes."
    ],
    "goalkicks_launching_tendency": [
        "Goal kicks launching tendency",
        "The percentage of goal kicks taken by a goalkeeper that are long passes. It represents the goalkeeper's tendency to launch the ball forward during goal kicks."
    ],
    "goalkicks_distance": [
        "Goal kicks distance",
        "The average length of goal kicks made by a goalkeeper. It reflects the goalkeeper's ability to kick the ball over different distances during goal kicks."
    ],
    "crossed_stopped": [
        "Crosses stopped",
        "The number of crosses stopped by a goalkeeper. It represents the goalkeeper's ability to prevent opponents from successfully crossing the ball into the box."
    ],
    "crosses_stopping_tendency": [
        "Crosses stopping tendency",
        "The success rate of stopping crosses attempted by a goalkeeper. It reflects the goalkeeper's ability to intercept or catch crosses from opponents."
    ],
    "sweeping_actions": [
        "Sweeping actions",
        "The number of offensive actions performed by a goalkeeper outside the penalty area. It includes clearances, interceptions, and other actions to prevent potential threats."
    ],
    "sweeping_tendency": [
        "Sweeping tendency",
        "The average number of offensive actions per 90 minutes performed by a goalkeeper outside the penalty area. It indicates the goalkeeper's inclination to participate in the team's build-up play."
    ],
};

export function getExplanationForAttribute(attributeName: string) {
    return attributeMap[attributeName][1];
}