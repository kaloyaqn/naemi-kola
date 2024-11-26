"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CarsList from "@/components/Lists/CarPartsList";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function Page({ params }) {
  const router = useRouter();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [carsList, setCarsList] = useState(null);


  useEffect(() => {
    async function getCar() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!params.id) throw new Error("No car ID provided");

        const res = await fetch(`${apiUrl}/api/car/${params.id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch car data");
        }

        const data = await res.json();
        if (!data || data.length === 0) throw new Error("No car data found");

        setCar(data[0]);
        setCurrentImage(data[0]?.image_url?.[0] || null);
        setImages(data);
      } catch (err) {
        setError(err.message);
      }
    }

    async function getCars() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/api/cars`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch cars list");
        }

        const data = await res.json();
        setCarsList(data || []);
      } catch (err) {
        setError(err.message);
      }
    }

    getCar();
    getCars();

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer); 
  }, [params.id]);

  const handleThumbnailClick = (image) => {
    setCurrentImage(image);
  };

  const handleRentNow = () => {
    if (car) {
      // Create query parameters with car information
      const queryParams = new URLSearchParams({
        carId: params.id,
        brand: car.brands?.name || '',
        price: car.price_per_day,
        type: car.type_car,
        description: car.description,
        seats:car.seats,
        image: car.image_url?.[0] || ''
      }).toString();

      // Navigate to contact form page with car data
      router.push(`/contact?${queryParams}`);
    }
  };

  if (loading) return (
    <div className="">
    <div class=" dark:bg-gray-800 dark:border-gray-700 h-full w-full flex justify-center items-center">
    <div role="status">
        <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
        <span class="sr-only">Loading...</span>
    </div>
</div>
    </div>
  );
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Image Section */}

        <div className="md:col-span-2">
          <Carousel useKeyboardArrows={true}>
            {images.length > 0 &&
              images[0].image_url.map((image, index) => (
                <div key={index} className="slide">
                  <img alt={`Image ${index + 1}`} src={image} />
                </div>
              ))}
          </Carousel>

          {/* Image Grid with Thumbnails */}
          {/* <div className="grid grid-cols-3 gap-4 mt-4">
        {images.length > 0 &&
          images[0].image_url.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Gallery image ${index + 1}`}
              className="rounded-lg shadow-lg cursor-pointer h-24 w-auto"
              onClick={() => handleThumbnailClick(image)} // Set main image on click
            />
          ))}
      </div> */}
        </div>
        {/* Details Section */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-[#1A202C]">
                  {car?.brands?.name && (
                    <h2 className="text-3xl font-bold text-[#1A202C]">
                      {car.brands.name}
                    </h2>
                  )}{" "}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <svg
                    width="108"
                    height="20"
                    viewBox="0 0 108 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_44_15987)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M9.16676 2.65838C9.22433 2.47584 9.33858 2.31641 9.49294 2.20324C9.64729 2.09007 9.8337 2.02905 10.0251 2.02905C10.2165 2.02905 10.4029 2.09007 10.5573 2.20324C10.7116 2.31641 10.8259 2.47584 10.8834 2.65838L12.4334 7.42505H17.4334C17.6317 7.41755 17.8269 7.47516 17.9893 7.58908C18.1517 7.70299 18.2724 7.86695 18.3329 8.05589C18.3933 8.24484 18.3903 8.44838 18.3242 8.63542C18.2581 8.82247 18.1325 8.98273 17.9668 9.09171L13.9084 12.0334L15.4584 16.8084C15.5197 16.9903 15.5213 17.187 15.4628 17.3698C15.4044 17.5526 15.2891 17.712 15.1336 17.8246C14.9782 17.9372 14.7908 17.9972 14.5989 17.9958C14.407 17.9944 14.2205 17.9316 14.0668 17.8167L10.0001 14.8417L5.94176 17.7917C5.78802 17.9066 5.60157 17.9694 5.40963 17.9708C5.2177 17.9722 5.03034 17.9122 4.87491 17.7996C4.71948 17.687 4.60412 17.5276 4.54569 17.3448C4.48725 17.162 4.4888 16.9653 4.5501 16.7834L6.1001 12.0084L2.04176 9.06671C1.876 8.95773 1.75047 8.79747 1.68437 8.61042C1.61826 8.42338 1.6152 8.21984 1.67566 8.03089C1.73612 7.84195 1.85678 7.67799 2.0192 7.56408C2.18161 7.45016 2.37686 7.39255 2.5751 7.40005H7.5751L9.16676 2.65838Z"
                        fill="#FBAD39"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M31.1668 2.65838C31.2243 2.47584 31.3386 2.31641 31.4929 2.20324C31.6473 2.09007 31.8337 2.02905 32.0251 2.02905C32.2165 2.02905 32.4029 2.09007 32.5573 2.20324C32.7116 2.31641 32.8259 2.47584 32.8834 2.65838L34.4334 7.42505H39.4334C39.6317 7.41755 39.8269 7.47516 39.9893 7.58908C40.1517 7.70299 40.2724 7.86695 40.3329 8.05589C40.3933 8.24484 40.3903 8.44838 40.3242 8.63542C40.2581 8.82247 40.1325 8.98273 39.9668 9.09171L35.9084 12.0334L37.4584 16.8084C37.5197 16.9903 37.5213 17.187 37.4628 17.3698C37.4044 17.5526 37.2891 17.712 37.1336 17.8246C36.9782 17.9372 36.7908 17.9972 36.5989 17.9958C36.407 17.9944 36.2205 17.9316 36.0668 17.8167L32.0001 14.8417L27.9418 17.7917C27.788 17.9066 27.6016 17.9694 27.4096 17.9708C27.2177 17.9722 27.0303 17.9122 26.8749 17.7996C26.7195 17.687 26.6041 17.5276 26.5457 17.3448C26.4873 17.162 26.4888 16.9653 26.5501 16.7834L28.1001 12.0084L24.0418 9.06671C23.876 8.95773 23.7505 8.79747 23.6844 8.61042C23.6183 8.42338 23.6152 8.21984 23.6757 8.03089C23.7361 7.84195 23.8568 7.67799 24.0192 7.56408C24.1816 7.45016 24.3769 7.39255 24.5751 7.40005H29.5751L31.1668 2.65838Z"
                        fill="#FBAD39"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M53.1668 2.65838C53.2243 2.47584 53.3386 2.31641 53.4929 2.20324C53.6473 2.09007 53.8337 2.02905 54.0251 2.02905C54.2165 2.02905 54.4029 2.09007 54.5573 2.20324C54.7116 2.31641 54.8259 2.47584 54.8834 2.65838L56.4334 7.42505H61.4334C61.6317 7.41755 61.8269 7.47516 61.9893 7.58908C62.1517 7.70299 62.2724 7.86695 62.3329 8.05589C62.3933 8.24484 62.3903 8.44838 62.3242 8.63542C62.2581 8.82247 62.1325 8.98273 61.9668 9.09171L57.9084 12.0334L59.4584 16.8084C59.5197 16.9903 59.5213 17.187 59.4628 17.3698C59.4044 17.5526 59.2891 17.712 59.1336 17.8246C58.9782 17.9372 58.7908 17.9972 58.5989 17.9958C58.407 17.9944 58.2205 17.9316 58.0668 17.8167L54.0001 14.8417L49.9418 17.7917C49.788 17.9066 49.6016 17.9694 49.4096 17.9708C49.2177 17.9722 49.0303 17.9122 48.8749 17.7996C48.7195 17.687 48.6041 17.5276 48.5457 17.3448C48.4873 17.162 48.4888 16.9653 48.5501 16.7834L50.1001 12.0084L46.0418 9.06671C45.876 8.95773 45.7505 8.79747 45.6844 8.61042C45.6183 8.42338 45.6152 8.21984 45.6757 8.03089C45.7361 7.84195 45.8568 7.67799 46.0192 7.56408C46.1816 7.45016 46.3769 7.39255 46.5751 7.40005H51.5751L53.1668 2.65838Z"
                        fill="#FBAD39"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M75.1668 2.65838C75.2243 2.47584 75.3386 2.31641 75.4929 2.20324C75.6473 2.09007 75.8337 2.02905 76.0251 2.02905C76.2165 2.02905 76.4029 2.09007 76.5573 2.20324C76.7116 2.31641 76.8259 2.47584 76.8834 2.65838L78.4334 7.42505H83.4334C83.6317 7.41755 83.8269 7.47516 83.9893 7.58908C84.1517 7.70299 84.2724 7.86695 84.3329 8.05589C84.3933 8.24484 84.3903 8.44838 84.3242 8.63542C84.2581 8.82247 84.1325 8.98273 83.9668 9.09171L79.9084 12.0334L81.4584 16.8084C81.5197 16.9903 81.5213 17.187 81.4628 17.3698C81.4044 17.5526 81.2891 17.712 81.1336 17.8246C80.9782 17.9372 80.7908 17.9972 80.5989 17.9958C80.407 17.9944 80.2205 17.9316 80.0668 17.8167L76.0001 14.8417L71.9418 17.7917C71.788 17.9066 71.6016 17.9694 71.4096 17.9708C71.2177 17.9722 71.0303 17.9122 70.8749 17.7996C70.7195 17.687 70.6041 17.5276 70.5457 17.3448C70.4873 17.162 70.4888 16.9653 70.5501 16.7834L72.1001 12.0084L68.0418 9.06671C67.876 8.95773 67.7505 8.79747 67.6844 8.61042C67.6183 8.42338 67.6152 8.21984 67.6757 8.03089C67.7361 7.84195 67.8568 7.67799 68.0192 7.56408C68.1816 7.45016 68.3769 7.39255 68.5751 7.40005H73.5751L75.1668 2.65838Z"
                        fill="#FBAD39"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M97.1668 2.65838C97.2243 2.47584 97.3386 2.31641 97.4929 2.20324C97.6473 2.09007 97.8337 2.02905 98.0251 2.02905C98.2165 2.02905 98.4029 2.09007 98.5573 2.20324C98.7116 2.31641 98.8259 2.47584 98.8834 2.65838L100.433 7.42505H105.433C105.632 7.41755 105.827 7.47516 105.989 7.58908C106.152 7.70299 106.272 7.86695 106.333 8.05589C106.393 8.24484 106.39 8.44838 106.324 8.63542C106.258 8.82247 106.133 8.98273 105.967 9.09171L101.908 12.0334L103.458 16.8084C103.52 16.9903 103.521 17.187 103.463 17.3698C103.404 17.5526 103.289 17.712 103.134 17.8246C102.978 17.9372 102.791 17.9972 102.599 17.9958C102.407 17.9944 102.221 17.9316 102.067 17.8167L98.0001 14.8417L93.9418 17.7917C93.788 17.9066 93.6016 17.9694 93.4096 17.9708C93.2177 17.9722 93.0303 17.9122 92.8749 17.7996C92.7195 17.687 92.6041 17.5276 92.5457 17.3448C92.4873 17.162 92.4888 16.9653 92.5501 16.7834L94.1001 12.0084L90.0418 9.06671C89.876 8.95773 89.7505 8.79747 89.6844 8.61042C89.6183 8.42338 89.6152 8.21984 89.6757 8.03089C89.7361 7.84195 89.8568 7.67799 90.0192 7.56408C90.1816 7.45016 90.3769 7.39255 90.5751 7.40005H95.5751L97.1668 2.65838Z"
                        stroke="#90A3BF"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_44_15987">
                        <rect width="108" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <span className="text-sm text-[#596780] font-medium">
                    440+ Ревюта
                  </span>
                </div>
              </div>
              {car.availability_status === true ? (
                <div className="text-sm bg-[#D3F178] font-semibold px-3 py-1 rounded-full text-[#3B6506]">
                  свободна
                </div>
              ) : (
                <div className="text-sm bg-[#FFA37A] font-semibold px-3 py-1 rounded-full text-[#7A0619]">
                  заета
                </div>
              )}
            </div>

            <p className="text-xl text-[#596780] font-light mt-6">
              {car.description}
            </p>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-[#90A3BF]">Тип кола</span>
                <b className="text-[#596780] font-bold">{car.type_car}</b>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#90A3BF]">Седалки</span>
                <b className="text-[#596780] font-bold">{car.seats}</b>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#90A3BF]">Трансмисия</span>
                <b className="text-[#596780] font-bold">
                  {car.transmission_type}
                </b>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#90A3BF]">Разход</span>
                <b className="text-[#596780] font-bold">{car.seats}/100Л.</b>
              </div>
            </div>

            <div className="flex justify-between items-center md:mt-16">
              <div>
                <h4 className="font-bold text-[#1A202C] text-[28px]">
                  {car.price_per_day}лв./
                  <span className="text-base font-bold text-[#90A3BF]">
                    ден
                  </span>
                </h4>
                <p className="line-through font-bold text-base text-[#90A3BF]">
                  {car.price_per_day + 50}лв.
                </p>
              </div>
              {car.availability_status === true ? (
          <Button variant="primary" onClick={handleRentNow}>
            Наеми сега
          </Button>
        ) : (
          <Button disabled variant="primary">
            Заета
          </Button>
        )}
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm md:mt-4">
            <div className="flex gap-2 md:mb-4">
              <h2 className="text-2xl font-semibold text-[#1A202C]">Ревюта</h2>
              <div className="text-white text-sm px-3 py-[6px] bg-[#3563E9] rounded-sm font-bold  ">
                2
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <img src="/images/profiles/Profill.png" />
                  <div className="flex flex-col">
                    <h4 className="font-semibold text-[#1A202C] text-xl">
                      Алекс Димитров
                    </h4>
                    <small className="text-sm text-[#90A3BF]">
                      CEO на Lidl
                    </small>
                    <div className="text-[#596780] text-lg mt-2">
                      Много хубава кола, нямаше проблеми топ лукс много вип.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <img src="/images/profiles/jena.png" />
                  <div className="flex flex-col">
                    <h4 className="font-semibold text-[#1A202C] text-xl">
                      Димитър Александров
                    </h4>
                    <small className="text-sm text-[#90A3BF]">
                      CEO на Kaufland
                    </small>
                    <div className="text-[#596780] text-lg mt-2">
                      Много хубав сайт, препоръчвам.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-3xl md:mt-4">Най-нови предложения</h3>
        <hr className="md:mb-6 md:mt-4" />
        <CarsList cars={carsList} />
      </div>
    </div>
  );
}
