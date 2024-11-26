import CarsList from "@/components/Lists/CarPartsList";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
              Наеми Koenigsegg CC 
            </h3>
            <p className="text-base leading-[150%] md:mb-5">
            Koenigsegg CC е прототип на автомобил, направен от шведския производител на автомобили
            </p>
            <Link href={"/car/547777e1-85b9-4cd9-8ae5-a7e550c6b828"}>
          <Button variant="primary">Наеми специална кола</Button>

          </Link>          </div>
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
          <Link href={"car/675ac78b-ecfe-4bc8-b32d-e24601e2ab40"}>
          <Button variant="secondary">Наеми специална кола</Button>
          </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="mt-10">
          <h3 className="text-3xl md:mt-4 font-semibold">
            Най-наемани коли
          </h3>
          <hr className="md:mb-6 md:mt-4" />
          <CarsList
            className="md:mt-8"
            cars={carParts}
            heading="Най-нови преложения"
          />
        </div>
        <div className="mt-10">
          <h3 className="text-3xl md:mt-4 font-semibold">
            Най-нови коли
          </h3>
          <hr className="md:mb-6 md:mt-4" />
          <CarsList
            className="md:mt-8"
            cars={carParts}
            heading="Най-нови преложения"
          />
        </div>
      </div>
    </>
  );
}
