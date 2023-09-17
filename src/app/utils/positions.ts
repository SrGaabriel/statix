export function getParentPosition(position: string) {
    switch (position) {
        case "striker" || "winger": return "forward";
        case "fullback" || "centreback": return "defender";
        default: return position;
    }
}

export function getSpacesForCategoryByPosition(position: string, category: string) {
    switch (category) {
        case "shooting": {
            switch (position) {
                case "forward": return 4;
                case "midfielder": return 3;
                case "defender": return 0;
            }
        }
        case "playmaking": {
            switch (position) {
                case "forward": return 4;
                case "midfielder": return 4;
                case "defender": return 1;
            }
        }
        case "possession": {
            switch (position) {
                case "forward": return 7;
                case "midfielder": return 10;
                case "defender": return 6;
            }
        }
        case "passing": {
            switch (position) {
                case "forward": return 6;
                case "midfielder": return 7;
                case "defender": return 9;
            }
        }
        case "defending": {
            switch (position) {
                case "forward": return 2;
                case "midfielder": return 8;
                case "defender": return 12;
            }
        }
        case "overall": return 2;
        case "shot-stopping": return 4;
        case "distribution": return 10;
        case "sweeping": return 9;
    }
    throw new Error(`Invalid category ${category}`);
}