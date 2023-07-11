export function getDefaultStatForPosition(positionAbbreviation: string): string {
    switch (positionAbbreviation) {
        case 'FW': return 'shooting';
        case 'MF': return 'shooting';
        case 'DF': return 'defending';
        case 'GK': return 'overall';
    }
    throw new Error(`Invalid position ${positionAbbreviation}`);
}


export function getPositionName(positionAbbreviation: string): string {
    switch (positionAbbreviation) {
        case "GK": return "goalkeeper";
        case "DF": return "defender";
        case "MF": return "midfielder";
        case "FW": return "forward";
    }
    throw new Error(`Invalid position ${positionAbbreviation}`);
}

export function getPositionAbbreviation(positionName: string): string {
    switch (positionName) {
        case "goalkeeper": return "GK";
        case "defender": return "DF";
        case "midfielder": return "MF";
        case "forward": return "FW";
    }
    throw new Error(`Invalid position ${positionName}`);
}

export const Positions = [
    "defender",
    "midfielder",
    "forward",
]