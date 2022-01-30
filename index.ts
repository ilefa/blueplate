import axios from 'axios';
import moment from 'moment';

export type Meal = {
    name: string;
    stations: string[];
}

export type DiningHallResponse = DiningHall & {
    time: Date;
    meals: Meal[];
    type: keyof typeof DiningHallType;
    status: keyof typeof DiningHallStatus;
}

export type DiningHall = {
    name: string;
    lateNight: boolean;
    location: {
        id: string;
        name: string;
        latitude: number;
        longitude: number;
        address: string;
        maps: string;
    }
}

export enum DiningHallStatus {
    BREAKFAST = 'Breakfast',
    LUNCH = 'Lunch',
    BRUNCH = 'Brunch',
    DINNER = 'Dinner',
    LATE_NIGHT = 'Late Night',
    BETWEEN_MEALS = 'Between Meals',
    CLOSED = 'Closed',
}

export enum DiningHallType {
    BUCKLEY = 'Buckley',
    MCMAHON = 'McMahon',
    NORTH = 'North',
    NORTHWEST = 'Northwest',
    PUTNAM = 'Putnam',
    SOUTH = 'South',
    TOWERS = 'Towers',
    WHITNEY = 'Whitney'
}

export const DiningHalls: Record<keyof typeof DiningHallType, DiningHall> = {
    'BUCKLEY': {
        name: 'Buckley',
        lateNight: false,
        location: {
            id: '03',
            name: 'Buckley+Dining+Hall',
            latitude: 41.805625,
            longitude: -72.252385,
            address: '1262 Storrs Rd, Storrs, CT, 06269',
            maps: 'https://www.google.com/maps/place/John+Buckley+Residence+Hall,+Storrs,+CT+06269/@41.8057388,-72.2460738,17z/data=!3m1!4b1!4m5!3m4!1s0x89e68a238c8f6bd7:0x234b2994a73acbaf!8m2!3d41.8057348!4d-72.2438851'
        }
    },
    'MCMAHON': {
        name: 'McMahon',
        lateNight: true,
        location: {
            id: '05',
            name: 'McMahon+Dining+Hall',
            latitude: 41.803548,
            longitude: -72.252385,
            address: '2011 Hillside Rd, Storrs, CT, 06269',
            maps: 'https://www.google.com/maps/place/McMahon+Dining+Hall/@41.8035583,-72.2546329,17z/data=!3m1!4b1!4m5!3m4!1s0x89e68a3d9478806f:0xc7f055938ed1d0a6!8m2!3d41.8033822!4d-72.2522574'
        }
    },
    'NORTH': {
        name: 'North',
        lateNight: false,
        location: {
            id: '07',
            name: 'North+Campus+Dining+Hall',
            latitude: 41.812185,
            longitude: -72.258381,
            address: '82 N Eagleville Rd, Storrs, CT 06269',
            maps: 'https://www.google.com/maps/place/North+Campus+Dining+Hall/@41.8118133,-72.2580436,20.01z/data=!4m12!1m6!3m5!1s0x89e68a3d9478806f:0xc7f055938ed1d0a6!2sMcMahon+Dining+Hall!8m2!3d41.8033822!4d-72.2522574!3m4!1s0x0:0xb9f08e6948417f21!8m2!3d41.8121366!4d-72.2585661',
        }
    },
    'NORTHWEST': {
        name: 'Northwest',
        lateNight: true,
        location: {
            id: '15',
            name: 'Northwest+Marketplace',
            latitude: 41.811441,
            longitude: -72.259667,
            address: 'N Eagleville Rd, Storrs, CT, 06269',
            maps: 'https://www.google.com/maps/place/Northwest+Dining+Hall/@41.8112212,-72.2599746,20.01z/data=!3m1!5s0x89e68a3879629c67:0x409c2613356c4ee1!4m5!3m4!1s0x0:0xe476d288c7ffdf1c!8m2!3d41.811443!4d-72.259743'
        }
    },
    'PUTNAM': {
        name: 'Putnam',
        lateNight: false,
        location: {
            id: '06',
            name: 'Putnam+Dining+Hall',
            latitude: 41.805151,
            longitude: -72.258880,
            address: '2358 Alumni Dr, Storrs, CT 06269',
            maps: 'https://www.google.com/maps/place/Putnam+Refectory/@41.8058232,-72.2599886,17.97z/data=!3m1!5s0x89e68a3f9416b0d3:0x4fa606fb32492bef!4m5!3m4!1s0x0:0xe102fa527107db81!8m2!3d41.805226!4d-72.2589772'
        }
    },
    'SOUTH': {
        name: 'South',
        lateNight: false,
        location: {
            id: '16',
            name: 'South+Campus+Marketplace',
            latitude: 41.803892,
            longitude: -72.248538,
            address: 'Lewis B. Rome Commons, Storrs, CT 06269',
            maps: 'https://www.google.com/maps/place/South+Campus+Dining+Hall/@41.8038295,-72.2503784,17.97z/data=!4m5!3m4!1s0x0:0x78bae9af27afcc79!8m2!3d41.8037265!4d-72.2486193'
        }
    },
    'TOWERS': {
        name: 'Towers',
        lateNight: false,
        location: {
            id: '42',
            name: 'Gelfenbien+Commons+%26+Halal',
            latitude: 41.813455,
            longitude: -72.254368,
            address: '3384 Tower Loop Rd, Storrs, CT 06269',
            maps: 'https://www.google.com/maps/place/41%C2%B048\'48.4%22N+72%C2%B015\'15.9%22W/@41.8135159,-72.253911,19.46z/data=!4m6!3m5!1s0x89e68a374c6ed731:0xbdf26ec0e2e34ec4!7e2!8m2!3d41.8134318!4d-72.2544378'
        }
    },
    'WHITNEY': {
        name: 'Whitney',
        lateNight: false,
        location: {
            id: '01',
            name: 'Whitney+Dining+Hall',
            latitude: 41.809891,
            longitude: -72.247374,
            address: '1356 Storrs Rd, Storrs, CT 06269',
            maps: 'https://www.google.com/maps/place/Edwina+Whitney+Residence+Hall/@41.8101301,-72.2475367,19z/data=!4m5!3m4!1s0x89e68a253a40d1e5:0xa1fbff3b6e368cf4!8m2!3d41.8099587!4d-72.2472346'
        }
    }
}

