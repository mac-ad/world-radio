export interface RadioStation {
    stationuuid: string;
    name: string;
    url: string;
    url_resolved: string;
    favicon: string;
    countrycode: string;
    state: string;
    city: string;
    geo_lat: number;
    geo_long: number;
    tags: string;
}

export interface RadioPlayerState {
    station: RadioStation | null;
    isPlaying: boolean;
    volume: number;
    isLoading: boolean;
    error: string | null;
}

