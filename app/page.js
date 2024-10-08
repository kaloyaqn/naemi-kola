import CarsList from "@/components/Lists/CarPartsList";
import { Button } from "@/components/ui/button";

async function getCars() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/api/cars`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch car parts");
  }
  return res.json();
}

export default async function Home() {
  const carParts = await getCars();

  return (
    <>
      {/* <div>
      <h1>Авточасти</h1>
      <CarPartsList carParts={carParts} />
      <Button>kur</Button>
    </div> */}

      <div className="container mx-auto grid md:grid-flow-row md:grid-cols-2 md:gap-8 md:mt-8">
        <div className="bg-[#54A6FF] w-full aspect-video rounded-[10px] text-white p-6 flex flex-col ad-1">
          <div className="md:max-w-72">
          <h3 className="text-3xl font-semibold leading-[150%] md:mb-4">
            The Best Platform for Car Rental
          </h3>
          <p className="text-base leading-[150%] md:mb-5">
            Ease of doing a car rental safely and reliably. Of course at a low
            price.
          </p>
          <Button variant="primary" >Rent a car</Button>
          </div>
        </div>
        <div className="bg-[#3563E9] w-full aspect-video rounded-[10px] text-white p-6 flex flex-col ad-2 sm:hidden md:block lg:block">
          <div className="md:max-w-72">
          <h3 className="text-3xl font-semibold leading-[150%] md:mb-4">
          Easy way to rent a car at a low price
          </h3>
          <p className="text-base leading-[150%] md:mb-5">
            Ease of doing a car rental safely and reliably. Of course at a low
            price.
          </p>
          <Button className="bg-[#54A6FF] " variant="primary" >Rent a car</Button>
          </div>
        </div>
      </div>

        <div className="container mx-auto">
        <CarsList className="md:mt-8" cars={carParts}/>
        </div>
    </>
  );
}
