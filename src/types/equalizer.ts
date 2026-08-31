export interface EqualizerBand {
  frequency: number;
  gain: number;
  q: number;
}

export interface EqualizerProfile {
  id: string;
  name: string;
  source: "auto" | "custom";
  bands: EqualizerBand[];
}
