export function getPlayerImageOrClubBadge(player: any) {
    return player.has_image ? `https://www.sportsbase.io/images/people/${player.base_id}.png` : `/badges/${player.club}.png`
}