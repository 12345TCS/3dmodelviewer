import React from 'react';
import { useViewer } from '../../store/viewerStore';
import SectionCard from '../ui/SectionCard';
import Toggle from '../ui/Toggle';
import Slider from '../ui/Slider';
import SelectGroup from '../ui/SelectGroup';

const BG_OPTIONS = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'transparent', label: 'None' },
];

const LIGHT_PRESETS = [
  { value: 'studio', label: 'Studio' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'dramatic', label: 'Dramatic' },
  { value: 'soft', label: 'Soft' },
];

const TONE_OPTIONS = [
  { value: 'aces', label: 'ACES' },
  { value: 'linear', label: 'Linear' },
  { value: 'reinhard', label: 'Reinhard' },
];

export default function ScenePanel() {
  const { state, dispatch } = useViewer();

  return (
    <>
      <SectionCard title="Model Display">
        <Toggle
          label="Wireframe"
          checked={state.wireframe}
          onChange={() => dispatch({ type: 'TOGGLE_WIREFRAME' })}
        />
        <Toggle
          label="Show Grid"
          checked={state.showGrid}
          onChange={() => dispatch({ type: 'TOGGLE_GRID' })}
        />
        <Toggle
          label="Show Axes"
          checked={state.showAxes}
          onChange={() => dispatch({ type: 'TOGGLE_AXES' })}
        />
      </SectionCard>

      <SectionCard title="Auto Rotate">
        <Toggle
          label="Auto Rotate"
          checked={state.autoRotate}
          onChange={() => dispatch({ type: 'TOGGLE_AUTO_ROTATE' })}
        />
        {state.autoRotate && (
          <Slider
            label="Speed"
            value={state.autoRotateSpeed}
            min={0.1}
            max={5}
            step={0.1}
            onChange={(v) => dispatch({ type: 'SET_AUTO_ROTATE_SPEED', payload: v })}
            formatValue={(v) => `${v.toFixed(1)}×`}
          />
        )}
      </SectionCard>

      <SectionCard title="Background">
        <SelectGroup
          options={BG_OPTIONS}
          value={state.background}
          onChange={(v) => dispatch({ type: 'SET_BACKGROUND', payload: v })}
        />
      </SectionCard>

      <SectionCard title="Lighting">
        <SelectGroup
          label="Preset"
          options={LIGHT_PRESETS}
          value={state.lightPreset}
          onChange={(v) => dispatch({ type: 'SET_LIGHT_PRESET', payload: v })}
        />
        <Slider
          label="Exposure"
          value={state.exposure}
          min={0.1}
          max={3}
          step={0.05}
          onChange={(v) => dispatch({ type: 'SET_EXPOSURE', payload: v })}
          formatValue={(v) => `${v.toFixed(2)}`}
        />
        <SelectGroup
          label="Tone Mapping"
          options={TONE_OPTIONS}
          value={state.toneMapping}
          onChange={(v) => dispatch({ type: 'SET_TONE_MAPPING', payload: v })}
        />
      </SectionCard>
    </>
  );
}
