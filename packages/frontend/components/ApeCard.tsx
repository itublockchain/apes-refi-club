type ApeCardProps = {
  ape: Ape;
};

type Ape = {
  paidCarbonPercantage: number;
  image: string;
};

function ApeCard(props: ApeCardProps) {
  const { ape } = props;
  //console.log(ape.image);
  return (
    <>
      <div className='w-54 h-54 bg-black rounded-md border-2 border-black'>
        <img src={ape.image} alt='' />
      </div>
    </>
  );
}

export default ApeCard;
