import { DiningHallType } from '../dist';
import { getDiningHallStatus } from '../dist';

let testDate = new Date('2024-03-06T19:15:00');
let statuses = Object.keys(DiningHallType).map(key => ({
    key, status: getDiningHallStatus(DiningHallType[key], testDate)
}));

console.log(statuses);