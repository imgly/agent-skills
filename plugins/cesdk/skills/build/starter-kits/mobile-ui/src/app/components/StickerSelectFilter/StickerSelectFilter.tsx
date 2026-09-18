import Select from '../Select/Select';
import { useEffect, useState } from 'react';
import { useEditor } from '../../contexts/EditorContext';

export const STICKER_GROUP_LABELS: Record<string, string> = {
  doodle: 'Doodle',
  emoji: 'Emoji',
  emoticons: 'Emoticons',
  craft: 'Craft',
  '3Dstickers': '3D Grain',
  florals: 'Florals',
  hand: 'Hands',
  stickers: 'Stickers'
};

export const labelForGroup = (group: string) =>
  STICKER_GROUP_LABELS[group] ?? group.charAt(0).toUpperCase() + group.slice(1);

type StickerSelectFilterProps = {
  onChange: (group: string) => void;
  currentGroup?: string;
};

const StickerSelectFilter = ({ onChange }: StickerSelectFilterProps) => {
  const { engine } = useEditor();
  const [availableGroups, setAvailableGroups] = useState<string[]>([]);
  useEffect(() => {
    const loadGroups = async () => {
      const newGroups = await engine.asset.getGroups('ly.img.sticker');
      setAvailableGroups(newGroups);
    };
    loadGroups();
  }, []);

  return (
    <Select aria-label="Sticker group" onChange={onChange}>
      <option value="">All</option>
      {availableGroups.map((group) => (
        <option value={group} key={group}>
          {labelForGroup(group)}
        </option>
      ))}
    </Select>
  );
};
export default StickerSelectFilter;
