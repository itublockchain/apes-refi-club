import { NextRouter, useRouter } from 'next/router';
import { classNames } from '@/utils';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

type HeaderProps = {};

interface ITab {
  name: string;
  href: string;
  active: boolean;
}

export const tabs: ITab[] = [
  { name: 'Home', href: '/', active: true },
  { name: 'Apes', href: '/apes', active: false },
  { name: 'Governance', href: '/govern', active: false },
];

function isCurrent(tab: ITab, router: NextRouter): boolean {
  return router.asPath.split('?')[0] === tab.href;
}

export default function Header(props: HeaderProps) {
  const router = useRouter();

  return (
    <>
      <div className='p-3 bg-gray-800 flex items-center justify-between'>
        <div className='float-left flex items-center'>
          <div className='rounded-full w-12 h-12 bg-slate-50'></div>
        </div>
        <ul className='flex items-center justify-center gap-8'>
          {tabs.map((tab: ITab) => {
            return (
              <li
                key={tab.name}
                className={classNames(
                  isCurrent(tab, router) ? 'text-white' : 'hover:text-white text-gray-400',
                  'h-10 flex justify-evenly items-center rounded-md'
                )}
              >
                <Link href={tab.href} className='text-center'>
                  {tab.name}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className='w-96 flex justify-end'>
          <ConnectButton accountStatus={'full'} />
        </div>
      </div>
    </>
  );
}
