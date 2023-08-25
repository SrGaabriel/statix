export function getDefaultStatForPosition(positionAbbreviation: string): string {
    switch (positionAbbreviation) {
        case 'ST': return 'shooting';
        case 'FW': return 'shooting';
        case 'W': return 'shooting';
        case 'MF': return 'shooting';
        case 'FB': return 'passing';
        case 'CB': return 'defending';
        case 'DF': return 'defending';
        case 'GK': return 'overall';
    }
    throw new Error(`Invalid position ${positionAbbreviation}`);
}

export function getPositionNameById(positionAbbreviation: string): string {
    switch (positionAbbreviation) {
        case "GK": return "goalkeeper";
        case "DF": return "defender";
        case "CB": return "centreback";
        case "FB": return "fullback";
        case "MF": return "midfielder";
        case "W": return "winger";
        case "FW": return "forward";
        case "ST": return "striker";
    }
    throw new Error(`Invalid position ${positionAbbreviation}`);
}

export function getLanguageName(languageCode: string) {
    switch (languageCode) {
        case "en": return "English";
        case "es": return "Spanish";
        case "fr": return "French";
        case "de": return "German";
        case "it": return "Italian";
        case "nl": return "Dutch";
        case "pl": return "Polish";
        case "pt": return "Portuguese";
        case "ru": return "Russian";
        case "tr": return "Turkish";
        case "ja": return "Japanese";
        case "ko": return "Korean";
        case "zh": return "Chinese";
    }
    throw new Error(`Invalid language ${languageCode}`);
}

export function getLanguageEmoji(languageCode: string) {
    switch (languageCode) {
        case "en": return "🇬🇧";
        case "es": return "🇪🇸";
        case "fr": return "🇫🇷";
        case "de": return "🇩🇪";
        case "it": return "🇮🇹";
        case "nl": return "🇳🇱";
        case "pl": return "🇵🇱";
        case "pt": return "🇧🇷";
    }
}

export const OUTFIELD_POSITIONS = [
    'striker',
    'forward',
    'winger',
    'midfielder',
    'fullback',
    'centreback',
    'defender',
]

export function getParentPosition(positionName: string): string {
    switch (positionName) {
        case "striker" || "winger": return "forward";
        case "fullback" || "centreback": return "defender";
    }
    return positionName;
}

export function getLeagueName(dictionary: any, leagueCode: string): string {
    return dictionary.leagues[leagueCode];
}

export function getFromLeagueText(dictionary: any, leagueCode: string): string {
    return dictionary.leagues[`from_${leagueCode}`];
}

export function getPositionName(dictionary: any, positionAbbreviation: string): string {
    return dictionary.position[positionAbbreviation];
}

export function getPositionPluralName(dictionary: any, originalPosition: string): string {
    return dictionary.position[originalPosition + 's'];
}

export function getStatisticName(dictionary: any, statistic: string): string {
    return dictionary.statistics_data[statistic].label;
}

export function getShortenedStatisticName(dictionary: any, statistic: string): string {
    const statisticData = dictionary.statistics_data[statistic];
    return statisticData.short ? statisticData.short : statisticData.label;
}

export function getStatisticMeasure(dictionary: any, statistic: string): string {
    const statisticData = dictionary.statistics_data[statistic];
    return statisticData.stat ?? statisticData.label;
}

export function getStatisticExplanation(dictionary: any, statistic: string): string {
    return dictionary.statistics_data[statistic].explanation;
}