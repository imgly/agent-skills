import Select from '../Select/Select';
import { useEffect, useState } from 'react';
import { useEditor } from '../../contexts/EditorContext';

const LABELS: Record<string, string> = {
  doodle: 'Doodle',
  emoji: 'Emoji',
  emoticons: 'Emoticons',
  craft: 'Craft',
  '3Dstickers': '3D Grain',
  hand: 'Hands',
  stickers: 'Stickers'
};

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Select onChange={onChange}>
      <option value="">All</option>
      {availableGroups.map((group) => (
        <option value={group} key={group}>
          {LABELS[group]}
        </option>
      ))}
    </Select>
  );
};
export default StickerSelectFilter;