export const LateNightDiningHalls = [DiningHallType.MCMAHON, DiningHallType.NORTHWEST];
export const LateNightWeekdays = [0, 1, 2, 3, 4];
export const Weekdays = [1, 2, 3, 4, 5];
export const Weekends = [6, 0];

/**
 * Attempts to retrieve information about the current
 * food being served in the provided dining hall,
 * and if a date is provided, that date's meals.
 * 
 * @param type the dining hall to lookup
 * @param date the date to lookup
 */
export const getMenu = async (type: DiningHallType, date = new Date()): Promise<DiningHallResponse> => {
    let hall: DiningHall = DiningHalls[getEnumKeyByEnumValue(DiningHallType, type)];
    let url = `http://nutritionanalysis.dds.uconn.edu/shortmenu.aspx?sName=UCONN+Dining+Services&locationNum=${hall.location.id}&locationName=${hall.location.name}&naFlag=1&WeeksMenus=This+Week%27s+Menus&myaction=read&dtdate=${moment(date).format('MM')}%2f${date.getDate()}%2f${date.getFullYear()}`;

    return await axios
        .get(url)
        .then(res => res.data)
        .then(html => ({
            ...hall,
            time: date,
            meals: parseFoodHTML(html),
            type: getEnumKeyByEnumValue(DiningHallType, type),
            status: getEnumKeyByEnumValue(DiningHallStatus, getDiningHallStatus(type, date))
        }))
        .catch(_ => null);
}       

/**
 * Returns the status of a dining hall for a provided
 * time, or if no time is provided, for right now.
 * 
 * @param type the dining hall
 * @param date the date/time to lookup (or right now if not provided)
 */
