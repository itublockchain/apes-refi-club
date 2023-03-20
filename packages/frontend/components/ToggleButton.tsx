import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { classNames } from '@/utils';

type ToggleButtonProps = {
  enabled: boolean;
  setEnabled: any;
};

export default function ToggleButton(props: ToggleButtonProps) {
  const { enabled, setEnabled } = props;

  return (
    <div className='flex justify-center items-center'>
      <span className={classNames(!enabled ? 'font-bold' : 'font-normal', 'font-normal text-sm px-2')}>BAYC</span>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`relative inline-flex h-6 w-12 items-center rounded-full shadow-md bg-white`}
      >
        <span
          className={`${
            enabled ? 'translate-x-6 bg-green-700' : 'translate-x-1 bg-gray-600'
          } inline-block h-5 w-5 transform rounded-full transition`}
        />
      </Switch>
      <span className={classNames(enabled ? 'font-bold' : 'font-normal', 'font-normal text-sm px-2')}>ARC</span>
    </div>
  );
}
