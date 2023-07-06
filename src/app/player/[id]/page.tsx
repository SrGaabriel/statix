import { Player, getPlayer } from "@/app/api/player";

export default async function Player(id: string) {
    const player = await getPlayer(id);
    if (player == null) {
        return (
            <div>
                <h1>Player not found</h1>
            </div>
        )
    }

    return (
        <div>
            <h1>{player.name}</h1>
        </div>
    )
}