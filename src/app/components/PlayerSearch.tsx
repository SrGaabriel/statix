'use client'

import { PlayerSuggestion, playerSuggestionsFetcher } from '../api/player';
import { getClubColors } from '../utils/colors';
import React, { useState, ChangeEvent, HTMLAttributes, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './searchbox.module.css';
import { getDefaultStatForPosition, getPositionName } from '../utils/defaults';
import useSWR from 'swr';

interface Properties extends HTMLAttributes<HTMLDivElement> {
  width?: number,
  height?: number
}

const SearchBox: React.FC<Properties> = ({ width = 400, height = 200 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const isSearchAvailable = searchTerm.length > 3
  const { data, error, isLoading } = useSWR(isSearchAvailable ? `${searchTerm}` : null, playerSuggestionsFetcher);

  function renderSuggestions() {
    if (isLoading)
      return <li className={`${styles.searchBoxSuggestion} ${styles.emptySearchBoxSuggestion}`}>
        <div className={styles.suggestionContent}>
          <Image
            className={styles.clubBadge}
            src={`/badges/$empty.png`}
          />
        </div>
      </li>
    if (error || !data)
      return <p>An unexpected error occured.</p>
  
    return data!!.sort((a, b) => b.club_elo - a.club_elo).map((suggestion: PlayerSuggestion) => (
        <Link key={suggestion.id} href={`/player/${suggestion.id}/${getPositionName(suggestion.position)}/${getDefaultStatForPosition(suggestion.position)}`}>
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
      ))
    }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.target.value = event.target.value.toUpperCase();
    const value = event.target.value;
    setSearchTerm(value);
  };

  const handleSuggestionClick = () => {
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
          {isSearchAvailable ? renderSuggestions() : undefined}
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
  const regex = new RegExp(`(${removeAccents(query)})`, 'gi');
  return removeAccents(suggestion.name.toUpperCase()).replace(regex, '<strong>$1</strong>');
}

function removeAccents(word: string): string {
  return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default SearchBox;
