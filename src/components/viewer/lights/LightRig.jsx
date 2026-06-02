import React from 'react';
import StudioLights from './StudioLights';
import OutdoorLights from './OutdoorLights';
import DramaticLights from './DramaticLights';
import SoftLights from './SoftLights';

const PRESETS = {
  studio: StudioLights,
  outdoor: OutdoorLights,
  dramatic: DramaticLights,
  soft: SoftLights,
};

export default function LightRig({ preset }) {
  const Lights = PRESETS[preset] ?? StudioLights;
  return <Lights />;
}
