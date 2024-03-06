import { DiningHallType, getMenu } from '../dist';

(async () => {
    let menu = await getMenu(DiningHallType.SOUTH);
    console.log(menu);
    console.log('Meals:', menu.meals);
})();