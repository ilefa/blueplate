import axios from 'axios';

export type Meal = {
    name: string;
    stations: string[];
}

export type DiningHallResponse = {
    hall: DiningHall;
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
            longitude: -72.252385
        }
    },
    'MCMAHON': {
        name: 'McMahon',
        lateNight: true,
        location: {
            id: '05',
            name: 'McMahon+Dining+Hall',
            latitude: 41.803548,
            longitude: -72.252385
        }
    },
    'NORTH': {
        name: 'North',
        lateNight: false,
        location: {
            id: '07',
            name: 'North+Campus+Dining+Hall',
            latitude: 41.812185,
            longitude: -72.258381
        }
    },
    'NORTHWEST': {
        name: 'Northwest',
        lateNight: true,
        location: {
            id: '15',
            name: 'Northwest+Marketplace',
            latitude: 41.811441,
            longitude: -72.259667
        }
    },
    'PUTNAM': {
        name: 'Putnam',
        lateNight: false,
        location: {
            id: '06',
            name: 'Putnam+Dining+Hall',
            latitude: 41.805151,
            longitude: -72.258880
        }
    },
    'SOUTH': {
        name: 'South',
        lateNight: false,
        location: {
            id: '16',
            name: 'South+Campus+Marketplace',
            latitude: 41.803892,
            longitude: -72.248538
        }
    },
    'TOWERS': {
        name: 'Towers',
        lateNight: false,
        location: {
            id: '42',
            name: 'Gelfenbien+Commons+%26+Halal',
            latitude: 41.813455,
            longitude: -72.254368
        }
    },
    'WHITNEY': {
        name: 'Whitney',
        lateNight: true,
        location: {
            id: '01',
            name: 'Whitney+Dining+Hall',
            latitude: 41.809891,
            longitude: -72.247374
        }
    }
}

export const LateNightDiningHalls = [DiningHallType.MCMAHON, DiningHallType.NORTHWEST, DiningHallType.WHITNEY];
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
    let url = `http://nutritionanalysis.dds.uconn.edu/shortmenu.aspx?sName=UCONN+Dining+Services&locationNum=${hall.location.id}&locationName=${hall.location.name}&naFlag=1`;
    if (date.getDate() !== new Date().getDate())
        url += `&WeeksMenus=This+Week%27s+Menus&myaction=read&dtdate=${date.getMonth() + 1}%2f${date.getDate()}%2f${date.getFullYear()}`;

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

    // Before 7AM or before 8AM on Sunday - all dining halls closed
    if (hour < 7 || (hour < 8 && day === 0))
        return DiningHallStatus.CLOSED;

    if (isWeekend(day) && isDiningHall(type, DiningHallType.BUCKLEY))
        return DiningHallStatus.CLOSED;

    // Before 9AM or Before 9:30AM on Weekdays - South serving breakfast, everything else closed
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
    if (hour < 22 && isLateNightWeekday(day) && DiningHalls[type].lateNight)
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