export const getDiningHallStatus = (type: DiningHallType, date = new Date()) => {
    let day = date.getDay();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let key = getEnumKeyByEnumValue(DiningHallType, type);

    // Before 7AM or before 8AM on Sunday - all dining halls closed
    if (hour < 7 || (hour < 8 && day === 0))
        return DiningHallStatus.CLOSED;

    // Buckley closed on weekends
    if (isWeekend(day) && isDiningHall(type, DiningHallType.BUCKLEY))
        return DiningHallStatus.CLOSED;

    // Before 9AM or Before 9:30AM on weekends - South serving breakfast, everything else closed
    if (hour < 9 || (hour === 9 && minute < 30) && isWeekend(day)) {
        if (isDiningHall(type, DiningHallType.SOUTH))
            return DiningHallStatus.BREAKFAST;
        return DiningHallStatus.CLOSED;
    }

    // Before 10AM or Before 10:30AM on Weekdays - South/Towers serving Brunch, everything else closed
    if (hour < 10 || (hour === 10 && minute < 30) && isWeekend(day)) {
        if (isDiningHall(type, DiningHallType.SOUTH, DiningHallType.TOWERS))
            return DiningHallStatus.BRUNCH;
        return DiningHallStatus.CLOSED;
    }

    // Before 10AM or Before 10:45AM on Weekdays - All serving breakfast
    if (hour < 10 || (hour === 10 && minute < 45) && isWeekday(day))
        return DiningHallStatus.BREAKFAST;

    // Before 11AM on Weekdays, all between meals
    if (hour < 11 && isWeekday(day))
        return DiningHallStatus.BETWEEN_MEALS;

    // Before 2PM or Before 2:15PM, on weekends all serving Brunch, otherwise all serving Lunch
    if (hour < 14 || (hour === 14 && minute < 15)) {
        if (isWeekend(day))
            return DiningHallStatus.BRUNCH;
        return DiningHallStatus.LUNCH;
    }

    // Before 3PM or Before 3:45PM at McMahon - McMahon is closed
    if ((hour < 15 || (hour === 15 && minute < 45)) && isDiningHall(type, DiningHallType.MCMAHON))
        return DiningHallStatus.CLOSED;

    // Before 4PM or Before 4:15PM - McMahon starts dinner, all others Between Meals
    if (hour < 16 || (hour === 16 && minute < 15)) {
        if (isDiningHall(type, DiningHallType.MCMAHON))
            return DiningHallStatus.DINNER;
        return DiningHallStatus.BETWEEN_MEALS;
    }

    // Before 7PM or Before 7:15PM - All serving Dinner
    if (hour < 19 || (hour === 19 && minute < 15))
        return DiningHallStatus.DINNER;

    // Before 10PM on Late Nights (at LN dining halls) - All serving Late Night
    if (hour < 22 && isLateNightWeekday(day) && DiningHalls[key].lateNight)
        return DiningHallStatus.LATE_NIGHT;
    
    // Otherwise, all closed.
    return DiningHallStatus.CLOSED;
}

const parseFoodHTML = (html: string) => {
    let meals = [];
    if (!html)
        return meals;

    let components = html.split('<div class="shortmenumeals">').slice(1);
    for (let component of components) {
        let name = component.split('</div>')[0] ?? 'Unknown Meal';
        let stations = parseFoodStations(component);
        let meal = { name, stations };
        meals.push(meal);

        // Late Night
        if (name !== 'Dinner')
            continue;

        let lnComponent = component.split('-- LATE NIGHT --');
        if (!lnComponent || lnComponent.length <= 1)
            continue;

        lnComponent = lnComponent[1].split('shortmenucats');
        let lnStations = { name: 'Late Night', options: parseFoodStationOptions(lnComponent[0]) }
        let lateNight = { name: 'Late Night', stations: lnStations };
        meals.push(lateNight);
    }

    return meals;
}

const parseFoodStations = (html: string) => {
    let stations = [];
    if (!html)
        return stations;

    let components = html.split('<div class="shortmenucats"><span style="color: #000000">-- ').slice(1);
    for (let component of components) {
        let name = component.split(' --')[0] ?? 'Unknown Station';
        if (name === 'LATE NIGHT')
            continue;

        name = capitalizeFirst(name);

        let options = parseFoodStationOptions(component);
        let station = { name, options }
        stations.push(station);
    }

    return stations;
}

const parseFoodStationOptions = (html: string) => {
    if (!html)
        return [];

    return html
        .split(`<div class='shortmenurecipes'><span style='color: #000000'`)
        .slice(1)
        .map(component => component
            .split('&nbsp;')[0]
            .substring(1) ?? 'Unknown');
}

const isDiningHall = (provided: DiningHallType, ...type: DiningHallType[]) => type.includes(provided);
const isWeekday = (day: number) => Weekdays.includes(day);
const isWeekend = (day: number) => Weekends.includes(day);
const isLateNightWeekday = (day: number) => LateNightWeekdays.includes(day);

const getEnumKeyByEnumValue = (target: any, value: string, caseSensitive = true) => {
    let keys = Object
        .keys(target)
        .filter(x => caseSensitive
            ? target[x] == value
            : target[x].toLowerCase() == value.toLowerCase());

    return keys.length > 0
        ? keys[0]
        : undefined;
}

const capitalizeFirst = (str: string) => str
    .split(' ')
    .map(token => token.toLowerCase())
    .map(token => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ');