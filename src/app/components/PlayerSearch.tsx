'use client'

import { PlayerSuggestion, getAllPlayers, getPlayerSuggestions } from '../api/player';
import { getClubColors } from '../utils/colors';
import React, { useState, useEffect, useRef, ChangeEvent, HTMLAttributes } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './searchbox.module.css';

interface Properties extends HTMLAttributes<HTMLDivElement> {
  width?: number,
  height?: number
}

let allPlayersCache: PlayerSuggestion[] = []

getAllPlayers().then((players) => {
  allPlayersCache = players;
});

const SearchBox: React.FC<Properties> = ({ width = 400, height = 200 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([] as PlayerSuggestion[]);
  const debounceTimer = useRef(undefined as (NodeJS.Timeout | undefined));

  useEffect(() => {
    return () => {
      clearTimeout(debounceTimer.current);
    };
  }, []);

  const setAndSortSuggestions = (suggestions: PlayerSuggestion[]) => {
    setSuggestions(suggestions.sort((a, b) => b.club_elo - a.club_elo));
  }

  const searchPlayers = (query: string): PlayerSuggestion[] => {
    const results: PlayerSuggestion[] = [];
  
    for (const player of allPlayersCache) {
      if (player.name.toLowerCase().normalize().includes(query.toLowerCase().normalize())) {
        results.push(player);
      }
    }
    return results;
  }

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3)
      return;

    setAndSortSuggestions(searchPlayers(query))
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (value.length > 3) {
        fetchSuggestions(value);
      } else {
        setAndSortSuggestions([]);
      }
    }, 300);
  };

  const handleSuggestionClick = () => {
    setAndSortSuggestions([]);
  };

  return (
    <div className={styles.searchFeature} style={{width: `${width}px`, height: `${height}px`}}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search for a player..."
        className={styles.searchBox}
      />
      <div className={styles.searchBoxSuggestionsContainer}>
        <ul className={styles.searchBoxSuggestions} style={{width: `${width + 60}px`}}>
          {suggestions.map((suggestion) => (
            <Link key={suggestion.id} href={`/player/${suggestion.id}`}>
              <li
                className={styles.searchBoxSuggestion}
                onClick={() => handleSuggestionClick()}
              >
                <div
                  className={styles.suggestionContent}
                  style={getStripeStyle(suggestion.club)}
                >
                  <Image
                    className={styles.clubBadge}
                    src={`/badges/${suggestion.club}.png`}
                    alt={`${suggestion.club} badge`}
                    width={32}
                    height={32}
                  />
                  <p
                    className={styles.positionBadge}
                    style={getStylesByPosition(suggestion.position)}
                  >
                    {suggestion.position}
                  </p>
                  <p
                    className={styles.playerSuggestionName}
                    dangerouslySetInnerHTML={{
                      __html: formatSuggestionName(suggestion, searchTerm)
                    }}
                  />
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

function getStripeStyle(club: string) {
  const color = getClubColors(club).primary
  return {  
    borderLeft: `7px solid ${color}`,
    transition: 'borderLeft 0.3s',
    ':hover': {
      borderLeft: `20px solid ${color}`,
    }
  }
}

function getStylesByPosition(position: string) {
  return {
    backgroundColor: '#9eaaa4'
  }
  /*
        position === 'FW'
        ? '#620ffc'
        : position === 'MF'
        ? '#7eadea'
        : position === 'DF'
        ? '#fc6c6c'
        : position === 'GK'
        ? 'orange'
        : 'inherit'
  */
}

function formatSuggestionName(suggestion: PlayerSuggestion, query: string) {
  const regex = new RegExp(`(${query})`, 'gi');
  return suggestion.name.toUpperCase().replace(regex, '<strong>$1</strong>');
}

export default SearchBox;
