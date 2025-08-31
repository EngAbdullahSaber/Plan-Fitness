"use client";

import Image from "next/image";
import img1 from "@/public/images/country/usa.png";
import img2 from "@/public/images/country/france.png";
import img3 from "@/public/images/country/india.png";
import img4 from "@/public/images/country/spain.png";
import img5 from "@/public/images/country/bangladesh.png";
import img6 from "@/public/images/country/brazil.png";
import "leaflet/dist/leaflet.css";

// import world from "../../../(map)/maps-vector/worldmap.json";
// import { VectorMap } from "@south-paw/react-vector-maps";
// import BasicMap  from 'basic-map';
import { CardContent, Card } from "@/components/ui/card";
import GeoJSONMap from "@/app/[lang]/(dashboard)/(map)/map-react-leaflet/geo-json";

import Link from "next/link";
import { useTranslate } from "@/config/useTranslation";

const CountryMap = () => {
  const {t} = useTranslate()

  const country = [
    { name: t("United State") , image: img1, user: 32900 },
    { name: t("France") , image: img2, user: 30456 },
    { name: t("India") , image: img3, user: 29703 },
    { name: t("Spain") , image: img4, user: 27533 },
    { name: t("Bangladesh") , image: img5, user: 27523 },
    { name: t("Brazil") , image: img6, user: 23289 },
  ];

  return (
    <div className="grid grid-cols-12 sm:gap-6 gap-4">
      <div className="col-span-12 md:col-span-8">
        <div className={`w-[full] h-[329px]`}>
          {/* <VectorMap
            {...world}
            className="h-full w-full object-fill dashtail-codeVmapWhite"
          /> */}

          <GeoJSONMap />

        </div>
      </div>
      <div className="col-span-12 md:col-span-4 mt-9 md:mt-0">
        <div className="flex justify-between items-center border-b pb-2">
          <div className="text-base font-semibold text-default-900">{t("Top Countries")} </div>
          <Link href="/dashboard" className="text-xs font-medium text-primary hover:underline">
            {t("See All")} 
          </Link>
        </div>
        <div className="py-5">
          {country.map((item, i) => (
            <div key={i} className="flex justify-between items-center flex-wrap pb-3.5">
              <div className="flex items-center gap-3">
                <div className="rounded-full overflow-hidden w-9 h-9 inline-block">
                  <Image className="w-full h-full object-cover" src={item.image} alt="spain" />
                </div>
                <span className="inline-block text-default-600 text-sm font-medium">{item.name}</span>
              </div>
              <div className="text-sm text-default-600 bg-default-100 dark:bg-default-50 py-1.5 px-1.5 rounded">{item.user}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountryMap;
