export interface RadioStation {
    stationuuid: string;
    name: string;
    url: string;
    url_resolved: string;
    homepage: string;
    favicon: string;
    countrycode: string;
    state: string;
    city: string;
    geo_lat: number;
    geo_long: number;
    tags: string;
}

// Genre categories with their associated tags
export const GENRES = [
    { id: 'all', name: 'All', tags: [] as string[] },
    { id: 'pop', name: 'Pop', tags: ['pop', 'top 40', 'hits', 'chart'] },
    { id: 'rock', name: 'Rock', tags: ['rock', 'classic rock', 'alternative', 'metal', 'punk'] },
    { id: 'jazz', name: 'Jazz', tags: ['jazz', 'smooth jazz', 'blues'] },
    { id: 'classical', name: 'Classical', tags: ['classical', 'opera', 'symphony', 'orchestra'] },
    { id: 'electronic', name: 'Electronic', tags: ['electronic', 'edm', 'techno', 'house', 'trance', 'dubstep'] },
    { id: 'hiphop', name: 'Hip Hop', tags: ['hip hop', 'hip-hop', 'rap', 'r&b', 'urban'] },
    { id: 'country', name: 'Country', tags: ['country', 'folk', 'americana', 'bluegrass'] },
    { id: 'latin', name: 'Latin', tags: ['latin', 'salsa', 'reggaeton', 'bachata', 'cumbia'] },
    { id: 'news', name: 'News', tags: ['news', 'talk', 'sports', 'politics'] },
    { id: 'ambient', name: 'Ambient', tags: ['ambient', 'chill', 'lounge', 'relaxation', 'meditation'] },
];

export interface RadioPlayerState {
    station: RadioStation | null;
    isPlaying: boolean;
    volume: number;
    isLoading: boolean;
    error: string | null;
}

