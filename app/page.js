
import { Button } from '@/components/ui/button';

async function getCarParts() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/api/carparts`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch car parts');
  }
  return res.json();
}

export default async function Home() {
  const carParts = await getCarParts();

  return (

    <>
        {/* <div>
      <h1>Авточасти</h1>
      <CarPartsList carParts={carParts} />
      <Button>kur</Button>
    </div> */}

    
    </>
    
  );
}
