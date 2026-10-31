import type { LucideIcon } from 'lucide-react';
import {
  ContactRound,
  Crop,
  FileImage,
  FileText,
  Files,
  Image,
  Layers,
  Printer,
  ScanLine,
  Scissors,
  Signature
} from 'lucide-react';
import type { ToolIconName } from '@/lib/types';

const ICONS: Record<ToolIconName, LucideIcon> = {
  image: Image,
  printer: Printer,
  'file-text': FileText,
  'file-image': FileImage,
  scissors: Scissors,
  layers: Layers,
  crop: Crop,
  scan: ScanLine,
  signature: Signature,
  passport: ContactRound,
  files: Files
};

export function ToolIcon({ name, className }: { name: ToolIconName; className?: string }) {
  const Icon = ICONS[name];
  return <Icon aria-hidden className={className} />;
}
