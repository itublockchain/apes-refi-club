import Link from 'next/link';

type ApeCardProps = {
  id: string;
};

function ApeCard(props: ApeCardProps) {
  const { id } = props;
  return (
    <div className='h-screen w-screen'>
      <div className='flex flex-col p-20'>
        <div className='flex flex-row'>
          <div className='w-96 h-96 rounded-md border-2 border-black'>
            <div className='h-72'>
              <img src={''} alt='' className='bg-black' />
            </div>
            <div className='h-24 flex items-center justify-center'>
              <button className='rounded-lg border-none- shadow-md bg-black w-2/3 h-10'></button>
            </div>
          </div>
          <div className='w-full h-96'>
            <div className='flex flex-col px-10'>
              <span className='text-lg font-bold py-10'>{`BAYC #${id}`}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApeCard;
