// Photos from SparkPoint gatherings other than the October 1 convening, so the
// homepage isn't one event. Each is a 960 / 1920 WebP pair made from the
// originals already on the site (Impact, About, Community Connectors, Stories).
import heleneFullHouse960 from '../../assets/home/gatherings/helene-full-house-960.webp';
import heleneFullHouse1920 from '../../assets/home/gatherings/helene-full-house-1920.webp';
import heleneCrew960 from '../../assets/home/gatherings/helene-crew-960.webp';
import heleneCrew1920 from '../../assets/home/gatherings/helene-crew-1920.webp';
import heleneMusic960 from '../../assets/home/gatherings/helene-music-960.webp';
import heleneMusic1920 from '../../assets/home/gatherings/helene-music-1920.webp';
import connectorsCircle960 from '../../assets/home/gatherings/connectors-circle-960.webp';
import connectorsCircle1920 from '../../assets/home/gatherings/connectors-circle-1920.webp';
import connectorsTable960 from '../../assets/home/gatherings/connectors-table-960.webp';
import connectorsTable1920 from '../../assets/home/gatherings/connectors-table-1920.webp';
import sparkpurpose960 from '../../assets/home/gatherings/sparkpurpose-group-960.webp';
import sparkpurpose1920 from '../../assets/home/gatherings/sparkpurpose-group-1920.webp';
import students960 from '../../assets/home/gatherings/students-voices-960.webp';
import students1920 from '../../assets/home/gatherings/students-voices-1920.webp';
import quilt960 from '../../assets/home/gatherings/quilt-drawing-960.webp';
import quilt1920 from '../../assets/home/gatherings/quilt-drawing-1920.webp';
import brainHealth960 from '../../assets/home/gatherings/brain-health-panel-960.webp';
import brainHealth1920 from '../../assets/home/gatherings/brain-health-panel-1920.webp';
import mural960 from '../../assets/home/gatherings/mural-interview-960.webp';
import mural1920 from '../../assets/home/gatherings/mural-interview-1920.webp';

export type GatheringPhoto = { src: string; srcSet: string; where: string };
const pair = (a: string, b: string, where: string): GatheringPhoto => ({ src: a, srcSet: `${a} 960w, ${b} 1920w`, where });

const HELENE = 'Helene: One Year of Healing · September 2025';
export const GATHERINGS = {
  heleneFullHouse: pair(heleneFullHouse960, heleneFullHouse1920, HELENE),
  heleneCrew: pair(heleneCrew960, heleneCrew1920, HELENE),
  heleneMusic: pair(heleneMusic960, heleneMusic1920, HELENE),
  connectorsCircle: pair(connectorsCircle960, connectorsCircle1920, 'Community Connectors listening session'),
  connectorsTable: pair(connectorsTable960, connectorsTable1920, 'Community Connectors listening session'),
  sparkpurpose: pair(sparkpurpose960, sparkpurpose1920, 'SparkPurpose workshop'),
  students: pair(students960, students1920, 'Voices of the Students'),
  quilt: pair(quilt960, quilt1920, 'A SparkPoint community gathering, 2025'),
  brainHealth: pair(brainHealth960, brainHealth1920, 'Brain Health talk with Dr. Ora Wells'),
  mural: pair(mural960, mural1920, 'StoryLab, on location'),
};
