type ApeCardProps = {
  ape: Ape;
};

type Ape = {
  paidCarbonPercantage: number;
  image: string;
};

function ApeCard(props: ApeCardProps) {
  const { ape } = props;
  return (
    <>
      <div className='w-40 h-40 bg-black rounded-md border-2 border-black'>
        <img src={ape.image} alt='' />
      </div>
    </>
  );
}

export default ApeCard;
