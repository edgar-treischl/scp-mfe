import type { ComponentProps } from 'react';
import { FormEditor } from './FormEditor';

type SchuleNewProps = Pick<ComponentProps<typeof FormEditor>, 'onNavigate'>;

export function SchuleNew({ onNavigate }: SchuleNewProps) {
  return <FormEditor onNavigate={onNavigate} parentView="new" />;
}
