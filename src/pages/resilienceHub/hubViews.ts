import springSmall from '../../assets/hub/hub-spring-1280.webp';
import springLarge from '../../assets/hub/hub-spring-2400.webp';
import daySmall from '../../assets/hub/hub-day-1280.webp';
import dayLarge from '../../assets/hub/hub-day-2400.webp';
import autumnSmall from '../../assets/hub/hub-autumn-1280.webp';
import autumnLarge from '../../assets/hub/hub-autumn-2400.webp';
import winterSmall from '../../assets/hub/hub-winter-1280.webp';
import winterLarge from '../../assets/hub/hub-winter-2400.webp';
import nightSmall from '../../assets/hub/hub-night-1280.webp';
import nightLarge from '../../assets/hub/hub-night-2400.webp';

export type HubHeroViewId = 'spring' | 'day' | 'autumn' | 'winter' | 'night';

export type HubHeroView = {
  id: HubHeroViewId;
  label: string;
  /** What the default view is called when it is showing because of the season. */
  seasonLabel?: string;
  small: string;
  large: string;
  description: string;
};

export const HUB_HERO_VIEWS: HubHeroView[] = [
  {
    id: 'spring',
    label: 'Spring',
    seasonLabel: 'Spring',
    small: springSmall,
    large: springLarge,
    description: 'Spring view of the SparkPoint Resilience Hub exterior in Brevard.',
  },
  {
    id: 'day',
    label: 'Day',
    seasonLabel: 'Summer',
    small: daySmall,
    large: dayLarge,
    description: 'Summer daytime view of the SparkPoint Resilience Hub exterior in Brevard.',
  },
  {
    id: 'autumn',
    label: 'Autumn',
    seasonLabel: 'Autumn',
    small: autumnSmall,
    large: autumnLarge,
    description: 'Autumn view of the SparkPoint Resilience Hub exterior in Brevard.',
  },
  {
    id: 'winter',
    label: 'Winter',
    seasonLabel: 'Winter',
    small: winterSmall,
    large: winterLarge,
    description: 'Winter view of the SparkPoint Resilience Hub exterior in Brevard.',
  },
  {
    id: 'night',
    label: 'Night',
    small: nightSmall,
    large: nightLarge,
    description: 'Night view of the SparkPoint Resilience Hub exterior in Brevard.',
  },
];

/**
 * The hero view for the season the visitor is in, by meteorological season
 * (Mar–May spring, Jun–Aug summer, Sep–Nov autumn, Dec–Feb winter). Summer has
 * no image of its own, so it shows the Day view. Uses the visitor's local date;
 * the prerendered HTML carries the build-day season until the app mounts.
 */
export function getSeasonalHeroId(date: Date = new Date()): HubHeroViewId {
  const month = date.getMonth(); // 0 = January
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'day';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}
