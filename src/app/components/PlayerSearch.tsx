'use client'

import { PlayerSuggestion, playerSuggestionsFetcher } from '../api/player';
import { getClubColors } from '../utils/colors';
import React, { useState, ChangeEvent, HTMLAttributes } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './searchbox.module.css';
import useSWR from 'swr';
import useDebounce from '../utils/useDebounce';

interface Properties extends HTMLAttributes<HTMLDivElement> {
  dictionary: any,
  width: string,
  height: string
  resultTrigger?: (result: PlayerSuggestion) => void | undefined
}

const SearchBox: React.FC<Properties> = ({ dictionary, width = '400px', height = '200px', resultTrigger = undefined }) => {
  	const [searchTerm, setSearchTerm] = useState('');
  	const isSearchAvailable = searchTerm.length > 3
  	const debouncedSearch = useDebounce(searchTerm, 500)
  	const { data, error, isLoading } = useSWR(isSearchAvailable && debouncedSearch ? `${searchTerm}` : null, playerSuggestionsFetcher);

	function renderSuggestions() {
		if (isLoading || (!data && !error)) {
			const genericSuggestion = (width: number) => {
			return (
			<li className={`${styles.searchBoxSuggestion} ${styles.emptySearchBoxSuggestion}`}>
				<div className={styles.suggestionContent} style={{ borderLeft: '7px solid gray' }}>
				<Image
					className={styles.clubBadge}
					src={`/badges/empty.png`}
					alt={`Loading badge`}
					width={32}
					height={32}
				/>
				<p
					className={`${styles.positionBadge} ${styles.invisibleText}`}
					style={{ backgroundColor: '#9eaaa4' }}
				>
					Invisible text
				</p>
				<div
					className={styles.emptyPlayerSuggestionName}
					style={{ width }}
				><p>Invisible text</p></div>
				</div>
			</li>
			)
		}
		return [
			genericSuggestion(175),
			genericSuggestion(150),
			genericSuggestion(200)
		]}
		if (error)
			return <p>{dictionary.error}</p>
		if (data && data.length == 0)
			return <p>{dictionary.search.no_players_found}</p>

		return data!!.sort((a, b) => b.club_elo - a.club_elo).map((suggestion: PlayerSuggestion) => {
			if (resultTrigger)
				return (<div key={suggestion.id} onClick={() => resultTrigger(suggestion)}>{createListElement(suggestion)}</div>)
			return (<Link key={suggestion.id} href={`/${dictionary.code}/player/${suggestion.id}`}>{createListElement(suggestion)}</Link>)
		});

    };

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    	event.target.value = event.target.value.toUpperCase();
    	const value = event.target.value;
    	setSearchTerm(value);
  	};

	return (
		<div className={styles.searchFeature} style={{width, height}}>
		<input
			type="text"
			value={searchTerm}
			onChange={handleInputChange}
			placeholder={dictionary.search.placeholder}
			style={{width, height}}
			className={styles.searchBox}
		/>
		<div className={styles.searchBoxSuggestionsContainer}>
			{isSearchAvailable ? (<ul className={styles.searchBoxSuggestions} style={{width}}>
			{renderSuggestions()}
			</ul>) : null}
		</div>
		</div>
	);
	function createListElement(suggestion: PlayerSuggestion) {
        return (
          <li
            className={styles.searchBoxSuggestion}
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
                style={{ backgroundColor: '#9eaaa4' }}
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
    )}
};



function getStripeStyle(club: string) {
  const color = getClubColors(club).primary
  return {  
    borderLeft: `7px solid ${color}`
  }
}

function formatSuggestionName(suggestion: PlayerSuggestion, query: string) {
  const regex = new RegExp(`(${removeAccents(query)})`, 'gi');
  return suggestion.name.toUpperCase().replace(regex, '<strong>$1</strong>');
}

function removeAccents(word: string): string {
  return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default SearchBox;
