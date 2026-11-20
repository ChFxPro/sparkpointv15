export interface GalaDirectionsData {
  bbox: { south: number; north: number; west: number; east: number };
  grid: { rows: number; cols: number; elevation: number[] };
  drive: number[][];
  approach: number[][];
  miles: { toGate: number; gateToClubhouse: number };
  places: Record<'mainEntrance' | 'dollarGeneral' | 'eastForkTurn' | 'gate' | 'clubhouse', [number, number]>;
}
