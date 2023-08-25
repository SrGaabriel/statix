import { PlayerInfo } from "@/app/api/player";
import { createContext, useContext } from "react";

export type Action = { type: string; payload: any };

export interface State {
    playerInfo: PlayerInfo,
    league: string,
    position: string,
    statisticType: string,
    dictionary: any,
    fullView: boolean,
    ratingMode: boolean,
    dynamicMode: boolean
};

export interface StatisticContextType {
    state: State;
    dispatch: React.Dispatch<Action>;
}

export const StatisticContext = createContext<StatisticContextType | undefined>(undefined);

export function useStatisticContext() {
    const context = useContext(StatisticContext);
    if (!context) {
        throw new Error('Context not found');
    }
    return context;
}

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_LEAGUE':
            return { ...state, league: action.payload };
        case 'SET_POSITION':
            return { ...state, position: action.payload };
        case 'SET_STATISTIC_TYPE':
            return { ...state, statisticType: action.payload };
        case 'SET_FULL_VIEW_MODE':
            return { ...state, fullView: action.payload };
        case 'SET_RATING_MODE':
            return { ...state, ratingMode: action.payload };
        case 'SET_DYNAMIC_MODE':
            return { ...state, dynamicMode: action.payload };
        default:
            return state;
    }
}

export default StatisticContext;