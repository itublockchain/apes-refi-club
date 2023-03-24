import Link from 'next/link';

type ApesCardProps = {
  ape: Ape;
};

type Ape = {
  id: number;
  image: string;
  paidCarbonPercantage: number;
};

function ApesCard(props: ApesCardProps) {
  const { ape } = props;
  return (
    <Link href={`ape/${ape.id}`}>
      <div className='w-40 h-40 bg-black rounded-md border-2 border-black'>
        <img src={ape.image} alt='' />
      </div>
    </Link>
  );
}

export default ApesCard;
